package store

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	_ "modernc.org/sqlite"
)

const schema = `
CREATE TABLE IF NOT EXISTS sources (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE,
	kind TEXT NOT NULL DEFAULT 'url',
	url TEXT NOT NULL DEFAULT '',
	cron_spec TEXT NOT NULL DEFAULT '',
	entity_type TEXT NOT NULL DEFAULT 'subject',
	total INTEGER NOT NULL DEFAULT 0,
	last_fetched_at DATETIME,
	created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	source_id INTEGER NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
	csv_id TEXT NOT NULL,
	entity_type TEXT NOT NULL DEFAULT 'subject',
	row_json TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'pending',
	locked_by INTEGER,
	locked_until DATETIME,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	UNIQUE(source_id, csv_id)
);

CREATE INDEX IF NOT EXISTS idx_items_source_status ON items(source_id, status);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);

CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	bgm_cookie TEXT NOT NULL DEFAULT '',
	created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
	token TEXT PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	expires_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
	user_id INTEGER NOT NULL,
	source_id INTEGER NOT NULL,
	last_item_id INTEGER NOT NULL,
	updated_at DATETIME NOT NULL,
	PRIMARY KEY(user_id, source_id)
);
`

// dbTime renders a timestamp as a UTC SQLite-comparable text value.
func dbTime(t time.Time) string {
	return t.UTC().Format(time.DateTime)
}

type Store struct {
	DB *sql.DB
}

func Open(path string) (*Store, error) {
	db, err := sql.Open("sqlite", path+"?_pragma=foreign_keys(1)&_pragma=journal_mode(WAL)&_pragma=busy_timeout(5000)")
	if err != nil {
		return nil, err
	}
	if _, err := db.Exec(schema); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("初始化数据库表: %w", err)
	}
	st := &Store{DB: db}
	st.ensureTotalColumn()
	return st, nil
}

func (s *Store) Close() error {
	return s.DB.Close()
}

type Source struct {
	ID            int64
	Name          string
	Kind          string
	URL           string
	CronSpec      string
	EntityType    string
	Total         int64
	LastFetchedAt sql.NullTime
}

type Item struct {
	ID          int64
	SourceID    int64
	CsvID       string
	EntityType  string
	RowJSON     string
	Status      string
	LockedBy    sql.NullInt64
	LockedUntil sql.NullTime
}

type User struct {
	ID        int64
	Name      string
	BgmCookie string
}

func (s *Store) listSources() ([]Source, error) {
	rows, err := s.DB.Query(`SELECT id, name, kind, url, cron_spec, entity_type, total, last_fetched_at FROM sources ORDER BY id`)
	if err != nil {
		return nil, err
	}
	defer func() { _ = rows.Close() }()
	var out []Source
	for rows.Next() {
		var src Source
		if err := rows.Scan(&src.ID, &src.Name, &src.Kind, &src.URL, &src.CronSpec, &src.EntityType, &src.Total, &src.LastFetchedAt); err != nil {
			return nil, err
		}
		out = append(out, src)
	}
	return out, rows.Err()
}

func (s *Store) GetSourceByName(name string) (*Source, error) {
	var src Source
	err := s.DB.QueryRow(`SELECT id, name, kind, url, cron_spec, entity_type, total, last_fetched_at FROM sources WHERE name = ?`, name).
		Scan(&src.ID, &src.Name, &src.Kind, &src.URL, &src.CronSpec, &src.EntityType, &src.Total, &src.LastFetchedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &src, nil
}

func (s *Store) CreateSource(src *Source) (int64, error) {
	res, err := s.DB.Exec(
		`INSERT INTO sources (name, kind, url, cron_spec, entity_type, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		src.Name, src.Kind, src.URL, src.CronSpec, src.EntityType, src.Total, dbTime(time.Now()),
	)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (s *Store) updateSourceConfig(src *Source) error {
	_, err := s.DB.Exec(`UPDATE sources SET url = ?, cron_spec = ? WHERE id = ?`,
		src.URL, src.CronSpec, src.ID)
	return err
}

type SourceConfigEntry struct {
	URL      string
	CronSpec string
}

// ReconcileSources aligns the sources table with the config:
// updates url sources in place, creates missing ones, deletes
// config-removed url sources together with their items.
func (s *Store) ReconcileSources(configured map[string]SourceConfigEntry) error {
	existing, err := s.listSources()
	if err != nil {
		return err
	}
	existingByName := make(map[string]Source, len(existing))
	for _, src := range existing {
		existingByName[src.Name] = src
	}

	for name, cfg := range configured {
		if cur, ok := existingByName[name]; ok {
			if cur.Kind != "url" {
				return fmt.Errorf("来源 %q 在配置中为 url 来源，但数据库中是 %s 来源", name, cur.Kind)
			}
			if cur.URL != cfg.URL || cur.CronSpec != cfg.CronSpec {
				if err := s.updateSourceConfig(&Source{ID: cur.ID, URL: cfg.URL, CronSpec: cfg.CronSpec}); err != nil {
					return err
				}
			}
			continue
		}
		if _, err := s.CreateSource(&Source{Name: name, Kind: "url", URL: cfg.URL, CronSpec: cfg.CronSpec, EntityType: "subject"}); err != nil {
			return err
		}
	}

	for name, src := range existingByName {
		if src.Kind != "url" {
			continue
		}
		if _, ok := configured[name]; !ok {
			if _, err := s.DB.Exec(`DELETE FROM sources WHERE id = ?`, src.ID); err != nil {
				return err
			}
		}
	}
	return nil
}

func (s *Store) ListURLSources() ([]Source, error) {
	all, err := s.listSources()
	if err != nil {
		return nil, err
	}
	var out []Source
	for _, src := range all {
		if src.Kind == "url" {
			out = append(out, src)
		}
	}
	return out, nil
}

func (s *Store) ListAllSources() ([]Source, error) {
	return s.listSources()
}

// DeleteSource removes a source by name together with its items
// (FK cascade). Returns false when the source does not exist.
func (s *Store) DeleteSource(name string) (bool, error) {
	res, err := s.DB.Exec(`DELETE FROM sources WHERE name = ?`, name)
	if err != nil {
		return false, err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return false, err
	}
	return n > 0, nil
}

func (s *Store) GetSource(id int64) (*Source, error) {
	var src Source
	err := s.DB.QueryRow(`SELECT id, name, kind, url, cron_spec, entity_type, total, last_fetched_at FROM sources WHERE id = ?`, id).
		Scan(&src.ID, &src.Name, &src.Kind, &src.URL, &src.CronSpec, &src.EntityType, &src.Total, &src.LastFetchedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &src, nil
}

func (s *Store) TouchSourceFetched(id int64) error {
	_, err := s.DB.Exec(`UPDATE sources SET last_fetched_at = ? WHERE id = ?`, dbTime(time.Now()), id)
	return err
}

func (s *Store) SetSourceEntityType(id int64, entityType string) error {
	_, err := s.DB.Exec(`UPDATE sources SET entity_type = ? WHERE id = ?`, entityType, id)
	return err
}

// SetSourceTotal records the number of CSV rows last imported for a
// source so the top progress bar can show a stable denominator.
func (s *Store) SetSourceTotal(id int64, total int64) error {
	_, err := s.DB.Exec(`UPDATE sources SET total = MAX(total, ?) WHERE id = ?`, total, id)
	return err
}

// ensureTotalColumn backfills the total column on databases created
// before it existed.
func (s *Store) ensureTotalColumn() {
	var count int
	if err := s.DB.QueryRow(`SELECT COUNT(*) FROM pragma_table_info('sources') WHERE name = 'total'`).Scan(&count); err != nil {
		return
	}
	if count > 0 {
		return
	}
	_, _ = s.DB.Exec(`ALTER TABLE sources ADD COLUMN total INTEGER NOT NULL DEFAULT 0`)
	_, _ = s.DB.Exec(`UPDATE sources SET total = (SELECT COUNT(*) FROM items WHERE items.source_id = sources.id)`)
}

// UpsertItems merges CSV rows into the pending set:
// new ids are inserted; existing pending rows get their payload
// refreshed when content changed; error rows are left untouched.
func (s *Store) UpsertItems(sourceID int64, entityType string, rows []map[string]string) (added int, updated int, err error) {
	tx, err := s.DB.Begin()
	if err != nil {
		return 0, 0, err
	}
	defer func() { _ = tx.Rollback() }()

	now := dbTime(time.Now())
	for _, row := range rows {
		id := row["id"]
		if id == "" {
			continue
		}
		payload, jerr := json.Marshal(row)
		if jerr != nil {
			return 0, 0, jerr
		}
		var itemID int64
		var status string
		var existingJSON string
		serr := tx.QueryRow(`SELECT id, status, row_json FROM items WHERE source_id = ? AND csv_id = ?`, sourceID, id).
			Scan(&itemID, &status, &existingJSON)
		if errors.Is(serr, sql.ErrNoRows) {
			if _, ierr := tx.Exec(
				`INSERT INTO items (source_id, csv_id, entity_type, row_json, status, created_at, updated_at)
				 VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
				sourceID, id, entityType, string(payload), now, now,
			); ierr != nil {
				return 0, 0, ierr
			}
			added++
			continue
		}
		if serr != nil {
			return 0, 0, serr
		}
		if status == "pending" && existingJSON != string(payload) {
			if _, uerr := tx.Exec(`UPDATE items SET row_json = ?, entity_type = ?, updated_at = ? WHERE id = ?`,
				string(payload), entityType, now, itemID); uerr != nil {
				return 0, 0, uerr
			}
			updated++
		}
	}
	return added, updated, tx.Commit()
}

func (s *Store) CountByStatus(sourceID int64, status string) (int, error) {
	var n int
	err := s.DB.QueryRow(`SELECT COUNT(*) FROM items WHERE source_id = ? AND status = ?`, sourceID, status).Scan(&n)
	return n, err
}

func (s *Store) CountErrorItems() (int, error) {
	var n int
	err := s.DB.QueryRow(`SELECT COUNT(*) FROM items WHERE status = 'error'`).Scan(&n)
	return n, err
}

// ReleaseLock clears the caller's own lock (used when skipping).
func (s *Store) ReleaseLock(itemID, userID int64) error {
	res, err := s.DB.Exec(
		`UPDATE items SET locked_by = NULL, locked_until = NULL
		 WHERE id = ? AND locked_by = ? AND status = 'pending'`,
		itemID, userID,
	)
	if err != nil {
		return err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return fmt.Errorf("无法释放：条目不存在或锁不属于当前用户")
	}
	return nil
}

// GetProgress returns the stored review cursor for a user in a
// workgroup (0 when none); source_id=0 is the global error workgroup.
func (s *Store) GetProgress(userID, sourceID int64) (int64, error) {
	var last int64
	err := s.DB.QueryRow(
		`SELECT last_item_id FROM progress WHERE user_id = ? AND source_id = ?`,
		userID, sourceID,
	).Scan(&last)
	if errors.Is(err, sql.ErrNoRows) {
		return 0, nil
	}
	if err != nil {
		return 0, err
	}
	return last, nil
}

// CountUnclaimed returns pending items not soft-locked by anyone
// (expired locks are cleaned up below in a follow-up read).
func (s *Store) CountUnclaimed(sourceID int64) (int, error) {
	query := `SELECT COUNT(*) FROM items WHERE status = 'pending' AND (locked_by IS NULL OR (locked_until IS NOT NULL AND locked_until < ?))`
	args := []any{dbTime(time.Now())}
	if sourceID > 0 {
		query += ` AND source_id = ?`
		args = append(args, sourceID)
	}
	var n int
	err := s.DB.QueryRow(query, args...).Scan(&n)
	return n, err
}

func (s *Store) setProgress(tx *sql.Tx, userID, sourceID, itemID int64) error {
	_, err := tx.Exec(
		`INSERT INTO progress (user_id, source_id, last_item_id, updated_at) VALUES (?, ?, ?, ?)
		 ON CONFLICT(user_id, source_id) DO UPDATE SET
		     last_item_id = MAX(last_item_id, excluded.last_item_id),
		     updated_at = excluded.updated_at`,
		userID, sourceID, itemID, dbTime(time.Now()),
	)
	return err
}

// AcquireNext picks one unlocked pending item (cleaning expired
// locks first), locks it for the user, and returns it. The cursor
// `after` skips items with equal or lower pk so that a reviewer who
// skipped an item moves forward instead of receiving it again
// (skipped items are still claimable by other users). The claimed
// position is persisted per user+workgroup.
func (s *Store) AcquireNext(sourceID int64, status string, userID int64, lockTTL time.Duration, after int64) (*Item, error) {
	tx, err := s.DB.Begin()
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback() }()

	if _, err := tx.Exec(
		`UPDATE items SET locked_by = NULL, locked_until = NULL
		 WHERE status = ? AND locked_until IS NOT NULL AND locked_until < ?`,
		status, dbTime(time.Now()),
	); err != nil {
		return nil, err
	}

	query := `SELECT id, source_id, csv_id, entity_type, row_json, status, locked_by, locked_until FROM items WHERE status = ?`
	args := []any{status}
	if sourceID > 0 {
		query += ` AND source_id = ?`
		args = append(args, sourceID)
	} else {
		query += ` AND locked_by IS NOT ?`
		args = append(args, userID)
	}
	if after > 0 {
		query += ` AND id > ?`
		args = append(args, after)
	}
	query += ` AND (locked_by IS NULL OR locked_by = ?) ORDER BY id LIMIT 1`
	args = append(args, userID)

	var item Item
	err = tx.QueryRow(query, args...).
		Scan(&item.ID, &item.SourceID, &item.CsvID, &item.EntityType, &item.RowJSON, &item.Status, &item.LockedBy, &item.LockedUntil)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	if _, err := tx.Exec(`UPDATE items SET locked_by = ?, locked_until = ? WHERE id = ?`,
		userID, dbTime(time.Now().Add(lockTTL)), item.ID); err != nil {
		return nil, err
	}
	if err := s.setProgress(tx, userID, sourceID, item.ID); err != nil {
		return nil, err
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return &item, nil
}

func (s *Store) GetItem(id int64) (*Item, error) {
	var item Item
	err := s.DB.QueryRow(`SELECT id, source_id, csv_id, entity_type, row_json, status, locked_by, locked_until FROM items WHERE id = ?`, id).
		Scan(&item.ID, &item.SourceID, &item.CsvID, &item.EntityType, &item.RowJSON, &item.Status, &item.LockedBy, &item.LockedUntil)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &item, nil
}

// ExtendLock renews the caller's lock on an item.
func (s *Store) ExtendLock(itemID, userID int64, lockTTL time.Duration) error {
	res, err := s.DB.Exec(
		`UPDATE items SET locked_until = ? WHERE id = ? AND locked_by = ? AND status = 'pending'`,
		dbTime(time.Now().Add(lockTTL)), itemID, userID,
	)
	if err != nil {
		return err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return fmt.Errorf("无法续锁：条目不存在、已被处理或锁已被释放")
	}
	return nil
}

// ConfirmItem deletes the item after a successful edit submission.
// Works for both pending items (owner-locked) and items in the global
// error workgroup. Returns false when the item is already gone or
// locked by someone else.
func (s *Store) ConfirmItem(itemID, userID int64) (bool, error) {
	res, err := s.DB.Exec(
		`DELETE FROM items WHERE id = ? AND status IN ('pending','error') AND (locked_by IS NULL OR locked_by = ?)`,
		itemID, userID,
	)
	if err != nil {
		return false, err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return false, err
	}
	return n > 0, nil
}

// MarkError sets the item status to error so it joins the global
// error workgroup; returns false when the item is already gone.
func (s *Store) MarkError(itemID, userID int64) (bool, error) {
	res, err := s.DB.Exec(
		`UPDATE items SET status = 'error', locked_by = NULL, locked_until = NULL, updated_at = ?
		 WHERE id = ? AND status = 'pending' AND (locked_by IS NULL OR locked_by = ?)`,
		dbTime(time.Now()), itemID, userID,
	)
	if err != nil {
		return false, err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return false, err
	}
	return n > 0, nil
}

func (s *Store) UpsertUser(id int64, name string) error {
	_, err := s.DB.Exec(
		`INSERT INTO users (id, name, created_at) VALUES (?, ?, ?)
		 ON CONFLICT(id) DO UPDATE SET name = excluded.name`,
		id, name, dbTime(time.Now()),
	)
	return err
}

func (s *Store) GetUser(id int64) (*User, error) {
	var u User
	err := s.DB.QueryRow(`SELECT id, name, bgm_cookie FROM users WHERE id = ?`, id).Scan(&u.ID, &u.Name, &u.BgmCookie)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (s *Store) SetUserCookie(userID int64, cookie string) error {
	_, err := s.DB.Exec(`UPDATE users SET bgm_cookie = ? WHERE id = ?`, cookie, userID)
	return err
}

func (s *Store) CreateSession(token string, userID int64, expiresAt time.Time) error {
	_, err := s.DB.Exec(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`, token, userID, dbTime(expiresAt))
	return err
}

func (s *Store) GetSessionUser(token string) (id int64, name string, bgmCookie string, err error) {
	err = s.DB.QueryRow(
		`SELECT u.id, u.name, u.bgm_cookie FROM sessions s JOIN users u ON u.id = s.user_id
		 WHERE s.token = ? AND s.expires_at > ?`, token, dbTime(time.Now()),
	).Scan(&id, &name, &bgmCookie)
	if errors.Is(err, sql.ErrNoRows) {
		return 0, "", "", nil
	}
	if err != nil {
		return 0, "", "", err
	}
	return id, name, bgmCookie, nil
}

func (s *Store) DeleteSession(token string) error {
	_, err := s.DB.Exec(`DELETE FROM sessions WHERE token = ?`, token)
	return err
}

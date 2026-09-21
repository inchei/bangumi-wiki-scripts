package store

import (
	"path/filepath"
	"testing"
	"time"
)

func testStore(t *testing.T) *Store {
	t.Helper()
	st, err := Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = st.Close() })
	return st
}

func TestReconcileAddsAndDeletes(t *testing.T) {
	st := testStore(t)
	if err := st.ReconcileSources(map[string]SourceConfigEntry{
		"a": {URL: "https://example.com/a.csv", CronSpec: "0 4 * * *"},
		"b": {URL: "https://example.com/b.csv", CronSpec: "30 5 * * *"},
	}); err != nil {
		t.Fatal(err)
	}
	srcs, err := st.ListURLSources()
	if err != nil || len(srcs) != 2 {
		t.Fatalf("want 2 sources, got %d (%v)", len(srcs), err)
	}
	aID := srcs[0].ID
	if added, _, err := st.UpsertItems(aID, "subject", []map[string]string{
		{"id": "100"}, {"id": "101"}, {"id": "102"},
	}); err != nil || added != 3 {
		t.Fatalf("added=%d err=%v", added, err)
	}
	if err := st.ReconcileSources(map[string]SourceConfigEntry{
		"a": {URL: "https://example.com/a2.csv", CronSpec: "0 4 * * *"},
	}); err != nil {
		t.Fatal(err)
	}
	srcs, _ = st.ListURLSources()
	if len(srcs) != 1 || srcs[0].Name != "a" || srcs[0].URL != "https://example.com/a2.csv" {
		t.Fatalf("unexpected sources: %+v", srcs)
	}
	n, _ := st.CountByStatus(aID, "pending")
	if n != 3 {
		t.Fatalf("items of kept source should survive, got %d", n)
	}
}

func TestUpsertItemsIncremental(t *testing.T) {
	st := testStore(t)
	id, err := st.CreateSource(&Source{Name: "imp", Kind: "upload"})
	if err != nil {
		t.Fatal(err)
	}
	added, _, err := st.UpsertItems(id, "subject", []map[string]string{
		{"id": "1", "v": "a"},
		{"id": "2", "v": "b"},
	})
	if err != nil || added != 2 {
		t.Fatalf("added=%d err=%v", added, err)
	}
	// same content: no changes
	added, updated, err := st.UpsertItems(id, "subject", []map[string]string{
		{"id": "1", "v": "a"},
		{"id": "2", "v": "b"},
	})
	if err != nil || added != 0 || updated != 0 {
		t.Fatalf("added=%d updated=%d err=%v", added, updated, err)
	}
	// changed pending + new row
	added, updated, err = st.UpsertItems(id, "subject", []map[string]string{
		{"id": "1", "v": "a2"},
		{"id": "3", "v": "c"},
	})
	if err != nil || added != 1 || updated != 1 {
		t.Fatalf("added=%d updated=%d err=%v", added, updated, err)
	}
	// mark error then re-merge: error untouched, payload change ignored
	item, err := st.AcquireNext(id, "pending", 9, time.Minute, 0)
	if err != nil || item == nil {
		t.Fatalf("acquire: %v %v", item, err)
	}
	if ok, err := st.MarkError(item.ID, 9); err != nil || !ok {
		t.Fatalf("mark error ok=%v err=%v", ok, err)
	}
	added, updated, err = st.UpsertItems(id, "subject", []map[string]string{
		{"id": "1", "v": "a3"},
	})
	if err != nil || added != 0 || updated != 0 {
		t.Fatalf("error row should be untouched: added=%d updated=%d err=%v", added, updated, err)
	}
}

func TestAcquireLockAndConfirm(t *testing.T) {
	st := testStore(t)
	id, _ := st.CreateSource(&Source{Name: "s", Kind: "url", URL: "u", CronSpec: "0 4 * * *"})
	_, _, err := st.UpsertItems(id, "subject", []map[string]string{
		{"id": "1"}, {"id": "2"},
	})
	if err != nil {
		t.Fatal(err)
	}

	u1, err := st.AcquireNext(id, "pending", 1, time.Minute, 0)
	if err != nil || u1 == nil || u1.CsvID != "1" {
		t.Fatalf("u1: %+v %v", u1, err)
	}
	// same user re-acquires their own locked item
	it, err := st.AcquireNext(id, "pending", 1, time.Minute, 0)
	if err != nil {
		t.Fatal(err)
	}
	if it.CsvID != "1" {
		t.Fatalf("same user should get their locked item, got %s", it.CsvID)
	}
	// another user gets item 2
	it2, err := st.AcquireNext(id, "pending", 2, time.Minute, 0)
	if err != nil || it2.CsvID != "2" {
		t.Fatalf("it2: %+v %v", it2, err)
	}
	// third user finds nothing (all locked)
	it3, err := st.AcquireNext(id, "pending", 3, time.Minute, 0)
	if err != nil || it3 != nil {
		t.Fatalf("it3 should be nil: %+v %v", it3, err)
	}

	if ok, err := st.ConfirmItem(u1.ID, 1); err != nil || !ok {
		t.Fatalf("confirm ok=%v err=%v", ok, err)
	}
	// confirming again fails
	if ok, _ := st.ConfirmItem(u1.ID, 1); ok {
		t.Fatal("double confirm should fail")
	}
	// user 2 cannot confirm user 1's item (already gone anyway)
	if ok, _ := st.ConfirmItem(u1.ID, 2); ok {
		t.Fatal("other user confirm should fail")
	}
}

func TestErrorWorkgroup(t *testing.T) {
	st := testStore(t)
	s1, _ := st.CreateSource(&Source{Name: "s1", Kind: "url", URL: "u", CronSpec: "0 4 * * *"})
	s2, _ := st.CreateSource(&Source{Name: "s2", Kind: "upload", EntityType: "person"})
	for _, sid := range []int64{s1, s2} {
		if _, _, err := st.UpsertItems(sid, "subject", []map[string]string{{"id": "1"}}); err != nil {
			t.Fatal(err)
		}
	}
	for _, sid := range []int64{s1, s2} {
		it, err := st.AcquireNext(sid, "pending", 5, time.Minute, 0)
		if err != nil {
			t.Fatal(err)
		}
		if ok, err := st.MarkError(it.ID, 5); err != nil || !ok {
			t.Fatalf("mark error: ok=%v err=%v", ok, err)
		}
	}
	// global error workgroup: acquire with scope error (no source filter)
	it, err := st.AcquireNext(0, "error", 7, time.Minute, 0)
	if err != nil || it == nil {
		t.Fatalf("error acquire: %+v %v", it, err)
	}
	if ok, err := st.ConfirmItem(it.ID, 7); err != nil || !ok {
		t.Fatalf("error item confirm: ok=%v err=%v", ok, err)
	}
	n, _ := st.CountErrorItems()
	if n != 1 {
		t.Fatalf("remaining error items = %d, want 1", n)
	}
}

func TestReleaseLockEnablesSkip(t *testing.T) {
	st := testStore(t)
	id, _ := st.CreateSource(&Source{Name: "s", Kind: "upload"})
	_, _, _ = st.UpsertItems(id, "subject", []map[string]string{{"id": "1"}, {"id": "2"}})

	// user 1 claims item 1, then skips → lock released
	it1, err := st.AcquireNext(id, "pending", 1, time.Minute, 0)
	if err != nil || it1 == nil {
		t.Fatal("acquire 1 failed")
	}
	if err := st.ReleaseLock(it1.ID, 1); err != nil {
		t.Fatalf("release: %v", err)
	}

	// user 2 must get item 1 right away (not wait for TTL expiry)
	it2, err := st.AcquireNext(id, "pending", 2, time.Minute, 0)
	if err != nil || it2 == nil || it2.CsvID != "1" {
		t.Fatalf("user2 should claim released item: %+v %v", it2, err)
	}

	// releasing someone else's lock is rejected
	if it3, _ := st.AcquireNext(id, "pending", 1, time.Minute, 0); it3 == nil || it3.CsvID != "2" {
		t.Fatalf("user1 should get remaining item, got %+v", it3)
	}
	if err := st.ReleaseLock(it2.ID, 1); err == nil {
		t.Fatal("release of other user's lock should fail")
	}
}

func TestSkipCursorMovesForward(t *testing.T) {
	st := testStore(t)
	id, _ := st.CreateSource(&Source{Name: "s", Kind: "upload"})
	_, _, _ = st.UpsertItems(id, "subject", []map[string]string{{"id": "1"}, {"id": "2"}})

	// reviewer claims item 1, then skips with cursor after=item pk
	it1, err := st.AcquireNext(id, "pending", 1, time.Minute, 0)
	if err != nil || it1 == nil || it1.CsvID != "1" {
		t.Fatalf("claim: %+v %v", it1, err)
	}
	if err := st.ReleaseLock(it1.ID, 1); err != nil {
		t.Fatal(err)
	}

	// with after=it1 pk the same reviewer must NOT get item 1 back
	again, err := st.AcquireNext(id, "pending", 1, time.Minute, it1.ID)
	if err != nil || again == nil || again.CsvID != "2" {
		t.Fatalf("skip should move to item 2: %+v %v", again, err)
	}

	// the skipped item stays available for another user
	other, err := st.AcquireNext(id, "pending", 7, time.Minute, 0)
	if err != nil || other == nil || other.CsvID != "1" {
		t.Fatalf("other user should redeem the skipped item: %+v %v", other, err)
	}

	// after=0 at entry re-claims own locked item (refresh resume)
	it2, err := st.AcquireNext(id, "pending", 1, time.Minute, 0)
	if err != nil || it2 == nil || it2.CsvID != "2" {
		t.Fatalf("own locked item re-claim: %+v %v", it2, err)
	}
}

func TestExtendLock(t *testing.T) {
	st := testStore(t)
	id, _ := st.CreateSource(&Source{Name: "s", Kind: "url", URL: "u", CronSpec: "0 4 * * *"})
	_, _, _ = st.UpsertItems(id, "subject", []map[string]string{{"id": "1"}})
	it, err := st.AcquireNext(id, "pending", 1, time.Minute, 0)
	if err != nil || it == nil {
		t.Fatal("acquire failed")
	}
	if err := st.ExtendLock(it.ID, 1, time.Minute); err != nil {
		t.Fatalf("extend: %v", err)
	}
	if err := st.ExtendLock(it.ID, 2, time.Minute); err == nil {
		t.Fatal("other user extend should fail")
	}
	if ok, _ := st.MarkError(it.ID, 2); ok {
		t.Fatal("other user mark error should fail while locked")
	}
	if ok, _ := st.ConfirmItem(it.ID, 2); ok {
		t.Fatal("other user confirm should fail while locked")
	}
}

func TestSessions(t *testing.T) {
	st := testStore(t)
	_ = st.UpsertUser(42, "niko")
	_ = st.CreateSession("tok", 42, time.Now().Add(time.Hour))
	id, name, cookie, err := st.GetSessionUser("tok")
	if err != nil || id != 42 || name != "niko" || cookie != "" {
		t.Fatalf("session: %d %q %q %v", id, name, cookie, err)
	}
	if err := st.SetUserCookie(42, "chii_auth=abc"); err != nil {
		t.Fatal(err)
	}
	if _, _, cookie, _ := st.GetSessionUser("tok"); cookie != "chii_auth=abc" {
		t.Fatalf("cookie not stored")
	}
	_ = st.CreateSession("exp", 42, time.Now().Add(-time.Hour))
	if id, _, _, _ := st.GetSessionUser("exp"); id != 0 {
		t.Fatal("expired session should be rejected")
	}
	_ = st.DeleteSession("tok")
	if id, _, _, _ := st.GetSessionUser("tok"); id != 0 {
		t.Fatal("deleted session should be rejected")
	}
}

func TestProgressPersisted(t *testing.T) {
	st := testStore(t)
	id, _ := st.CreateSource(&Source{Name: "s", Kind: "upload"})
	_, _, _ = st.UpsertItems(id, "subject", []map[string]string{{"id": "1"}, {"id": "2"}, {"id": "3"}})

	if got, _ := st.GetProgress(9, id); got != 0 {
		t.Fatalf("initial progress: %d", got)
	}

	// reviewer claims item 1 → position stored
	it1, err := st.AcquireNext(id, "pending", 9, time.Minute, 0)
	if err != nil || it1 == nil || it1.CsvID != "1" {
		t.Fatalf("claim: %+v %v", it1, err)
	}
	if got, _ := st.GetProgress(9, id); got != it1.ID {
		t.Fatalf("progress after claim: %d want %d", got, it1.ID)
	}

	// confirm removes item 1; re-entry (no explicit cursor) resumes after it
	if _, err := st.ConfirmItem(it1.ID, 9); err != nil {
		t.Fatal(err)
	}
	it2, err := st.AcquireNext(id, "pending", 9, time.Minute, 0)
	if err != nil || it2 == nil || it2.CsvID != "2" {
		t.Fatalf("resume after processed item: %+v %v", it2, err)
	}

	// progress only moves forward
	// progress only moves forward: trying to set an older position is a no-op
	tx, err := st.DB.Begin()
	if err != nil {
		t.Fatal(err)
	}
	if err := st.setProgress(tx, 9, id, 1); err != nil {
		t.Fatal(err)
	}
	if err := tx.Commit(); err != nil {
		t.Fatal(err)
	}
	if got, _ := st.GetProgress(9, id); got != it2.ID {
		t.Fatalf("progress regressed: %d", got)
	}
}

func TestDeleteSource(t *testing.T) {
	st := testStore(t)
	id, err := st.CreateSource(&Source{Name: "d", Kind: "upload"})
	if err != nil {
		t.Fatal(err)
	}
	if _, _, err = st.UpsertItems(id, "subject", []map[string]string{{"id": "5"}}); err != nil {
		t.Fatal(err)
	}
	deleted, err := st.DeleteSource("d")
	if err != nil || !deleted {
		t.Fatalf("deleted=%v err=%v", deleted, err)
	}
	// FK cascade removed the items
	var n int
	if err := st.DB.QueryRow(`SELECT COUNT(*) FROM items WHERE source_id = ?`, id).Scan(&n); err != nil {
		t.Fatal(err)
	}
	if n != 0 {
		t.Fatalf("items not cascaded: %d", n)
	}
	again, err := st.DeleteSource("d")
	if err != nil || again {
		t.Fatalf("second delete: deleted=%v err=%v", again, err)
	}
}

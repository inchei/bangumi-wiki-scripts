package csvsource

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/csvutil"
	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/store"
)

const userAgent = "inchei/wiki-batch-together (https://github.com/inchei/bangumi-wiki-scripts)"

type Service struct {
	store  *store.Store
	client *http.Client
}

func New(st *store.Store) *Service {
	return &Service{
		store:  st,
		client: &http.Client{Timeout: 10 * time.Minute},
	}
}

// Import merges CSV content (from a reader) into a source.
// The source is created if absent; the row id column determines entity type.
func (s *Service) Import(name string, r io.Reader) (added int, updated int, err error) {
	entityType, rows, err := csvutil.Parse(r)
	if err != nil {
		return 0, 0, err
	}
	src, err := s.store.GetSourceByName(name)
	if err != nil {
		return 0, 0, err
	}
	if src == nil {
		id, cerr := s.store.CreateSource(&store.Source{Name: name, Kind: "upload", EntityType: entityType})
		if cerr != nil {
			return 0, 0, cerr
		}
		src = &store.Source{ID: id, Name: name, Kind: "upload", EntityType: entityType}
	}
	addedN, updatedN, err := s.store.UpsertItems(src.ID, entityType, rows)
	if err != nil {
		return 0, 0, err
	}
	if terr := s.store.SetSourceTotal(src.ID, int64(len(rows))); terr != nil {
		return 0, 0, terr
	}
	return addedN, updatedN, nil
}

// DownloadAndMerge fetches a URL source's CSV and merges it into the database.
func (s *Service) DownloadAndMerge(sourceID int64) error {
	src, err := s.store.GetSource(sourceID)
	if err != nil || src == nil {
		return fmt.Errorf("来源不存在 (id=%d)", sourceID)
	}
	resp, err := s.fetch(src.URL)
	if err != nil {
		return fmt.Errorf("下载 %q 失败: %w", src.URL, err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("下载 %q: HTTP %d", src.URL, resp.StatusCode)
	}
	entityType, rows, err := csvutil.Parse(resp.Body)
	if err != nil {
		return fmt.Errorf("解析 %q 失败: %w", src.URL, err)
	}
	added, updated, err := s.store.UpsertItems(sourceID, entityType, rows)
	if err != nil {
		return err
	}
	if err := s.store.TouchSourceFetched(sourceID); err != nil {
		return err
	}
	log.Printf("[wbt] 来源 %q 下载完成: 新增 %d，更新 %d，总数 %d", src.Name, added, updated, len(rows))
	if err := s.store.SetSourceEntityType(sourceID, entityType); err != nil {
		return err
	}
	return s.store.SetSourceTotal(sourceID, int64(len(rows)))
}

func (s *Service) fetch(url string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", userAgent)
	return s.client.Do(req)
}

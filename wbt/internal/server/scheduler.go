package server

import (
	"fmt"
	"log"

	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/csvsource"
	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/store"
	"github.com/robfig/cron/v3"
)

// Scheduler registers each URL source's download job on its cron schedule.
type Scheduler struct {
	cron       *cron.Cron
	store      *store.Store
	downloader *csvsource.Service
}

func NewScheduler(st *store.Store) *Scheduler {
	return &Scheduler{
		cron:       cron.New(),
		store:      st,
		downloader: csvsource.New(st),
	}
}

func (s *Scheduler) Start() error {
	srcs, err := s.store.ListURLSources()
	if err != nil {
		return err
	}
	parser := cron.NewParser(cron.Minute | cron.Hour | cron.Dom | cron.Month | cron.Dow)
	for _, src := range srcs {
		schedule, err := parser.Parse(src.CronSpec)
		if err != nil {
			return fmt.Errorf("来源 %q cron 表达式 %q 无效: %w", src.Name, src.CronSpec, err)
		}
		id := src.ID
		s.cron.Schedule(schedule, cron.FuncJob(func() {
			if err := s.downloader.DownloadAndMerge(id); err != nil {
				log.Printf("[wbt] 定期下载失败 (source=%d): %v", id, err)
			}
		}))
		log.Printf("[wbt] 已调度来源 %q (id=%d, cron=%q)", src.Name, id, src.CronSpec)
	}
	s.cron.Start()
	return nil
}

func (s *Scheduler) Stop() {
	ctx := s.cron.Stop()
	<-ctx.Done()
}

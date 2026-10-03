package missingpersons

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strconv"
)

func statsCreatedAt(archiveDir string) string {
	if data, err := os.ReadFile(filepath.Join(archiveDir, "data_version.json")); err == nil {
		var v struct {
			CreatedAt string `json:"created_at"`
		}
		if err := json.Unmarshal(data, &v); err == nil && v.CreatedAt != "" {
			return v.CreatedAt
		}
	}
	return ""
}

func writeStatsJSON(path string, stats missingStats) error {
	data, err := json.MarshalIndent(stats, "", "  ")
	if err != nil {
		return err
	}
	data = append(data, '\n')
	if path == "" {
		_, err = os.Stdout.Write(data)
		return err
	}
	return os.WriteFile(path, data, 0644)
}

func buildStatsByType(missing []*missingPerson, related, bare, variant []*missingRelatedPerson) map[string]typeStats {
	m := make(map[string]typeStats)
	for _, mp := range missing {
		for t := range mp.TypeCounts {
			k := strconv.Itoa(t)
			v := m[k]
			v.Missing++
			m[k] = v
		}
	}
	for _, rp := range related {
		for t := range rp.TypeCounts {
			k := strconv.Itoa(t)
			v := m[k]
			v.Related++
			m[k] = v
		}
	}
	for _, rp := range bare {
		for t := range rp.TypeCounts {
			k := strconv.Itoa(t)
			v := m[k]
			v.Bare++
			m[k] = v
		}
	}
	for _, rp := range variant {
		for t := range rp.TypeCounts {
			k := strconv.Itoa(t)
			v := m[k]
			v.Variant++
			m[k] = v
		}
	}
	return m
}

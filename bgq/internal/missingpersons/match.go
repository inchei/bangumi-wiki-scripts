package missingpersons

import (
	"fmt"
	"os"
	"sort"
	"strings"
	"time"
)

const missingPersonsMinCount = 2

func parseSubjects(records []subjectRecord) map[string]*missingPerson {
	personSubjects := make(map[string]*missingPerson)
	total := len(records)
	lastLog := time.Now()

	for i, subj := range records {
		if i%100000 == 0 && i > 0 {
			elapsed := time.Since(lastLog)
			fmt.Fprintf(os.Stderr, "  已处理: %d/%d (%.1fs)\n", i, total, elapsed.Seconds())
			lastLog = time.Now()
		}
		pni, ok := _typePni[subj.Type]
		if !ok {
			continue
		}

		addPersonNames(subj, pni, personSubjects)
	}
	return personSubjects
}

func addPersonNames(subj subjectRecord, pni map[string]int, personSubjects map[string]*missingPerson) {
	infobox := subj.Infobox
	skey := fmt.Sprintf("%d:%d", subj.Type, subj.ID)

	start := 0
	for start < len(infobox) {
		end := strings.IndexByte(infobox[start:], '\n')
		var line string
		if end >= 0 {
			line = infobox[start : start+end]
			start = start + end + 1
		} else {
			line = infobox[start:]
			start = len(infobox)
		}
		if len(line) > 0 && line[len(line)-1] == '\r' {
			line = line[:len(line)-1]
		}
		if len(line) == 0 || line[0] != '|' {
			continue
		}

		key, value, found := strings.Cut(line[1:], "=")
		if !found {
			continue
		}
		key = strings.TrimSpace(key)
		key = strings.TrimRight(key, "：:")
		if key == "原作" {
			continue
		}
		posID, ok := pni[key]
		if !ok {
			continue
		}
		value = strings.TrimSpace(value)

		for _, name := range strings.FieldsFunc(value, isDelim) {
			name = strings.TrimSpace(name)
			if !isLikelyPerson(name) {
				continue
			}
			keyNorm := normalizePersonName(name)
			entry := personSubjects[keyNorm]
			if entry == nil {
				entry = &missingPerson{
					DisplayName: name,
					KeyNorm:     keyNorm,
					Subjects:    make(map[string]*subjectInfo),
					TypeCounts:  make(map[int]int),
				}
				personSubjects[keyNorm] = entry
			}
			if si, ok := entry.Subjects[skey]; ok {
				si.PosIDs[posID] = struct{}{}
			} else {
				entry.Subjects[skey] = &subjectInfo{
					SubjectName: subj.Name,
					DisplayName: name,
					SubjectType: subj.Type,
					PosIDs:      map[int]struct{}{posID: {}},
				}
			}
			entry.TypeCounts[subj.Type]++
		}
	}
}

func filterMissing(personSubjects map[string]*missingPerson, existing map[string]bool) []*missingPerson {
	var missing []*missingPerson
	for keyNorm, entry := range personSubjects {
		if existing[keyNorm] {
			continue
		}
		if len(entry.Subjects) < missingPersonsMinCount {
			continue
		}
		entry.Count = len(entry.Subjects)
		entry.DisplayName = entry.Subjects[firstSubjectKey(entry.Subjects)].DisplayName
		missing = append(missing, entry)
	}
	sort.Slice(missing, func(i, j int) bool {
		return missing[i].Count > missing[j].Count
	})
	return missing
}

func firstSubjectKey(subjects map[string]*subjectInfo) string {
	for k := range subjects {
		return k
	}
	return ""
}

package query

// targetConfig centralizes all target-specific data for SQL generation.
type targetConfig struct {
	target       string
	mainAlias    string
	mainTable    string // FROM clause table name
	idColumn     string // primary key column name (without alias)
	typeColumn   string // type/role column name (without alias)
	defaultCols  []string
	directFields map[string]bool
}

// nestedEntityConfig describes the many-to-many relationship between the main entity and a related entity.
type nestedEntityConfig struct {
	junctionTable  string // e.g. "subject_persons"
	mainPK         string // primary key column on main entity (e.g. "id", "person_id")
	junctionMainFK string // FK column in junction referencing main entity (e.g. "subject_id", "person_id")
	relatedTable   string // related entity table
	relatedAlias   string // related entity alias
	relatedPK      string // primary key column on related entity (e.g. "id", "person_id", "character_id")
	relatedFK      string // FK column in junction referencing related entity (e.g. "person_id", "subject_id", "character_id")
}

var subjectDirectFields = map[string]bool{
	"id": true, "type": true, "name": true, "name_cn": true,
	"platform": true, "summary": true, "nsfw": true,
	"score": true, "rank": true, "date": true, "series": true, "infobox": true,
}

var personDirectFields = map[string]bool{
	"person_id": true, "person_type": true, "career": true,
}

var characterDirectFields = map[string]bool{
	"character_id": true, "role": true, "comments": true, "collects": true,
}

var episodeDirectFields = map[string]bool{
	"subject_id": true, "airdate": true, "duration": true,
	"sort": true, "disc": true, "desc": true,
}

func newTargetConfig(target string) *targetConfig {
	switch target {
	case "person":
		return &targetConfig{
			target:       "person",
			mainAlias:    "p",
			mainTable:    "persons",
			idColumn:     "person_id",
			typeColumn:   "person_type",
			defaultCols:  []string{"person_id", "name", "career"},
			directFields: mergeMaps(subjectDirectFields, personDirectFields),
		}
	case "character":
		return &targetConfig{
			target:       "character",
			mainAlias:    "c",
			mainTable:    "characters",
			idColumn:     "character_id",
			typeColumn:   "role",
			defaultCols:  []string{"character_id", "name", "role"},
			directFields: mergeMaps(subjectDirectFields, characterDirectFields),
		}
	case "episode":
		return &targetConfig{
			target:       "episode",
			mainAlias:    "e",
			mainTable:    "episodes",
			idColumn:     "id",
			typeColumn:   "type",
			defaultCols:  []string{"id", "name", "name_cn", "type", "airdate", "duration", "sort"},
			directFields: mergeMaps(subjectDirectFields, episodeDirectFields),
		}
	default: // subject
		return &targetConfig{
			target:       "subject",
			mainAlias:    "s",
			mainTable:    "subjects",
			idColumn:     "id",
			typeColumn:   "type",
			defaultCols:  []string{"id", "name", "name_cn", "type", "score", "date"},
			directFields: subjectDirectFields,
		}
	}
}

// getNestedConfig returns the many-to-many relationship config for staff/character filters.
func getNestedConfig(target, filterKind string) *nestedEntityConfig {
	switch {
	case target == "person" && filterKind == "staff":
		return &nestedEntityConfig{
			junctionTable:  "subject_persons",
			mainPK:         "person_id",
			junctionMainFK: "person_id",
			relatedTable:   "subjects",
			relatedAlias:   "rs",
			relatedPK:      "id",
			relatedFK:      "subject_id",
		}
	case target == "subject" && filterKind == "staff":
		return &nestedEntityConfig{
			junctionTable:  "subject_persons",
			mainPK:         "id",
			junctionMainFK: "subject_id",
			relatedTable:   "persons",
			relatedAlias:   "p",
			relatedPK:      "person_id",
			relatedFK:      "person_id",
		}
	case target == "character" && filterKind == "character":
		return &nestedEntityConfig{
			junctionTable:  "subject_characters",
			mainPK:         "character_id",
			junctionMainFK: "character_id",
			relatedTable:   "subjects",
			relatedAlias:   "rs",
			relatedPK:      "id",
			relatedFK:      "subject_id",
		}
	case target == "subject" && filterKind == "character":
		return &nestedEntityConfig{
			junctionTable:  "subject_characters",
			mainPK:         "id",
			junctionMainFK: "subject_id",
			relatedTable:   "characters",
			relatedAlias:   "c",
			relatedPK:      "character_id",
			relatedFK:      "character_id",
		}
	default:
		return nil
	}
}

func mergeMaps(a, b map[string]bool) map[string]bool {
	m := make(map[string]bool, len(a)+len(b))
	for k, v := range a {
		m[k] = v
	}
	for k, v := range b {
		m[k] = v
	}
	return m
}

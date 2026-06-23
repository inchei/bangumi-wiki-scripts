package config

import (
	"encoding/json"
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

// Config is the top-level YAML configuration.
type Config struct {
	Database string     `yaml:"database,omitempty" json:"database,omitempty"`
	DataDir  string     `yaml:"data_dir,omitempty" json:"data_dir,omitempty"`
	Target   string     `yaml:"target,omitempty" json:"target,omitempty"` // "subject" (default) or "person"
	Filters  []Filter   `yaml:"filters,omitempty" json:"filters,omitempty"`
	Output   *Output    `yaml:"output,omitempty" json:"output,omitempty"`
	Sort     []SortRule `yaml:"sort,omitempty" json:"sort,omitempty"`
	Limit    int        `yaml:"limit,omitempty" json:"limit,omitempty"`
}

// Filter is a single filter condition. Exactly one of the pointer fields should be set.
type Filter struct {
	Type              *TypeFilter              `yaml:"type,omitempty" json:"type,omitempty"`
	Field             *FieldFilter             `yaml:"field,omitempty" json:"field,omitempty"`
	Global            *GlobalFilter            `yaml:"global,omitempty" json:"global,omitempty"`
	Tag               *TagFilter               `yaml:"tag,omitempty" json:"tag,omitempty"`
	MetaTag           *TagFilter               `yaml:"meta_tag,omitempty" json:"meta_tag,omitempty"`
	Relation          *RelationFilter          `yaml:"relation,omitempty" json:"relation,omitempty"`
	PersonRelation    *PersonRelationFilter    `yaml:"person_relation,omitempty" json:"person_relation,omitempty"`
	CharacterRelation *CharacterRelationFilter `yaml:"character_relation,omitempty" json:"character_relation,omitempty"`
	Staff             *StaffFilter             `yaml:"staff,omitempty" json:"staff,omitempty"`
	Character         *CharacterFilter         `yaml:"character,omitempty" json:"character,omitempty"`
	PersonCharacter   *PersonCharacterFilter   `yaml:"person_character,omitempty" json:"person_character,omitempty"`
	CharacterPerson   *CharacterPersonFilter   `yaml:"character_person,omitempty" json:"character_person,omitempty"`
	Episode           *EpisodeFilter           `yaml:"episode,omitempty" json:"episode,omitempty"`
	Logic             *LogicFilter             `yaml:"logic,omitempty" json:"logic,omitempty"`
}

// LogicFilter combines child filters with AND or OR logic.
type LogicFilter struct {
	Op    string   `yaml:"op" json:"op"`       // "and" or "or"
	Items []Filter `yaml:"items" json:"items"` // child filters
}

// UnmarshalJSON implements custom JSON unmarshaling for Filter.
func (f *Filter) UnmarshalJSON(data []byte) error {
	// Use type-switching based on which key is present
	var raw map[string]json.RawMessage
	if err := json.Unmarshal(data, &raw); err != nil {
		return err
	}
	for key, val := range raw {
		switch key {
		case "type":
			f.Type = &TypeFilter{}
			return json.Unmarshal(val, f.Type)
		case "field":
			f.Field = &FieldFilter{}
			return json.Unmarshal(val, f.Field)
		case "global":
			f.Global = &GlobalFilter{}
			return json.Unmarshal(val, f.Global)
		case "tag":
			f.Tag = &TagFilter{}
			return json.Unmarshal(val, f.Tag)
		case "meta_tag":
			f.MetaTag = &TagFilter{}
			return json.Unmarshal(val, f.MetaTag)
		case "relation":
			f.Relation = &RelationFilter{}
			return json.Unmarshal(val, f.Relation)
		case "person_relation":
			f.PersonRelation = &PersonRelationFilter{}
			return json.Unmarshal(val, f.PersonRelation)
		case "character_relation":
			f.CharacterRelation = &CharacterRelationFilter{}
			return json.Unmarshal(val, f.CharacterRelation)
		case "staff":
			f.Staff = &StaffFilter{}
			return json.Unmarshal(val, f.Staff)
		case "character":
			f.Character = &CharacterFilter{}
			return json.Unmarshal(val, f.Character)
		case "person_character":
			f.PersonCharacter = &PersonCharacterFilter{}
			return json.Unmarshal(val, f.PersonCharacter)
		case "character_person":
			f.CharacterPerson = &CharacterPersonFilter{}
			return json.Unmarshal(val, f.CharacterPerson)
		case "episode":
			f.Episode = &EpisodeFilter{}
			return json.Unmarshal(val, f.Episode)
		case "logic":
			f.Logic = &LogicFilter{}
			return json.Unmarshal(val, f.Logic)
		}
	}
	return fmt.Errorf("filter must have one of: type, field, global, tag, meta_tag, relation, person_relation, character_relation, staff, character, person_character, character_person, episode, logic")
}

// UnmarshalYAML implements custom YAML unmarshaling for Filter.
// Supports both shorthand (type: 2) and full (type: {value: 2}) forms.
func (f *Filter) UnmarshalYAML(value *yaml.Node) error {
	if value.Kind != yaml.MappingNode {
		return fmt.Errorf("filter must be a mapping, got %v", value.Kind)
	}

	for i := 0; i < len(value.Content); i += 2 {
		key := value.Content[i].Value
		val := value.Content[i+1]

		switch key {
		case "type":
			f.Type = &TypeFilter{}
			if val.Kind == yaml.ScalarNode {
				f.Type.Value = parseYAMLValue(val)
			} else {
				if err := val.Decode(f.Type); err != nil {
					return err
				}
			}
		case "field":
			f.Field = &FieldFilter{}
			if val.Kind == yaml.ScalarNode {
				// Shorthand: field: <field_name> (just the field name, no condition)
				f.Field.Field = val.Value
				f.Field.Operator = "contains"
				f.Field.Value = ""
			} else {
				if err := val.Decode(f.Field); err != nil {
					return err
				}
			}
		case "global":
			if val.Kind == yaml.ScalarNode {
				f.Global = &GlobalFilter{Operator: "contains", Value: val.Value}
			} else {
				f.Global = &GlobalFilter{}
				if err := val.Decode(f.Global); err != nil {
					return err
				}
			}
		case "tag":
			if val.Kind == yaml.ScalarNode {
				// Shorthand: tag: <tag_name>
				f.Tag = &TagFilter{Operator: "contains", Value: val.Value}
			} else {
				f.Tag = &TagFilter{}
				if err := val.Decode(f.Tag); err != nil {
					return err
				}
			}
		case "meta_tag", "公共标签":
			if val.Kind == yaml.ScalarNode {
				// Shorthand: meta_tag: <tag_name>
				f.MetaTag = &TagFilter{Operator: "contains", Value: val.Value}
			} else {
				f.MetaTag = &TagFilter{}
				if err := val.Decode(f.MetaTag); err != nil {
					return err
				}
			}
		case "relation":
			if val.Kind == yaml.ScalarNode {
				f.Relation = &RelationFilter{Type: val.Value, Mode: "any"}
			} else {
				f.Relation = &RelationFilter{}
				if err := val.Decode(f.Relation); err != nil {
					return err
				}
			}
		case "person_relation":
			if val.Kind == yaml.ScalarNode {
				f.PersonRelation = &PersonRelationFilter{Type: val.Value, Mode: "any"}
			} else {
				f.PersonRelation = &PersonRelationFilter{}
				if err := val.Decode(f.PersonRelation); err != nil {
					return err
				}
			}
		case "character_relation":
			if val.Kind == yaml.ScalarNode {
				f.CharacterRelation = &CharacterRelationFilter{Type: val.Value, Mode: "any"}
			} else {
				f.CharacterRelation = &CharacterRelationFilter{}
				if err := val.Decode(f.CharacterRelation); err != nil {
					return err
				}
			}
		case "staff":
			if val.Kind == yaml.ScalarNode {
				f.Staff = &StaffFilter{Position: val.Value, Mode: "any"}
			} else {
				f.Staff = &StaffFilter{}
				if err := val.Decode(f.Staff); err != nil {
					return err
				}
			}
		case "character":
			f.Character = &CharacterFilter{}
			if err := val.Decode(f.Character); err != nil {
				return err
			}
		case "person_character":
			f.PersonCharacter = &PersonCharacterFilter{}
			if err := val.Decode(f.PersonCharacter); err != nil {
				return err
			}
		case "character_person":
			f.CharacterPerson = &CharacterPersonFilter{}
			if err := val.Decode(f.CharacterPerson); err != nil {
				return err
			}
		case "episode":
			f.Episode = &EpisodeFilter{}
			if err := val.Decode(f.Episode); err != nil {
				return err
			}
		case "logic":
			f.Logic = &LogicFilter{}
			if val.Kind == yaml.MappingNode {
				// Check for shorthand: logic: {or: [...]} or logic: {and: [...]}
				shorthand := false
				for j := 0; j < len(val.Content); j += 2 {
					subKey := val.Content[j].Value
					if subKey == "and" || subKey == "or" {
						f.Logic.Op = subKey
						if err := val.Content[j+1].Decode(&f.Logic.Items); err != nil {
							return err
						}
						shorthand = true
						break
					}
				}
				if !shorthand {
					if err := val.Decode(f.Logic); err != nil {
						return err
					}
				}
			}
		case "and":
			f.Logic = &LogicFilter{Op: "and"}
			if err := val.Decode(&f.Logic.Items); err != nil {
				return err
			}
		case "or":
			f.Logic = &LogicFilter{Op: "or"}
			if err := val.Decode(&f.Logic.Items); err != nil {
				return err
			}
		default:
			// Unknown key — treat as field filter shorthand
			f.Field = &FieldFilter{
				Field:    key,
				Operator: "contains",
			}
			if val.Kind == yaml.ScalarNode {
				f.Field.Value = val.Value
			} else {
				// Read operator and value from sub-mapping
				f.Field.Operator = "contains"
				f.Field.Value = val.Value
			}
		}
	}
	return nil
}

// parseYAMLValue converts a YAML scalar node to a Go value.
func parseYAMLValue(node *yaml.Node) interface{} {
	switch node.Tag {
	case "!!int":
		var v int
		_ = node.Decode(&v)
		return v
	case "!!float":
		var v float64
		_ = node.Decode(&v)
		return v
	case "!!bool":
		var v bool
		_ = node.Decode(&v)
		return v
	default:
		return node.Value
	}
}

// TypeFilter filters by subject type.
type TypeFilter struct {
	Value interface{} `yaml:"value" json:"value"` // int or string (Chinese name)
}

// FieldFilter filters a specific field (JSON field or infobox field).
type FieldFilter struct {
	Field    string      `yaml:"field" json:"field"`
	Operator string      `yaml:"operator" json:"operator"` // eq, contains, regex, gt, gte, lt, lte, before, after
	Value    interface{} `yaml:"value" json:"value"`
}

// GlobalFilter searches across all fields (including infobox).
type GlobalFilter struct {
	Operator string      `yaml:"operator" json:"operator"`
	Value    interface{} `yaml:"value" json:"value"`
}

// TagFilter filters by tag name.
type TagFilter struct {
	Operator string `yaml:"operator" json:"operator"` // contains, eq
	Value    string `yaml:"value" json:"value"`
	Negate   bool   `yaml:"negate" json:"negate"`
}

// RelationFilter filters by subject relation.
// Conditions support all filter types (nested), allowing full filtering on related subjects.
type RelationFilter struct {
	Type       string      `yaml:"type" json:"type"`                               // Chinese relation name (e.g., "单行本")
	Mode       string      `yaml:"mode" json:"mode"`                               // any, all, none, count
	CountOp    string      `yaml:"count_op,omitempty" json:"count_op,omitempty"`   // count mode operator: gt, gte, lt, lte, eq
	CountVal   interface{} `yaml:"count_val,omitempty" json:"count_val,omitempty"` // count mode threshold
	Conditions []Filter    `yaml:"conditions" json:"conditions"`                   // conditions on the related subject (full filter types)
}

// PersonRelationFilter filters by person-to-person relation (person_type=prsn).
// Conditions support person-level filter types on the related person.
type PersonRelationFilter struct {
	Type       string      `yaml:"type" json:"type"`                               // Chinese relation name (e.g., "同事")
	Mode       string      `yaml:"mode" json:"mode"`                               // any, all, none, count
	CountOp    string      `yaml:"count_op,omitempty" json:"count_op,omitempty"`   // count mode operator
	CountVal   interface{} `yaml:"count_val,omitempty" json:"count_val,omitempty"` // count mode threshold
	Conditions []Filter    `yaml:"conditions" json:"conditions"`                   // conditions on the related person
}

// CharacterRelationFilter filters by character-to-character relation (person_type=crt).
// Conditions support character-level filter types on the related character.
type CharacterRelationFilter struct {
	Type       string      `yaml:"type" json:"type"`                               // Chinese relation name (e.g., "朋友")
	Mode       string      `yaml:"mode" json:"mode"`                               // any, all, none, count
	CountOp    string      `yaml:"count_op,omitempty" json:"count_op,omitempty"`   // count mode operator
	CountVal   interface{} `yaml:"count_val,omitempty" json:"count_val,omitempty"` // count mode threshold
	Conditions []Filter    `yaml:"conditions" json:"conditions"`                   // conditions on the related character
}

// StaffFilter filters by staff/person.
// Conditions support all filter types (nested), allowing full filtering on persons (subject target) or subjects (person target).
type StaffFilter struct {
	Position   string       `yaml:"position" json:"position"`                         // Chinese position name (e.g., "原作")
	AppearEps  *FieldFilter `yaml:"appear_eps,omitempty" json:"appear_eps,omitempty"` // filter on appear_eps field
	Mode       string       `yaml:"mode" json:"mode"`                                 // any, all, none, count
	CountOp    string       `yaml:"count_op,omitempty" json:"count_op,omitempty"`     // count mode operator
	CountVal   interface{}  `yaml:"count_val,omitempty" json:"count_val,omitempty"`   // count mode threshold
	Conditions []Filter     `yaml:"conditions" json:"conditions"`                     // conditions on person (subject target) or subject (person target)
}

// CharacterFilter filters by character in a subject.
// Conditions support character-level filter types on the associated character.
type CharacterFilter struct {
	Type       string      `yaml:"type,omitempty" json:"type,omitempty"`           // association type name (e.g., "主角")
	Mode       string      `yaml:"mode" json:"mode"`                               // any, all, none, count
	CountOp    string      `yaml:"count_op,omitempty" json:"count_op,omitempty"`   // count mode operator
	CountVal   interface{} `yaml:"count_val,omitempty" json:"count_val,omitempty"` // count mode threshold
	Conditions []Filter    `yaml:"conditions" json:"conditions"`                   // conditions on the character
}

// PersonCharacterFilter filters persons by their associated characters (via person_characters).
// Supports filtering by character conditions AND related subject conditions.
type PersonCharacterFilter struct {
	Type              string      `yaml:"type,omitempty" json:"type,omitempty"`                             // CV type name (e.g., "CV", "演员")
	Mode              string      `yaml:"mode" json:"mode"`                                                 // any, all, none, count — character-level quantifier
	CountOp           string      `yaml:"count_op,omitempty" json:"count_op,omitempty"`                     // count mode operator
	CountVal          interface{} `yaml:"count_val,omitempty" json:"count_val,omitempty"`                   // count mode threshold
	SubjectMode       string      `yaml:"subject_mode,omitempty" json:"subject_mode,omitempty"`             // any, all, count — subject-level quantifier per character
	SubjectCountOp    string      `yaml:"subject_count_op,omitempty" json:"subject_count_op,omitempty"`     // subject count mode operator
	SubjectCountVal   interface{} `yaml:"subject_count_val,omitempty" json:"subject_count_val,omitempty"`   // subject count mode threshold
	Conditions        []Filter    `yaml:"conditions" json:"conditions"`                                     // conditions on the character
	SubjectConditions []Filter    `yaml:"subject_conditions,omitempty" json:"subject_conditions,omitempty"` // conditions on the related subject
}

// CharacterPersonFilter filters characters by their associated persons (via person_characters).
// Supports filtering by person conditions AND related subject conditions.
type CharacterPersonFilter struct {
	Type              string      `yaml:"type,omitempty" json:"type,omitempty"`                             // CV type name (e.g., "CV", "演员")
	Mode              string      `yaml:"mode" json:"mode"`                                                 // any, all, none, count — person-level quantifier
	CountOp           string      `yaml:"count_op,omitempty" json:"count_op,omitempty"`                     // count mode operator
	CountVal          interface{} `yaml:"count_val,omitempty" json:"count_val,omitempty"`                   // count mode threshold
	SubjectMode       string      `yaml:"subject_mode,omitempty" json:"subject_mode,omitempty"`             // any, all, count — subject-level quantifier per person
	SubjectCountOp    string      `yaml:"subject_count_op,omitempty" json:"subject_count_op,omitempty"`     // subject count mode operator
	SubjectCountVal   interface{} `yaml:"subject_count_val,omitempty" json:"subject_count_val,omitempty"`   // subject count mode threshold
	Conditions        []Filter    `yaml:"conditions" json:"conditions"`                                     // conditions on the person
	SubjectConditions []Filter    `yaml:"subject_conditions,omitempty" json:"subject_conditions,omitempty"` // conditions on the related subject
}

// EpisodeFilter filters by episode.
type EpisodeFilter struct {
	Mode       string        `yaml:"mode" json:"mode"`                               // any, all, count
	CountOp    string        `yaml:"count_op,omitempty" json:"count_op,omitempty"`   // count mode operator
	CountVal   interface{}   `yaml:"count_val,omitempty" json:"count_val,omitempty"` // count mode threshold
	Conditions []FieldFilter `yaml:"conditions" json:"conditions"`                   // legacy: flat field conditions
	Logic      *LogicFilter  `yaml:"logic,omitempty" json:"logic,omitempty"`         // logic tree (new)
}

// Output configures the query output.
type Output struct {
	Format  string   `yaml:"format,omitempty" json:"format,omitempty"`   // csv, json, table
	Path    string   `yaml:"path,omitempty" json:"path,omitempty"`       // output file path (empty = stdout)
	Columns []string `yaml:"columns,omitempty" json:"columns,omitempty"` // columns to include
}

// SortRule defines a sort order.
type SortRule struct {
	Field     string `yaml:"field" json:"field"`
	Direction string `yaml:"direction" json:"direction"` // asc, desc
}

// Load reads a YAML config file.
func Load(path string) (*Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("读取配置文件失败: %w", err)
	}
	return ParseYAML(data)
}

// ParseYAML parses YAML (or JSON) config from bytes.
func ParseYAML(data []byte) (*Config, error) {
	cfg := &Config{}
	if err := yaml.Unmarshal(data, cfg); err != nil {
		return nil, fmt.Errorf("解析YAML配置失败: %w", err)
	}

	if err := cfg.Validate(); err != nil {
		return nil, fmt.Errorf("配置验证失败: %w", err)
	}

	return cfg, nil
}

// Validate checks the configuration for errors.
func (c *Config) Validate() error {
	// data_dir/database will be provided via CLI if not in config
	if len(c.Filters) == 0 {
		return fmt.Errorf("至少需要一个筛选条件 (filters)")
	}

	for i, f := range c.Filters {
		set := 0
		if f.Type != nil {
			set++
		}
		if f.Field != nil {
			set++
		}
		if f.Global != nil {
			set++
		}
		if f.Tag != nil {
			set++
		}
		if f.MetaTag != nil {
			set++
		}
		if f.Relation != nil {
			set++
		}
		if f.PersonRelation != nil {
			set++
		}
		if f.CharacterRelation != nil {
			set++
		}
		if f.Staff != nil {
			set++
		}
		if f.Character != nil {
			set++
		}
		if f.PersonCharacter != nil {
			set++
		}
		if f.CharacterPerson != nil {
			set++
		}
		if f.Episode != nil {
			set++
		}
		if f.Logic != nil {
			set++
		}
		if set == 0 {
			return fmt.Errorf("筛选条件 %d: 至少需要指定一个过滤类型", i+1)
		}
		if set > 1 {
			return fmt.Errorf("筛选条件 %d: 每个条件只能指定一种过滤类型", i+1)
		}

		// Validate specific filter types
		switch {
		case f.Field != nil:
			if f.Field.Field == "" {
				return fmt.Errorf("筛选条件 %d: field 名称不能为空", i+1)
			}
			if f.Field.Operator == "" {
				return fmt.Errorf("筛选条件 %d: operator 不能为空", i+1)
			}
		case f.Relation != nil:
			if f.Relation.Type == "" {
				return fmt.Errorf("筛选条件 %d: relation type 不能为空", i+1)
			}
			if f.Relation.Mode == "" {
				f.Relation.Mode = "any"
			}
		case f.PersonRelation != nil:
			if f.PersonRelation.Type == "" {
				return fmt.Errorf("筛选条件 %d: person_relation type 不能为空", i+1)
			}
			if f.PersonRelation.Mode == "" {
				f.PersonRelation.Mode = "any"
			}
		case f.CharacterRelation != nil:
			if f.CharacterRelation.Type == "" {
				return fmt.Errorf("筛选条件 %d: character_relation type 不能为空", i+1)
			}
			if f.CharacterRelation.Mode == "" {
				f.CharacterRelation.Mode = "any"
			}
		case f.Staff != nil:
			if f.Staff.Position == "" {
				return fmt.Errorf("筛选条件 %d: staff position 不能为空", i+1)
			}
			if f.Staff.Mode == "" {
				f.Staff.Mode = "any"
			}
		case f.Character != nil:
			if f.Character.Mode == "" {
				f.Character.Mode = "any"
			}
		case f.PersonCharacter != nil:
			if f.PersonCharacter.Mode == "" {
				f.PersonCharacter.Mode = "any"
			}
		case f.CharacterPerson != nil:
			if f.CharacterPerson.Mode == "" {
				f.CharacterPerson.Mode = "any"
			}
		case f.Episode != nil:
			if f.Episode.Mode == "" {
				f.Episode.Mode = "any"
			}
		case f.Logic != nil:
			if f.Logic.Op != "and" && f.Logic.Op != "or" {
				return fmt.Errorf("筛选条件 %d: logic op 必须为 and 或 or", i+1)
			}
			if len(f.Logic.Items) == 0 {
				return fmt.Errorf("筛选条件 %d: logic items 不能为空", i+1)
			}
		}
	}

	if c.Output == nil {
		c.Output = &Output{}
	}
	if c.Output.Format == "" {
		c.Output.Format = "table"
	}
	if c.Limit <= 0 {
		c.Limit = 1000
	}

	return nil
}

// HasDatabase returns true if a persistent database path is set.
func (c *Config) HasDatabase() bool {
	return c.Database != ""
}

// NeedsRelations returns true if any filter requires relations data.
func (c *Config) NeedsRelations() bool {
	return filtersNeedRelations(c.Filters)
}

func filtersNeedRelations(filters []Filter) bool {
	for _, f := range filters {
		if f.Relation != nil {
			return true
		}
		if f.Logic != nil && filtersNeedRelations(f.Logic.Items) {
			return true
		}
	}
	return false
}

// NeedsPersons returns true if any filter requires persons data.
func (c *Config) NeedsPersons() bool {
	return filtersNeedPersons(c.Filters)
}

func filtersNeedPersons(filters []Filter) bool {
	for _, f := range filters {
		if f.Staff != nil {
			return true
		}
		if f.Logic != nil && filtersNeedPersons(f.Logic.Items) {
			return true
		}
	}
	return false
}

// NeedsPersonRelations returns true if any filter requires person_relations data.
func (c *Config) NeedsPersonRelations() bool {
	return filtersNeedPersonRelations(c.Filters)
}

func filtersNeedPersonRelations(filters []Filter) bool {
	for _, f := range filters {
		if f.PersonRelation != nil {
			return true
		}
		if f.Logic != nil && filtersNeedPersonRelations(f.Logic.Items) {
			return true
		}
	}
	return false
}

// NeedsCharacterRelations returns true if any filter requires character_relations data.
func (c *Config) NeedsCharacterRelations() bool {
	return filtersNeedCharacterRelations(c.Filters)
}

func filtersNeedCharacterRelations(filters []Filter) bool {
	for _, f := range filters {
		if f.CharacterRelation != nil {
			return true
		}
		if f.Logic != nil && filtersNeedCharacterRelations(f.Logic.Items) {
			return true
		}
	}
	return false
}

// NeedsCharacters returns true if any filter requires character data.
func (c *Config) NeedsCharacters() bool {
	return filtersNeedCharacters(c.Filters)
}

func filtersNeedCharacters(filters []Filter) bool {
	for _, f := range filters {
		if f.Character != nil {
			return true
		}
		if f.Logic != nil && filtersNeedCharacters(f.Logic.Items) {
			return true
		}
	}
	return false
}

// NeedsPersonCharacters returns true if any filter requires person_characters data.
func (c *Config) NeedsPersonCharacters() bool {
	return filtersNeedPersonCharacters(c.Filters)
}

func filtersNeedPersonCharacters(filters []Filter) bool {
	for _, f := range filters {
		if f.PersonCharacter != nil || f.CharacterPerson != nil {
			return true
		}
		if f.Logic != nil && filtersNeedPersonCharacters(f.Logic.Items) {
			return true
		}
	}
	return false
}

// NeedsEpisodes returns true if any filter requires episode data.
func (c *Config) NeedsEpisodes() bool {
	return filtersNeedEpisodes(c.Filters)
}

func filtersNeedEpisodes(filters []Filter) bool {
	for _, f := range filters {
		if f.Episode != nil {
			return true
		}
		if f.Logic != nil && filtersNeedEpisodes(f.Logic.Items) {
			return true
		}
		// Check episode logic tree
		if f.Episode != nil && f.Episode.Logic != nil && filtersNeedEpisodes(f.Episode.Logic.Items) {
			return true
		}
	}
	return false
}

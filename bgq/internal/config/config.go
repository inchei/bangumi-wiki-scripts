package config

import (
	"encoding/json"
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

// Config is the top-level YAML configuration.
type Config struct {
	Database  string     `yaml:"database" json:"database"`
	DataDir   string     `yaml:"data_dir" json:"data_dir"`
	Target    string     `yaml:"target" json:"target"` // "subject" (default) or "person"
	Filters   []Filter   `yaml:"filters" json:"filters"`
	Output    Output     `yaml:"output" json:"output"`
	Sort      []SortRule `yaml:"sort" json:"sort"`
	Limit     int        `yaml:"limit" json:"limit"`
}

// Filter is a single filter condition. Exactly one of the pointer fields should be set.
type Filter struct {
	Type     *TypeFilter     `yaml:"type,omitempty" json:"type,omitempty"`
	Field    *FieldFilter    `yaml:"field,omitempty" json:"field,omitempty"`
	Global   *GlobalFilter   `yaml:"global,omitempty" json:"global,omitempty"`
	Tag      *TagFilter      `yaml:"tag,omitempty" json:"tag,omitempty"`
	MetaTag  *TagFilter      `yaml:"meta_tag,omitempty" json:"meta_tag,omitempty"`
	Relation *RelationFilter `yaml:"relation,omitempty" json:"relation,omitempty"`
	Staff    *StaffFilter    `yaml:"staff,omitempty" json:"staff,omitempty"`
	Episode  *EpisodeFilter  `yaml:"episode,omitempty" json:"episode,omitempty"`
	Count    *CountFilter    `yaml:"count,omitempty" json:"count,omitempty"`
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
		case "staff":
			f.Staff = &StaffFilter{}
			return json.Unmarshal(val, f.Staff)
		case "episode":
			f.Episode = &EpisodeFilter{}
			return json.Unmarshal(val, f.Episode)
		case "count":
			f.Count = &CountFilter{}
			return json.Unmarshal(val, f.Count)
		}
	}
	return fmt.Errorf("filter must have one of: type, field, global, tag, meta_tag, relation, staff, episode, count")
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
		case "staff":
			if val.Kind == yaml.ScalarNode {
				f.Staff = &StaffFilter{Position: val.Value, Mode: "any"}
			} else {
				f.Staff = &StaffFilter{}
				if err := val.Decode(f.Staff); err != nil {
					return err
				}
			}
		case "episode":
			f.Episode = &EpisodeFilter{}
			if err := val.Decode(f.Episode); err != nil {
				return err
			}
		case "count":
			f.Count = &CountFilter{}
			if err := val.Decode(f.Count); err != nil {
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
		node.Decode(&v)
		return v
	case "!!float":
		var v float64
		node.Decode(&v)
		return v
	case "!!bool":
		var v bool
		node.Decode(&v)
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
	Type       string   `yaml:"type" json:"type"`             // Chinese relation name (e.g., "单行本")
	Mode       string   `yaml:"mode" json:"mode"`             // any, all, none
	Conditions []Filter `yaml:"conditions" json:"conditions"` // conditions on the related subject (full filter types)
}

// StaffFilter filters by staff/person.
// Conditions support all filter types (nested), allowing full filtering on persons (subject target) or subjects (person target).
type StaffFilter struct {
	Position   string   `yaml:"position" json:"position"`     // Chinese position name (e.g., "原作")
	Mode       string   `yaml:"mode" json:"mode"`             // any, all, none
	Conditions []Filter `yaml:"conditions" json:"conditions"` // conditions on person (subject target) or subject (person target)
}

// EpisodeFilter filters by episode.
type EpisodeFilter struct {
	Mode       string        `yaml:"mode" json:"mode"`             // any, all
	Conditions []FieldFilter `yaml:"conditions" json:"conditions"` // conditions on the episodes
}

// CountFilter filters by count of relations or episodes.
type CountFilter struct {
	What     string      `yaml:"what" json:"what"`         // Chinese relation name or "ep"
	Operator string      `yaml:"operator" json:"operator"` // gt, gte, lt, lte, eq
	Value    interface{} `yaml:"value" json:"value"`
}

// Output configures the query output.
type Output struct {
	Format  string   `yaml:"format" json:"format"`   // csv, json, table
	Path    string   `yaml:"path" json:"path"`       // output file path (empty = stdout)
	Columns []string `yaml:"columns" json:"columns"` // columns to include
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
	if c.Database == "" && c.DataDir == "" {
		// OK — CLI will supply via --data-dir
	}
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
		if f.Staff != nil {
			set++
		}
		if f.Episode != nil {
			set++
		}
		if f.Count != nil {
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
		case f.Staff != nil:
			if f.Staff.Position == "" {
				return fmt.Errorf("筛选条件 %d: staff position 不能为空", i+1)
			}
			if f.Staff.Mode == "" {
				f.Staff.Mode = "any"
			}
		case f.Episode != nil:
			if f.Episode.Mode == "" {
				f.Episode.Mode = "any"
			}
		}
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
	for _, f := range c.Filters {
		if f.Relation != nil || f.Count != nil && f.Count.What != "ep" {
			return true
		}
	}
	return false
}

// NeedsPersons returns true if any filter requires persons data.
func (c *Config) NeedsPersons() bool {
	for _, f := range c.Filters {
		if f.Staff != nil {
			return true
		}
	}
	return false
}

// NeedsEpisodes returns true if any filter requires episode data.
func (c *Config) NeedsEpisodes() bool {
	for _, f := range c.Filters {
		if f.Episode != nil {
			return true
		}
		if f.Count != nil && f.Count.What == "ep" {
			return true
		}
	}
	return false
}

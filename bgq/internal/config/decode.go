package config

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"reflect"
	"strings"
	"sync"

	"gopkg.in/yaml.v3"
)

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
		case "person_cast_subject":
			f.PersonCastSubject = &PersonCastSubjectFilter{}
			return json.Unmarshal(val, f.PersonCastSubject)
		case "subject_cast":
			f.SubjectCast = &SubjectCastFilter{}
			return json.Unmarshal(val, f.SubjectCast)
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
	return fmt.Errorf("filter must have one of: type, field, global, tag, meta_tag, relation, person_relation, character_relation, staff, character, person_character, person_cast_subject, character_person, subject_cast, episode, logic")
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
				if err := decodeStrict(val, key, f.Type); err != nil {
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
				if err := decodeStrict(val, key, f.Field); err != nil {
					return err
				}
			}
		case "global":
			if val.Kind == yaml.ScalarNode {
				f.Global = &GlobalFilter{Operator: "contains", Value: val.Value}
			} else {
				f.Global = &GlobalFilter{}
				if err := decodeStrict(val, key, f.Global); err != nil {
					return err
				}
			}
		case "tag":
			if val.Kind == yaml.ScalarNode {
				// Shorthand: tag: <tag_name>
				f.Tag = &TagFilter{Operator: "contains", Value: val.Value}
			} else {
				f.Tag = &TagFilter{}
				if err := decodeStrict(val, key, f.Tag); err != nil {
					return err
				}
			}
		case "meta_tag":
			if val.Kind == yaml.ScalarNode {
				// Shorthand: meta_tag: <tag_name>
				f.MetaTag = &TagFilter{Operator: "contains", Value: val.Value}
			} else {
				f.MetaTag = &TagFilter{}
				if err := decodeStrict(val, key, f.MetaTag); err != nil {
					return err
				}
			}
		case "relation":
			if val.Kind == yaml.ScalarNode {
				f.Relation = &RelationFilter{Type: val.Value, Mode: "any"}
			} else {
				f.Relation = &RelationFilter{}
				if err := decodeStrict(val, key, f.Relation); err != nil {
					return err
				}
			}
		case "person_relation":
			if val.Kind == yaml.ScalarNode {
				f.PersonRelation = &PersonRelationFilter{Type: val.Value, Mode: "any"}
			} else {
				f.PersonRelation = &PersonRelationFilter{}
				if err := decodeStrict(val, key, f.PersonRelation); err != nil {
					return err
				}
			}
		case "character_relation":
			if val.Kind == yaml.ScalarNode {
				f.CharacterRelation = &CharacterRelationFilter{Type: val.Value, Mode: "any"}
			} else {
				f.CharacterRelation = &CharacterRelationFilter{}
				if err := decodeStrict(val, key, f.CharacterRelation); err != nil {
					return err
				}
			}
		case "staff":
			if val.Kind == yaml.ScalarNode {
				f.Staff = &StaffFilter{Position: val.Value, Mode: "any"}
			} else {
				f.Staff = &StaffFilter{}
				if err := decodeStrict(val, key, f.Staff); err != nil {
					return err
				}
			}
		case "character":
			f.Character = &CharacterFilter{}
			if err := decodeStrict(val, key, f.Character); err != nil {
				return err
			}
		case "person_character":
			f.PersonCharacter = &PersonCharacterFilter{}
			if err := decodeStrict(val, key, f.PersonCharacter); err != nil {
				return err
			}
		case "person_cast_subject":
			f.PersonCastSubject = &PersonCastSubjectFilter{}
			if err := decodeStrict(val, key, f.PersonCastSubject); err != nil {
				return err
			}
		case "subject_cast":
			f.SubjectCast = &SubjectCastFilter{}
			if err := decodeStrict(val, key, f.SubjectCast); err != nil {
				return err
			}
		case "character_person":
			f.CharacterPerson = &CharacterPersonFilter{}
			if err := decodeStrict(val, key, f.CharacterPerson); err != nil {
				return err
			}
		case "episode":
			f.Episode = &EpisodeFilter{}
			if err := decodeStrict(val, key, f.Episode); err != nil {
				return err
			}
		case "logic":
			f.Logic = &LogicFilter{}
			if err := decodeStrict(val, key, f.Logic); err != nil {
				return err
			}
		default:
			return fmt.Errorf("未知筛选键「%s」", key)
		}
	}
	return nil
}

// strictYAMLKeys caches the yaml-tagged field names per struct type.
var strictYAMLKeys sync.Map // reflect.Type -> map[string]struct{}

func strictYAMLKeysFor(t reflect.Type) map[string]struct{} {
	if cached, ok := strictYAMLKeys.Load(t); ok {
		return cached.(map[string]struct{})
	}
	keys := make(map[string]struct{})
	for i := 0; i < t.NumField(); i++ {
		name := strings.Split(t.Field(i).Tag.Get("yaml"), ",")[0]
		if name == "" || name == "-" {
			continue
		}
		keys[name] = struct{}{}
	}
	actual, _ := strictYAMLKeys.LoadOrStore(t, keys)
	return actual.(map[string]struct{})
}

// decodeStrict decodes a mapping node into target, rejecting keys that are
// not yaml-tagged fields of the target struct. KnownFields(true) does not
// propagate through custom UnmarshalYAML → node.Decode, so nested filter
// values would otherwise silently drop unknown keys while the Web UI's YAML
// editor rejects them (kind names the error like the frontend does).
func decodeStrict(node *yaml.Node, kind string, target interface{}) error {
	if node.Kind == yaml.MappingNode {
		t := reflect.TypeOf(target)
		if t.Kind() == reflect.Pointer {
			t = t.Elem()
		}
		if t.Kind() == reflect.Struct {
			allowed := strictYAMLKeysFor(t)
			for i := 0; i < len(node.Content); i += 2 {
				key := node.Content[i].Value
				if _, ok := allowed[key]; !ok {
					return fmt.Errorf("%s 中未知键「%s」", kind, key)
				}
			}
		}
	}
	return node.Decode(target)
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
	// KnownFields mirrors the Web UI's YAML editor: unknown top-level and
	// nested keys (e.g. a typo'd "limt:") are rejected instead of silently
	// dropped.
	dec := yaml.NewDecoder(bytes.NewReader(data))
	dec.KnownFields(true)
	if err := dec.Decode(cfg); err != nil && err != io.EOF {
		return nil, fmt.Errorf("解析YAML配置失败: %w", err)
	}

	if err := cfg.Validate(); err != nil {
		return nil, fmt.Errorf("配置验证失败: %w", err)
	}

	return cfg, nil
}

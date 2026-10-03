package config

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
		if f.Character != nil || f.SubjectCast != nil {
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
		if f.PersonCharacter != nil || f.CharacterPerson != nil || f.PersonCastSubject != nil || f.SubjectCast != nil {
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

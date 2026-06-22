package model

// Subject represents a Bangumi subject entry.
type Subject struct {
	ID           int            `json:"id"`
	Type         int            `json:"type"`
	Name         string         `json:"name"`
	NameCN       string         `json:"name_cn"`
	Infobox      string         `json:"infobox"`
	Platform     int            `json:"platform"`
	Summary      string         `json:"summary"`
	NFSW         bool           `json:"nsfw"`
	Score        float64        `json:"score"`
	Rank         int            `json:"rank"`
	Date         string         `json:"date"`
	Series       bool           `json:"series"`
	Tags         []Tag          `json:"tags"`
	MetaTags     []string       `json:"meta_tags"`
	ScoreDetails map[string]int `json:"score_details"`
	Favorite     Favorite       `json:"favorite"`
}

// Tag represents a subject tag.
type Tag struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

// Favorite represents user collection stats.
type Favorite struct {
	Wish    int `json:"wish"`
	Done    int `json:"done"`
	Doing   int `json:"doing"`
	OnHold  int `json:"on_hold"`
	Dropped int `json:"dropped"`
}

// SubjectRelation represents a relation between two subjects.
type SubjectRelation struct {
	SubjectID        int `json:"subject_id"`
	RelationType     int `json:"relation_type"`
	RelatedSubjectID int `json:"related_subject_id"`
	Order            int `json:"order"`
}

// SubjectPerson represents a person's role in a subject.
type SubjectPerson struct {
	PersonID  int    `json:"person_id"`
	SubjectID int    `json:"subject_id"`
	Position  int    `json:"position"`
	AppearEps string `json:"appear_eps"`
}

// Episode represents an episode/chapter of a subject.
type Episode struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	NameCN      string `json:"name_cn"`
	Description string `json:"description"`
	Airdate     string `json:"airdate"`
	Disc        int    `json:"disc"`
	Duration    string `json:"duration"`
	SubjectID   int    `json:"subject_id"`
	Sort        int    `json:"sort"`
	Type        int    `json:"type"`
}

// Person represents a person in the database.
type Person struct {
	ID      int      `json:"id"`
	Name    string   `json:"name"`
	Type    int      `json:"type"`
	Career  []string `json:"career"`
	Infobox string   `json:"infobox"`
	Summary string   `json:"summary"`
}

// Character represents a character in the database.
type Character struct {
	ID       int    `json:"id"`
	Role     int    `json:"role"`
	Name     string `json:"name"`
	Infobox  string `json:"infobox"`
	Summary  string `json:"summary"`
	Comments int    `json:"comments"`
	Collects int    `json:"collects"`
}

// SubjectCharacter represents a character's appearance in a subject.
type SubjectCharacter struct {
	CharacterID int `json:"character_id"`
	SubjectID   int `json:"subject_id"`
	Type        int `json:"type"`
	Order       int `json:"order"`
}

// CharacterAssociationTypes maps subject_character type codes to Chinese names.
var CharacterAssociationTypes = map[int]string{
	1: "主角",
	2: "配角",
	3: "客串",
	4: "闲角",
	5: "旁白",
	6: "声库",
}

// CharacterAssociationTypeNames returns all character association type names.
func CharacterAssociationTypeNames() []string {
	var names []string
	for _, name := range CharacterAssociationTypes {
		names = append(names, name)
	}
	return names
}

// PersonCharacter represents a person-character-subject three-way relationship.
type PersonCharacter struct {
	PersonID    int    `json:"person_id"`
	SubjectID   int    `json:"subject_id"`
	CharacterID int    `json:"character_id"`
	Type        int    `json:"type"`
	Summary     string `json:"summary"`
}

// PersonCharacterTypes maps person_character type codes to Chinese names (CV type).
var PersonCharacterTypes = map[int]string{
	0: "CV",
	1: "译配",
	2: "演员",
	3: "中配",
	4: "日配",
	5: "英配",
	6: "韩配",
}

// PersonCharacterTypeNames returns all person character type names.
func PersonCharacterTypeNames() []string {
	var names []string
	for _, name := range PersonCharacterTypes {
		names = append(names, name)
	}
	return names
}

// SubjectType represents a Bangumi subject type.
type SubjectType int

const (
	TypeBook  SubjectType = 1
	TypeAnime SubjectType = 2
	TypeMusic SubjectType = 3
	TypeGame  SubjectType = 4
	TypeReal  SubjectType = 6
)

// TypeCNToNum maps Chinese type names to numeric codes.
var TypeCNToNum = map[string]int{
	"书籍":  1,
	"动画":  2,
	"音乐":  3,
	"游戏":  4,
	"三次元": 6,
}

// TypeNumToCN maps numeric codes to Chinese type names.
var TypeNumToCN = map[int]string{
	1: "书籍",
	2: "动画",
	3: "音乐",
	4: "游戏",
	6: "三次元",
}

func test() {}

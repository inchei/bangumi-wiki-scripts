package missingpersons

import "html/template"

type subjectRecord struct {
	ID      int
	Name    string
	Type    int
	Infobox string
}

type subjectInfo struct {
	SubjectName string
	DisplayName string
	SubjectType int
	PosIDs      map[int]struct{}
}

type missingPerson struct {
	DisplayName string
	KeyNorm     string
	Count       int
	Subjects    map[string]*subjectInfo
	TypeCounts  map[int]int
}

type typePosNameToID map[int]map[string]int

type personIDName struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type missingRelatedPerson struct {
	DisplayName       string
	KeyNorm           string
	Count             int
	Subjects          map[string]*subjectInfo
	TypeCounts        map[int]int
	ExistingPersonIDs []personIDName
	FromAlias         bool
}

type subData struct {
	Name      string `json:"name"`
	Positions []int  `json:"positions"`
	Type      int    `json:"_type"`
}

type idName struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type personTplData struct {
	Idx             int
	Name            string
	Count           int
	FirstPersonID   int
	FirstPersonName string
	MultiMatch      bool
	SelectOptions   template.HTML
	FromAlias       bool
}

type partLinkTplData struct {
	Href  string
	Label string
}

type typeLinkTplData struct {
	TypeName string
	Count    int
	Parts    []partLinkTplData
}

type typePageTplData struct {
	CSS         template.CSS
	JS          template.JS
	Title       string
	PrevLink    string
	NextLink    string
	PageInfo    string
	PendingData template.JS
	PosTable    template.JS
	Persons     []personTplData
	PageKind    string
}

// searchItem is a single homepage-search row: one unique person with the link
// to the first page they appear on. Each person is in exactly one category
// (missing/related/variant/bare), so one href suffices. Only name + href are
// embedded to keep search.html small.
type searchItem struct {
	DisplayName string `json:"displayName"`
	Href        string `json:"href"`
}

type missingStats struct {
	CreatedAt     string               `json:"created_at"`
	Date          string               `json:"date"`
	TotalSubjects int                  `json:"totalSubjects"`
	TotalMissing  int                  `json:"totalMissing"`
	TotalRelated  int                  `json:"totalRelated"`
	TotalBare     int                  `json:"totalBare"`
	TotalVariant  int                  `json:"totalVariant"`
	Remaining     int                  `json:"remaining"`
	ByType        map[string]typeStats `json:"byType"`
}

type typeStats struct {
	Missing int `json:"missing"`
	Related int `json:"related"`
	Bare    int `json:"bare"`
	Variant int `json:"variant"`
}

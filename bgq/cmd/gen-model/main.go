package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"text/template"

	"gopkg.in/yaml.v3"
)

const bangumiCommonBase = "https://raw.githubusercontent.com/bangumi/common/master"

//go:generate cp -r templates ../../internal/model/templates

func main() {
	dataDir := "../bangumi_archive"
	outDir := "internal/model"

	for i := 1; i < len(os.Args); i++ {
		switch os.Args[i] {
		case "--data-dir":
			if i+1 < len(os.Args) {
				dataDir = os.Args[i+1]
				i++
			}
		case "--out-dir":
			if i+1 < len(os.Args) {
				outDir = os.Args[i+1]
				i++
			}
		}
	}

	if outDir == "internal/model" {
		if _, err := os.Stat("model.go"); err == nil {
			outDir = "."
		}
	}

	// Find templates directory
	tmplDir := findTemplatesDir()

	fmt.Println("Generating model data...")
	fmt.Println("  Downloading from bangumi/common...")

	platformsYAML := downloadFile(bangumiCommonBase + "/subject_platforms.yml")
	subjectRelationsYAML := downloadFile(bangumiCommonBase + "/subject_relations.yml")
	personRelationsYAML := downloadFile(bangumiCommonBase + "/person_relations.yml")
	staffYAML := downloadFile(bangumiCommonBase + "/subject_staffs.yml")

	fmt.Println("  Generating platform.go...")
	generatePlatform(platformsYAML, outDir, tmplDir)

	fmt.Println("  Generating relation_data.go...")
	generateRelationData(subjectRelationsYAML, personRelationsYAML, outDir, tmplDir)

	fmt.Println("  Generating staff_data.go...")
	generateStaffData(staffYAML, outDir, tmplDir)

	fmt.Println("  Generating metatags.go...")
	generateMetaTags(dataDir, outDir, tmplDir)

	fmt.Println("Done!")
}

func findTemplatesDir() string {
	// Try relative to executable
	if _, err := os.Stat("templates"); err == nil {
		return "templates"
	}
	// Try relative to module root
	if _, err := os.Stat("cmd/gen-model/templates"); err == nil {
		return "cmd/gen-model/templates"
	}
	// Try from internal/model
	if _, err := os.Stat("../../cmd/gen-model/templates"); err == nil {
		return "../../cmd/gen-model/templates"
	}
	fmt.Fprintf(os.Stderr, "Cannot find templates directory\n")
	os.Exit(1)
	return ""
}

// --- Download ---

func downloadFile(url string) []byte {
	resp, err := http.Get(url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to download %s: %v\n", url, err)
		os.Exit(1)
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		fmt.Fprintf(os.Stderr, "Failed to download %s: HTTP %d\n", url, resp.StatusCode)
		os.Exit(1)
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to read response: %v\n", err)
		os.Exit(1)
	}
	return body
}

// --- YAML structures ---

type PlatformItem struct {
	ID     int    `yaml:"id"`
	TypeCN string `yaml:"type_cn"`
}

type PlatformYAML struct {
	Platforms map[string]map[string]PlatformItem `yaml:"platforms"`
}

type RelationItem struct {
	CN string `yaml:"cn"`
}

type RelationYAML struct {
	Define struct {
		Types map[string]map[int]RelationItem `yaml:"types"`
	} `yaml:"define"`
}

type StaffItem struct {
	CN string `yaml:"cn"`
}

type StaffYAML struct {
	Define struct {
		Types map[string]map[int]StaffItem `yaml:"types"`
	} `yaml:"define"`
}

// --- Helpers ---

func sortedIntKeys[V any](m map[int]V) []int {
	keys := make([]int, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Ints(keys)
	return keys
}

func writeToFile(path, content string) {
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Failed to write %s: %v\n", path, err)
		os.Exit(1)
	}
}

func loadTemplate(tmplDir, name string) *template.Template {
	path := filepath.Join(tmplDir, name)
	data, err := os.ReadFile(path)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to read template %s: %v\n", path, err)
		os.Exit(1)
	}
	tmpl, err := template.New(name).Parse(string(data))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to parse template %s: %v\n", path, err)
		os.Exit(1)
	}
	return tmpl
}

// --- Platform ---

func generatePlatform(yamlData []byte, outDir, tmplDir string) {
	var data PlatformYAML
	if err := yaml.Unmarshal(yamlData, &data); err != nil {
		fmt.Fprintf(os.Stderr, "Failed to parse subject_platforms.yml: %v\n", err)
		os.Exit(1)
	}

	type entry struct{ Code, Name string }
	type platformData struct {
		Name    string
		Entries []entry
	}

	yamlToGo := map[string]string{
		"1": "Book", "2": "Anime", "3": "Music", "4": "Game", "6": "Real",
	}

	var platforms []platformData
	for yamlKey, goType := range yamlToGo {
		var entries []entry
		if ps, ok := data.Platforms[yamlKey]; ok {
			ids := make([]int, 0, len(ps))
			for _, p := range ps {
				ids = append(ids, p.ID)
			}
			sort.Ints(ids)
			for _, id := range ids {
				for _, p := range ps {
					if p.ID == id {
						entries = append(entries, entry{fmt.Sprint(p.ID), p.TypeCN})
						break
					}
				}
			}
		}
		platforms = append(platforms, platformData{goType, entries})
	}

	tmpl := loadTemplate(tmplDir, "platform.go.tmpl")
	var sb strings.Builder
	tmpl.Execute(&sb, struct{ Platforms []platformData }{platforms})
	writeToFile(filepath.Join(outDir, "platform.go"), sb.String())
}

// --- Relation Data ---

func generateRelationData(subjectYAML, personYAML []byte, outDir, tmplDir string) {
	var subjectData RelationYAML
	if err := yaml.Unmarshal(subjectYAML, &subjectData); err != nil {
		fmt.Fprintf(os.Stderr, "Failed to parse subject_relations.yml: %v\n", err)
		os.Exit(1)
	}
	var personData RelationYAML
	if err := yaml.Unmarshal(personYAML, &personData); err != nil {
		fmt.Fprintf(os.Stderr, "Failed to parse person_relations.yml: %v\n", err)
		os.Exit(1)
	}

	type relEntry struct{ Code, Name string }
	type relType struct {
		GoType  string
		Entries []relEntry
	}

	yamlToGo := map[string]string{
		"book": "Book", "anime": "Anime", "music": "Music",
		"game": "Game", "real": "Real",
	}

	var relTypes []relType
	for yt, gt := range yamlToGo {
		var entries []relEntry
		if rels, ok := subjectData.Define.Types[yt]; ok {
			codes := sortedIntKeys(rels)
			for _, c := range codes {
				entries = append(entries, relEntry{fmt.Sprint(c), rels[c].CN})
			}
		}
		relTypes = append(relTypes, relType{gt, entries})
	}

	toEntries := func(m map[int]RelationItem) []relEntry {
		codes := sortedIntKeys(m)
		var entries []relEntry
		for _, c := range codes {
			entries = append(entries, relEntry{fmt.Sprint(c), m[c].CN})
		}
		return entries
	}

	var personEntries, charEntries []relEntry
	if pt, ok := personData.Define.Types["person"]; ok {
		personEntries = toEntries(pt)
	}
	if ct, ok := personData.Define.Types["character"]; ok {
		charEntries = toEntries(ct)
	}

	tmpl := loadTemplate(tmplDir, "relation_data.go.tmpl")
	data := struct {
		RelTypes      []relType
		PersonEntries []relEntry
		CharEntries   []relEntry
	}{relTypes, personEntries, charEntries}

	var sb strings.Builder
	tmpl.Execute(&sb, data)
	writeToFile(filepath.Join(outDir, "relation_data.go"), sb.String())
}

// --- Staff Data ---

func generateStaffData(yamlData []byte, outDir, tmplDir string) {
	var data StaffYAML
	if err := yaml.Unmarshal(yamlData, &data); err != nil {
		fmt.Fprintf(os.Stderr, "Failed to parse subject_staffs.yml: %v\n", err)
		os.Exit(1)
	}

	type staffEntry struct{ Code, Name string }
	type staffType struct {
		Prefix, Comment string
		Entries         []staffEntry
	}

	yamlToVar := map[string]string{
		"book": "book", "anime": "anime", "music": "music",
		"game": "game", "real": "real",
	}
	yamlToComment := map[string]string{
		"book": "书籍", "anime": "动画", "music": "音乐",
		"game": "游戏", "real": "三次元",
	}

	var staffTypes []staffType
	for yt, vp := range yamlToVar {
		var entries []staffEntry
		if ps, ok := data.Define.Types[yt]; ok {
			codes := sortedIntKeys(ps)
			for _, c := range codes {
				entries = append(entries, staffEntry{fmt.Sprint(c), ps[c].CN})
			}
		}
		staffTypes = append(staffTypes, staffType{vp, yamlToComment[yt], entries})
	}

	tmpl := loadTemplate(tmplDir, "staff_data.go.tmpl")
	var sb strings.Builder
	tmpl.Execute(&sb, struct{ StaffTypes []staffType }{staffTypes})
	writeToFile(filepath.Join(outDir, "staff_data.go"), sb.String())
}

// --- MetaTags ---

func generateMetaTags(dataDir, outDir, tmplDir string) {
	subjectFile := filepath.Join(dataDir, "subject.jsonlines")
	file, err := os.Open(subjectFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to open %s: %v\n", subjectFile, err)
		os.Exit(1)
	}
	defer file.Close()

	typeMetaTags := make(map[int]map[string]bool)
	decoder := json.NewDecoder(file)
	for decoder.More() {
		var subject struct {
			Type     int      `json:"type"`
			MetaTags []string `json:"meta_tags"`
		}
		if err := decoder.Decode(&subject); err != nil {
			break
		}
		if subject.MetaTags == nil {
			continue
		}
		if typeMetaTags[subject.Type] == nil {
			typeMetaTags[subject.Type] = make(map[string]bool)
		}
		for _, tag := range subject.MetaTags {
			typeMetaTags[subject.Type][tag] = true
		}
	}

	type tagEntry struct {
		TypeCode int
		Tags     string
	}
	var entries []tagEntry
	for _, tc := range []int{1, 2, 3, 4, 6} {
		tags := typeMetaTags[tc]
		if tags == nil {
			continue
		}
		var tagList []string
		for tag := range tags {
			tagList = append(tagList, tag)
		}
		sort.Strings(tagList)
		quoted := make([]string, len(tagList))
		for i, tag := range tagList {
			quoted[i] = `"` + tag + `"`
		}
		entries = append(entries, tagEntry{tc, strings.Join(quoted, ", ")})
	}

	tmpl := loadTemplate(tmplDir, "metatags.go.tmpl")
	var sb strings.Builder
	tmpl.Execute(&sb, struct{ Entries []tagEntry }{entries})
	writeToFile(filepath.Join(outDir, "metatags.go"), sb.String())
}

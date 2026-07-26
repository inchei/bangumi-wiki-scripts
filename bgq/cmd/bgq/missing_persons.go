package main

import (
	"bufio"
	"context"
	_ "embed"
	"encoding/json"
	"fmt"
	"html"
	"html/template"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/inchei/bangumi-query/internal/model"
	"github.com/inchei/bangumi-query/internal/query"
)

const seriesRelationType = 1002
const missingPersonsMinCount = 2

var musicExtraPositions = map[int]string{
	30:   "主题歌编曲",
	31:   "主题歌作曲",
	32:   "主题歌作词",
	33:   "主题歌演出",
	34:   "插入歌演出",
	118:  "插入歌作词",
	119:  "插入歌作曲",
	120:  "插入歌编曲",
	4015: "主题歌演出",
}

var subjectTypeNames = map[int]string{1: "书籍", 2: "动画", 3: "音乐", 4: "游戏", 6: "三次元"}

func isDelim(r rune) bool {
	switch r {
	case '(', ')', '[', ']', '{', '}', '（', '）', '<', '>',
		'《', '》', '「', '」', '『', '』', '【', '】',
		'+', '×', '·', '→', '/', '／', '、', ',', '，', ';', '；', '：',
		':', '&', '＆', '\\', '等':
		return true
	}
	return false
}

var noiseSubstringsCJK = []string{
	"总监", "总策划", "总制片", "总导演", "总作监", "出品人", "发行人",
	"制片", "制片人", "制作人", "制作总指挥", "制作管理", "制作进行", "制作担当", "制作デスク",
	"导演", "監督", "チーフディレクター", "ディレクター", "チーフ",
	"监制", "监修", "監修", "作监",
	"企画", "構成", "构成", "策划", "统筹", "协力", "協力", "协助", "提供", "支持",
	"辅助", "辅佐", "助理", "助手", "修型", "鳴謝", "鸣谢",
	"指导", "编剧", "脚本", "原作", "原案", "分镜", "演出", "作曲", "作词", "编曲",
	"录音", "混音", "选曲", "整音", "效果", "編集", "剪辑", "编辑", "摄影", "宣传",
	"设计", "合成", "特效", "美術", "色彩", "人设", "原画", "作画", "背景", "动画", "制作", "製作",
	"出品", "发行", "出版", "発行", "連載", "掲載", "刊", "版",
	"后期", "前期", "版权", "文学", "文艺", "设定", "設定",
	"原创音乐", "原作音乐", "调整", "指挥", "指挥者", "指挥家",
	"工作室", "委员会", "委員会", "株式会社", "有限公司", "有限责任公司", "集团", "公司",
	"企鹅影视", "哔哩哔哩", "腾讯", "爱奇艺", "优酷",
	"ミュージック", "ピクチャーズ", "エンタテインメント", "エンタテイメント",
	"ワークス", "スタジオ", "プロダクション", "アニメーション", "プロモーション",
	"エージェンシー", "ウォンバット", "DIGITAL",
	"テレビジョン", "テレビ", "放送", "出版", "発行", "シリーズ",
	"鬼戦車",
	"話", "回", "巻", "期", "集", "冊", "章",
	"北京", "上海", "東京", "日本", "台湾", "香港", "中国",
	"顾问", "演奏", "指揮", "協力", "宣伝", "宣伝協力",
	"より", "漫画", "アニメ", "小説", "原作小説", "原作漫画",
	"片头曲", "片尾曲", "插曲", "主題歌", "主題曲",
	"製作担当", "音楽協力", "製作協力",
	"録音調整", "補佐", "拟音", "内容推广", "Layout", "調整", "和声", "人声", "有", "https",
	"企划", "场景", "助监督", "主题曲", "内容宣发", "特别感谢", "配音团队", "组长", "场景监督", "场景美术",
	"発売", "封面", "ドラマ",
	"東映動画", "創通", "マーベラス", "Showgate", "ショウゲート",
	"钢琴", "小提琴", "中提琴", "大提琴", "吉他", "贝斯", "萨克斯", "单簧管", "双簧管",
	"竖琴", "小号", "长号", "圆号", "长笛", "短笛", "口琴", "手风琴", "电子琴", "架子鼓",
	"インディペンデント", "インディーズ", "オムニバス", "サントラ", "アルバム",
	"イメージ", "ラジオ", "ビデオ", "レーベル", "イラスト", "サウンドトラック",
	"ドラマ", "コンピレーション", "音楽", "ゲーム",
	"itaku", "委託", "パブリッシング", "マーケティング", "エンタテインメント", "コミュニケーション",
	"录制", "混音", "母带", "伴奏",
	"主笔", "本編", "本篇", "番外", "特典", "限定", "体验版", "体验", "无语音", "语音",
	"中文版", "日文版", "英文版", "副", "现", "总", "辅", "ほか", "他",
	"北美", "大陆", "全球", "韩国", "法国", "英国", "加拿大", "欧洲", "亚洲",
	"英文", "中文", "日文", "韩文", "繁中", "简中", "武汉", "日",
	"映画", "配音", "国际", "剧本", "主演", "出演", "友情", "特別", "领衔", "映像",
	"应援", "カメオ", "声音", "声客", "電子", "非首发",
	"环境音效", "厦门", "上色", "選曲", "CG", "Mac", "主美", "内容运营",
	"一原", "立绘", "协作", "三维", "合唱", "美术", "3D", "3D美术", "合作单位",
	"デザイン", "グラフィック", "サウンド", "エフェクト", "キャラクター",
	"プログラム", "プログラミング", "シナリオ", "プランナー", "ディレクター",
	"ライター", "イラスト", "モンスター", "ロボット", "メカ", "メイン",
}

var personCNNameRe = regexp.MustCompile(`\|\s*简体中文名\s*=\s*([^\n|]*)`)

func extractPersonCNName(infobox string) string {
	m := personCNNameRe.FindStringSubmatch(infobox)
	if len(m) >= 2 {
		return strings.TrimSpace(m[1])
	}
	return ""
}

var noiseEnRe = regexp.MustCompile(`(?i)\b(?:` +
	`letterer|colorist|inker|penciler|penciller|translator|editor|` +
	`assistant|credited|uncredited|retouch|assist|technic?ian|` +
	`coordinat(?:or|ion)|contributor|collaborator|producer|` +
	`supervis(?:or|ion)|manage[rm]|planner|director|` +
	`distribut(?:or|ion)|packager|printer|binder|staff|` +
	`piano|violin|guitar|bass|drums|flute|sax(?:ophone)?|` +
	`cello|harp|trumpet|trombone|clarinet|oboe|viola|` +
	`ukulele|synthesiz(?:s|er)|keyboard|drum|` +
	`recording|mastering|remastering|vocaloid|utau|` +
	`(?:various\s+)?artists|` +
	`p[lc]c?|llc|l\.?t\.?d|ltd|gmbh|inc|corp|co|` +
	`android|ios|windows|steam|switch|new|` +
	`program|programming|programmer|design|designer|writer|` +
	`producer|direction?|effects?|graphics?|scenario|planning|` +
	`coordinat(?:or|ion)` +
	`)\b|` +
	`PS\d?|PSP|PSV|3DS|NDS|GBA|FC|SFC|FX|N64|DC|SS|Xbox|XBOX|PC\d?` +
	`[SsTt][Uu][Dd][Ii][Oo]|[Pp]roduction|[Ee]ntertainment|[Pp]ictures|[Mm]usic|[Ww]orks|` +
	`OP\d?|ED\d?|IN\d?|BGM|OST|OVA|OAD|ONA|TV|BD|DVD|CD|Blu-ray|第\d+` +
	`Team[- ]|CV\b|NC\b|` +
	`INC\.?|Inc\.?|Ltd\.?|Co\.|Corp\.|` +
	`\bS\d|3D|cv\b`,
)

func isNoiseName(name string) bool {
	for _, s := range noiseSubstringsCJK {
		if strings.Contains(name, s) {
			return true
		}
	}
	// Only run regex for names that contain ASCII letters — most CJK names skip this
	if containsASCII(name) && noiseEnRe.MatchString(name) {
		return true
	}
	return false
}

func containsASCII(s string) bool {
	for i := 0; i < len(s); i++ {
		c := s[i]
		if (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') {
			return true
		}
	}
	return false
}

var allPosIDs []int
var allPosNameToID map[string]int
var allPosIDToName map[int]string

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

var _typePni typePosNameToID

func init() {
	_typePni = buildTypePosNameToID()

	allPosNameToID = make(map[string]int)
	allPosIDToName = make(map[int]string)
	for _, pni := range _typePni {
		for name, id := range pni {
			allPosNameToID[name] = id
			allPosIDToName[id] = name
		}
	}
	allPosIDs = make([]int, 0, len(allPosIDToName))
	for id := range allPosIDToName {
		allPosIDs = append(allPosIDs, id)
	}
	sort.Ints(allPosIDs)
}

func buildTypePosNameToID() typePosNameToID {
	result := make(typePosNameToID, len(model.StaffPositions))
	for t, pos := range model.StaffPositions {
		pni := make(map[string]int, len(pos))
		for id, name := range pos {
			pni[name] = id
		}
		result[t] = pni
	}
	for id, name := range musicExtraPositions {
		result[int(model.TypeMusic)][name] = id
	}
	return result
}

var (
	isDigitsOnlyRe  = regexp.MustCompile(`^[\d\-./#\s]+$`)
	hasCJKOrAlphaRe = regexp.MustCompile(`[\p{Han}\p{Hiragana}\p{Katakana}a-zA-Z]`)
)

func normalizePersonName(name string) string {
	return normalizeAlias(name)
}

func isLikelyPerson(name string) bool {
	if len(name) < 2 {
		return false
	}
	if isDigitsOnlyRe.MatchString(name) {
		return false
	}
	if !hasCJKOrAlphaRe.MatchString(name) {
		return false
	}
	if isNoiseName(name) {
		return false
	}
	return true
}

func loadKnownPersons(personFile, aliasFile string) (map[string]bool, map[string][]int, map[int]string, map[string]bool, error) {
	known := make(map[string]bool)
	knownIDs := make(map[string][]int)
	idToName := make(map[int]string)
	aliasNorm := make(map[string]bool)

	f, err := os.Open(personFile)
	if err != nil {
		return nil, nil, nil, nil, fmt.Errorf("打开 person.jsonlines 失败: %w", err)
	}
	defer func() { _ = f.Close() }()

	scanner := bufio.NewScanner(f)
	scanner.Buffer(make([]byte, 1024*1024), 10*1024*1024)
	for scanner.Scan() {
		var p struct {
			ID      int    `json:"id"`
			Name    string `json:"name"`
			Infobox string `json:"infobox"`
		}
		if err := json.Unmarshal(scanner.Bytes(), &p); err != nil {
			continue
		}
		if p.Name != "" {
			norm := normalizePersonName(p.Name)
			known[norm] = true
			knownIDs[norm] = append(knownIDs[norm], p.ID)
			if p.ID > 0 {
				display := p.Name
				if cn := extractPersonCNName(p.Infobox); cn != "" {
					display = cn
				}
				idToName[p.ID] = display
			}
		}
		// Also match by CN name from infobox
		if cn := extractPersonCNName(p.Infobox); cn != "" && cn != p.Name {
			normCN := normalizePersonName(cn)
			if normCN != normalizePersonName(p.Name) {
				known[normCN] = true
				knownIDs[normCN] = append(knownIDs[normCN], p.ID)
			}
		}
	}
	if err := scanner.Err(); err != nil {
		return nil, nil, nil, nil, fmt.Errorf("读取 person.jsonlines 失败: %w", err)
	}

	if aliasFile != "" {
		ad, err := loadAliasesFile(aliasFile)
		if err == nil {
			for alias := range ad.aliases {
				if !known[alias] {
					aliasNorm[alias] = true
				}
				known[alias] = true
				indices := ad.aliases[alias]
				for _, idx := range indices {
					if idx >= 0 && idx < len(ad.persons) {
						pid := ad.persons[idx].ID
						already := false
						for _, existing := range knownIDs[alias] {
							if existing == pid {
								already = true
								break
							}
						}
						if !already {
							knownIDs[alias] = append(knownIDs[alias], pid)
						}
					}
				}
			}
		}
	}

	return known, knownIDs, idToName, aliasNorm, nil
}

func loadCharacterNames(archiveDir string, dbPath string) (map[string]bool, error) {
	names := make(map[string]bool)

	charFile := filepath.Join(archiveDir, "character.jsonlines")
	f, err := os.Open(charFile)
	if err != nil {
		return names, nil
	}
	defer func() { _ = f.Close() }()

	scanner := bufio.NewScanner(f)
	scanner.Buffer(make([]byte, 1024*1024), 10*1024*1024)
	for scanner.Scan() {
		var c struct {
			Name string `json:"name"`
		}
		if err := json.Unmarshal(scanner.Bytes(), &c); err != nil {
			continue
		}
		if c.Name != "" {
			names[normalizePersonName(c.Name)] = true
		}
	}
	return names, scanner.Err()
}

func loadSubjectsFromDB(ctx context.Context, dbPath string) ([]subjectRecord, error) {
	sql := fmt.Sprintf(`SELECT id, name, type, infobox FROM subjects
		WHERE type IN (1, 2, 3, 4, 6)
		  AND NOT (type = 1 AND id IN (
			SELECT subject_id FROM subject_relations WHERE relation_type = %d
		  ))`, seriesRelationType)
	engine := query.NewEngine(dbPath, "")
	result, err := engine.ExecuteRaw(ctx, sql)
	if err != nil {
		return nil, fmt.Errorf("DuckDB 查询失败: %w", err)
	}

	colIdx := make(map[string]int, len(result.Columns))
	for i, col := range result.Columns {
		colIdx[col] = i
	}

	records := make([]subjectRecord, 0, result.TotalRows)
	for _, row := range result.Rows {
		id, _ := strconv.Atoi(row[colIdx["id"]])
		stype, _ := strconv.Atoi(row[colIdx["type"]])
		records = append(records, subjectRecord{
			ID:      id,
			Name:    row[colIdx["name"]],
			Type:    stype,
			Infobox: row[colIdx["infobox"]],
		})
	}
	return records, nil
}

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

const missingRelatedMinCount = 1

func collectRelated(personSubjects map[string]*missingPerson, existing map[string]bool, knownIDs map[string][]int, idToName map[int]string, aliasNorm map[string]bool) []*missingRelatedPerson {
	var related []*missingRelatedPerson
	for keyNorm, entry := range personSubjects {
		if !existing[keyNorm] {
			continue
		}
		ids := knownIDs[keyNorm]
		if len(ids) == 0 {
			continue
		}
		if len(entry.Subjects) < missingRelatedMinCount {
			continue
		}
		entry.Count = len(entry.Subjects)
		entry.DisplayName = entry.Subjects[firstSubjectKey(entry.Subjects)].DisplayName
		pairs := make([]personIDName, len(ids))
		for i, pid := range ids {
			name := idToName[pid]
			if name == "" {
				name = fmt.Sprintf("ID:%d", pid)
			}
			pairs[i] = personIDName{ID: pid, Name: name}
		}
		related = append(related, &missingRelatedPerson{
			DisplayName:       entry.DisplayName,
			KeyNorm:           keyNorm,
			Count:             entry.Count,
			Subjects:          entry.Subjects,
			TypeCounts:        entry.TypeCounts,
			ExistingPersonIDs: pairs,
			FromAlias:         aliasNorm[keyNorm],
		})
	}
	sort.Slice(related, func(i, j int) bool {
		return related[i].Count > related[j].Count
	})
	return related
}

func pendingJS(missing []*missingPerson) template.JS {
	type subData struct {
		Name      string `json:"name"`
		Positions []int  `json:"positions"`
		Type      int    `json:"_type"`
	}
	type pendPerson struct {
		PersonName   string             `json:"personName"`
		SubjectsData map[string]subData `json:"subjectsData"`
		EpisodesData interface{}        `json:"episodesData"`
	}

	var result []pendPerson
	for _, mp := range missing {
		pp := pendPerson{
			PersonName:   mp.DisplayName,
			SubjectsData: make(map[string]subData, len(mp.Subjects)),
			EpisodesData: nil,
		}
		for skey, si := range mp.Subjects {
			posIDs := make([]int, 0, len(si.PosIDs))
			for pid := range si.PosIDs {
				posIDs = append(posIDs, pid)
			}
			sort.Ints(posIDs)
			pp.SubjectsData[skey] = subData{
				Name:      si.SubjectName,
				Positions: posIDs,
				Type:      si.SubjectType,
			}
		}
		result = append(result, pp)
	}
	b, _ := json.Marshal(result)
	return template.JS(b)
}

func pendingRelatedJS(related []*missingRelatedPerson) template.JS {
	type subData struct {
		Name      string `json:"name"`
		Positions []int  `json:"positions"`
		Type      int    `json:"_type"`
	}
	type idName struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	}
	type relPerson struct {
		PersonName       string             `json:"personName"`
		SubjectsData     map[string]subData `json:"subjectsData"`
		EpisodesData     interface{}        `json:"episodesData"`
		RelatedPersonIDs []idName           `json:"relatedPersonIds"`
	}

	var result []relPerson
	for _, mp := range related {
		ids := make([]idName, len(mp.ExistingPersonIDs))
		for i, p := range mp.ExistingPersonIDs {
			ids[i] = idName(p)
		}
		rp := relPerson{
			PersonName:       mp.DisplayName,
			SubjectsData:     make(map[string]subData, len(mp.Subjects)),
			EpisodesData:     nil,
			RelatedPersonIDs: ids,
		}
		for skey, si := range mp.Subjects {
			posIDs := make([]int, 0, len(si.PosIDs))
			for pid := range si.PosIDs {
				posIDs = append(posIDs, pid)
			}
			sort.Ints(posIDs)
			rp.SubjectsData[skey] = subData{
				Name:      si.SubjectName,
				Positions: posIDs,
				Type:      si.SubjectType,
			}
		}
		result = append(result, rp)
	}
	b, _ := json.Marshal(result)
	return template.JS(b)
}

func posTableJS() template.JS {
	var parts []string
	for _, id := range allPosIDs {
		name := strings.ReplaceAll(strings.ReplaceAll(allPosIDToName[id], `\`, `\\`), `"`, `\"`)
		parts = append(parts, fmt.Sprintf(`%d:"%s"`, id, name))
	}
	return template.JS(strings.Join(parts, ","))
}

//go:embed templates/missing_persons.css
var pageCSS string

//go:embed templates/missing_page.js
var missingPageJS string

//go:embed templates/related_page.js
var relatedPageJS string

//go:embed templates/index.html
var indexHTML string

//go:embed templates/missing_page.html
var missingPageHTML string

//go:embed templates/related_page.html
var relatedPageHTML string

var indexTpl = template.Must(template.New("index").Parse(indexHTML))
var missingPageTpl = template.Must(template.New("missing").Parse(missingPageHTML))
var relatedPageTpl = template.Must(template.New("related").Parse(relatedPageHTML))

func filterAlreadyLinked(ctx context.Context, dbPath string, related []*missingRelatedPerson) []*missingRelatedPerson {
	if len(related) == 0 {
		return related
	}

	personIDSet := make(map[int]bool)
	for _, rp := range related {
		for _, p := range rp.ExistingPersonIDs {
			personIDSet[p.ID] = true
		}
	}
	if len(personIDSet) == 0 {
		return related
	}

	var idList strings.Builder
	first := true
	for pid := range personIDSet {
		if !first {
			idList.WriteString(",")
		}
		fmt.Fprintf(&idList, "%d", pid)
		first = false
	}

	sql := fmt.Sprintf(`
SELECT sp.subject_id, sp.person_id, sp.position
FROM subject_persons sp
WHERE sp.person_id IN (%s)
`, idList.String())

	engine := query.NewEngine(dbPath, "")
	result, err := engine.ExecuteRaw(ctx, sql)
	if err != nil {
		fmt.Fprintf(os.Stderr, "警告: 查询已关联数据失败: %v\n", err)
		return related
	}

	// linkedMap: personID -> subjectID -> set of positionIDs
	linkedMap := make(map[int]map[int]map[int]bool)
	for _, row := range result.Rows {
		if len(row) < 3 {
			continue
		}
		pid, _ := strconv.Atoi(row[1])
		sid, _ := strconv.Atoi(row[0])
		pos, _ := strconv.Atoi(row[2])
		if linkedMap[pid] == nil {
			linkedMap[pid] = make(map[int]map[int]bool)
		}
		if linkedMap[pid][sid] == nil {
			linkedMap[pid][sid] = make(map[int]bool)
		}
		linkedMap[pid][sid][pos] = true
	}

	filtered := make([]*missingRelatedPerson, 0, len(related))
	for _, rp := range related {
		newSubjects := make(map[string]*subjectInfo)
		for skey, si := range rp.Subjects {
			sid := parseSubjectID(skey)
			newPosIDs := make(map[int]struct{})
			for pos := range si.PosIDs {
				isLinked := false
				for _, p := range rp.ExistingPersonIDs {
					if linkedMap[p.ID] != nil && linkedMap[p.ID][sid] != nil && linkedMap[p.ID][sid][pos] {
						isLinked = true
						break
					}
				}
				if !isLinked {
					newPosIDs[pos] = struct{}{}
				}
			}
			if len(newPosIDs) > 0 {
				newSubjects[skey] = &subjectInfo{
					SubjectName: si.SubjectName,
					DisplayName: si.DisplayName,
					SubjectType: si.SubjectType,
					PosIDs:      newPosIDs,
				}
			}
		}
		if len(newSubjects) > 0 {
			newTypeCounts := make(map[int]int)
			for _, si := range newSubjects {
				newTypeCounts[si.SubjectType]++
			}
			rr := *rp
			rr.Subjects = newSubjects
			rr.Count = len(newSubjects)
			rr.TypeCounts = newTypeCounts
			filtered = append(filtered, &rr)
		}
	}
	// Re-sort after Count may have changed
	sort.Slice(filtered, func(i, j int) bool {
		return filtered[i].Count > filtered[j].Count
	})
	return filtered
}

func parseSubjectID(skey string) int {
	// skey format: "{type}:{id}" (e.g., "2:123")
	parts := strings.SplitN(skey, ":", 2)
	if len(parts) == 2 {
		id, _ := strconv.Atoi(parts[1])
		return id
	}
	return 0
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

func writeIndexHTML(outputDir string, subjCount, totalMissing, totalRelated int, missingLinks, relatedLinks []typeLinkTplData) error {
	f, err := os.Create(filepath.Join(outputDir, "index.html"))
	if err != nil {
		return err
	}
	defer func() { _ = f.Close() }()
	return indexTpl.Execute(f, map[string]interface{}{
		"CSS":           template.CSS(pageCSS),
		"SubjectCount":  subjCount,
		"TotalMissing":  totalMissing,
		"TotalRelated":  totalRelated,
		"MinCount":      missingPersonsMinCount,
		"GeneratedDate": time.Now().Format("2006-01-02"),
		"TypeLinks":     append(missingLinks, relatedLinks...),
	})
}

func writeMissingPage(outputDir, tname string, tcode int, entries []*missingPerson, partNum, totalParts int) error {
	var filename string
	if totalParts == 1 {
		filename = fmt.Sprintf("type-%d", tcode)
	} else {
		filename = fmt.Sprintf("type-%d-part-%d", tcode, partNum)
	}

	var prevLink, nextLink string
	if partNum > 1 {
		prevLink = fmt.Sprintf("type-%d-part-%d.html", tcode, partNum-1)
	}
	if partNum < totalParts {
		nextLink = fmt.Sprintf("type-%d-part-%d.html", tcode, partNum+1)
	}

	var title string
	if totalParts > 1 {
		title = fmt.Sprintf("%s中缺失的人物 - 第 %d/%d 页", tname, partNum, totalParts)
	} else {
		title = fmt.Sprintf("%s中缺失的人物", tname)
	}

	var pageInfo string
	if totalParts > 1 {
		pageInfo = fmt.Sprintf("第 %d/%d 页", partNum, totalParts)
	}

	persons := make([]personTplData, len(entries))
	for i, mp := range entries {
		persons[i] = personTplData{Idx: i, Name: mp.DisplayName, Count: mp.Count}
	}

	f, err := os.Create(filepath.Join(outputDir, filename+".html"))
	if err != nil {
		return err
	}
	defer func() { _ = f.Close() }()
	return missingPageTpl.Execute(f, typePageTplData{
		CSS:         template.CSS(pageCSS),
		JS:          template.JS(missingPageJS),
		Title:       title,
		PrevLink:    prevLink,
		NextLink:    nextLink,
		PageInfo:    pageInfo,
		PendingData: pendingJS(entries),
		PosTable:    posTableJS(),
		Persons:     persons,
		PageKind:    tname,
	})
}

func writeRelatedPage(outputDir, tname string, tcode int, entries []*missingRelatedPerson, partNum, totalParts int) error {
	var filename string
	if totalParts == 1 {
		filename = fmt.Sprintf("type-%d-related", tcode)
	} else {
		filename = fmt.Sprintf("type-%d-related-part-%d", tcode, partNum)
	}

	var prevLink, nextLink string
	if partNum > 1 {
		prevLink = fmt.Sprintf("type-%d-related-part-%d.html", tcode, partNum-1)
	}
	if partNum < totalParts {
		nextLink = fmt.Sprintf("type-%d-related-part-%d.html", tcode, partNum+1)
	}

	var title string
	if totalParts > 1 {
		title = fmt.Sprintf("%s中缺失关联的人物 - 第 %d/%d 页", tname, partNum, totalParts)
	} else {
		title = fmt.Sprintf("%s中缺失关联的人物", tname)
	}

	var pageInfo string
	if totalParts > 1 {
		pageInfo = fmt.Sprintf("第 %d/%d 页", partNum, totalParts)
	}

	persons := make([]personTplData, len(entries))
	for i, rp := range entries {
		pd := personTplData{Idx: i, Name: rp.DisplayName, Count: rp.Count, FromAlias: rp.FromAlias}
		if len(rp.ExistingPersonIDs) > 0 {
			pd.FirstPersonID = rp.ExistingPersonIDs[0].ID
			pd.FirstPersonName = rp.ExistingPersonIDs[0].Name
			pd.MultiMatch = len(rp.ExistingPersonIDs) > 1
			if pd.MultiMatch {
				var opts strings.Builder
				for _, p := range rp.ExistingPersonIDs {
					fmt.Fprintf(&opts, `<option value="%d">%s (ID:%d)</option>`, p.ID, html.EscapeString(p.Name), p.ID)
				}
				pd.SelectOptions = template.HTML(opts.String())
			}
		}
		persons[i] = pd
	}

	f, err := os.Create(filepath.Join(outputDir, filename+".html"))
	if err != nil {
		return err
	}
	defer func() { _ = f.Close() }()
	return relatedPageTpl.Execute(f, typePageTplData{
		CSS:         template.CSS(pageCSS),
		JS:          template.JS(relatedPageJS),
		Title:       title,
		PrevLink:    prevLink,
		NextLink:    nextLink,
		PageInfo:    pageInfo,
		PendingData: pendingRelatedJS(entries),
		PosTable:    posTableJS(),
		Persons:     persons,
	})
}

const chunkSize = 2000

func writeMultiTypePages(missing []*missingPerson, related []*missingRelatedPerson, outputDir string, subjCount int) error {
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return fmt.Errorf("创建输出目录失败: %w", err)
	}

	typeMissing := make(map[int][]*missingPerson)
	for _, mp := range missing {
		for t := range mp.TypeCounts {
			typeMissing[t] = append(typeMissing[t], mp)
		}
	}

	typeRelated := make(map[int][]*missingRelatedPerson)
	for _, rp := range related {
		for t := range rp.TypeCounts {
			typeRelated[t] = append(typeRelated[t], rp)
		}
	}

	var missingLinks, relatedLinks []typeLinkTplData

	// Missing persons pages
	for _, t := range sortedTypesByCountLens(typeMissing) {
		people := typeMissing[t]
		tname := subjectTypeNames[t]
		totalType := len(people)
		totalParts := (totalType + chunkSize - 1) / chunkSize
		if totalParts == 0 {
			totalParts = 1
		}

		var partLinks []partLinkTplData
		for partNum := 1; partNum <= totalParts; partNum++ {
			start := (partNum - 1) * chunkSize
			end := start + chunkSize
			if end > totalType {
				end = totalType
			}
			chunk := people[start:end]

			if err := writeMissingPage(outputDir, tname, t, chunk, partNum, totalParts); err != nil {
				return err
			}

			var fname string
			if totalParts == 1 {
				fname = fmt.Sprintf("type-%d", t)
			} else {
				fname = fmt.Sprintf("type-%d-part-%d", t, partNum)
			}
			fmt.Fprintf(os.Stderr, "  [%s] %s/%s.html (缺失:%d)\n", tname, outputDir, fname, len(chunk))
			label := "浏览"
			if totalParts > 1 {
				label = fmt.Sprintf("第%d页", partNum)
			}
			partLinks = append(partLinks, partLinkTplData{Href: fname + ".html", Label: label})
		}
		missingLinks = append(missingLinks, typeLinkTplData{TypeName: tname + "缺失", Count: totalType, Parts: partLinks})
	}

	// Related persons pages
	for _, t := range sortedTypesByCountLens(typeRelated) {
		people := typeRelated[t]
		tname := subjectTypeNames[t]
		totalType := len(people)
		totalParts := (totalType + chunkSize - 1) / chunkSize
		if totalParts == 0 {
			totalParts = 1
		}

		var partLinks []partLinkTplData
		for partNum := 1; partNum <= totalParts; partNum++ {
			start := (partNum - 1) * chunkSize
			end := start + chunkSize
			if end > totalType {
				end = totalType
			}
			chunk := people[start:end]

			if err := writeRelatedPage(outputDir, tname, t, chunk, partNum, totalParts); err != nil {
				return err
			}

			var fname string
			if totalParts == 1 {
				fname = fmt.Sprintf("type-%d-related", t)
			} else {
				fname = fmt.Sprintf("type-%d-related-part-%d", t, partNum)
			}
			fmt.Fprintf(os.Stderr, "  [%s] %s/%s.html (关联缺失:%d)\n", tname, outputDir, fname, len(chunk))
			label := "浏览"
			if totalParts > 1 {
				label = fmt.Sprintf("第%d页", partNum)
			}
			partLinks = append(partLinks, partLinkTplData{Href: fname + ".html", Label: label})
		}
		relatedLinks = append(relatedLinks, typeLinkTplData{TypeName: tname + "关联缺失", Count: totalType, Parts: partLinks})
	}

	totalMissing := len(missing)
	totalRelated := len(related)
	return writeIndexHTML(outputDir, subjCount, totalMissing, totalRelated, missingLinks, relatedLinks)
}

func sortedTypesByCountLens[T any](typeMap map[int][]T) []int {
	types := make([]int, 0, len(typeMap))
	for t := range typeMap {
		types = append(types, t)
	}
	sort.Slice(types, func(i, j int) bool {
		return len(typeMap[types[i]]) > len(typeMap[types[j]])
	})
	return types
}

func resolveArchiveDir(candidates ...string) string {
	for _, p := range candidates {
		if fi, err := os.Stat(p); err == nil && fi.IsDir() {
			return p
		}
	}
	return ""
}

func runMissingPersons(ctx context.Context, dbPath, archiveDir, aliasFile, personFile, outputDir string) {
	t0 := time.Now()

	fmt.Fprintf(os.Stderr, "查询条目中...\n")
	records, err := loadSubjectsFromDB(ctx, dbPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "错误: %v\n", err)
		os.Exit(1)
	}
	t1 := time.Now()
	fmt.Fprintf(os.Stderr, "  总条目数: %d\n", len(records))
	fmt.Fprintf(os.Stderr, "  耗时: %.1fs\n", t1.Sub(t0).Seconds())

	fmt.Fprintf(os.Stderr, "解析条目 infobox 中...\n")
	personSubjects := parseSubjects(records)
	t2 := time.Now()
	fmt.Fprintf(os.Stderr, "  唯一人物名: %d\n", len(personSubjects))
	fmt.Fprintf(os.Stderr, "  耗时: %.1fs\n", t2.Sub(t1).Seconds())

	fmt.Fprintf(os.Stderr, "加载已创建人物中...\n")
	if personFile == "" {
		personFile = filepath.Join(archiveDir, "person.jsonlines")
	}
	existing, knownIDs, idToName, aliasNorm, err := loadKnownPersons(personFile, aliasFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "错误: %v\n", err)
		os.Exit(1)
	}
	t2b := time.Now()
	fmt.Fprintf(os.Stderr, "  已有人员数: %d\n", len(existing))
	fmt.Fprintf(os.Stderr, "  耗时: %.1fs\n", t2b.Sub(t2).Seconds())

	fmt.Fprintf(os.Stderr, "加载角色名中...\n")
	charNames, err := loadCharacterNames(archiveDir, dbPath)
	if err == nil {
		before := len(existing)
		for name := range charNames {
			existing[name] = true
		}
		fmt.Fprintf(os.Stderr, "  角色名: %d, 已合并排除: %d\n", len(charNames), len(existing)-before)
	}
	fmt.Fprintf(os.Stderr, "  耗时: %.1fs\n", time.Since(t2b).Seconds())

	fmt.Fprintf(os.Stderr, "筛选缺失人物中...\n")
	missing := filterMissing(personSubjects, existing)
	related := collectRelated(personSubjects, existing, knownIDs, idToName, aliasNorm)
	t3 := time.Now()
	fmt.Fprintf(os.Stderr, "  初步缺失: %d, 初步关联缺失: %d\n", len(missing), len(related))
	fmt.Fprintf(os.Stderr, "  耗时: %.1fs\n", t3.Sub(t2b).Seconds())

	if len(related) > 0 {
		fmt.Fprintf(os.Stderr, "过滤已关联人物中...\n")
		beforeFilter := len(related)
		related = filterAlreadyLinked(ctx, dbPath, related)
		fmt.Fprintf(os.Stderr, "  关联缺失过滤后: %d → %d (移除已关联 %d)\n", beforeFilter, len(related), beforeFilter-len(related))
		fmt.Fprintf(os.Stderr, "  耗时: %.1fs\n", time.Since(t3).Seconds())
	}

	totalMissing := len(missing)
	totalRelated := len(related)
	fmt.Fprintf(os.Stderr, "  缺失且 ≥%d 次出现的人数: %d\n", missingPersonsMinCount, totalMissing)
	fmt.Fprintf(os.Stderr, "  关联缺失且 ≥%d 次出现的人数: %d\n", missingRelatedMinCount, totalRelated)

	if totalMissing == 0 && totalRelated == 0 {
		fmt.Fprintln(os.Stderr, "没有需要处理的人物")
		return
	}

	fmt.Fprintf(os.Stderr, "生成分类型 HTML...\n")
	if outputDir == "" {
		outputDir = "docs/missing-persons"
	}
	if err := writeMultiTypePages(missing, related, outputDir, len(records)); err != nil {
		fmt.Fprintf(os.Stderr, "错误: %v\n", err)
		os.Exit(1)
	}
	t4 := time.Now()
	fmt.Fprintf(os.Stderr, "  输出目录: %s\n", outputDir)
	fmt.Fprintf(os.Stderr, "  耗时: %.1fs\n", t4.Sub(t3).Seconds())

	fmt.Fprintf(os.Stderr, "\n总计耗时: %.1fs\n", time.Since(t0).Seconds())
}

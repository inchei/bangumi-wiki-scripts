package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
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

func loadKnownPersons(personFile, aliasFile string) (map[string]bool, error) {
	known := make(map[string]bool)

	f, err := os.Open(personFile)
	if err != nil {
		return nil, fmt.Errorf("打开 person.jsonlines 失败: %w", err)
	}
	defer func() { _ = f.Close() }()

	scanner := bufio.NewScanner(f)
	scanner.Buffer(make([]byte, 1024*1024), 10*1024*1024)
	for scanner.Scan() {
		var p struct {
			Name string `json:"name"`
		}
		if err := json.Unmarshal(scanner.Bytes(), &p); err != nil {
			continue
		}
		if p.Name != "" {
			known[normalizePersonName(p.Name)] = true
		}
	}
	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("读取 person.jsonlines 失败: %w", err)
	}

	if aliasFile != "" {
		ad, err := loadAliasesFile(aliasFile)
		if err == nil {
			for alias := range ad.aliases {
				known[alias] = true
			}
		}
	}

	return known, nil
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

func posTableJS() template.JS {
	var parts []string
	for _, id := range allPosIDs {
		name := strings.ReplaceAll(strings.ReplaceAll(allPosIDToName[id], `\`, `\\`), `"`, `\"`)
		parts = append(parts, fmt.Sprintf(`%d:"%s"`, id, name))
	}
	return template.JS(strings.Join(parts, ","))
}

const pageCSS = `body{font-family:-apple-system,sans-serif;max-width:800px;margin:0 auto;padding:20px}
details{margin:.3em 0}summary{cursor:pointer;font-size:1.05em}summary .count{color:#888;font-weight:normal;font-size:.85em}
summary .type{color:#999;font-weight:normal;font-size:.75em}
.btn-create{font-size:.7em;margin-left:.5em;cursor:pointer;padding:0 .5em;border:1px solid #4caf50;border-radius:3px;background:#e8f5e9;color:#2e7d32;vertical-align:middle}
.btn-create:hover{background:#c8e6c9}ul{margin:.3em 0 .5em 1.5em;padding:0}li{margin:.15em 0;font-size:.9em}
li .pos{color:#888;font-size:.85em;margin-left:.3em}
.sr{margin:.2em 0 .2em 1.5em;font-size:.9em;padding:.3em .6em;border-radius:3px}
.sr-found{background:#e8f5e9}.sr-missing{background:#fff3e0}.sr a{margin-right:.5em}
.nav{margin-bottom:1em}.nav a{margin-right:1em}
h1{margin-bottom:.3em}.stats{color:#666;font-size:.9em;margin-bottom:1.5em}
.type-dir summary{cursor:pointer;font-size:1.1em;margin:.2em 0}.type-dir .cnt{color:#888;font-weight:normal;font-size:.85em}
.type-dir .parts{margin:.3em 0 .5em 1.5em}.type-dir .parts a{margin-right:.8em}`

const pageJS = `
function normalize(s){return s.replace(/[\s-]/g,'').replace(/[\u30A1-\u30F6]/g,function(m){return String.fromCharCode(m.charCodeAt(0)-0x60)}).replace(/[\uFF21-\uFF5A]/g,function(m){return String.fromCharCode(m.charCodeAt(0)-0xFEE0)}).toLowerCase()}
function renderSubjects(idx,container){var data=_pendingData[idx];if(!data||!data.subjectsData)return;var ul=document.createElement('ul');var entries=Object.entries(data.subjectsData).sort(function(a,b){return a[0].localeCompare(b[0])});for(var i=0;i<entries.length;i++){var parts=entries[i][0].split(':');var stype=parseInt(parts[0]);var sid=parts[1];var entry=entries[i][1];var li=document.createElement('li');li.innerHTML='<span class="type">['+(_typeNames[stype]||stype)+']</span> <a href="https://bgm.tv/subject/'+sid+'" target="_blank">'+entry.name+'</a> <span class="pos">['+entry.positions.map(function(p){return _posNames[p]||p}).join('\u3001')+']</span>';ul.appendChild(li)}container.appendChild(ul)}
document.addEventListener('click',function(e){var det=e.target.closest('details.person');if(!det||det.querySelector('ul'))return;renderSubjects(parseInt(det.dataset.idx),det)})
function showResult(btn,html,className){var sr=btn.parentElement.querySelector('.sr');if(!sr){sr=document.createElement('div');sr.className='sr';btn.parentElement.insertBefore(sr,btn.nextSibling)}sr.className='sr '+className;sr.innerHTML=html}
window.addEventListener('message',function(e){if(e.data&&e.data.type==='bgm_mp_request'&&_bgmMpPending){e.source.postMessage({type:'bgm_mp_data',data:_bgmMpPending},'*')}})
document.addEventListener('click',function(e){var btn=e.target.closest('.btn-create');if(!btn)return;var idx=parseInt(btn.dataset.idx);var name=btn.dataset.name;_bgmMpPending=JSON.stringify(_pendingData[idx]);showResult(btn,'\u641C\u7D22\u4E2D\u2026','sr-loading');fetch('https://api.bgm.tv/v0/search/persons?limit=5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({keyword:name})}).then(function(r){return r.json()}).then(function(data){var matches=(data.data||[]).filter(function(p){return normalize(p.name)===normalize(name)});if(matches.length){_bgmMpPending=null;var links=matches.map(function(p){return '<a href="https://bgm.tv/person/'+p.id+'" target="_blank">'+p.name+' (ID:'+p.id+')</a>'}).join(' ');showResult(btn,'\u2705 '+links,'sr-found');return}showResult(btn,'\u2796 \u672A\u521B\u5EFA','sr-missing');window.open('https://bgm.tv/person/new?name='+encodeURIComponent(name)+'&bgm_mp=1','_blank')}).catch(function(){showResult(btn,'\u641C\u7D22\u5931\u8D25','sr-loading')})})`

type personTplData struct {
	Idx   int
	Name  string
	Count int
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

var indexTpl = template.Must(template.New("index").Parse(`<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>缺失的人物</title>
<style>{{.CSS}}</style>
</head>
<body>
<h1>缺失的人物</h1>
<p class="stats">扫描 {{.SubjectCount}} 个条目，发现 {{.TotalMissing}} 个在 ≥{{.MinCount}} 个条目中出现但未创建的人物</p>
<p class="stats">生成于 {{.GeneratedDate}} — 需要 <a href="https://raw.githubusercontent.com/inchei/bangumi-wiki-scripts/main/wikiMissingPositions/dist/wikiMissingPositions.user.js" target="_blank">wikiMissingPositions</a> 用户脚本 / <a href="https://bgm.tv/dev/app/6476" target="_blank">bangumi 组件</a> 配合。</p>
<div class="type-dir">
{{range .TypeLinks}}<details><summary>{{.TypeName}} <span class="cnt">({{.Count}}人)</span></summary><div class="parts">
{{range .Parts}}<a href="{{.Href}}">{{.Label}}</a>
{{end}}</div></details>
{{end}}</div>
</body>
</html>`))

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
}

var typePageTpl = template.Must(template.New("type").Parse(`<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{{.Title}}</title>
<style>{{.CSS}}</style>
</head>
<body>
<div class="nav">
  <a href="index.html">&#x2190; 返回首页</a>
{{if .PrevLink}}  <a href="{{.PrevLink}}">&#x2190; 上一页</a>{{end}}
{{if .NextLink}}  <a href="{{.NextLink}}">下一页 &#x2192;</a>{{end}}
</div>
{{if .PageInfo}}<p>{{.PageInfo}}</p>{{end}}

{{range .Persons}}<details class="person" data-idx="{{.Idx}}">
  <summary>{{.Name}} <span class="count">({{.Count}})</span>
    <button class="btn-create" data-idx="{{.Idx}}" data-name="{{.Name}}">创建</button>
  </summary>
</details>
{{end}}

<script>{{.JS}}</script>
<script>var _pendingData = {{.PendingData}};var _bgmMpPending = null;</script>
<script>var _posNames = { {{.PosTable}} };var _typeNames = {1:'书籍',2:'动画',3:'音乐',4:'游戏',6:'三次元'};</script>
</body>
</html>`))

func writeIndexHTML(outputDir string, subjCount, totalMissing int, typeLinks []typeLinkTplData) error {
	f, err := os.Create(filepath.Join(outputDir, "index.html"))
	if err != nil {
		return err
	}
	defer func() { _ = f.Close() }()
	return indexTpl.Execute(f, map[string]interface{}{
		"CSS":           template.CSS(pageCSS),
		"SubjectCount":  subjCount,
		"TotalMissing":  totalMissing,
		"MinCount":      missingPersonsMinCount,
		"GeneratedDate": time.Now().Format("2006-01-02"),
		"TypeLinks":     typeLinks,
	})
}

func writeTypePage(outputDir, tname string, tcode int, missing []*missingPerson, partNum, totalParts int) error {
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

	persons := make([]personTplData, len(missing))
	for i, mp := range missing {
		persons[i] = personTplData{Idx: i, Name: mp.DisplayName, Count: mp.Count}
	}

	f, err := os.Create(filepath.Join(outputDir, filename+".html"))
	if err != nil {
		return err
	}
	defer func() { _ = f.Close() }()
	return typePageTpl.Execute(f, typePageTplData{
		CSS:         template.CSS(pageCSS),
		JS:          template.JS(pageJS),
		Title:       title,
		PrevLink:    prevLink,
		NextLink:    nextLink,
		PageInfo:    pageInfo,
		PendingData: pendingJS(missing),
		PosTable:    posTableJS(),
		Persons:     persons,
	})
}

const chunkSize = 2000

func writeMultiTypePages(missing []*missingPerson, outputDir string, subjCount int) error {
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return fmt.Errorf("创建输出目录失败: %w", err)
	}

	typeMissing := make(map[int][]*missingPerson)
	for _, mp := range missing {
		for t := range mp.TypeCounts {
			typeMissing[t] = append(typeMissing[t], mp)
		}
	}

	var typeLinks []typeLinkTplData
	orderedTypes := sortedTypesByCount(typeMissing)

	for _, t := range orderedTypes {
		people := typeMissing[t]
		tname := subjectTypeNames[t]
		totalType := len(people)
		totalParts := (totalType + chunkSize - 1) / chunkSize

		var partLinks []partLinkTplData
		for partNum := 1; partNum <= totalParts; partNum++ {
			start := (partNum - 1) * chunkSize
			end := start + chunkSize
			if end > totalType {
				end = totalType
			}
			chunk := people[start:end]

			if err := writeTypePage(outputDir, tname, t, chunk, partNum, totalParts); err != nil {
				return err
			}

			var fname string
			if totalParts == 1 {
				fname = fmt.Sprintf("type-%d", t)
			} else {
				fname = fmt.Sprintf("type-%d-part-%d", t, partNum)
			}
			fmt.Fprintf(os.Stderr, "  [%s] %s/%s.html (%d人)\n", tname, outputDir, fname, len(chunk))
			label := "浏览"
			if totalParts > 1 {
				label = fmt.Sprintf("第%d页", partNum)
			}
			partLinks = append(partLinks, partLinkTplData{Href: fname + ".html", Label: label})
		}
		typeLinks = append(typeLinks, typeLinkTplData{TypeName: tname, Count: totalType, Parts: partLinks})
	}

	totalMissing := len(missing)
	return writeIndexHTML(outputDir, subjCount, totalMissing, typeLinks)
}

func sortedTypesByCount(typeMissing map[int][]*missingPerson) []int {
	types := make([]int, 0, len(typeMissing))
	for t := range typeMissing {
		types = append(types, t)
	}
	sort.Slice(types, func(i, j int) bool {
		return len(typeMissing[types[i]]) > len(typeMissing[types[j]])
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
	existing, err := loadKnownPersons(personFile, aliasFile)
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
	t3 := time.Now()
	totalMissing := len(missing)
	fmt.Fprintf(os.Stderr, "  缺失且 ≥%d 次出现的人数: %d\n", missingPersonsMinCount, totalMissing)
	fmt.Fprintf(os.Stderr, "  耗时: %.1fs\n", t3.Sub(t2b).Seconds())

	if totalMissing == 0 {
		fmt.Fprintln(os.Stderr, "没有需要处理的人物")
		return
	}

	fmt.Fprintf(os.Stderr, "生成分类型 HTML...\n")
	if outputDir == "" {
		outputDir = "docs/missing-persons"
	}
	if err := writeMultiTypePages(missing, outputDir, len(records)); err != nil {
		fmt.Fprintf(os.Stderr, "错误: %v\n", err)
		os.Exit(1)
	}
	t4 := time.Now()
	fmt.Fprintf(os.Stderr, "  输出目录: %s\n", outputDir)
	fmt.Fprintf(os.Stderr, "  耗时: %.1fs\n", t4.Sub(t3).Seconds())

	fmt.Fprintf(os.Stderr, "\n总计耗时: %.1fs\n", time.Since(t0).Seconds())
}

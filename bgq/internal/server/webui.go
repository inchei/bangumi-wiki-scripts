package server

// WebUIHTML is the embedded single-page web UI.
const WebUIHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<link rel="stylesheet" href="/static/awesomplete.min.css">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bangumi Query</title>
<style>
/* ===== Reset & Base ===== */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --accent:#f09199;--accent-hover:#e07a85;--accent-light:#fef0f2;--accent-border:#fad4da;
  --link:#0084b4;--link-hover:#006d96;
  --white:#fff;--bg:#f7f8fa;--bg-alt:#f0f1f3;
  --text:#303133;--text-secondary:#909399;--text-placeholder:#c0c4cc;
  --border:#e4e7ed;--border-light:#ebeef5;
  --radius:15px;--radius-sm:10px;--radius-xs:6px;
  --shadow:0 0 0 2px rgba(0,0,0,.04);
  --shadow-hover:0 2px 12px rgba(0,0,0,.08);
  --transition:all .2s ease;
  --font:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
  --font-mono:"SF Mono","Fira Code","Cascadia Code",monospace;
}
body{font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh}
a{color:var(--link);text-decoration:none;transition:var(--transition)}
a:hover{color:var(--link-hover);text-decoration:underline}

/* ===== Header ===== */
.header{
  background:var(--white);border-bottom:1px solid var(--border);
  padding:0 24px;height:56px;display:flex;align-items:center;gap:16px;
  box-shadow:var(--shadow);position:sticky;top:0;z-index:100
}
.header-logo{font-size:18px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:8px}
.header-logo .icon{width:28px;height:28px;background:var(--accent);border-radius:var(--radius-xs);display:flex;align-items:center;justify-content:center;font-size:16px}
.header .spacer{flex:1}
.header .dot{width:8px;height:8px;border-radius:50%;background:#67c23a;margin-right:4px;display:inline-block}
.header .status{font-size:12px;color:var(--text-secondary);display:flex;align-items:center}

/* ===== Layout ===== */
.container{display:flex;height:calc(100vh - 56px)}
.panel{overflow-y:auto}
.panel-left{
  width:420px;min-width:420px;background:var(--white);border-right:1px solid var(--border);
  padding:20px;display:flex;flex-direction:column;gap:20px
}
.panel-right{flex:1;background:var(--bg);padding:20px 24px}

/* ===== Cards ===== */
.card{
  background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);
  border:1px solid var(--border-light);padding:20px
}
.card-header{font-size:15px;font-weight:600;color:var(--text);margin-bottom:16px;display:flex;align-items:center;gap:8px}
.card-header .dot-indicator{width:6px;height:6px;border-radius:50%;background:var(--accent)}

/* ===== Form Controls ===== */
.form-group{margin-bottom:12px}
.form-label{font-size:13px;color:var(--text-secondary);margin-bottom:4px;display:block}
.input,.select{
  height:36px;padding:0 12px;border:1px solid var(--border);border-radius:var(--radius-xs);
  font-size:13px;font-family:var(--font);color:var(--text);background:var(--white);
  transition:var(--transition);outline:none;width:100%
}
.input:focus,.select:focus{border-color:var(--accent);box-shadow:0 0 0 2px rgba(240,145,153,.15)}
.input::placeholder{color:var(--text-placeholder)}
.select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23909399' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:28px}
.select-sm{height:32px;font-size:12px;padding:0 8px;min-width:auto;width:auto}

/* ===== Buttons ===== */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:6px;
  height:36px;padding:0 20px;border:none;border-radius:var(--radius-xs);
  font-size:13px;font-weight:500;font-family:var(--font);cursor:pointer;
  transition:var(--transition);white-space:nowrap;outline:none
}
.btn-primary{background:var(--accent);color:var(--white)}
.btn-primary:hover{background:var(--accent-hover);box-shadow:0 2px 8px rgba(240,145,153,.3)}
.btn-outline{background:var(--white);color:var(--accent);border:1px solid var(--accent)}
.btn-outline:hover{background:var(--accent-light)}
.btn-default{background:var(--white);color:var(--text);border:1px solid var(--border)}
.btn-default:hover{color:var(--accent);border-color:var(--accent)}
.btn-sm{height:30px;padding:0 12px;font-size:12px;border-radius:var(--radius-xs)}
.btn-xs{height:24px;padding:0 8px;font-size:11px;border-radius:4px}
.btn-block{width:100%}
.btn:disabled{opacity:.5;cursor:not-allowed}

/* ===== Filter Tags ===== */
.filter-tags{display:flex;flex-wrap:wrap;gap:6px;min-height:32px}
.filter-tag{
  display:inline-flex;align-items:center;gap:4px;
  background:var(--accent-light);border:1px solid var(--accent-border);
  padding:4px 12px;border-radius:20px;font-size:12px;color:var(--text);
  line-height:1.4;max-width:100%
}
.filter-tag .tag-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.filter-tag .tag-remove{
  cursor:pointer;color:var(--accent);font-size:14px;line-height:1;
  flex-shrink:0;transition:var(--transition)
}
.filter-tag .tag-remove:hover{color:#e06a75;transform:scale(1.2)}
.filter-empty{color:var(--text-placeholder);font-size:13px;padding:8px 0}

/* ===== Filter Builder Row ===== */
.filter-builder{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.filter-builder .input,.filter-builder .select{width:auto;min-width:80px}
.filter-builder .input{flex:1;min-width:100px}
.logic-group{border:1px solid var(--border);border-radius:6px;padding:8px;margin:2px 0;cursor:default;transition:border-color .15s;display:flex;flex-direction:column;gap:2px}
.logic-group .btn,.logic-group select,.logic-group .op-btn,.logic-group .tag-remove,.logic-group .radio-pill{cursor:pointer}
.logic-group .btn:focus-visible,.logic-group .op-btn:focus-visible,.logic-group .tag-remove:focus-visible{outline:2px solid var(--accent);outline-offset:1px;border-radius:3px}
.logic-group input{cursor:text}
.cond-type{font-size:13px;color:var(--accent);font-weight:600}
.logic-group.root{cursor:default}
.logic-group.selected{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
.logic-op-toggle{display:inline-flex;border:1px solid var(--border);border-radius:4px;overflow:hidden}
.logic-op-toggle .op-btn{padding:1px 8px;font-size:11px;font-weight:600;cursor:pointer;background:var(--bg);color:var(--text-secondary);transition:all .15s}
.logic-op-toggle .op-btn.active{background:var(--accent);color:#fff}
.logic-item-leaf{display:flex;align-items:center;gap:4px;padding:3px 8px;background:var(--bg-secondary);border-radius:4px}
.logic-group select,.logic-group input.input{field-sizing:content;width:auto;min-width:40px;height:36px;font-size:13px;padding:0 12px}
.logic-group select{padding-right:30px!important}

/* ===== Results ===== */
.results-empty{text-align:center;padding:60px 20px;color:var(--text-placeholder)}
.results-empty .icon{font-size:48px;margin-bottom:16px;opacity:.5}
.results-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px}
.results-count{font-size:14px;color:var(--text-secondary)}
.results-count b{color:var(--text);font-weight:600}
.results-count .time{color:var(--text-placeholder);font-size:12px;margin-left:8px}
.results-table-wrap{overflow-x:auto;border-radius:var(--radius);box-shadow:var(--shadow);border:1px solid var(--border-light)}
.results-table{width:100%;border-collapse:collapse;font-size:13px;background:var(--white)}
.results-table th{
  background:#fafafa;padding:10px 14px;text-align:left;font-weight:600;color:var(--text-secondary);
  font-size:12px;text-transform:uppercase;letter-spacing:.5px;
  position:sticky;top:0;z-index:2;border-bottom:2px solid var(--border);
  white-space:nowrap
}
.results-table td{padding:8px 14px;border-bottom:1px solid var(--bg-alt);max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.results-table tbody tr{transition:var(--transition)}
.results-table tbody tr:hover{background:#fef5f6}
.results-table .col-id{font-family:var(--font-mono);font-size:12px;font-weight:500}
.results-table .col-id a{color:var(--link)}
.results-table .col-id a:hover{color:var(--link-hover);text-decoration:underline}
.results-table .col-score{font-weight:600;color:var(--accent)}
.results-table .col-name{font-weight:500}
.results-table .cell-null{color:var(--text-placeholder);font-style:italic}

/* ===== Error ===== */
.error-card{
  background:#fef0f0;border:1px solid #fde2e2;border-radius:var(--radius);
  padding:16px 20px;color:#f56c6c;font-size:14px
}
.error-card .error-title{font-weight:600;margin-bottom:8px}
.error-card pre{background:#fff5f5;padding:12px;border-radius:var(--radius-xs);font-size:12px;font-family:var(--font-mono);overflow-x:auto;max-height:200px;overflow-y:auto}
.error-card details{margin-top:8px}
.error-card summary{cursor:pointer;color:var(--text-secondary);font-size:12px;user-select:none}
.error-card ul{padding-left:20px;font-size:12px;color:var(--text-secondary);margin-top:4px}
.error-card ul li{margin:4px 0}

/* ===== YAML Editor ===== */
.yaml-editor{
  width:100%;min-height:200px;font-family:var(--font-mono);font-size:12px;
  padding:12px;border:1px solid var(--border);border-radius:var(--radius-xs);
  resize:vertical;outline:none;background:#fafafa;line-height:1.6;tab-size:2
}
.yaml-editor:focus{border-color:var(--accent);box-shadow:0 0 0 2px rgba(240,145,153,.15);background:var(--white)}

/* ===== Loading ===== */
.loading-spinner{
  display:flex;align-items:center;justify-content:center;gap:8px;padding:40px;color:var(--text-secondary)
}
.spinner{
  width:20px;height:20px;border:2px solid var(--border);border-top-color:var(--accent);
  border-radius:50%;animation:spin .6s linear infinite
}
@keyframes spin{to{transform:rotate(360deg)}}

/* ===== Scrollbar ===== */
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#ddd;border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:#ccc}

/* ===== Responsive ===== */
@media(max-width:900px){
  .container{flex-direction:column;height:auto;min-height:calc(100vh - 56px)}
  .panel-left{width:100%;min-width:100%;max-height:none;overflow-y:visible}
  .panel-right{flex:none;overflow-y:visible}
  .results-table th{position:relative;top:auto;z-index:auto}
  .results-table-wrap{overflow-x:auto;max-height:none}
}

/* ===== Section divider ===== */
.section-divider{height:1px;background:var(--border-light);margin:4px 0}

/* ===== Pill/Tag select (mode toggle) ===== */
.pill-group{display:flex;gap:4px}
.pill{font-size:12px;padding:3px 10px;border:1px solid var(--border);border-radius:20px;cursor:pointer;transition:var(--transition);user-select:none;background:var(--white)}
.pill:hover{border-color:var(--accent);color:var(--accent)}
.pill.active{background:var(--accent);color:var(--white);border-color:var(--accent)}
.pill-group input{display:none}
.radio-pill{cursor:pointer;font-size:12px;padding:3px 10px;border:1px solid var(--border);border-radius:20px;background:var(--white);color:var(--text);transition:var(--transition);user-select:none;display:inline-block}
.radio-pill:hover{border-color:var(--accent)}
.radio-pill.active{background:var(--accent);color:var(--white);border-color:var(--accent)}
/* Awesomplete theme override — loads after CDN so wins */
.awesomplete{position:relative!important;display:inline-block!important}
.awesomplete>ul{
  position:absolute!important;left:0!important;z-index:100!important;
  min-width:140px!important;max-height:200px!important;overflow-y:auto!important;
  background:rgba(254,254,254,.82)!important;
  backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;
  border:1px solid rgba(255,255,255,.3)!important;
  border-radius:12px!important;
  box-shadow:0 4px 24px rgba(80,80,80,.12)!important;
  list-style:none!important;padding:4px 0!important;margin:2px 0 0!important;
  font-size:12px!important;
  transition:none!important;animation:none!important;
}
.awesomplete>ul>li{
  padding:5px 10px!important;cursor:pointer!important;white-space:nowrap!important;
  color:var(--text)!important;background:transparent!important;
  transition:none!important;
}
.awesomplete>ul>li:hover{background:var(--accent-light)!important;color:var(--text)!important}
.awesomplete>ul>li[aria-selected="true"]{background:var(--accent)!important;color:#fff!important}
.awesomplete>ul>li:hover mark{background:transparent!important;color:var(--accent)!important;font-weight:600!important}
.awesomplete>ul>li[aria-selected="true"] mark{background:transparent!important;color:#fff!important;font-weight:600!important}
.awesomplete>ul>li mark{background:transparent!important;color:var(--accent)!important;font-weight:600!important;padding:0!important}
.awesomplete>ul:empty{display:none!important}
.awesomplete .visually-hidden{position:absolute!important;clip:rect(0,0,0,0)!important}
</style>
</head>
<body>

<!-- Header -->
<div class="header">
  <div class="header-logo">
    <div class="icon">🔍</div>
    <span>Bangumi Query</span>
  </div>
  <span class="spacer"></span>
  <span class="status"><span class="dot" id="statusDot"></span><span id="statusText">就绪</span></span>
  <button class="btn btn-outline btn-sm" onclick="loadSchema()">🔄 刷新</button>
  <button class="btn btn-default btn-sm" onclick="toggleYAML()">⚙ YAML</button>
</div>

<!-- Main Container -->
<div class="container">

<!-- Left Panel: Query Builder -->
<div class="panel panel-left">

  <!-- Filters -->
  <div class="card">
    <div class="card-header"><span class="dot-indicator"></span>筛选条件
      <span class="spacer"></span>
      <label class="radio-pill active" id="targetSubject" onclick="setTarget('subject')" style="cursor:pointer;padding:2px 8px">📚 条目</label>
      <label class="radio-pill" id="targetPerson" onclick="setTarget('person')" style="cursor:pointer;padding:2px 8px">👤 人物</label>
      <button class="btn btn-outline btn-xs" onclick="clearFilters()" style="margin-left:8px">清除全部</button>
    </div>
    <div id="filterTree"></div>
  </div>

  <!-- YAML Editor (hidden by default) -->
  <div class="card" id="yamlSection" style="display:none">
    <div class="card-header"><span class="dot-indicator"></span>YAML 配置</div>
    <textarea class="yaml-editor" id="yamlEditor" placeholder="在此编辑 YAML 配置..."></textarea>
    <div style="margin-top:8px;display:flex;gap:8px">
      <button class="btn btn-primary btn-sm" onclick="applyYAML()">应用 YAML</button>
      <button class="btn btn-default btn-sm" onclick="updateYAMLEditor()">从筛选器同步</button>
    </div>
  </div>

  <!-- Output Columns & Execute -->
  <div class="card">
    <div class="card-header"><span class="dot-indicator"></span>输出设置</div>
    <div class="form-group">
      <label class="form-label">输出列（逗号分隔）</label>
      <input class="input" id="outputColumns" value="id,name,name_cn,type,score" placeholder="id,name,score,出版社">
    </div>
    <div class="form-group">
      <label class="form-label">结果数量上限</label>
      <input class="input" id="resultLimit" value="500" type="number" min="1" max="10000" style="width:120px">
    </div>
    <button class="btn btn-primary btn-block" onclick="runQuery()" style="height:42px;font-size:15px">▶ 执行查询</button>
  </div>

</div>

<!-- Right Panel: Results -->
<div class="panel panel-right" id="resultsPanel">
  <div class="results-empty" id="resultsPlaceholder">
    <div class="icon">📋</div>
    <div>点击 <b>"执行查询"</b> 开始筛选</div>
    <div style="font-size:12px;margin-top:8px">或访问 <a href="/api/debug" target="_blank">/api/debug</a> 检查状态</div>
  </div>
  <div id="resultsInfo"></div>
  <div id="resultsTable"></div>
</div>

</div>

<script src="/static/awesomplete.min.js"></script>
<script>
/* ===== WASM config ==== */
const DIRECT_FIELDS=['id','type','name','name_cn','platform','nsfw','score','rank','date','series','infobox','person_id','person_type','career','summary'];

/* ===== State ===== */
let schema = {direct_fields:[],subject_types:{},relation_types:{},staff_positions:{}};
let lastResult = null;
let backendMode = 'api';
let duckDB = null, duckConn = null;

/* ===== Init ===== */
detectBackend();
async function detectBackend(){
  try{
    const r=await fetch('/api/health');const d=await r.json();
    if(d.status==='ok'){backendMode='api';setStatus('ready','已连接');loadSchema();return}
  }catch(e){}
  // API unavailable — use DuckDB-WASM
  backendMode='wasm';
  setStatus('loading-bg','WASM...');
  await initWasm();
  loadSchemaOffline();
}
async function initWasm(){
  const duckdb=await import('https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.0/+esm');
  const base=new URL('.',location.href).href;
  const bundle=await duckdb.selectBundle({
    mvp:{mainModule:base+'duckdb-mvp.wasm',mainWorker:base+'duckdb-browser-mvp.worker.js'},
    eh:{mainModule:base+'duckdb-eh.wasm',mainWorker:base+'duckdb-browser-eh.worker.js'}
  });
  const worker=new Worker(bundle.mainWorker);
  duckDB=new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(),worker);
  await duckDB.instantiate(bundle.mainModule);

  // Try to load DB from cache, then ask user to upload
  const cached=await loadCachedDB();
  if(cached){duckConn=await duckDB.connect();setStatus('ready','WASM');return}

  showDBUpload();
}

const DB_KEY='bangumi_web.db';

async function loadCachedDB(){
  // OPFS — Origin Private File System, designed for large files in browser
  try{
    const root=await navigator.storage.getDirectory();
    const fh=await root.getFileHandle(DB_KEY);
    const file=await fh.getFile();
    if(file.size>1000000){
      const buf=await file.arrayBuffer();
      await duckDB.registerFileBuffer(DB_KEY,new Uint8Array(buf.slice(0)));
      await duckDB.open({path:DB_KEY,query:{mode:'ro'}});
      console.log('OPFS loaded:',file.size,'bytes');
      return true;
    }
  }catch(e){console.log('OPFS load:',e.message)}

  // Fallback: Cache API
  try{
    const cache=await caches.open('bgq-db');
    const resp=await cache.match('https://bgq/'+DB_KEY);
    if(resp){const buf=await resp.arrayBuffer();if(buf.byteLength>1000000){
      await duckDB.registerFileBuffer(DB_KEY,new Uint8Array(buf.slice(0)));
      await duckDB.open({path:DB_KEY,query:{mode:'ro'}});
      console.log('CacheAPI loaded');
      return true;
    }}
  }catch(e){console.log('CacheAPI load:',e.message)}
  return false;
}

async function cacheDB(buf){const buffer=buf.slice(0);
  console.log('caching',buffer.byteLength,'bytes...');
  try{
    const root=await navigator.storage.getDirectory();
    const fh=await root.getFileHandle(DB_KEY,{create:true});
    const w=await fh.createWritable();
    await w.write(buffer);await w.close();
    console.log('OPFS cached:',buffer.byteLength,'bytes');
    return;
  }catch(e){console.log('OPFS cache:',e.message)}
  try{
    const cache=await caches.open('bgq-db');
    await cache.put('https://bgq/'+DB_KEY,new Response(buffer));
    console.log('CacheAPI cached');
  }catch(e){console.log('CacheAPI cache:',e.message)}
}

function showDBUpload(){
  const el=document.getElementById('resultsPanel');
  if(!el){console.error('resultsPanel not found');return}
  el.innerHTML='<div class="card" style="text-align:center;padding:40px;max-width:500px;margin:40px auto">'+
    '<div style="font-size:48px;margin-bottom:16px">📦</div>'+
    '<h3 style="margin-bottom:8px">加载数据库</h3>'+
    '<p style="color:var(--text-secondary);margin-bottom:12px;font-size:13px">选择 bangumi_web.db 文件（约 500MB）<br>首次加载后自动缓存，后续无需重复操作</p>'+
    '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">'+
    '<input type="file" id="dbFileInput" accept=".db" style="display:none" onchange="onDBFileSelected(event)">'+
    '<button class="btn btn-primary" onclick="document.getElementById(\'dbFileInput\').click()">📁 选择本地文件</button>'+
    '<a href="https://github.com/inchei/bangumi-wiki-scripts/releases/latest/download/bangumi_web.db" class="btn btn-outline" target="_blank">📥 下载数据库</a>'+
    '</div>'+
    '<p id="dbUploadStatus" style="margin-top:12px;font-size:12px;color:var(--text-secondary)"></p>'+
    '</div>';
}
async function onDBFileSelected(e){
  const file=e.target.files[0];
  if(!file)return;
  const status=document.getElementById('dbUploadStatus');
  status.textContent='加载中...';
  try{
    const buffer=await file.arrayBuffer();
    const uint8=new Uint8Array(buffer.slice(0));
    await duckDB.registerFileBuffer('bangumi_web.db',uint8);
    await duckDB.open({path:'bangumi_web.db',query:{mode:'ro'}});
    duckConn=await duckDB.connect();
    cacheDB(buffer.slice(0));
    setStatus('ready','WASM');
    document.getElementById('resultsPanel').innerHTML='<div id="resultsPlaceholder" class="results-empty"><div class="icon">📋</div><div>点击 <b>"执行查询"</b> 开始筛选</div></div><div id="resultsInfo"></div><div id="resultsTable"></div>';
  }catch(err){
    status.textContent='加载失败: '+err.message;
  }
}
function loadSchemaOffline(){
  renderFilterTags();
}
async function loadSchema(){
  if(backendMode==='wasm'){renderFilterTags();return}
  try{const r=await fetch('/api/schema/fields');schema=await r.json();renderFilterTags()}catch(e){console.error(e)}
}
function setStatus(cls,text){document.getElementById('statusDot').style.background=cls==='ready'?'#67c23a':cls==='loading-bg'?'#e6a23c':'#f56c6c';document.getElementById('statusText').textContent=text}

/* ===== Render Filter Tags ===== */
let _acLater=[];

/* ===== Condition context constants ===== */
const CTX_SUBJECT='subject',CTX_PERSON='person',CTX_EPISODE='episode';
const EPISODE_FIELDS=['name','name_cn','description','airdate','duration','sort','type','disc','id'];
const EPISODE_FIELD_LABELS={name:'名称',name_cn:'中文名',description:'简介',airdate:'播出日期',duration:'时长',sort:'排序',type:'类型',disc:'碟片',id:'ID'};
const EPISODE_FIELD_OPS={
  name:['contains','not_contains','eq','regex'],name_cn:['contains','not_contains','eq','regex'],
  description:['contains','not_contains','eq','regex'],airdate:['before','after'],
  duration:['contains','not_contains','eq','regex'],
  sort:['gt','gte','lt','lte','eq'],type:['gt','gte','lt','lte','eq'],
  disc:['gt','gte','lt','lte','eq'],id:['gt','gte','lt','lte','eq']
};
const PERSON_FIELDS=['name','id','type','career','appear_eps','简体中文名','别名','性别','生日'];
function getTypeOptions(){
  const types=schema.subject_types||{};
  return Object.entries(types).map(([name,val])=>[String(val),name]);
}
function getPlatformOptions(){
  return (schemaOptions.platforms||[]).map(p=>[String(p.code),p.name]);
}
function fieldSelectOptions(fc){
  if(fc.dynamic==='type') return getTypeOptions();
  if(fc.dynamic==='platform') return getPlatformOptions();
  return fc.options||[];
}
const SUBJECT_FIELD_CONFIGS={
  type:{label:'类型',ops:['eq'],type:'select',dynamic:'type'},
  platform:{label:'子类型',ops:['eq'],type:'select',dynamic:'platform'},
  nsfw:{label:'NSFW',ops:['eq'],type:'select',options:[['true','是'],['false','否']]},
  score:{label:'评分',ops:['gt','gte','lt','lte','eq','empty'],type:'number',step:'0.1'},
  rank:{label:'排名',ops:['gt','gte','lt','lte','eq','empty'],type:'number',step:'1'},
  date:{label:'日期',ops:['before','after','empty'],type:'date'},
  series:{label:'系列',ops:['eq'],type:'select',options:[['true','是'],['false','否']]}
};
const PERSON_FIELD_CONFIGS={
  type:{label:'类型',ops:['eq'],type:'select',options:[['1','个人'],['2','公司'],['3','组合']]},
  性别:{label:'性别',ops:['contains'],type:'select',options:[['男','男'],['女','女'],['其他','其他']]},
  生日:{label:'生日',ops:['before','after','empty'],type:'date'},
  career:{label:'职业',ops:['contains','not_contains','empty'],type:'text',ac:'career'}
};
function ctxFieldConfigs(ctx){return ctx===CTX_PERSON?PERSON_FIELD_CONFIGS:SUBJECT_FIELD_CONFIGS}
function isSpecialField(f,ctx){return f in ctxFieldConfigs(ctx||CTX_SUBJECT)}
function epFieldPlaceholder(f){return f==='duration'?'如: 24m / 00:23:30':''}
function opInputType(op){
  if(['gt','gte','lt','lte'].includes(op)) return 'number';
  if(['before','after'].includes(op)) return 'date';
  return 'text';
}
function switchOpInputType(sel,valId){
  const valEl=document.getElementById(valId);
  if(valEl) valEl.type=opInputType(sel.value);
}
function ctxFields(ctx){
  if(ctx===CTX_EPISODE) return EPISODE_FIELDS;
  if(ctx===CTX_PERSON) return PERSON_FIELDS;
  return schema.direct_fields||[];
}
function ctxTypeOpts(ctx){
  if(ctx===CTX_PERSON) return [['','全部'],['1','个人'],['2','公司'],['3','组合']];
  if(ctx===CTX_EPISODE) return [];
  return [['','全部'],['1','书籍'],['2','动画'],['3','音乐'],['4','游戏'],['6','三次元']];
}

function renderFilterTags(){
  assignGroupNumbers(rootLogic);
  _acLater=[];
  const el=document.getElementById('filterTree');
  if(el) el.innerHTML=renderLogicTree(rootLogic,true,queryTarget==='person'?CTX_PERSON:CTX_SUBJECT);
  for(const[id,items] of _acLater)autoComplete(id,items);
  _acLater=[];
}

function renderLogicTree(lg,isRoot,ctx){
  lg._ctx=ctx;
  if(!lg._id) lg._id=++_logicIdCounter;
  const gid=lg._id;
  let html='<div class="logic-group'+(isRoot?' root':'')+'">';

  // Header
  html+='<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">';
  html+='<div class="logic-op-toggle">';
  html+='<span class="op-btn'+(lg.op==='and'?' active':'')+'" onclick="event.stopPropagation();toggleLogicOp('+gid+',\'and\')">AND</span>';
  html+='<span class="op-btn'+(lg.op==='or'?' active':'')+'" onclick="event.stopPropagation();toggleLogicOp('+gid+',\'or\')">OR</span>';
  html+='</div>';
  if(!isRoot){
    html+='<span class="tag-remove" tabindex="0" role="button" style="margin-left:auto" onclick="event.stopPropagation();removeLogicGroup('+gid+')" onkeydown="if(event.key===\'Enter\')this.click()" title="删除此组">&times;</span>';
  }
  html+='</div>';

  // Items
  for(let i=0;i<lg.items.length;i++){
    const item=lg.items[i];
    if(item.logic){
      html+=renderLogicTree(item.logic,false,ctx);
    }else{
      html+=renderEditableCondition(gid,i,item,ctx);
    }
  }

  // Add new condition button
  html+=renderAddConditionBtn(gid,ctx);

  html+='</div>';
  return html;
}

function renderEditableCondition(gid,idx,item,ctx){
  const uid=gid+'_'+idx;
  const fields=ctxFields(ctx);
  let html='<div style="display:flex;gap:3px;align-items:center;flex-wrap:wrap;margin:2px 0;width:100%">';
  if(item.field){
    const fc=ctxFieldConfigs(ctx)[item.field.field];
    const isEpCtx=ctx===CTX_EPISODE;
    const epOps=EPISODE_FIELD_OPS[item.field.field];
    // Label
    if(fc){
      html+='<span class="cond-type">'+fc.label+'</span>';
    }else if(isEpCtx){
      html+='<span class="cond-type">'+(EPISODE_FIELD_LABELS[item.field.field]||item.field.field)+'</span>';
    }else{
      html+='<span class="cond-type">字段</span>';
      html+='<input class="input" id="efn_'+uid+'" value="'+escHtml(item.field.field)+'" onchange="updateCondition('+gid+','+idx+',\'field\')" placeholder="字段名">';
      _acLater.push(['efn_'+uid,fields]);
    }
    // Operator select (hidden if only one option)
    const availOps=fc?fc.ops:(isEpCtx&&epOps)?epOps:['contains','not_contains','eq','regex','gt','lt','gte','lte','before','after','empty'];
    if(!availOps.includes(item.field.operator)) item.field.operator=availOps[0];
    if(availOps.length>1){
      html+='<select class="select select-sm" id="efo_'+uid+'" onchange="switchOpInputType(this,\'efv_'+uid+'\');updateCondition('+gid+','+idx+',\'field\')">';
      availOps.forEach(o=>{html+='<option value="'+o+'"'+(o===item.field.operator?' selected':'')+'>'+opLabel(o)+'</option>'});
      html+='</select>';
    }
    // Value input
    if(fc&&fc.type==='select'){
      const opts=fieldSelectOptions(fc);
      opts.forEach(([v,l])=>{
        html+='<span class="radio-pill'+(v===String(item.field.value)?' active':'')+'" onclick="this.parentElement.querySelectorAll(\'.radio-pill\').forEach(e=>e.classList.remove(\'active\'));this.classList.add(\'active\');document.getElementById(\'efv_'+uid+'\').value=this.dataset.v;document.getElementById(\'efv_'+uid+'\').dispatchEvent(new Event(\'change\'))" data-v="'+v+'">'+escHtml(l)+'</span>';
      });
      html+='<input type="hidden" id="efv_'+uid+'" value="'+escHtml(String(item.field.value||''))+'" onchange="updateCondition('+gid+','+idx+',\'field\')">';
    }else{
      const vType=fc?(fc.type||'text'):opInputType(item.field.operator);
      const step=fc?fc.step:'';
      const ph=isEpCtx?epFieldPlaceholder(item.field.field):'';
      html+='<input class="input" type="'+vType+'" id="efv_'+uid+'" value="'+escHtml(String(item.field.value||''))+'" onchange="updateCondition('+gid+','+idx+',\'field\')" placeholder="'+ph+'"'+(step?' step="'+step+'"':'')+'>';
      if(fc&&fc.ac){
        const acList=fc.ac==='career'?['actor','artist','illustrator','mangaka','producer','seiyu','writer']:(schemaOptions.platforms?.map(p=>p.name)||[]);
        _acLater.push(['efv_'+uid,acList]);
      }
    }
  }else if(item.tag){
    html+='<span class="cond-type">标签</span>';
    html+='<input class="input" id="efn_'+uid+'" value="'+escHtml(item.tag.value)+'" onchange="updateCondition('+gid+','+idx+',\'tag\')">';
    html+='<select class="select select-sm" id="efo_'+uid+'" onchange="updateCondition('+gid+','+idx+',\'tag\')"><option value="contains"'+(!item.tag.negate?' selected':'')+'>包含</option><option value="negate"'+(item.tag.negate?' selected':'')+'>排除</option></select>';
  }else if(item.meta_tag){
    html+='<span class="cond-type">公共标签</span>';
    html+='<input class="input" id="efn_'+uid+'" value="'+escHtml(item.meta_tag.value)+'" onchange="updateCondition('+gid+','+idx+',\'meta_tag\')" placeholder="公共标签">';
    _acLater.push(['efn_'+uid,schemaOptions.meta_tags||[]]);
    html+='<select class="select select-sm" id="efo_'+uid+'" onchange="updateCondition('+gid+','+idx+',\'meta_tag\')"><option value="contains"'+(!item.meta_tag.negate?' selected':'')+'>包含</option><option value="negate"'+(item.meta_tag.negate?' selected':'')+'>排除</option></select>';
  }else if(item.global){
    html+='<span class="cond-type">全局</span>';
    html+='<select class="select select-sm" id="efo_'+uid+'" onchange="updateCondition('+gid+','+idx+',\'global\')"><option value="contains"'+(item.global.operator==='contains'?' selected':'')+'>包含</option><option value="not_contains"'+(item.global.operator==='not_contains'?' selected':'')+'>不包含</option><option value="regex"'+(item.global.operator==='regex'?' selected':'')+'>正则</option></select>';
    html+='<input class="input" id="efn_'+uid+'" value="'+escHtml(String(item.global.value||''))+'" onchange="updateCondition('+gid+','+idx+',\'global\')">';
  }else if(item.count){
    html+='<span class="cond-type">数量</span>';
    html+='<input class="input" id="efn_'+uid+'" value="'+escHtml(item.count.what)+'" onchange="updateCondition('+gid+','+idx+',\'count\')" placeholder="关联/ep">';
    _acLater.push(['efn_'+uid,['ep'].concat(schemaOptions.relations||[])]);
    html+='<select class="select select-sm" id="efo_'+uid+'" onchange="updateCondition('+gid+','+idx+',\'count\')">';
    ['gt','gte','lt','lte','eq'].forEach(o=>{html+='<option value="'+o+'"'+(o===item.count.operator?' selected':'')+'>'+opLabel(o)+'</option>'});
    html+='</select>';
    html+='<input class="input" type="number" id="efv_'+uid+'" value="'+escHtml(String(item.count.value||''))+'" onchange="updateCondition('+gid+','+idx+',\'count\')">';
  }else if(item.type){
    const typeOpts=ctxTypeOpts(ctx);
    html+='<span class="cond-type">分类</span>';
    html+='<select class="select select-sm" id="efv_'+uid+'" onchange="updateCondition('+gid+','+idx+',\'type\')">';
    typeOpts.forEach(([v,l])=>{
      html+='<option value="'+v+'"'+(String(item.type.value)===v?' selected':'')+'>'+l+'</option>';
    });
    html+='</select>';
  }else if(item.relation){
    const r=item.relation;
    html+='<div style="display:flex;gap:3px;align-items:center;flex-wrap:wrap;width:100%">';
    html+='<span class="cond-type">关系</span>';
    html+='<input class="input" id="efn_'+uid+'" value="'+escHtml(r.type)+'" onchange="updateCondition('+gid+','+idx+',\'relation\')" placeholder="关系名">';
    _acLater.push(['efn_'+uid,schemaOptions.relations||[]]);
    html+='<select class="select select-sm" id="efo_'+uid+'" onchange="updateCondition('+gid+','+idx+',\'relation\')"><option value="any"'+(r.mode==='any'?' selected':'')+'>任意</option><option value="all"'+(r.mode==='all'?' selected':'')+'>全部</option><option value="none"'+(r.mode==='none'?' selected':'')+'>排除</option></select>';
    html+='<span class="tag-remove" tabindex="0" role="button" onclick="event.stopPropagation();removeLogicLeaf('+gid+','+idx+')" onkeydown="if(event.key===\'Enter\')this.click()" title="删除">×</span>';
    html+='</div>';
    // Nested conditions as logic tree (conditions apply to related subject)
    if(r.conditions&&r.conditions.length>0&&r.conditions[0].logic){
      html+='<div style="margin-left:12px;margin-top:2px">'+renderLogicTree(r.conditions[0].logic,false,CTX_SUBJECT)+'</div>';
    }
    return html;
  }else if(item.staff){
    const s=item.staff;
    html+='<div style="display:flex;gap:3px;align-items:center;flex-wrap:wrap;width:100%">';
    html+='<span class="cond-type">'+(queryTarget==='person'?'关联':'人物')+'</span>';
    html+='<input class="input" id="efn_'+uid+'" value="'+escHtml(s.position)+'" onchange="updateCondition('+gid+','+idx+',\'staff\')" placeholder="职位名">';
    _acLater.push(['efn_'+uid,schemaOptions.positions||[]]);
    html+='<select class="select select-sm" id="efo_'+uid+'" onchange="updateCondition('+gid+','+idx+',\'staff\')"><option value="any"'+(s.mode==='any'?' selected':'')+'>任意</option><option value="all"'+(s.mode==='all'?' selected':'')+'>全部</option><option value="none"'+(s.mode==='none'?' selected':'')+'>排除</option></select>';
    html+='<span class="tag-remove" tabindex="0" role="button" onclick="event.stopPropagation();removeLogicLeaf('+gid+','+idx+')" onkeydown="if(event.key===\'Enter\')this.click()" title="删除">×</span>';
    html+='</div>';
    if(s.conditions&&s.conditions.length>0&&s.conditions[0].logic){
      const staffCtx=queryTarget==='person'?CTX_SUBJECT:CTX_PERSON;
      html+='<div style="margin-left:12px;margin-top:2px">'+renderLogicTree(s.conditions[0].logic,false,staffCtx)+'</div>';
    }
    return html;
  }else if(item.episode){
    const ep=item.episode;
    html+='<div style="display:flex;gap:3px;align-items:center;flex-wrap:wrap;width:100%">';
    html+='<span class="cond-type">剧集</span>';
    html+='<select class="select select-sm" id="efo_'+uid+'" onchange="updateCondition('+gid+','+idx+',\'episode\')"><option value="any"'+(ep.mode==='any'?' selected':'')+'>任意</option><option value="all"'+(ep.mode==='all'?' selected':'')+'>全部</option></select>';
    html+='<span class="tag-remove" tabindex="0" role="button" onclick="event.stopPropagation();removeLogicLeaf('+gid+','+idx+')" onkeydown="if(event.key===\'Enter\')this.click()" title="删除">×</span>';
    html+='</div>';
    // Nested logic tree (conditions apply to episodes)
    if(ep.logic){
      html+='<div style="margin-left:12px;margin-top:2px">'+renderLogicTree(ep.logic,false,CTX_EPISODE)+'</div>';
    }else if(ep.conditions&&ep.conditions.length>0){
      ep.logic={op:'and',items:ep.conditions.map(c=>({field:c})),_id:++_logicIdCounter};
      delete ep.conditions;
      html+='<div style="margin-left:12px;margin-top:2px">'+renderLogicTree(ep.logic,false,CTX_EPISODE)+'</div>';
    }
    return html;
  }else{
    html+='<span style="font-size:12px;flex:1">'+escHtml(filterToLabel(item))+'</span>';
  }
  html+='<span class="tag-remove" tabindex="0" role="button" onclick="event.stopPropagation();removeLogicLeaf('+gid+','+idx+')" onkeydown="if(event.key===\'Enter\')this.click()" title="删除">×</span>';
  html+='</div>';
  return html;
}

function updateCondition(gid,idx,kind){
  const g=findLogicGroup(rootLogic,gid);if(!g||!g.items[idx])return;
  const uid=gid+'_'+idx;
  const typeEl=document.getElementById('eft_'+uid);
  const newType=typeEl?typeEl.value:null;
  if(newType&&newType!==kind){
    // Type changed — replace with new empty condition
    g.items[idx]=createEmptyCondition(newType);
    renderFilterTags();updateYAMLEditor();return;
  }
  const item=g.items[idx];
  if(item.field){
    const fEl=document.getElementById('efn_'+uid);
    if(fEl) item.field.field=fEl.value.trim();
    item.field.operator=document.getElementById('efo_'+uid)?.value||'contains';
    item.field.value=(document.getElementById('efv_'+uid)?.value||'').trim();
  }else if(item.tag){
    item.tag.value=(document.getElementById('efn_'+uid)?.value||'').trim();
    item.tag.negate=document.getElementById('efo_'+uid)?.value==='negate';
  }else if(item.meta_tag){
    item.meta_tag.value=(document.getElementById('efn_'+uid)?.value||'').trim();
    item.meta_tag.negate=document.getElementById('efo_'+uid)?.value==='negate';
  }else if(item.global){
    item.global.operator=document.getElementById('efo_'+uid)?.value||'contains';
    item.global.value=(document.getElementById('efn_'+uid)?.value||'').trim();
  }else if(item.count){
    item.count.what=(document.getElementById('efn_'+uid)?.value||'').trim();
    item.count.operator=document.getElementById('efo_'+uid)?.value||'gt';
    item.count.value=(document.getElementById('efv_'+uid)?.value||'').trim();
  }else if(item.type){
    item.type.value=document.getElementById('efv_'+uid)?.value||'';
  }else if(item.relation){
    item.relation.type=(document.getElementById('efn_'+uid)?.value||'').trim();
    item.relation.mode=document.getElementById('efo_'+uid)?.value||'any';
  }else if(item.staff){
    item.staff.position=(document.getElementById('efn_'+uid)?.value||'').trim();
    item.staff.mode=document.getElementById('efo_'+uid)?.value||'any';
  }else if(item.episode){
    item.episode.mode=document.getElementById('efo_'+uid)?.value||'any';
  }
  updateYAMLEditor();
}

function createEmptyCondition(type){
  switch(type){
    case 'field':return{field:{field:'',operator:'contains',value:''}};
    case 'tag':return{tag:{operator:'contains',value:'',negate:false}};
    case 'meta_tag':return{meta_tag:{operator:'contains',value:'',negate:false}};
    case 'global':return{global:{operator:'contains',value:''}};
    case 'count':return{count:{what:'',operator:'gt',value:''}};
    case 'type':return{type:{value:''}};
    case 'relation':return{relation:{type:'',mode:'any',conditions:[{logic:{op:'and',items:[]}}]}};
    case 'staff':return{staff:{position:'',mode:'any',conditions:[{logic:{op:'and',items:[]}}]}};
    case 'episode':return{episode:{mode:'any',logic:{op:'and',items:[]}}};
    default:return{field:{field:'',operator:'contains',value:''}};
  }
}

function renderAddConditionBtn(gid,ctx){
  let html='<div style="display:flex;gap:4px;align-items:center;margin-top:4px;flex-wrap:wrap">';
  html+='<select class="select select-sm" id="newType_'+gid+'">';
  if(ctx===CTX_EPISODE){
    for(const f of EPISODE_FIELDS){html+='<option value="ep_'+f+'">'+EPISODE_FIELD_LABELS[f]+'</option>';}
  }else if(ctx===CTX_PERSON){
    html+='<option value="field">字段</option><option value="global">全局</option>';
    const pfc=ctxFieldConfigs(CTX_PERSON);
    for(const k in pfc){html+='<option value="'+k+'">'+pfc[k].label+'</option>';}
    html+='<option value="staff">关联</option>';
  }else{
    html+='<option value="field">字段</option>';
    const fc=ctxFieldConfigs(ctx);
    for(const k in fc){html+='<option value="'+k+'">'+fc[k].label+'</option>';}
    html+='<option value="tag">标签</option><option value="meta_tag">公共标签</option><option value="global">全局</option>';
    if(queryTarget==='subject'){
      html+='<option value="relation">关系</option><option value="episode">剧集</option><option value="count">数量</option>';
    }
    html+='<option value="staff">'+(queryTarget==='person'?'关联':'人物')+'</option>';
  }
  html+='</select>';
  html+='<button class="btn btn-outline btn-xs" onclick="event.stopPropagation();addCondition('+gid+')">+ 添加条件</button>';
  html+='<button class="btn btn-outline btn-xs" onclick="event.stopPropagation();addLogicGroupTo('+gid+')">+ 嵌套组</button>';
  html+='</div>';
  return html;
}

function addCondition(gid){
  const type=document.getElementById('newType_'+gid)?.value||'field';
  if(type.startsWith('ep_')){
    addToGroup(gid,{field:{field:type.slice(3),operator:'contains',value:''}});
  }else{
    const g=findLogicGroup(rootLogic,gid);
    const ctx=g?g._ctx:CTX_SUBJECT;
    const fc=ctxFieldConfigs(ctx)[type];
    if(fc){
      const val=fc.type==='select'?(fc.options?.[0]?.[0]||''):'';
      addToGroup(gid,{field:{field:type,operator:fc.ops[0],value:val}});
    }else{
      addToGroup(gid,createEmptyCondition(type));
    }
  }
}

function removeLogicGroup(groupId){
  removeLogicItemById(rootLogic,groupId);
  renderFilterTags();updateYAMLEditor();
}

function removeLogicLeaf(lgId,idx){
  const g=findLogicGroup(rootLogic,lgId);if(!g)return;
  g.items.splice(idx,1);renderFilterTags();updateYAMLEditor();
}

function addLogicGroupTo(gid){
  const g=findLogicGroup(rootLogic,gid);if(!g)return;
  const ng=newLogicGroup(g.op==='and'?'or':'and');
  g.items.push({logic:ng});
  renderFilterTags();updateYAMLEditor();
}
function opLabel(op){const m={eq:'=',contains:'包含',not_contains:'不包含',regex:'~=',gt:'>',gte:'>=',lt:'<',lte:'<=',before:'早于',after:'晚于',empty:'为空'};return m[op]||op}
function clearFilters(){resetLogicBuilder();renderFilterTags();updateYAMLEditor()}

/* ===== Query Target ===== */
let queryTarget='subject';
function setTarget(t){
  queryTarget=t;
  rootLogic = t==='person' ? personRootLogic : subjectRootLogic;
  document.getElementById('targetSubject').className='radio-pill'+(t==='subject'?' active':'');
  document.getElementById('targetPerson').className='radio-pill'+(t==='person'?' active':'');
  if(t==='person'){document.getElementById('outputColumns').value='person_id,name,career'}
  else{document.getElementById('outputColumns').value='id,name,name_cn,type,score'}
  renderFilterTags();loadSchemaOptions();
}

/* ===== 基础筛选 ===== */
let schemaOptions = {types:{},platforms:[],relations:[],positions:[]};
let selectedBaseType = 0;
loadSchemaOptions();

async function loadSchemaOptions(){
  try{const r=await fetch('/api/schema/options');schemaOptions=await r.json()}catch(e){}
}
async function loadSchemaOptionsForType(t){
  try{const r=await fetch('/api/schema/options?type='+(t||0));schemaOptions=await r.json()}catch(e){}
}

function renderBaseFilter(){
  let h='';
  // Row: Type radio buttons
  h+='<div class="form-group"><label class="form-label">条目类型</label>';
  h+='<div style="display:flex;gap:4px;flex-wrap:wrap">';
  const types=[['0','全部'],[1,'📚 书籍'],[2,'📺 动画'],[3,'🎵 音乐'],[4,'🎮 游戏'],[6,'🎬 三次元']];
  for(const [v,label] of types){
    const sel=selectedBaseType==v;
    h+='<span class="radio-pill'+(sel?' active':'')+'" onclick="onBaseTypeChange(\''+v+'\')">'+label+'</span>';
  }
  h+='</div></div>';

  // Row: Platform (searchable select)
  const platforms = schemaOptions.platforms||[];
  h+='<div class="form-group"><label class="form-label">平台</label>';
  h+='<select class="select select-sm" id="basePlatform" style="width:100%"><option value="">不限</option>';
  for(const p of platforms) h+='<option value="'+p.code+'">'+escHtml(p.name)+' ('+p.code+')</option>';
  h+='</select></div>';

  // Row: Score range
  // Meta tags (public tags)
  const metaTags = schemaOptions.meta_tags||[];
  h+='<div class="form-group"><label class="form-label">公共标签</label>';
  h+='<div style="display:flex;flex-wrap:wrap;gap:4px" id="baseMetaTags">';
  for(const mt of metaTags){
    h+='<label class="radio-pill" style="cursor:pointer;padding:2px 8px" onclick="toggleBaseMetaTag(this,\''+escHtml(mt)+'\')">'+escHtml(mt)+'</label>';
  }
  h+='</div></div>';

  h+='<div class="form-group"><label class="form-label">评分范围</label>';
  h+='<div style="display:flex;gap:8px;align-items:center"><input class="input" id="baseScoreMin" type="number" step="0.1" min="0" max="10" placeholder="最低" style="width:80px"><span style="color:var(--text-placeholder)">~</span><input class="input" id="baseScoreMax" type="number" step="0.1" min="0" max="10" placeholder="最高" style="width:80px"></div></div>';

  // Row: Date range
  h+='<div class="form-group"><label class="form-label">发售日期</label>';
  h+='<div style="display:flex;gap:8px;align-items:center"><input class="input" id="baseDateMin" type="date" style="flex:1"><span style="color:var(--text-placeholder)">~</span><input class="input" id="baseDateMax" type="date" style="flex:1"></div></div>';

  // Row: Rank
  h+='<div class="form-group"><label class="form-label">排名 ≤</label>';
  h+='<input class="input" id="baseRank" type="number" min="1" placeholder="如: 1000" style="width:120px"></div>';

  // Row: Series + NSFW checkboxes
  h+='<div class="form-group"><div style="display:flex;gap:16px">';
  h+='<label style="font-size:13px;cursor:pointer;display:flex;align-items:center;gap:4px"><input type="checkbox" id="baseSeries"> 系列作品</label>';
  h+='<label style="font-size:13px;cursor:pointer;display:flex;align-items:center;gap:4px"><input type="checkbox" id="baseNsfw"> NSFW</label>';
  h+='</div></div>';

  // Button
  h+='<button class="btn btn-primary btn-sm" onclick="addBaseFilters()">添加基础筛选</button>';
  return h;
}

async function onBaseTypeChange(v){
  selectedBaseType = Number(v);
  await loadSchemaOptionsForType(selectedBaseType);
  renderFilterTags();
}

let selectedMetaTags = [];

function toggleBaseMetaTag(el, tag){
  el.classList.toggle('active');
  const idx = selectedMetaTags.indexOf(tag);
  if(idx >= 0) selectedMetaTags.splice(idx, 1);
  else selectedMetaTags.push(tag);
}

function addBaseFilters(){
  const g=getSelectedGroup();
  let count=0;
  const t=selectedBaseType;
  if(t&&t>0){g.items.push({type:{value:t}});count++}

  const plat=document.getElementById('basePlatform')?.value;
  if(plat){g.items.push({field:{field:'platform',operator:'eq',value:plat}});count++}

  for(const mt of selectedMetaTags){
    g.items.push({meta_tag:{operator:'contains',value:mt}});count++;
  }

  const smin=document.getElementById('baseScoreMin')?.value;
  if(smin){g.items.push({field:{field:'score',operator:'gte',value:smin}});count++}
  const smax=document.getElementById('baseScoreMax')?.value;
  if(smax){g.items.push({field:{field:'score',operator:'lte',value:smax}});count++}

  const dmin=document.getElementById('baseDateMin')?.value;
  if(dmin){g.items.push({field:{field:'date',operator:'after',value:dmin}});count++}
  const dmax=document.getElementById('baseDateMax')?.value;
  if(dmax){g.items.push({field:{field:'date',operator:'before',value:dmax}});count++}

  const rank=document.getElementById('baseRank')?.value;
  if(rank){g.items.push({field:{field:'rank',operator:'lte',value:rank}});count++}

  if(document.getElementById('baseSeries')?.checked){g.items.push({field:{field:'series',operator:'eq',value:'true'}});count++}
  if(document.getElementById('baseNsfw')?.checked){g.items.push({field:{field:'nsfw',operator:'eq',value:'true'}});count++}

  selectedMetaTags = [];
  if(count>0){renderFilterTags();updateYAMLEditor()}
}

function escHtml(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

/* ===== Autocomplete (Awesomplete wrapper) ===== */
function autoComplete(inputId,suggestions){
  const inp=document.getElementById(inputId);
  if(!inp||typeof Awesomplete==='undefined')return;
  const aw=new Awesomplete(inp,{
    list:suggestions,
    minChars:0,
    maxItems:20,
    autoFirst:true,
    filter:function(text,input){
      return Awesomplete.FILTER_CONTAINS(text,input.match(/^\s*/)[0]+input.trim());
    }
  });
  // Open on focus even when empty
  inp.addEventListener('focus',function(){
    aw.evaluate();
    if(this.value.trim()===''){aw.ul.innerHTML='';suggestions.forEach(function(s){const li=document.createElement('li');li.textContent=s;aw.ul.appendChild(li)});aw.open()}
  });
  // Close on blur
  inp.addEventListener('blur',function(){setTimeout(function(){aw.close()},150)});
}
function ensureResultElements(){
  const panel=document.getElementById('resultsPanel');
  if(!document.getElementById('resultsInfo')){const d=document.createElement('div');d.id='resultsInfo';panel.appendChild(d)}
  if(!document.getElementById('resultsTable')){const d=document.createElement('div');d.id='resultsTable';panel.appendChild(d)}
}

/* ===== Filter Actions ===== */
function getVal(id){return document.getElementById(id)?.value?.trim()||''}
/* ===== Inline add functions ===== */
function addToGroup(gid,filter){
  const g=findLogicGroup(rootLogic,gid);if(!g)return;
  g.items.push(filter);renderFilterTags();updateYAMLEditor();
}
// ===== Unified condition helpers =====
function rv(id){return document.getElementById(id)?.value?.trim()||''}

/* ===== Logic Tree (base for all filters) ===== */
let _logicIdCounter=0;
function newLogicGroup(op){return {op:op||'and',items:[],_id:++_logicIdCounter}}

let subjectRootLogic = newLogicGroup('and');
let personRootLogic = newLogicGroup('and');
let rootLogic = subjectRootLogic;

function resetLogicBuilder(){
  _logicIdCounter=0;
  subjectRootLogic = newLogicGroup('and');
  personRootLogic = newLogicGroup('and');
  rootLogic = queryTarget==='person' ? personRootLogic : subjectRootLogic;
}

function findLogicGroup(node,id){
  if(node._id===id) return node;
  for(const item of node.items){
    if(item.logic){const r=findLogicGroup(item.logic,id);if(r) return r}
    if(item.relation&&item.relation.conditions){for(const c of item.relation.conditions){if(c.logic){const r=findLogicGroup(c.logic,id);if(r) return r}}}
    if(item.staff&&item.staff.conditions){for(const c of item.staff.conditions){if(c.logic){const r=findLogicGroup(c.logic,id);if(r) return r}}}
    if(item.episode&&item.episode.logic){const r=findLogicGroup(item.episode.logic,id);if(r) return r}
  }
  return null;
}

let _groupNumMap={};
function assignGroupNumbers(node){
  _groupNumMap={};
  let n=0;
  (function walk(lg){
    _groupNumMap[lg._id]=++n;
    for(const item of lg.items){
      if(item.logic) walk(item.logic);
      if(item.relation&&item.relation.conditions){for(const c of item.relation.conditions){if(c.logic) walk(c.logic)}}
      if(item.staff&&item.staff.conditions){for(const c of item.staff.conditions){if(c.logic) walk(c.logic)}}
      if(item.episode&&item.episode.logic) walk(item.episode.logic);
    }
  })(node);
}
function groupNum(id){return _groupNumMap[id]||'?'}

function removeLogicItemById(node,id){
  for(let i=0;i<node.items.length;i++){
    const item=node.items[i];
    if(item.logic){
      if(item.logic._id===id){node.items.splice(i,1);return true}
      if(removeLogicItemById(item.logic,id)) return true;
    }
    if(item.relation&&item.relation.conditions){for(const c of item.relation.conditions){if(c.logic&&removeLogicItemById(c.logic,id)) return true}}
    if(item.staff&&item.staff.conditions){for(const c of item.staff.conditions){if(c.logic&&removeLogicItemById(c.logic,id)) return true}}
    if(item.episode&&item.episode.logic&&removeLogicItemById(item.episode.logic,id)) return true;
  }
  return false;
}

function filterToLabel(f){
  if(f.type) return '分类: '+(Object.entries(schema.subject_types).find(([k,v])=>v==f.type.value)?.[0]||f.type.value);
  if(f.field){
    const fc=SUBJECT_FIELD_CONFIGS[f.field.field]||PERSON_FIELD_CONFIGS[f.field.field];
    const label=fc?fc.label:f.field.field;
    const op=fc&&fc.ops.length===1?'':opLabel(f.field.operator)+' ';
    const val=fc&&fc.type==='select'?(fc.options?.find(o=>o[0]===String(f.field.value))?.[1]||f.field.value):f.field.value;
    return label+' '+op+'"'+val+'"';
  }
  if(f.global) return '全局: '+opLabel(f.global.operator)+' "'+f.global.value+'"';
  if(f.tag) return (f.tag.negate?'排除':'包含')+'标签: '+f.tag.value;
  if(f.meta_tag) return (f.meta_tag.negate?'排除':'包含')+'公共标签: '+f.meta_tag.value;
  if(f.count) return '数量['+f.count.what+'] '+opLabel(f.count.operator)+' '+f.count.value;
  if(f.relation){
    const modeLabel={any:'任意',all:'全部',none:'排除'}[f.relation.mode]||f.relation.mode;
    let l=modeLabel+'关系['+f.relation.type+']';
    if(f.relation.conditions?.length) l+=' ('+f.relation.conditions.map(relCondLabel).join(', ')+')';
    return l;
  }
  if(f.staff){
    const modeLabel={any:'任意',all:'全部',none:'排除'}[f.staff.mode]||f.staff.mode;
    let l=(queryTarget==='person'?'关联':'人员')+'['+f.staff.position+'] '+modeLabel;
    if(f.staff.conditions?.length) l+=' ('+f.staff.conditions.map(staffCondLabel).join(', ')+')';
    return l;
  }
  if(f.episode){const c=f.episode.logic?f.episode.logic.items.length:(f.episode.conditions?.length||0);return '剧集 '+(f.episode.mode||'any')+(c?' +'+c+'条件':'')}
  if(f.logic) return logicLabel(f.logic);
  return JSON.stringify(f);
}

function logicLabel(lg){
  const opLabel=lg.op==='or'?'OR':'AND';
  if(lg.items.length===0) return opLabel+' (空)';
  return opLabel+' ('+lg.items.map(filterToLabel).join(', ')+')';
}

function toggleLogicOp(lgId,val){
  const g=findLogicGroup(rootLogic,lgId);if(!g)return;
  g.op=val;renderFilterTags();updateYAMLEditor();
}

function logicToFilter(lg){
  return {logic:{op:lg.op,items:lg.items.map(item=>{
    if(item.logic) return logicToFilter(item.logic);
    return item;
  })}};
}

function getFiltersForAPI(){
  if(rootLogic.items.length===0) return [];
  // Strip internal _id before sending
  return [logicToFilter(rootLogic)];
}

/* ===== YAML ===== */
function toggleYAML(){
  const s=document.getElementById('yamlSection');
  if(s.style.display==='none'){s.style.display='block';updateYAMLEditor()}
  else{s.style.display='none'}
}
function updateYAMLEditor(){
  syncAllConditions();
  const cols=document.getElementById('outputColumns').value;
  const apiFilters=getFiltersForAPI();
  const y='filters:\n'+apiFilters.map(f=>'  - '+JSON.stringify(f,null,2).replace(/\n/g,'\n    ')).join('\n')+'\noutput:\n  columns: ['+cols+']';
  document.getElementById('yamlEditor').value=y;
}
async function applyYAML(){
  const raw=document.getElementById('yamlEditor').value;
  if(!raw.trim()){alert('YAML 内容为空');return}
  try{
    const r=await fetch('/api/config/parse',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({yaml:raw})});
    const data=await r.json();
    if(data.error){alert('解析失败: '+data.error+(data.message?'\n'+data.message:''));return}
    if(data.filters&&data.filters.length>0){
      applyFiltersFromAPI(data.filters);
      renderFilterTags()
    }
    if(data.output?.columns)document.getElementById('outputColumns').value=data.output.columns.join(',');
    if(data.limit)document.getElementById('resultLimit').value=data.limit;
  }catch(e){alert('请求失败: '+e.message)}
}

function applyFiltersFromAPI(apiFilters){
  _logicIdCounter=0;
  let newRoot;
  if(apiFilters.length===1&&apiFilters[0].logic){
    newRoot=assignLogicIds(apiFilters[0].logic);
  }else{
    newRoot={op:'and',items:apiFilters,_id:++_logicIdCounter};
  }
  if(queryTarget==='person'){personRootLogic=newRoot}else{subjectRootLogic=newRoot}
  rootLogic=newRoot;
}

function assignLogicIds(lg){
  if(!lg._id) lg._id=++_logicIdCounter;
  for(const item of lg.items){
    if(item.logic) assignLogicIds(item.logic);
  }
  return lg;
}

/* ===== WASM SQL Builder ===== */
function isDirect(f){return DIRECT_FIELDS.includes(f)}
function infoboxExpr(f,alias){const a=alias||'s';const n=f.replace(/'/g,"''");return "regexp_extract("+a+".infobox,'(?i)\\|"+n+"\\\\s*[:=]\\\\s*([^|}\\\\n]*)',1)"}
function numExpr(e){return "TRY_CAST(NULLIF(REPLACE(regexp_extract("+e+",'(\\\\d[\\\\d,]*(?:\\\\.\\\\d+)?)',1),',',''),'') AS DOUBLE)"}
function dateExpr(e){const n="regexp_replace(regexp_replace(TRIM("+e+"),'[年月]','-'),'日','')";const p="CASE WHEN regexp_matches("+n+",'^\\\\d{4}$') THEN "+n+"||'-01-01' WHEN regexp_matches("+n+",'^\\\\d{4}-\\\\d{1,2}$') THEN "+n+"||'-01' ELSE "+n+" END";return "TRY_CAST("+p+" AS DATE)"}
function escSql(s){return (s||'').replace(/'/g,"''")}
function buildCond(expr,op,val){
  switch(op){
    case 'eq':return "CAST("+expr+" AS VARCHAR) = '"+escSql(val)+"'";
    case 'contains':return "CAST("+expr+" AS VARCHAR) LIKE '%"+escSql(val).replace(/%/g,'\\%').replace(/_/g,'\\_')+"%'";
    case 'not_contains':return "CAST("+expr+" AS VARCHAR) NOT LIKE '%"+escSql(val).replace(/%/g,'\\%').replace(/_/g,'\\_')+"%'";
    case 'regex':return "regexp_matches("+expr+",'"+val.replace(/'/g,"''")+"')";
    case 'empty':return "COALESCE(CAST("+expr+" AS VARCHAR),'') = ''";
    case 'gt':case 'gte':case 'lt':case 'lte':return "CAST("+expr+" AS DOUBLE) "+({gt:'>',gte:'>=',lt:'<',lte:'<='})[op]+" "+val;
    case 'before':return dateExpr(expr)+" < CAST('"+escSql(val)+"' AS DATE)";
    case 'after':return dateExpr(expr)+" > CAST('"+escSql(val)+"' AS DATE)";
    default:return expr+" LIKE '%"+escSql(val)+"%'";
  }
}
function buildFieldWhere(f,alias){
  const a=alias||'s';let expr;
  if(isDirect(f.field))expr=a+"."+f.field;
  else{expr=infoboxExpr(f.field,a);if(['gt','gte','lt','lte'].includes(f.operator))expr=numExpr(expr)}
  return buildCond(expr,f.operator,String(f.value||''));
}
function buildWasmClauses(filters,alias,op){
  const parts=[];
  for(const f of filters){
    if(f.logic){
      const c=buildWasmClauses(f.logic.items,alias,f.logic.op);
      if(c) parts.push(c);
    }else if(f.field){
      parts.push(buildFieldWhere(f.field,alias));
    }else if(f.type){
      const col=queryTarget==='person'?alias+'.person_type':alias+'.type';
      parts.push(col+' = '+f.type.value);
    }else if(f.global){
      parts.push(buildCond(alias+'.infobox',f.global.operator,String(f.global.value||'')));
    }else if(f.tag){
      const c="EXISTS (SELECT 1 FROM (SELECT UNNEST("+alias+".tags) AS t) WHERE t.name = '"+escSql(f.tag.value)+"')";
      parts.push(f.tag.negate?'NOT '+c:c);
    }else if(f.meta_tag){
      parts.push("LIST_CONTAINS(COALESCE("+alias+".meta_tags, []), '"+escSql(f.meta_tag.value)+"')");
    }else if(f.count){
      let cnt="(SELECT COUNT(*) FROM subject_relations r WHERE r.subject_id="+alias+".id)";
      parts.push(buildCond(cnt,f.count.operator||'gt',String(f.count.value||'0')));
    }
  }
  if(parts.length===0) return '';
  const sep=op==='or'?' OR ':' AND ';
  const joined=parts.join(sep);
  return (op==='or'&&parts.length>1)?'('+joined+')':joined;
}

function buildWasmSQL(filters,cols,target,limit,sortBy){
  const alias=target==='person'?'p':'s';
  const fromTbl=target==='person'?'persons':'subjects';
  let selectExprs=[];
  for(const col of cols){
    if(col==='id'){selectExprs.push(alias+(target==='person'?'.person_id as id':'.id'));continue}
    if(isDirect(col)){selectExprs.push(alias+'.'+col);continue}
    if(col==='name_cn'&&target==='person'){selectExprs.push(alias+'.name AS name_cn');continue}
    selectExprs.push(infoboxExpr(col,alias)+' AS "'+col.replace(/"/g,'""')+'"');
  }
  let whereParts=[];
  for(const f of filters){
    if(f.type){
      const col=target==='person'?alias+'.person_type':alias+'.type';
      whereParts.push(col+' = '+f.type.value);
    }else if(f.field){
      whereParts.push(buildFieldWhere(f.field,alias));
    }else if(f.global){
      whereParts.push(buildCond(alias+'.infobox',f.global.operator,String(f.global.value||'')));
    }else if(f.tag){
      const c="EXISTS (SELECT 1 FROM (SELECT UNNEST("+alias+".tags) AS t) WHERE t.name = '"+escSql(f.tag.value)+"')";
      whereParts.push(f.tag.negate?'NOT '+c:c);
    }else if(f.meta_tag){
      whereParts.push("LIST_CONTAINS(COALESCE("+alias+".meta_tags, []), '"+escSql(f.meta_tag.value)+"')");
    }else if(f.relation){
      const rids=f.relation.type||'';
      const mode=f.relation.mode||'any';
      let sub="EXISTS (SELECT 1 FROM subject_relations r LEFT JOIN subjects rs ON r.related_subject_id=rs.id WHERE r.subject_id="+alias+".id";
      sub+=" AND r.relation_type IN (/*TODO:resolve*/"+rids+"))";
      whereParts.push(sub);
    }else if(f.staff){
      const pos=f.staff.position||'';
      const mode=f.staff.mode||'any';
      const conds=f.staff.conditions||[];
      if(target==='person'){
        if(mode==='none'){
          whereParts.push("NOT EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.person_id=p.person_id AND sp.position IN (/*pos*/"+pos+"))");
        }else{
          let sub="EXISTS (SELECT 1 FROM subject_persons sp LEFT JOIN subjects rs ON sp.subject_id=rs.id WHERE sp.person_id=p.person_id AND sp.position IN (/*pos*/"+pos+")";
          for(const c of conds){
            if(c.field)sub+=" AND "+buildCond('rs.'+escSql(c.field.field),c.field.operator||'contains',String(c.field.value||''));
            else if(c.type)sub+=" AND rs.type="+Number(c.type.value);
            else if(c.global)sub+=" AND "+buildCond('rs.infobox',c.global.operator||'contains',String(c.global.value||''));
            else if(c.tag){
              const tc="EXISTS (SELECT 1 FROM (SELECT UNNEST(rs.tags) AS t) WHERE t.name = '"+escSql(c.tag.value)+"')";
              sub+=c.tag.negate?' AND NOT '+tc:' AND '+tc;
            }else if(c.meta_tag)sub+=" AND LIST_CONTAINS(COALESCE(rs.meta_tags, []), '"+escSql(c.meta_tag.value)+"')";
          }
          sub+=")";
          whereParts.push(sub);
        }
      }else{
        if(mode==='none'){
          whereParts.push("NOT EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.subject_id=s.id AND sp.position IN (/*pos*/"+pos+"))");
        }else{
          let sub="EXISTS (SELECT 1 FROM subject_persons sp LEFT JOIN persons p2 ON sp.person_id=p2.person_id";
          sub+=" WHERE sp.subject_id=s.id AND sp.position IN (/*pos*/"+pos+")";
          for(const c of conds){
            if(c.field){
              const fname=c.field.field;
              if(fname==='name'||fname==='person_name')sub+=" AND "+buildCond('p2.name',c.field.operator||'contains',String(c.field.value||''));
              else if(fname==='id'||fname==='person_id')sub+=" AND "+buildCond('sp.person_id',c.field.operator||'contains',String(c.field.value||''));
              else if(fname==='type')sub+=" AND "+buildCond('p2.person_type',c.field.operator||'contains',String(c.field.value||''));
              else if(fname==='career')sub+=" AND LIST_CONTAINS(COALESCE(p2.career, []), '"+escSql(String(c.field.value||''))+"')";
              else if(fname==='appear_eps')sub+=" AND "+buildCond('sp.appear_eps',c.field.operator||'contains',String(c.field.value||''));
              else sub+=" AND "+buildCond('p2.infobox',c.field.operator||'contains',String(c.field.value||''));
            }else if(c.global)sub+=" AND "+buildCond('p2.infobox',c.global.operator||'contains',String(c.global.value||''));
          }
          sub+=")";
          whereParts.push(sub);
        }
      }
    }else if(f.episode){
      whereParts.push("EXISTS (SELECT 1 FROM episodes e WHERE e.subject_id=s.id)");
    }else if(f.count){
      let cnt="(SELECT COUNT(*) FROM subject_relations r WHERE r.subject_id="+alias+".id)";
      whereParts.push(buildCond(cnt,f.count.operator||'gt',String(f.count.value||'0')));
    }else if(f.logic){
      const c=buildWasmClauses(f.logic.items,alias,f.logic.op);
      if(c) whereParts.push(c);
    }
  }
  let sql="SELECT "+selectExprs.join(', ')+" FROM "+fromTbl+" "+alias;
  if(whereParts.length>0)sql+=" WHERE "+whereParts.join(' AND ');
  if(sortBy)sql+=" ORDER BY "+sortBy;
  sql+=" LIMIT "+(limit||500);
  return sql;
}

/* ===== Run Query ===== */
function syncAllConditions(){
  (function walk(lg){
    for(let i=0;i<lg.items.length;i++){
      const item=lg.items[i];
      if(item.logic){walk(item.logic);continue}
      const uid=lg._id+'_'+i;
      if(item.field){
        const fEl=document.getElementById('efn_'+uid);
        if(fEl) item.field.field=fEl.value.trim();
        const oEl=document.getElementById('efo_'+uid);
        if(oEl) item.field.operator=oEl.value;
        const vEl=document.getElementById('efv_'+uid);
        if(vEl) item.field.value=vEl.value.trim();
      }else if(item.tag){
        const vEl=document.getElementById('efn_'+uid);
        if(vEl) item.tag.value=vEl.value.trim();
      }else if(item.meta_tag){
        const vEl=document.getElementById('efn_'+uid);
        if(vEl) item.meta_tag.value=vEl.value.trim();
      }else if(item.global){
        const vEl=document.getElementById('efn_'+uid);
        if(vEl) item.global.value=vEl.value.trim();
      }else if(item.count){
        const vEl=document.getElementById('efv_'+uid);
        if(vEl) item.count.value=vEl.value.trim();
      }else if(item.episode&&item.episode.logic){
        walk(item.episode.logic);
      }
      if(item.relation&&item.relation.conditions){for(const c of item.relation.conditions){if(c.logic)walk(c.logic)}}
      if(item.staff&&item.staff.conditions){for(const c of item.staff.conditions){if(c.logic)walk(c.logic)}}
    }
  })(rootLogic);
}

async function runQuery(){
  syncAllConditions();
  const cols=document.getElementById('outputColumns').value.split(',').map(s=>s.trim()).filter(Boolean);
  const limit=parseInt(document.getElementById('resultLimit').value)||500;
  const sortBy=document.getElementById('sortBy')?.value||'';
  const placeholder=document.getElementById('resultsPlaceholder');
  if(placeholder)placeholder.remove();
  ensureResultElements();
  document.getElementById('resultsInfo').innerHTML='<div class="loading-spinner"><div class="spinner"></div>查询中...</div>';
  document.getElementById('resultsTable').innerHTML='';

  if(backendMode==='wasm'){
    // DuckDB-WASM mode
    try{
      if(!duckDB||!duckConn){await detectBackend()}
      const sql=buildWasmSQL(getFiltersForAPI(),cols,queryTarget,limit,sortBy);
      const t0=performance.now();
      const result=await duckConn.query(sql);
      const elapsed=((performance.now()-t0)/1000).toFixed(2);
      const rcols=result.schema.fields.map(f=>f.name);
      const rows=[];
      for(let i=0;i<result.numRows;i++){const row=[];for(const c of rcols)row.push(String(result.getChild(c)?.get(i)??''));rows.push(row)}
      lastResult={columns:rcols,rows,total_rows:rows.length,duration:elapsed+'s'};
      renderResults(lastResult);
    }catch(e){
      document.getElementById('resultsInfo').innerHTML='<div class="error-card"><div class="error-title">查询失败</div><pre>'+escapeHtml(e.message)+'</pre></div>';
    }
    return;
  }

  // API mode
  const body=JSON.stringify({target:queryTarget,filters:getFiltersForAPI(),columns:cols,limit});
  try{
    const r=await fetch('/api/query',{method:'POST',headers:{'Content-Type':'application/json'},body});
    const data=await r.json();
    if(data.error){
      let err='<div class="error-card"><div class="error-title">查询失败</div>';
      err+='<pre>'+escapeHtml(data.error).replace(/\\n/g,'\n')+'</pre>';
      err+='<details><summary>🔧 排查建议</summary><ul>';
      err+='<li>确认数据目录路径正确 — 访问 <a href="/api/debug" target="_blank">/api/debug</a></li>';
      err+='<li>确认 JSONLines 文件存在且可读</li>';
      err+='<li>在 CLI 中加 <code>--verbose</code> 查看完整 SQL</li>';
      err+='</ul></details></div>';
      document.getElementById('resultsInfo').innerHTML=err;
      return;
    }
    lastResult=data;
    renderResults(data);
  }catch(e){
    document.getElementById('resultsInfo').innerHTML='<div class="error-card"><div class="error-title">网络错误</div>'+escapeHtml(e.message)+'</div>';
  }
}

/* ===== Render Results ===== */
function bgmLink(id, colName){
  if(id===null||id===undefined||id==='')return escapeHtml(String(id));
  const s=String(id);
  const cn=colName.toLowerCase();
  let type='subject';
  if(cn.includes('person'))type='person';
  else if(cn.includes('character'))type='character';
  else if(cn.includes('episode'))type='episode';
  return '<a href="https://bgm.tv/'+type+'/'+s+'" target="_blank" rel="noopener">'+escapeHtml(s)+'</a>';
}

function isIDColumn(colName){
  const cn=colName.toLowerCase();
  return cn==='id'||cn.endsWith('_id')||cn.endsWith('id');
}

function renderResults(data){
  const info=document.getElementById('resultsInfo');
  const table=document.getElementById('resultsTable');
  const cols=data.columns||[];
  const rows=data.rows||[];

  // Toolbar
  info.innerHTML='<div class="results-toolbar">'+
    '<span class="results-count">共 <b>'+data.total_rows+'</b> 条结果<span class="time">'+data.duration+'</span></span>'+
    '<span>'+
      '<button class="btn btn-outline btn-sm" onclick="exportCSV()">📥 下载 CSV</button>'+
      '<button class="btn btn-default btn-sm" onclick="copyTable()" style="margin-left:6px">📋 复制表格</button>'+
    '</span>'+
  '</div>';

  if(rows.length===0){
    table.innerHTML='<div class="results-empty"><div class="icon">📭</div><div>没有找到符合条件的条目</div></div>';
    return;
  }

  // Build table
  let html='<div class="results-table-wrap"><table class="results-table"><thead><tr>';
  for(const col of cols){
    let label=col;
    if(col.length>20)label=col.substring(0,18)+'…';
    html+='<th title="'+escapeHtml(col)+'">'+escapeHtml(label)+'</th>';
  }
  html+='</tr></thead><tbody>';
  for(const row of rows){
    html+='<tr>';
    for(let i=0;i<cols.length;i++){
      const col=cols[i],val=row[i];
      let cellClass='';
      let cellContent;
      if(isIDColumn(col)){
        cellClass='col-id';
        cellContent=bgmLink(val,col);
      }else if(col==='score'||col==='评分'){
        cellClass='col-score';
        cellContent=escapeHtml(String(val??''));
      }else if(col==='name'||col==='name_cn'){
        cellClass='col-name';
        cellContent=escapeHtml(String(val??''));
      }else if(val===null||val===undefined||val===''){
        cellClass='cell-null';
        cellContent='—';
      }else{
        cellContent=escapeHtml(String(val));
      }
      html+='<td class="'+cellClass+'">'+cellContent+'</td>';
    }
    html+='</tr>';
  }
  html+='</tbody></table></div>';
  table.innerHTML=html;
}

/* ===== Export ===== */
function exportCSV(){
  const cols=document.getElementById('outputColumns').value.split(',').map(s=>s.trim()).filter(Boolean);
  const limit=parseInt(document.getElementById('resultLimit').value)||500;
  fetch('/api/query',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({target:queryTarget,filters:getFiltersForAPI(),columns:cols,format:'csv',limit:Math.min(limit*10,10000)})
  }).then(r=>r.blob()).then(blob=>{
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='bangumi_results.csv';a.click();
  });
}
function copyTable(){
  if(!lastResult||!lastResult.rows)return;
  const cols=lastResult.columns;
  let text=cols.join('\t')+'\n';
  for(const row of lastResult.rows)text+=row.map(v=>v??'').join('\t')+'\n';
  navigator.clipboard.writeText(text).then(()=>{
    const btn=event.target;const orig=btn.textContent;btn.textContent='已复制!';setTimeout(()=>btn.textContent=orig,1500);
  }).catch(()=>alert('复制失败'));
}

/* ===== Escape ===== */
function escapeHtml(s){if(s===null||s===undefined)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
</script>
</body>
</html>`

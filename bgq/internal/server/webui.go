package server

// WebUIHTML is the embedded single-page web UI.
const WebUIHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
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
  .container{flex-direction:column}
  .panel-left{width:100%;min-width:100%;max-height:50vh}
  .panel-right{flex:none}
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

  <!-- Active Filters -->
  <div class="card">
    <div class="card-header"><span class="dot-indicator"></span>筛选条件</div>
    <div class="filter-tags" id="filterTags">
      <span class="filter-empty">暂无筛选条件</span>
    </div>
    <div style="margin-top:12px">
      <button class="btn btn-outline btn-xs" onclick="clearFilters()">清除全部</button>
    </div>
  </div>

  <!-- Add Filter -->
  <div class="card">
    <div class="card-header"><span class="dot-indicator"></span>添加条件</div>
    <div id="addFilterForm"></div>
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

<script>
/* ===== WASM config ==== */
const DIRECT_FIELDS=['id','type','name','name_cn','platform','nsfw','score','rank','date','series','infobox','person_id','person_type','career','summary'];

/* ===== State ===== */
let schema = {direct_fields:[],subject_types:{},relation_types:{},staff_positions:{}};
let filters = [];
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
  renderAddForm();
}
async function loadSchema(){
  if(backendMode==='wasm'){renderAddForm();return}
  try{const r=await fetch('/api/schema/fields');schema=await r.json();renderAddForm()}catch(e){console.error(e)}
}
function setStatus(cls,text){document.getElementById('statusDot').style.background=cls==='ready'?'#67c23a':cls==='loading-bg'?'#e6a23c':'#f56c6c';document.getElementById('statusText').textContent=text}

/* ===== Render Filter Tags ===== */
function renderFilterTags(){
  const el=document.getElementById('filterTags');
  if(filters.length===0){el.innerHTML='<span class="filter-empty">暂无筛选条件</span>';return}
  el.innerHTML=filters.map((f,i)=>{
    let label='';
    if(f.type) label='类型: '+(Object.entries(schema.subject_types).find(([k,v])=>v==f.type.value)?.[0]||f.type.value);
    else if(f.field) label=f.field.field+' '+opLabel(f.field.operator)+' "'+f.field.value+'"';
    else if(f.global) label='全局: '+opLabel(f.global.operator)+' "'+f.global.value+'"';
    else if(f.tag) label=(f.tag.negate?'排除':'包含')+'标签: '+f.tag.value;
    else if(f.meta_tag) label=(f.meta_tag.negate?'排除':'包含')+'公共标签: '+f.meta_tag.value;
    else if(f.relation){
      const c=f.relation.conditions?.length||0;
      const modeLabel={any:'任意',all:'全部',none:'排除'}[f.relation.mode]||f.relation.mode;
      label=modeLabel+'关系['+f.relation.type+']';
      if(c>0){label+=' ('+f.relation.conditions.map(relCondLabel).join(', ')+')';}
    }
    else if(f.staff){const c=f.staff.conditions?.length||0;label=(queryTarget==='person'?'关联':'人员')+'['+f.staff.position+'] '+(f.staff.mode||'any')+(c?' +'+c+'条件':'')}
    else if(f.episode){const c=f.episode.conditions?.length||0;label='剧集 '+(f.episode.mode||'any')+(c?' +'+c+'条件':'')}
    else if(f.count) label='数量['+f.count.what+'] '+opLabel(f.count.operator)+' '+f.count.value;
    else label=JSON.stringify(f);
    return '<span class="filter-tag"><span class="tag-text">'+escapeHtml(label)+'</span><span class="tag-remove" onclick="removeFilter('+i+')">&times;</span></span>';
  }).join('');
}
function opLabel(op){const m={eq:'=',contains:'包含',regex:'~=',gt:'>',gte:'>=',lt:'<',lte:'<=',before:'早于',after:'晚于',empty:'为空'};return m[op]||op}
function clearFilters(){filters=[];selectedBaseType=0;selectedMetaTags=[];resetRelationBuilder();renderFilterTags();updateYAMLEditor();renderAddForm()}
function removeFilter(i){filters.splice(i,1);renderFilterTags()}

/* ===== Filter Builder ===== */
let addFilterMode='field';
function setTarget(t){queryTarget=t;if(t==='person'){selectedBaseType=0;addFilterMode='field';document.getElementById('outputColumns').value='person_id,name,career'}else{document.getElementById('outputColumns').value='id,name,name_cn,type,score'};renderAddForm();loadSchemaOptions()}
function onModeChange(mode){
  addFilterMode = mode;
  if(mode === 'relation') resetRelationBuilder();
  if(mode === 'base') loadSchemaOptionsForType(selectedBaseType);
  renderAddForm();
}
let queryTarget='subject';
function renderAddForm(){
  const el=document.getElementById('addFilterForm');
  el.innerHTML='<div style="margin-bottom:8px;display:flex;align-items:center;gap:8px">'+
    '<span style="font-size:12px;color:var(--text-secondary)">查询:</span>'+
    '<label class="radio-pill'+(queryTarget==='subject'?' active':'')+'" onclick="setTarget(\'subject\')" style="cursor:pointer;font-size:11px;padding:2px 8px">📚 条目</label>'+
    '<label class="radio-pill'+(queryTarget==='person'?' active':'')+'" onclick="setTarget(\'person\')" style="cursor:pointer;font-size:11px;padding:2px 8px">👤 人物</label>'+
    '</div>'+
    '<div class="filter-builder">'+
    '<select class="select select-sm" onchange="onModeChange(this.value)">'+
      (queryTarget==='subject'?'<option value="base" '+(addFilterMode==='base'?'selected':'')+'>基础筛选</option>':'')+
      '<option value="field" '+(addFilterMode==='field'?'selected':'')+'>字段筛选</option>'+
      (queryTarget==='subject'?'<option value="tag" '+(addFilterMode==='tag'?'selected':'')+'>标签筛选</option><option value="meta_tag" '+(addFilterMode==='meta_tag'?'selected':'')+'>公共标签</option><option value="global" '+(addFilterMode==='global'?'selected':'')+'>全局搜索</option><option value="relation" '+(addFilterMode==='relation'?'selected':'')+'>关系筛选</option>':'')+
      '<option value="staff" '+(addFilterMode==='staff'?'selected':'')+'>'+(queryTarget==='person'?'条目关联':'人物筛选')+'</option>'+
      (queryTarget==='subject'?'<option value="episode" '+(addFilterMode==='episode'?'selected':'')+'>剧集筛选</option><option value="count" '+(addFilterMode==='count'?'selected':'')+'>数量筛选</option>':'')+
    '</select>'+
    getFilterFormHTML()+
  '</div>';
}
function getFilterFormHTML(){
  const dl=schema.direct_fields.map(f=>'<option value="'+f+'">').join('');
  switch(addFilterMode){
    case 'base':
      return renderBaseFilter();
    case 'field':
      return '<input class="input" id="fieldName" placeholder="字段名" list="fieldList" style="flex:1;min-width:120px"><datalist id="fieldList">'+dl+'</datalist>'+
        '<select class="select select-sm" id="fieldOp"><option value="contains">包含</option><option value="eq">等于</option><option value="regex">正则</option><option value="gt">&gt;</option><option value="lt">&lt;</option><option value="gte">&gt;=</option><option value="lte">&lt;=</option><option value="before">早于</option><option value="after">晚于</option><option value="empty">为空</option></select>'+
        '<input class="input" id="fieldVal" placeholder="值" style="flex:1;min-width:80px"><button class="btn btn-primary btn-sm" onclick="addFieldFilter()">添加</button>';
    case 'tag':
      return '<input class="input" id="tagVal" placeholder="标签名" style="flex:1"><select class="select select-sm" id="tagNegate"><option value="0">包含</option><option value="1">排除</option></select><button class="btn btn-primary btn-sm" onclick="addTagFilter()">添加</button>';
    case 'meta_tag':
      const mts = schemaOptions.meta_tags||[];
      let mtOpts = mts.map(t=>'<option value="'+escHtml(t)+'">').join('');
      return '<input class="input" id="metaTagVal" placeholder="公共标签名" list="metaTagList" style="flex:1"><datalist id="metaTagList">'+mtOpts+'</datalist><select class="select select-sm" id="metaTagNegate"><option value="0">包含</option><option value="1">排除</option></select><button class="btn btn-primary btn-sm" onclick="addMetaTagFilter()">添加</button>';
    case 'global':
      return '<select class="select select-sm" id="globalOp"><option value="contains">包含</option><option value="regex">正则</option></select><input class="input" id="globalVal" placeholder="搜索文本" style="flex:1"><button class="btn btn-primary btn-sm" onclick="addGlobalFilter()">添加</button>';
    case 'relation':
      return renderRelationBuilder();
    case 'staff':
      if(queryTarget==='person'){
        return '<input class="input" id="staffPos" placeholder="职位名" style="width:100px"><select class="select select-sm" id="staffMode"><option value="any">任意</option></select>'+
          '<button class="btn btn-primary btn-sm" onclick="addStaffFilter()">添加</button>';
      }
      return '<input class="input" id="staffPos" placeholder="职位名" style="width:100px"><select class="select select-sm" id="staffMode"><option value="any">任意</option><option value="all">全部</option></select>'+
        '<input class="input" id="staffField2" placeholder="人物字段" value="name" list="staffFieldList" style="width:80px"><datalist id="staffFieldList"><option value="name"><option value="id"><option value="type"><option value="career"><option value="appear_eps"><option value="简体中文名"><option value="别名"><option value="性别"><option value="生日"></datalist>'+
        '<select class="select select-sm" id="staffOp2" style="width:70px"><option value="contains">包含</option><option value="eq">等于</option></select>'+
        '<input class="input" id="staffVal" placeholder="值" style="width:80px"><button class="btn btn-primary btn-sm" onclick="addStaffFilter()">添加</button>';
    case 'episode':
      return '<input class="input" id="epField2" placeholder="剧集字段" value="name" style="width:80px"><select class="select select-sm" id="epOp2"><option value="contains">包含</option><option value="regex">正则</option><option value="gt">&gt;</option><option value="lt">&lt;</option></select>'+
        '<input class="input" id="epVal" placeholder="值" style="flex:1"><select class="select select-sm" id="epMode"><option value="any">任意</option><option value="all">全部</option></select><button class="btn btn-primary btn-sm" onclick="addEpisodeFilter()">添加</button>';
    case 'count':
      return '<input class="input" id="countWhat" placeholder="关系名或ep" style="width:110px"><select class="select select-sm" id="countOp"><option value="gt">&gt;</option><option value="gte">&gt;=</option><option value="lt">&lt;</option><option value="lte">&lt;=</option><option value="eq">=</option></select>'+
        '<input class="input" id="countVal" placeholder="数量" style="width:60px"><button class="btn btn-primary btn-sm" onclick="addCountFilter()">添加</button>';
    default:return'';
  }
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
    h+='<label class="radio-pill" style="cursor:pointer;font-size:11px;padding:2px 8px" onclick="toggleBaseMetaTag(this,\''+escHtml(mt)+'\')">'+escHtml(mt)+'</label>';
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
  renderAddForm();
}

let selectedMetaTags = [];

function toggleBaseMetaTag(el, tag){
  el.classList.toggle('active');
  const idx = selectedMetaTags.indexOf(tag);
  if(idx >= 0) selectedMetaTags.splice(idx, 1);
  else selectedMetaTags.push(tag);
}

function addBaseFilters(){
  let count=0;
  const t=selectedBaseType;
  if(t&&t>0){filters.push({type:{value:t}});count++}

  const plat=document.getElementById('basePlatform')?.value;
  if(plat){filters.push({field:{field:'platform',operator:'eq',value:plat}});count++}

  for(const mt of selectedMetaTags){
    filters.push({meta_tag:{operator:'contains',value:mt}});count++;
  }

  const smin=document.getElementById('baseScoreMin')?.value;
  if(smin){filters.push({field:{field:'score',operator:'gte',value:smin}});count++}
  const smax=document.getElementById('baseScoreMax')?.value;
  if(smax){filters.push({field:{field:'score',operator:'lte',value:smax}});count++}

  const dmin=document.getElementById('baseDateMin')?.value;
  if(dmin){filters.push({field:{field:'date',operator:'after',value:dmin}});count++}
  const dmax=document.getElementById('baseDateMax')?.value;
  if(dmax){filters.push({field:{field:'date',operator:'before',value:dmax}});count++}

  const rank=document.getElementById('baseRank')?.value;
  if(rank){filters.push({field:{field:'rank',operator:'lte',value:rank}});count++}

  if(document.getElementById('baseSeries')?.checked){filters.push({field:{field:'series',operator:'eq',value:'true'}});count++}
  if(document.getElementById('baseNsfw')?.checked){filters.push({field:{field:'nsfw',operator:'eq',value:'true'}});count++}

  selectedMetaTags = [];
  if(count>0){renderFilterTags()}
}

function escHtml(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function ensureResultElements(){
  const panel=document.getElementById('resultsPanel');
  if(!document.getElementById('resultsInfo')){const d=document.createElement('div');d.id='resultsInfo';panel.appendChild(d)}
  if(!document.getElementById('resultsTable')){const d=document.createElement('div');d.id='resultsTable';panel.appendChild(d)}
}

/* ===== Filter Actions ===== */
function getVal(id){return document.getElementById(id)?.value?.trim()||''}
function addFieldFilter(){const f=getVal('fieldName'),o=getVal('fieldOp'),v=getVal('fieldVal');if(!f)return;if(o!=='empty'&&!v)return;filters.push({field:{field:f,operator:o,value:v}});renderFilterTags()}
function addTagFilter(){const v=getVal('tagVal'),n=document.getElementById('tagNegate').value==='1';if(v){filters.push({tag:{operator:'contains',value:v,negate:n}});renderFilterTags()}}
function addMetaTagFilter(){const v=getVal('metaTagVal'),n=document.getElementById('metaTagNegate').value==='1';if(v){filters.push({meta_tag:{operator:'contains',value:v,negate:n}});renderFilterTags()}}
function addGlobalFilter(){const o=getVal('globalOp'),v=getVal('globalVal');if(v){filters.push({global:{operator:o,value:v}});renderFilterTags()}}
// ===== Relation builder with nested conditions =====
let pendingRelation = null;
let relNestMode = 'field';

function resetRelationBuilder(){
  pendingRelation = {type:'',mode:'any',conditions:[]};
  relNestMode = 'field';
}

function renderRelationBuilder(){
  if(!pendingRelation) resetRelationBuilder();
  let html = '';

  // Row 1: Relation type + mode
  html += '<div class="filter-builder" style="margin-bottom:4px">'+
    '<input class="input" id="relType" placeholder="关系名 (如: 单行本)" style="flex:1;min-width:100px" value="'+escapeHtml(pendingRelation.type)+'">'+
    '<select class="select select-sm" id="relMode" onchange="pendingRelation.mode=this.value">'+
      '<option value="any" '+(pendingRelation.mode==='any'?'selected':'')+'>任意满足</option>'+
      '<option value="all" '+(pendingRelation.mode==='all'?'selected':'')+'>全部满足</option>'+
      '<option value="none" '+(pendingRelation.mode==='none'?'selected':'')+'>排除</option>'+
    '</select>'+
  '</div>';

  // Row 2: Show existing conditions
  if(pendingRelation.conditions.length > 0){
    html += '<div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px">';
    for(let i=0;i<pendingRelation.conditions.length;i++){
      html += '<span class="filter-tag" style="font-size:11px">'+relCondLabel(pendingRelation.conditions[i])+
        '<span class="tag-remove" onclick="removeRelCond('+i+')">&times;</span></span>';
    }
    html += '</div>';
  }

  // Row 3: Nested condition builder
  html += '<div class="filter-builder" style="margin-bottom:4px">'+
    '<select class="select select-sm" onchange="relNestMode=this.value;renderAddForm()">'+
      '<option value="field" '+(relNestMode==='field'?'selected':'')+'>字段</option>'+
      '<option value="type" '+(relNestMode==='type'?'selected':'')+'>类型</option>'+
      '<option value="global" '+(relNestMode==='global'?'selected':'')+'>全局</option>'+
      '<option value="tag" '+(relNestMode==='tag'?'selected':'')+'>标签</option>'+
      '<option value="meta_tag" '+(relNestMode==='meta_tag'?'selected':'')+'>公共标签</option>'+
      '<option value="count" '+(relNestMode==='count'?'selected':'')+'>数量</option>'+
    '</select>';
  html += relNestFormHTML();
  html += '</div>';

  // Row 4: Finalize button
  html += '<button class="btn btn-primary btn-sm" onclick="addRelationFilter()" style="margin-top:4px">'+
    '✅ 添加关系 ('+pendingRelation.conditions.length+'个条件)</button>';
  if(pendingRelation.conditions.length > 0){
    html += '<button class="btn btn-default btn-sm" onclick="resetRelationBuilder();renderAddForm()" style="margin-left:4px">清空</button>';
  }
  return html;
}

function relCondLabel(f){
  if(f.type) return '类型: '+(Object.entries(schema.subject_types).find(([k,v])=>v==f.type.value)?.[0]||f.type.value);
  if(f.field) return f.field.field+' '+opLabel(f.field.operator)+' "'+f.field.value+'"';
  if(f.global) return '全局: '+opLabel(f.global.operator)+' "'+f.global.value+'"';
  if(f.tag) return (f.tag.negate?'排除':'包含')+'标签: '+f.tag.value;
  if(f.meta_tag) return (f.meta_tag.negate?'排除':'包含')+'公共标签: '+f.meta_tag.value;
  if(f.count) return '数量['+f.count.what+'] '+opLabel(f.count.operator)+' '+f.count.value;
  return JSON.stringify(f);
}

function relNestFormHTML(){
  const dl=schema.direct_fields.map(f=>'<option value="'+f+'">').join('');
  switch(relNestMode){
    case 'field':
      return '<input class="input" id="rnField" placeholder="字段名" style="width:80px"><select class="select select-sm" id="rnOp"><option value="contains">包含</option><option value="eq">等于</option><option value="regex">正则</option><option value="gt">&gt;</option><option value="lt">&lt;</option><option value="gte">&gt;=</option><option value="lte">&lt;=</option><option value="before">早于</option><option value="after">晚于</option><option value="empty">为空</option></select>'+
        '<input class="input" id="rnVal" placeholder="值" style="flex:1"><button class="btn btn-primary btn-sm" onclick="addRelNestField()">+</button>';
    case 'type':
      return '<select class="select select-sm" id="rnType"><option>书籍</option><option>动画</option><option>音乐</option><option>游戏</option><option>三次元</option></select><button class="btn btn-primary btn-sm" onclick="addRelNestType()">+</button>';
    case 'global':
      return '<select class="select select-sm" id="rnGlobalOp"><option value="contains">包含</option><option value="regex">正则</option></select><input class="input" id="rnGlobalVal" placeholder="搜索文本" style="flex:1"><button class="btn btn-primary btn-sm" onclick="addRelNestGlobal()">+</button>';
    case 'tag':
      return '<input class="input" id="rnTag" placeholder="标签名" style="flex:1"><select class="select select-sm" id="rnTagNeg"><option value="0">包含</option><option value="1">排除</option></select><button class="btn btn-primary btn-sm" onclick="addRelNestTag()">+</button>';
    case 'meta_tag':
      return '<input class="input" id="rnMetaTag" placeholder="公共标签名" style="flex:1"><select class="select select-sm" id="rnMetaNeg"><option value="0">包含</option><option value="1">排除</option></select><button class="btn btn-primary btn-sm" onclick="addRelNestMeta()">+</button>';
    case 'count':
      return '<input class="input" id="rnCountWhat" placeholder="关系名或ep" style="width:80px"><select class="select select-sm" id="rnCountOp"><option value="gt">&gt;</option><option value="gte">&gt;=</option><option value="lt">&lt;</option><option value="lte">&lt;=</option><option value="eq">=</option></select><input class="input" id="rnCountVal" placeholder="数量" style="width:50px"><button class="btn btn-primary btn-sm" onclick="addRelNestCount()">+</button>';
    default: return '';
  }
}

function rv(id){return document.getElementById(id)?.value?.trim()||''}
function syncPendingRelation(){
  if(!pendingRelation) return;
  const tEl=document.getElementById('relType');
  const mEl=document.getElementById('relMode');
  if(tEl) pendingRelation.type = tEl.value.trim();
  if(mEl) pendingRelation.mode = mEl.value;
}
function addRelNestField(){
  syncPendingRelation();
  const f=rv('rnField'),o=rv('rnOp'),v=rv('rnVal');if(!f||!v)return;
  pendingRelation.conditions.push({field:{field:f,operator:o,value:v}});
  renderAddForm();
}
function addRelNestType(){
  syncPendingRelation();
  pendingRelation.conditions.push({type:{value:rv('rnType')}});
  renderAddForm();
}
function addRelNestGlobal(){
  syncPendingRelation();
  const o=rv('rnGlobalOp'),v=rv('rnGlobalVal');if(!v)return;
  pendingRelation.conditions.push({global:{operator:o,value:v}});
  renderAddForm();
}
function addRelNestTag(){
  syncPendingRelation();
  const v=rv('rnTag'),n=document.getElementById('rnTagNeg')?.value==='1';
  if(!v)return;
  pendingRelation.conditions.push({tag:{operator:'contains',value:v,negate:n}});
  renderAddForm();
}
function addRelNestMeta(){
  syncPendingRelation();
  const v=rv('rnMetaTag'),n=document.getElementById('rnMetaNeg')?.value==='1';
  if(!v)return;
  pendingRelation.conditions.push({meta_tag:{operator:'contains',value:v,negate:n}});
  renderAddForm();
}
function addRelNestCount(){
  syncPendingRelation();
  const w=rv('rnCountWhat'),o=rv('rnCountOp'),v=rv('rnCountVal');if(!w||!v)return;
  pendingRelation.conditions.push({count:{what:w,operator:o,value:v}});
  renderAddForm();
}
function removeRelCond(i){pendingRelation.conditions.splice(i,1);renderAddForm()}

function addRelationFilter(){
  const t=document.getElementById('relType')?.value?.trim()||'';
  if(!t) return;
  pendingRelation.type = t;
  pendingRelation.mode = document.getElementById('relMode')?.value||'any';
  filters.push({relation:{
    type: pendingRelation.type,
    mode: pendingRelation.mode,
    conditions: pendingRelation.conditions
  }});
  resetRelationBuilder();
  renderFilterTags();
  renderAddForm();
}
function addStaffFilter(){const p=getVal('staffPos'),m=getVal('staffMode'),f=getVal('staffField2'),o=getVal('staffOp2'),v=getVal('staffVal');if(!p)return;const r={staff:{position:p,mode:m}};if(f&&v)r.staff.conditions=[{field:f,operator:o,value:v}];filters.push(r);renderFilterTags()}
function addEpisodeFilter(){const f=getVal('epField2'),o=getVal('epOp2'),v=getVal('epVal'),m=getVal('epMode');if(!f||!v)return;filters.push({episode:{mode:m,conditions:[{field:f,operator:o,value:v}]}});renderFilterTags()}
function addCountFilter(){const w=getVal('countWhat'),o=getVal('countOp'),v=getVal('countVal');if(!w||!v)return;filters.push({count:{what:w,operator:o,value:v}});renderFilterTags()}

/* ===== YAML ===== */
function toggleYAML(){
  const s=document.getElementById('yamlSection');
  if(s.style.display==='none'){s.style.display='block';updateYAMLEditor()}
  else{s.style.display='none'}
}
function updateYAMLEditor(){
  const cols=document.getElementById('outputColumns').value;
  const y='filters:\n'+filters.map(f=>'  - '+JSON.stringify(f,null,2).replace(/\n/g,'\n    ')).join('\n')+'\noutput:\n  columns: ['+cols+']';
  document.getElementById('yamlEditor').value=y;
}
async function applyYAML(){
  const raw=document.getElementById('yamlEditor').value;
  if(!raw.trim()){alert('YAML 内容为空');return}
  try{
    const r=await fetch('/api/config/parse',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({yaml:raw})});
    const data=await r.json();
    if(data.error){alert('解析失败: '+data.error+(data.message?'\n'+data.message:''));return}
    if(data.filters&&data.filters.length>0){filters=data.filters;renderFilterTags();resetRelationBuilder();renderAddForm()}
    if(data.output?.columns)document.getElementById('outputColumns').value=data.output.columns.join(',');
    if(data.limit)document.getElementById('resultLimit').value=data.limit;
  }catch(e){alert('请求失败: '+e.message)}
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
      if(target==='person'){
        whereParts.push("EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.person_id=p.person_id AND sp.position IN (/*pos*/"+pos+"))");
      }else{
        let sub="EXISTS (SELECT 1 FROM subject_persons sp";
        if(f.staff.conditions&&f.staff.conditions.some(c=>c.field==='name'||c.field==='type'||c.field==='career'))sub+=" LEFT JOIN persons p2 ON sp.person_id=p2.person_id";
        sub+=" WHERE sp.subject_id=s.id AND sp.position IN (/*pos*/"+pos+")";
        if(f.staff.conditions&&f.staff.conditions.length>0){
          for(const c of f.staff.conditions){
            if(c.field==='count')continue;
            if(c.field==='name')sub+=" AND "+buildCond('p2.name',c.operator||'contains',String(c.value||''));
            else if(c.field==='id'||c.field==='person_id')sub+=" AND "+buildCond('sp.person_id',c.operator||'contains',String(c.value||''));
          }
        }
        sub+=")";
        whereParts.push(sub);
      }
    }else if(f.episode){
      whereParts.push("EXISTS (SELECT 1 FROM episodes e WHERE e.subject_id=s.id)");
    }else if(f.count){
      let cnt="(SELECT COUNT(*) FROM subject_relations r WHERE r.subject_id="+alias+".id)";
      whereParts.push(buildCond(cnt,f.count.operator||'gt',String(f.count.value||'0')));
    }
  }
  let sql="SELECT "+selectExprs.join(', ')+" FROM "+fromTbl+" "+alias;
  if(whereParts.length>0)sql+=" WHERE "+whereParts.join(' AND ');
  if(sortBy)sql+=" ORDER BY "+sortBy;
  sql+=" LIMIT "+(limit||500);
  return sql;
}

/* ===== Run Query ===== */
async function runQuery(){
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
      const sql=buildWasmSQL(filters,cols,queryTarget,limit,sortBy);
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
  const body=JSON.stringify({target:queryTarget,filters,columns:cols,limit});
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
    body:JSON.stringify({target:queryTarget,filters,columns:cols,format:'csv',limit:Math.min(limit*10,10000)})
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

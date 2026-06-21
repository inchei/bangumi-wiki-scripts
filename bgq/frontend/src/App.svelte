<script>
  import { onMount } from "svelte";
  import { loadSchema, loadSchemaOptions } from "./api.js";
  import { queryTarget, clearFilters } from "./stores.js";
  import FilterTree from "./components/FilterTree.svelte";
  import ResultTable from "./components/ResultTable.svelte";
  import YamlEditor from "./components/YamlEditor.svelte";
  import QuerySettings from "./components/QuerySettings.svelte";

  let showYaml = $state(false);
  let statusText = $state("连接中...");
  let statusOk = $state(false);
  let themeBtn = $state("🌙");

  function toggleTheme() {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "" : "dark";
    if (next) html.setAttribute("data-theme", "dark");
    else html.removeAttribute("data-theme");
    localStorage.setItem("theme", next);
    themeBtn = next === "dark" ? "☀️" : "🌙";
  }

  function toggleYaml() {
    showYaml = !showYaml;
  }

  function setTarget(t) {
    queryTarget.set(t);
    if (t === "person") {
      document.getElementById("outputColumns").value = "person_id,name,career";
    } else {
      document.getElementById("outputColumns").value =
        "id,name,name_cn,type,score";
    }
    loadSchemaOptions();
  }

  onMount(async () => {
    // Restore theme
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeBtn = "☀️";
    }
    // Connect
    try {
      const r = await fetch("/api/health");
      const d = await r.json();
      if (d.status === "ok") {
        statusOk = true;
        statusText = "已连接";
        await loadSchema();
        await loadSchemaOptions();
      }
    } catch {
      statusOk = false;
      statusText = "连接失败";
    }
  });
</script>

<!-- Header -->
<div class="header">
  <div class="header-logo">
    <div class="icon">🔍</div>
    <span>Bangumi Query</span>
  </div>
  <span class="spacer"></span>
  <span class="status">
    <span class="dot" class:ok={statusOk}></span>
    <span>{statusText}</span>
  </span>
  <button
    class="btn btn-outline btn-sm"
    onclick={() => {
      loadSchema();
      loadSchemaOptions();
    }}>🔄 刷新</button
  >
  <button class="btn btn-default btn-sm" onclick={toggleYaml}>⚙ YAML</button>
  <button
    class="btn btn-default btn-sm"
    onclick={toggleTheme}
    title="切换夜间模式">{themeBtn}</button
  >
</div>

<!-- Main Container -->
<div class="container">
  <!-- Left Panel -->
  <div class="panel panel-left">
    <div class="card">
      <div class="card-header">
        <span class="dot-indicator"></span>筛选条件
        <span class="spacer"></span>
        <button
          class="radio-pill"
          class:active={$queryTarget === "subject"}
          onclick={() => setTarget("subject")}
          style="cursor:pointer;padding:2px 8px">📚 条目</button
        >
        <button
          class="radio-pill"
          class:active={$queryTarget === "person"}
          onclick={() => setTarget("person")}
          style="cursor:pointer;padding:2px 8px">👤 人物</button
        >
        <button
          class="btn btn-outline btn-xs"
          onclick={clearFilters}
          style="margin-left:8px">清除全部</button
        >
      </div>
      <FilterTree />
    </div>

    {#if showYaml}
      <YamlEditor />
    {/if}

    <QuerySettings />
  </div>

  <!-- Right Panel -->
  <div class="panel panel-right">
    <ResultTable />
  </div>
</div>

<style>
  /* ===== Header ===== */
  .header {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    height: 56px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .header-logo {
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .header-logo .icon {
    width: 28px;
    height: 28px;
    background: var(--accent);
    border-radius: var(--radius-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .spacer {
    flex: 1;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--status-err);
    margin-right: 4px;
    display: inline-block;
  }
  .dot.ok {
    background: var(--status-ok);
  }
  .status {
    font-size: 12px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
  }

  /* ===== Layout ===== */
  :global(.container) {
    display: flex;
    height: calc(100vh - 56px);
  }
  :global(.panel) {
    overflow-y: auto;
  }
  :global(.panel-left) {
    width: 420px;
    min-width: 420px;
    background: var(--white);
    border-right: 1px solid var(--border);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  :global(.panel-right) {
    flex: 1;
    background: var(--bg);
    padding: 20px 24px;
  }

  /* ===== Cards ===== */
  :global(.card) {
    background: var(--white);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: 1px solid var(--border-light);
    padding: 20px;
  }
  :global(.card-header) {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  :global(.card-header .dot-indicator) {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
  }

  /* ===== Form Controls ===== */
  :global(.form-group) {
    margin-bottom: 12px;
  }
  :global(.form-label) {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 4px;
    display: block;
  }
  :global(.input),
  :global(.select) {
    height: 36px;
    padding: 0 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    font-size: 13px;
    font-family: var(--font);
    color: var(--text);
    background: var(--white);
    transition: var(--transition);
    outline: none;
    width: 100%;
  }
  :global(.input:focus),
  :global(.select:focus) {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(240, 145, 153, 0.15);
  }
  :global(.input::placeholder) {
    color: var(--text-placeholder);
  }
  :global(.select) {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23909399' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 28px;
  }
  :global(.select-sm) {
    height: 32px;
    font-size: 12px;
    padding: 0 8px;
    min-width: auto;
    width: auto;
  }

  /* ===== Buttons ===== */
  :global(.btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 36px;
    padding: 0 20px;
    border: none;
    border-radius: var(--radius-xs);
    font-size: 13px;
    font-weight: 500;
    font-family: var(--font);
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
  }
  :global(.btn-primary) {
    background: var(--accent);
    color: var(--white);
  }
  :global(.btn-primary:hover) {
    background: var(--accent-hover);
    box-shadow: 0 2px 8px rgba(240, 145, 153, 0.3);
  }
  :global(.btn-outline) {
    background: var(--white);
    color: var(--accent);
    border: 1px solid var(--accent);
  }
  :global(.btn-outline:hover) {
    background: var(--accent-light);
  }
  :global(.btn-default) {
    background: var(--white);
    color: var(--text);
    border: 1px solid var(--border);
  }
  :global(.btn-default:hover) {
    color: var(--accent);
    border-color: var(--accent);
  }
  :global(.btn-sm) {
    height: 30px;
    padding: 0 12px;
    font-size: 12px;
    border-radius: var(--radius-xs);
  }
  :global(.btn-xs) {
    height: 24px;
    padding: 0 8px;
    font-size: 11px;
    border-radius: 4px;
  }
  :global(.btn-block) {
    width: 100%;
  }
  :global(.btn:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ===== Radio Pill ===== */
  :global(.radio-pill) {
    cursor: pointer;
    font-size: 12px;
    padding: 3px 10px;
    border: 1px solid var(--border);
    border-radius: 20px;
    background: var(--white);
    color: var(--text);
    transition: var(--transition);
    user-select: none;
    display: inline-block;
    font-family: inherit;
  }
  :global(.radio-pill:hover) {
    border-color: var(--accent);
  }
  :global(.radio-pill.active) {
    background: var(--accent);
    color: var(--white);
    border-color: var(--accent);
  }

  /* ===== Responsive ===== */
  @media (max-width: 900px) {
    :global(.container) {
      flex-direction: column;
      height: auto;
      min-height: calc(100vh - 56px);
    }
    :global(.panel-left) {
      width: 100%;
      min-width: 100%;
      max-height: none;
      overflow-y: visible;
    }
    :global(.panel-right) {
      flex: none;
      overflow-y: visible;
    }
  }
</style>

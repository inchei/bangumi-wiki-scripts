<script>
  import { onDestroy } from "svelte";
  import {
    getFiltersForAPI,
    applyFiltersFromAPI,
    outputColumns,
    sortRules,
    resultLimit,
    RESULT_LIMIT_DEFAULT,
    queryTarget,
    subjectRootLogic,
    personRootLogic,
    characterRootLogic,
    episodeRootLogic,
  } from "../stores.js";
  import { filtersToYAML, parseYAML, validateConfig } from "../yaml.js";
  import { get } from "svelte/store";
  import { MorphIcon } from "morphicons/svelte";
  import { ChevronDown, ChevronUp } from "lucide";

  const INDENT = "  ";
  const FLASH_MS = 1500;

  let expanded = $state(false);
  let yamlText = $state("");
  let error = $state("");
  let dirty = $state(false);
  let undoState = $state(null);
  let taEl = $state(null);

  let appliedFlash = $state(false);
  let syncedFlash = $state(false);
  let applyTimer = 0;
  let syncTimer = 0;

  function pulse(which) {
    if (which === "apply") {
      appliedFlash = true;
      clearTimeout(applyTimer);
      applyTimer = setTimeout(() => (appliedFlash = false), FLASH_MS);
    } else {
      syncedFlash = true;
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => (syncedFlash = false), FLASH_MS);
    }
  }

  onDestroy(() => {
    clearTimeout(applyTimer);
    clearTimeout(syncTimer);
  });

  function syncFromFilters() {
    error = "";
    dirty = false;
    try {
      yamlText = filtersToYAML(
        get(queryTarget),
        getFiltersForAPI(),
        get(outputColumns),
        get(resultLimit),
        get(sortRules),
      );
      pulse("sync");
      if (taEl) {
        taEl.focus();
        const end = taEl.value.length;
        taEl.setSelectionRange(end, end);
      }
    } catch (e) {
      error = "导出失败: " + e.message;
    }
  }

  function handleApply() {
    if (!yamlText.trim()) {
      alert("YAML 内容为空");
      return;
    }
    let data;
    try {
      data = parseYAML(yamlText);
    } catch (e) {
      alert("解析失败: " + e.message);
      return;
    }
    const errors = validateConfig(data);
    if (errors.length > 0) {
      const shown = errors.slice(0, 5).join("\n");
      const more = errors.length > 5 ? `\n…等共 ${errors.length} 处` : "";
      alert("配置有误:\n" + shown + more);
      return;
    }
    error = "";
    undoState = {
      target: get(queryTarget),
      filters: getFiltersForAPI(),
      columns: get(outputColumns),
      sort: get(sortRules),
      limit: get(resultLimit),
    };
    dirty = false;
    // Full replace: the YAML is the whole config — settings it omits reset
    // to defaults. Scoped to the current target (its filter tree; the target
    // itself only switches when the YAML specifies one).
    if (data.target) queryTarget.set(data.target);
    applyFiltersFromAPI(data.filters ?? []);
    outputColumns.set((data.output?.columns ?? []).join(","));
    sortRules.set(data.sort ?? []);
    resultLimit.set(data.limit ?? RESULT_LIMIT_DEFAULT);
    pulse("apply");
    document.getElementById("btn-run")?.focus();
  }

  function handleUndo() {
    if (!undoState) return;
    const u = undoState;
    undoState = null;
    error = "";
    dirty = false;
    queryTarget.set(u.target);
    applyFiltersFromAPI(u.filters);
    outputColumns.set(u.columns);
    sortRules.set(u.sort);
    resultLimit.set(u.limit);
  }

  $effect(() => {
    const target = $queryTarget;
    const cols = $outputColumns;
    const lim = $resultLimit;
    const sr = $sortRules;
    void $subjectRootLogic;
    void $personRootLogic;
    void $characterRootLogic;
    void $episodeRootLogic;
    if (!expanded || dirty) return;
    error = "";
    try {
      yamlText = filtersToYAML(target, getFiltersForAPI(), cols, lim, sr);
    } catch (e) {
      error = "导出失败: " + e.message;
    }
  });

  function replaceRange(el, start, end, text, selStart, selEnd) {
    el.focus();
    el.setSelectionRange(start, end);
    let ok;
    try {
      ok = document.execCommand("insertText", false, text);
    } catch {
      ok = false;
    }
    if (!ok) {
      const v = el.value;
      el.value = v.slice(0, start) + text + v.slice(end);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const caret = selStart ?? start + text.length;
    el.setSelectionRange(caret, selEnd ?? caret);
  }

  function deleteRange(el, start, end) {
    el.focus();
    el.setSelectionRange(start, end);
    let ok;
    try {
      ok = document.execCommand("delete", false);
    } catch {
      ok = false;
    }
    if (!ok) {
      const v = el.value;
      el.value = v.slice(0, start) + v.slice(end);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.setSelectionRange(start, start);
    }
  }

  function handleKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter") onEnter(e);
    else if (e.key === "Backspace") onBackspace(e);
  }

  function onEnter(e) {
    e.preventDefault();
    const el = e.currentTarget;
    const v = el.value;
    const s = el.selectionStart;
    const t = el.selectionEnd;
    const lineStart = v.lastIndexOf("\n", s - 1) + 1;
    const line = v.slice(lineStart, s);
    const ws = /^[ \t]*/.exec(line)[0];
    const body = line.trimEnd();
    const deeper = body.endsWith(":") || body.trim() === "-" ? INDENT : "";
    replaceRange(el, s, t, "\n" + ws + deeper);
  }

  function onBackspace(e) {
    const el = e.currentTarget;
    const v = el.value;
    const s = el.selectionStart;
    if (s !== el.selectionEnd) return;
    if (s === 0) return;
    const lineStart = v.lastIndexOf("\n", s - 1) + 1;
    const prefix = v.slice(lineStart, s);
    if (/\S/.test(prefix)) return;
    const cut = Math.min(INDENT.length, prefix.length);
    if (cut === 0) return;
    e.preventDefault();
    deleteRange(el, s - cut, s);
  }
</script>

<div class="card" class:collapsed={!expanded}>
  <div
    class="card-header yaml-toggle"
    onclick={() => (expanded = !expanded)}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === "Enter" && (expanded = !expanded)}
  >
    <span class="dot-indicator"></span>YAML 配置
    <span class="yaml-chevron">
      <MorphIcon
        icon={expanded ? ChevronUp : ChevronDown}
        size={16}
        reducedMotion="always"
      />
    </span>
  </div>
  {#if expanded}
    <textarea
      class="yaml-editor"
      bind:this={taEl}
      bind:value={yamlText}
      oninput={() => (dirty = true)}
      onkeydown={handleKeyDown}
      spellcheck="false"
      autocapitalize="off"
      autocorrect="off"
      placeholder="在此编辑 YAML 配置..."></textarea>
    {#if error}
      <div class="yaml-error">{error}</div>
    {/if}
    <div class="yaml-actions">
      <div class="yaml-actions-left">
        <button class="btn btn-primary btn-sm" onclick={handleApply}>
          {appliedFlash ? "已应用" : "应用"}
        </button>
        {#if undoState}
          <button class="btn btn-default btn-sm" onclick={handleUndo}
            >撤销</button
          >
        {/if}
      </div>
      <button class="btn btn-default btn-sm" onclick={syncFromFilters}>
        {syncedFlash ? "已同步" : "同步当前配置"}
      </button>
    </div>
  {/if}
</div>

<style>
  .collapsed .card-header {
    margin-bottom: 0;
  }

  .yaml-toggle {
    cursor: pointer;
    user-select: none;
  }

  .yaml-chevron {
    margin-left: auto;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
  }

  .yaml-editor {
    width: 100%;
    min-height: 200px;
    font-family: var(--font-mono);
    font-size: 12px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    resize: vertical;
    outline: none;
    background: var(--white);
    color: var(--text);
    line-height: 1.6;
    tab-size: 2;
  }

  .yaml-editor:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgb(240 145 153 / 15%);
  }

  .yaml-actions {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
  }

  .yaml-actions-left {
    display: flex;
    gap: 8px;
  }

  .yaml-error {
    color: var(--error-text);
    font-size: 12px;
    margin-top: 4px;
  }
</style>

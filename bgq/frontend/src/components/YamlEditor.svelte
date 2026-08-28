<script>
  import {
    getFiltersForAPI,
    applyFiltersFromAPI,
    outputColumns,
    sortRules,
    resultLimit,
    queryTarget,
    subjectRootLogic,
    personRootLogic,
    characterRootLogic,
    episodeRootLogic,
  } from "../stores.js";
  import { filtersToYAML, parseYAML, validateConfig } from "../yaml.js";
  import { get } from "svelte/store";
  import { MorphIcon } from "morphicons/svelte";
  import { ChevronDown } from "lucide";

  let expanded = $state(false);
  let yamlText = $state("");
  let error = $state("");
  // Dirty = the user has hand-edited the text; pause auto-sync so drafts
  // survive unrelated filter changes. Cleared by both button actions.
  let dirty = $state(false);
  // Snapshot taken right before 应用, enabling 撤销.
  let undoState = $state(null);

  const INDENT = "  ";

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
    if (data.target) queryTarget.set(data.target);
    if (data.filters?.length > 0) applyFiltersFromAPI(data.filters);
    if (data.output?.columns) outputColumns.set(data.output.columns.join(","));
    if (data.sort) sortRules.set(data.sort);
    if (data.limit) resultLimit.set(data.limit);
    document.getElementById("btn-run")?.focus();
  }

  function handleUndo() {
    if (!undoState) return;
    const u = undoState;
    undoState = null;
    error = "";
    dirty = false;
    queryTarget.set(u.target);
    // Unconditional: u.filters may be [] (pre-apply state was empty).
    applyFiltersFromAPI(u.filters);
    outputColumns.set(u.columns);
    sortRules.set(u.sort);
    resultLimit.set(u.limit);
  }

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
    else if (e.key === "Tab") onTab(e);
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

  function onTab(e) {
    e.preventDefault();
    const el = e.currentTarget;
    const v = el.value;
    let s = el.selectionStart;
    let t = el.selectionEnd;
    if (s > t) [s, t] = [t, s];
    if (e.shiftKey) return dedentSelection(el, v, s, t);
    if (v.slice(s, t).includes("\n")) return indentSelection(el, v, s, t);
    return replaceRange(el, s, t, INDENT);
  }

  function indentSelection(el, v, s, t) {
    const ls = v.lastIndexOf("\n", s - 1) + 1;
    let le = v.indexOf("\n", t);
    if (le === -1) le = v.length;
    const out = v
      .slice(ls, le)
      .split("\n")
      .map((l) => (l.length ? INDENT + l : l))
      .join("\n");
    replaceRange(el, ls, le, out, ls, ls + out.length);
  }

  function dedentSelection(el, v, s, t) {
    const ls = v.lastIndexOf("\n", s - 1) + 1;
    let le = v.indexOf("\n", t);
    if (le === -1) le = v.length;
    const lines = v.slice(ls, le).split("\n");
    const cuts = lines.map((line) =>
      Math.min(INDENT.length, /^[ \t]*/.exec(line)[0].length),
    );
    if (cuts.every((c) => c === 0)) return;
    const out = lines.map((line, i) => line.slice(cuts[i])).join("\n");
    const map = (pos) => {
      let lineStart = ls;
      let removed = 0;
      for (let i = 0; i < lines.length; i++) {
        const lineEnd = lineStart + lines[i].length;
        if (pos <= lineEnd) {
          removed += Math.min(cuts[i], pos - lineStart);
          return pos - removed;
        }
        removed += cuts[i];
        lineStart = lineEnd + 1;
      }
      return pos - removed;
    };
    replaceRange(el, ls, le, out, map(s), map(t));
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

  // Auto-sync YAML from live filter/output state. Every store is read
  // reactively (all four roots, since $-references below select one by
  // target) so the textarea tracks the current configuration without any
  // button press. Skipped while hidden or while the user has a pending
  // hand-edited draft.
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
    <span class="yaml-chevron" class:open={expanded}>
      <MorphIcon icon={ChevronDown} size={12} />
    </span>
  </div>
  {#if expanded}
    <textarea
      class="yaml-editor"
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
        <button class="btn btn-primary btn-sm" onclick={handleApply}
          >应用</button
        >
        {#if undoState}
          <button class="btn btn-default btn-sm" onclick={handleUndo}
            >撤销</button
          >
        {/if}
      </div>
      <button class="btn btn-default btn-sm" onclick={syncFromFilters}
        >同步当前配置</button
      >
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
    font-size: 11px;
    color: var(--text-secondary);
    transition: transform 0.2s ease;
  }

  .yaml-chevron.open {
    transform: rotate(180deg);
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
    background: var(--bg-alt);
    color: var(--text);
    line-height: 1.6;
    tab-size: 2;
  }

  .yaml-editor:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgb(240 145 153 / 15%);
    background: var(--white);
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

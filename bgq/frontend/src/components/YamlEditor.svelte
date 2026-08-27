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
  import { filtersToYAML, parseYAML } from "../yaml.js";
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

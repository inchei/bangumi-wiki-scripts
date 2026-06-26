<script>
  import {
    getFiltersForAPI,
    applyFiltersFromAPI,
    logicVersion,
    outputColumns,
    sortRules,
    resultLimit,
  } from "../stores.js";
  import { filtersToYAML, parseYAML } from "../yaml.js";
  import { get } from "svelte/store";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

  let expanded = $state(false);
  let yamlText = $state("");
  let error = $state("");

  // Subscribe to logicVersion so we re-sync when filters change
  const _ver = $derived($logicVersion); // eslint-disable-line no-unused-vars

  function syncFromFilters() {
    error = "";
    const cols = get(outputColumns) || "";
    const limit = get(resultLimit) || 0;
    try {
      yamlText = filtersToYAML(getFiltersForAPI(), cols, limit, get(sortRules));
    } catch (e) {
      error = "导出失败: " + e.message;
    }
  }

  function handleApply() {
    if (!yamlText.trim()) {
      alert("YAML 内容为空");
      return;
    }
    error = "";
    try {
      const data = parseYAML(yamlText);
      if (data.filters?.length > 0) applyFiltersFromAPI(data.filters);
      if (data.output?.columns)
        outputColumns.set(data.output.columns.join(","));
      if (data.sort) sortRules.set(data.sort);
      if (data.limit) resultLimit.set(data.limit);
      document.getElementById("btn-run")?.focus();
    } catch (e) {
      alert("解析失败: " + e.message);
    }
  }

  // Sync on mount
  $effect(() => {
    syncFromFilters();
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
      <FontAwesomeIcon icon={faChevronDown} />
    </span>
  </div>
  {#if expanded}
    <textarea
      class="yaml-editor"
      bind:value={yamlText}
      placeholder="在此编辑 YAML 配置..."></textarea>
    {#if error}
      <div class="yaml-error">{error}</div>
    {/if}
    <div class="yaml-actions">
      <button class="btn btn-primary btn-sm" onclick={handleApply}
        >应用 YAML</button
      >
      <button class="btn btn-default btn-sm" onclick={syncFromFilters}
        >从筛选器同步</button
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
    gap: 8px;
  }

  .yaml-error {
    color: var(--error-text);
    font-size: 12px;
    margin-top: 4px;
  }
</style>

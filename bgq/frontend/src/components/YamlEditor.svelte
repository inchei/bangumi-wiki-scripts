<script>
  import {
    getFiltersForAPI,
    applyFiltersFromAPI,
    logicVersion,
  } from "../stores.js";
  import { loadSchemaOptions } from "../api.js";
  import { filtersToYAML, parseYAML } from "../yaml.js";

  let yamlText = $state("");
  let error = $state("");

  // Subscribe to logicVersion so we re-sync when filters change
  const _ver = $derived($logicVersion); // eslint-disable-line no-unused-vars

  function syncFromFilters() {
    error = "";
    const cols = document.getElementById("outputColumns")?.value || "";
    const limit = parseInt(document.getElementById("resultLimit")?.value) || 0;
    try {
      yamlText = filtersToYAML(getFiltersForAPI(), cols, limit);
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
        document.getElementById("outputColumns").value =
          data.output.columns.join(",");
      if (data.limit) document.getElementById("resultLimit").value = data.limit;
      loadSchemaOptions();
    } catch (e) {
      alert("解析失败: " + e.message);
    }
  }

  // Sync on mount
  $effect(() => {
    syncFromFilters();
  });
</script>

<div class="card">
  <div class="card-header"><span class="dot-indicator"></span>YAML 配置</div>
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
</div>

<style>
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

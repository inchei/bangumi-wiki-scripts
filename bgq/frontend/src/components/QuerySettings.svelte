<script>
  import {
    getFiltersForAPI,
    queryTarget,
    lastResult,
    queryLoading,
    outputColumns,
    ctxFields,
    CTX_SUBJECT,
    CTX_PERSON,
    CTX_CHARACTER,
    EPISODE_FIELDS,
  } from "../stores.js";
  import { positionsByType } from "../schema-data.js";
  import { runQuery } from "../api.js";
  import { get } from "svelte/store";
  import AwesompleteInput from "./AwesompleteInput.svelte";

  let loading = $state(false);
  let limitValue = $state("500");

  const STAFF_POSITIONS = positionsByType(0);

  const TARGET_COLUMNS = {
    subject: [...ctxFields(CTX_SUBJECT), ...STAFF_POSITIONS],
    person: ctxFields(CTX_PERSON),
    character: ctxFields(CTX_CHARACTER),
    episode: EPISODE_FIELDS,
  };

  let target = $derived($queryTarget);
  let suggestions = $derived(TARGET_COLUMNS[target] || TARGET_COLUMNS.subject);

  async function handleRun() {
    loading = true;
    queryLoading.set(true);
    lastResult.set(null);
    const cols =
      $outputColumns
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];
    const limit = parseInt(limitValue) || 500;
    try {
      const data = await runQuery(
        getFiltersForAPI(),
        cols,
        get(queryTarget),
        limit,
      );
      lastResult.set(data);
    } catch (e) {
      lastResult.set({ error: e.message });
    } finally {
      loading = false;
      queryLoading.set(false);
    }
  }
</script>

<div class="card">
  <div class="card-header"><span class="dot-indicator"></span>输出设置</div>
  <div class="form-group">
    <label class="form-label" for="outputColumns">输出列（逗号分隔）</label>
    <AwesompleteInput
      value={$outputColumns}
      {suggestions}
      onchange={(v) => outputColumns.set(v)}
      placeholder="id/name/infobox字段名/..."
      multiple={true}
      separator=","
    />
  </div>
  <div class="form-group">
    <label class="form-label" for="resultLimit">结果数量上限</label>
    <input
      class="input"
      id="resultLimit"
      bind:value={limitValue}
      type="number"
      min="1"
      max="10000"
      style="width:120px"
    />
  </div>
  <button
    class="btn btn-primary btn-block"
    onclick={handleRun}
    disabled={loading}
    style="height:42px;font-size:15px"
  >
    {loading ? "查询中..." : "▶ 执行查询"}
  </button>
</div>

<style>
  :global(.form-group .awesomplete) {
    display: block !important;
    width: 100%;
  }
</style>

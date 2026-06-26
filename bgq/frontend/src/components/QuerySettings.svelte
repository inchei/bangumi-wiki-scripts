<script>
  import { tick } from "svelte";
  import {
    getFiltersForAPI,
    queryTarget,
    lastResult,
    queryLoading,
    outputColumns,
    sortRules,
    sortState,
    resultLimit,
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
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import {
    faArrowDownWideShort,
    faArrowDownShortWide,
    faMagnifyingGlass,
  } from "@fortawesome/free-solid-svg-icons";

  let loading = $state(false);

  const STAFF_POSITIONS = positionsByType(0);

  const TARGET_COLUMNS = {
    subject: [...ctxFields(CTX_SUBJECT), ...STAFF_POSITIONS],
    person: ctxFields(CTX_PERSON),
    character: ctxFields(CTX_CHARACTER),
    episode: EPISODE_FIELDS,
  };

  let target = $derived($queryTarget);
  let suggestions = $derived(TARGET_COLUMNS[target] || TARGET_COLUMNS.subject);

  async function addSortRule() {
    sortRules.update((rules) => [...rules, { field: "", direction: "asc" }]);
    await tick();
    const rows = document.querySelectorAll(".sort-row");
    const last = rows[rows.length - 1];
    last?.querySelector("input")?.focus();
  }

  function removeSortRule(idx) {
    sortRules.update((rules) => rules.filter((_, i) => i !== idx));
  }

  function updateSortField(idx, field) {
    sortRules.update((rules) => {
      const next = [...rules];
      next[idx] = { ...next[idx], field };
      return next;
    });
  }

  function toggleSortDirection(idx) {
    sortRules.update((rules) => {
      const next = [...rules];
      next[idx] = {
        ...next[idx],
        direction: next[idx].direction === "asc" ? "desc" : "asc",
      };
      return next;
    });
  }

  async function handleRun() {
    loading = true;
    queryLoading.set(true);
    lastResult.set(null);
    const cols =
      $outputColumns
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];
    const limit = parseInt($resultLimit) || 500;
    const sort = $sortRules.filter((r) => r.field);
    try {
      const data = await runQuery(
        getFiltersForAPI(),
        cols,
        get(queryTarget),
        limit,
        sort.length > 0 ? sort : undefined,
      );
      lastResult.set(data);
      // Sync sort state to match the first sort rule if its field is in the result columns
      if (sort.length > 0 && data?.columns) {
        const colIdx = data.columns.indexOf(sort[0].field);
        if (colIdx >= 0) {
          sortState.set({ col: colIdx, asc: sort[0].direction === "asc" });
        }
      }
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
      oninput={(v) => outputColumns.set(v)}
      placeholder="id/name/infobox字段名/..."
      multiple={true}
      separator=","
    />
  </div>
  <div class="form-group">
    <span class="form-label">排序</span>
    {#each $sortRules as rule, i (i)}
      <div class="sort-row">
        <div style="flex:1">
          <AwesompleteInput
            value={rule.field}
            {suggestions}
            onchange={(v) => updateSortField(i, v)}
            oninput={(v) => updateSortField(i, v)}
            placeholder="字段名"
          />
        </div>
        <button
          class="btn btn-sm btn-default"
          onclick={() => toggleSortDirection(i)}
        >
          {#if rule.direction === "asc"}
            <FontAwesomeIcon icon={faArrowDownShortWide} />
          {:else}
            <FontAwesomeIcon icon={faArrowDownWideShort} />
          {/if}
          {rule.direction === "asc" ? "升序" : "降序"}
        </button>
        <button
          class="tag-remove"
          onclick={() => removeSortRule(i)}
          title="删除"
        >
          &times;
        </button>
      </div>
    {/each}
    <button class="btn btn-outline btn-xs" onclick={addSortRule}>+ 排序</button>
  </div>
  <div class="form-group">
    <label class="form-label" for="resultLimit">结果数量上限</label>
    <input
      class="input"
      id="resultLimit"
      bind:value={$resultLimit}
      type="number"
      min="1"
      max="10000"
      style="width:120px"
    />
  </div>
  <button
    id="btn-run"
    class="btn btn-primary btn-block"
    onclick={handleRun}
    disabled={loading}
    style="height:42px;font-size:15px"
  >
    {#if loading}
      查询中...
    {:else}
      <FontAwesomeIcon icon={faMagnifyingGlass} /> 执行查询
    {/if}
  </button>
</div>

<style>
  .sort-row {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-bottom: 6px;
  }
</style>

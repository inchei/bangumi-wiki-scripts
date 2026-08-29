<script>
  import { tick } from "svelte";
  import {
    getFiltersForAPI,
    queryTarget,
    lastResult,
    lastQueryTarget,
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
  import { positionsByType, PERSON_CHAR_TYPES } from "../schema-data.js";
  import { runQuery } from "../api.js";
  import { get } from "svelte/store";
  import AwesompleteInput from "./AwesompleteInput.svelte";
  import { MorphIcon } from "morphicons/svelte";
  import { ArrowDownWideNarrow, ArrowDownNarrowWide, Search } from "lucide";

  let loading = $state(false);

  const STAFF_POSITIONS = positionsByType(0);

  const TARGET_COLUMNS = {
    subject: [...ctxFields(CTX_SUBJECT), ...STAFF_POSITIONS],
    person: [
      ...ctxFields(CTX_PERSON),
      ...STAFF_POSITIONS,
      ...PERSON_CHAR_TYPES,
    ],
    character: [...ctxFields(CTX_CHARACTER), ...PERSON_CHAR_TYPES],
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
    const filters = getFiltersForAPI();
    if (filters.length === 0) {
      lastResult.set({ error: "请先添加筛选条件" });
      return;
    }
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
      const savedTarget = get(queryTarget);
      const data = await runQuery(
        filters,
        cols,
        savedTarget,
        limit,
        sort.length > 0 ? sort : undefined,
      );
      lastQueryTarget.set(savedTarget);
      lastResult.set(data);
      // Sync sort state to match the first sort rule if its field is in the result
      // columns (also matching group-column sub-fields like 导演.生日+ ↔
      // 导演.{name|生日|id}+).
      if (sort.length > 0 && data?.columns) {
        const f = sort[0].field;
        let colIdx = data.columns.indexOf(f);
        let field = "";
        if (colIdx < 0) {
          const m = f.match(/^(.+)\.([^.{}+]+)\+?$/);
          if (m) {
            const [, prefix, sub] = m;
            colIdx = data.columns.findIndex((c) => {
              const gm = c.match(/^(.+)\.\{([^}]+)\}(\+)?$/);
              if (!gm || gm[1] !== prefix) return false;
              return gm[2]
                .split("|")
                .map((s) => s.trim())
                .includes(sub);
            });
            if (colIdx >= 0) field = sub;
          }
        }
        if (colIdx >= 0) {
          sortState.set({
            col: colIdx,
            asc: sort[0].direction === "asc",
            field,
          });
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
          <MorphIcon
            icon={rule.direction === "asc"
              ? ArrowDownWideNarrow
              : ArrowDownNarrowWide}
            size={14}
          />
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
      <MorphIcon icon={Search} size={16} /> 执行查询
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

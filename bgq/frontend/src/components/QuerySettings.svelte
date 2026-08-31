<script>
  import { tick } from "svelte";
  import {
    queryTarget,
    lastResult,
    lastQueryTarget,
    queryLoading,
    outputColumns,
    sortRules,
    sortState,
    resultLimit,
    assocLimit,
    ctxFields,
    CTX_SUBJECT,
    CTX_PERSON,
    CTX_CHARACTER,
    EPISODE_FIELDS,
    subjectRootLogic,
    personRootLogic,
    characterRootLogic,
    episodeRootLogic,
    manualAssoc,
    assocSeeded,
    nextAssocId,
  } from "../stores.js";
  import { getFiltersForAPI } from "../logic-tree.js";
  import { positionsByType, PERSON_CHAR_TYPES } from "../schema-data.js";
  import {
    assocRowsFromFilters,
    assocPrefixesForTarget,
    parseAssocToken,
    buildAssocToken,
    makeOutputTokenLister,
    sortColumnSuggestions,
    ENTITY_FIELDS,
    ENTITY_LABELS,
    DEFAULT_ROW_FIELDS,
  } from "../columns.js";
  import { runQuery } from "../api.js";
  import { get } from "svelte/store";
  import AwesompleteInput from "./AwesompleteInput.svelte";
  import { MorphIcon } from "morphicons/svelte";
  import { ArrowDownWideNarrow, ArrowDownNarrowWide, Search } from "lucide";

  let loading = $state(false);

  const STAFF_POSITIONS = positionsByType(0);

  const TARGET_COLUMNS = {
    subject: [...ctxFields(CTX_SUBJECT), ...STAFF_POSITIONS],
    // name_cn：后端 person target 特例（name AS name_cn）
    person: [
      ...ctxFields(CTX_PERSON),
      "name_cn",
      ...STAFF_POSITIONS,
      ...PERSON_CHAR_TYPES,
    ],
    character: [...ctxFields(CTX_CHARACTER), ...PERSON_CHAR_TYPES],
    // subject_id：后端支持 episode target 输出所属条目 id。
    // 刻意不提供 infobox 原始列（整段 wiki 文本，噪声大、无筛选价值）。
    episode: [...EPISODE_FIELDS, "subject_id"],
  };

  let target = $derived($queryTarget);
  let plainColumns = $derived(TARGET_COLUMNS[target] || TARGET_COLUMNS.subject);
  let getColumnTokenList = $derived(
    makeOutputTokenLister(target, plainColumns),
  );
  let sortSuggestions = $derived(sortColumnSuggestions(target, plainColumns));

  // ---- Association output rows ----
  // Rows are manual entries (persisted), seeded once from first-level filter
  // associations. Each row's prefix is editable; field boxes and the
  // 仅首个 switch manage the corresponding token in the main input.

  let rootItems = $derived(
    (target === "person"
      ? $personRootLogic
      : target === "character"
        ? $characterRootLogic
        : target === "episode"
          ? $episodeRootLogic
          : $subjectRootLogic
    ).items,
  );

  let prefixInfoMap = $derived(
    new Map(assocPrefixesForTarget(target).map((i) => [i.prefix, i])),
  );

  let assocRows = $derived.by(() => {
    return ($manualAssoc[target] || [])
      .map(({ prefix, _id }) => {
        if (!prefix)
          return { key: `a${_id}`, _id, prefix: "", entity: null, dual: false };
        const info = prefixInfoMap.get(prefix);
        return info
          ? {
              key: `a${_id}`,
              _id,
              prefix,
              entity: info.entity,
              dual: !!info.dual,
            }
          : null;
      })
      .filter(Boolean);
  });

  let filterAssocPrefixes = $derived(
    assocRowsFromFilters(target, rootItems).map((r) => r.prefix),
  );

  // Prefixes not yet used by any row — candidates for "+ 关联"/renames.
  let addablePrefixes = $derived.by(() => {
    const have = new Set(assocRows.map((r) => r.prefix));
    return [...prefixInfoMap.keys()].filter((p) => !have.has(p));
  });

  function prefixSuggestionsFor(row) {
    const have = new Set(
      assocRows.filter((r) => r._id !== row._id).map((r) => r.prefix),
    );
    return [...prefixInfoMap.keys()].filter((p) => !have.has(p));
  }

  // Cleanup invalid rows/tokens left by IME intermediate pinyin (e.g. "d",
  // "da" for "导演"). Runs once per target.
  $effect(() => {
    const rows = $manualAssoc[target] || [];
    const validRows = rows.filter(
      (r) => !r.prefix || prefixInfoMap.has(r.prefix),
    );
    if (validRows.length !== rows.length) {
      manualAssoc.update((m) => ({ ...m, [target]: validRows }));
    }
    const tokens = splitTokens(get(outputColumns));
    const validTokens = tokens.filter((tok) => {
      if (!tok.includes(".")) return true;
      const pfx = tok.slice(0, tok.indexOf("."));
      // Keep association tokens only if prefix is known for this target
      return prefixInfoMap.has(pfx);
    });
    if (validTokens.length !== tokens.length) writeTokens(validTokens);
    const seeded = $assocSeeded[target] || [];
    const validSeeded = seeded.filter((p) => prefixInfoMap.has(p));
    if (validSeeded.length !== seeded.length) {
      assocSeeded.update((m) => ({ ...m, [target]: validSeeded }));
    }
  });

  // Seed one row per first-level filter association (once per prefix).
  // Removing the row or clearing its fields suppresses re-seeding until the
  // filter itself disappears (assocSeeded is pruned on filter removal).
  $effect(() => {
    const filters = new Set(
      filterAssocPrefixes.filter((p) => prefixInfoMap.has(p)),
    );
    const seeded = new Set($assocSeeded[target] || []);
    const rows = $manualAssoc[target] || [];
    const have = new Set(rows.map((r) => r.prefix));
    const kept = [...seeded].filter((p) => filters.has(p));
    const toMark = [];
    const toSeed = [];
    for (const p of filters) {
      if (seeded.has(p)) continue;
      toMark.push(p);
      if (!have.has(p)) toSeed.push(p);
    }
    if (kept.length !== seeded.size || toMark.length > 0) {
      assocSeeded.update((m) => ({
        ...m,
        [target]: [...new Set([...kept, ...toMark])],
      }));
    }
    if (toSeed.length > 0) {
      manualAssoc.update((m) => ({
        ...m,
        [target]: [
          ...(m[target] || []),
          ...toSeed.map((p) => ({ prefix: p, _id: nextAssocId() })),
        ],
      }));
      const tokens = splitTokens(get(outputColumns));
      let added = false;
      for (const p of toSeed) {
        if (findManagedIndex(tokens, p) >= 0) continue;
        const info = prefixInfoMap.get(p);
        const tk = buildAssocToken(
          p,
          DEFAULT_ROW_FIELDS,
          info?.dual ? DEFAULT_ROW_FIELDS : [],
          true,
        );
        if (tk) {
          tokens.push(tk);
          added = true;
        }
      }
      if (added) writeTokens(tokens);
    }
  });

  function splitTokens(str) {
    return str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function writeTokens(tokens) {
    outputColumns.set(tokens.length > 0 ? tokens.join(",") + "," : "");
  }

  // The row editor manages only group/scalar tokens ("前缀.{...}"/"前缀.f");
  // count / ~min / ~max / 前缀.s.* tokens stay manual (see columns.js).
  function findManagedIndex(tokens, prefix) {
    return tokens.findIndex((tk) => {
      const p = parseAssocToken(tk, prefix);
      return p && !p.raw;
    });
  }

  // View state per row: derived from the managed token when present. An
  // empty/cleared field input means "don't output this column" — clearing
  // every box removes the token (no checkbox needed).
  function rowState(row, colsStr) {
    const tokens = splitTokens(colsStr);
    const idx = findManagedIndex(tokens, row.prefix);
    if (idx >= 0) {
      const p = parseAssocToken(tokens[idx], row.prefix);
      return {
        fields: p.fields,
        subjectFields: p.subjectFields || [],
        firstOnly: !p.plus,
      };
    }
    return { fields: [], subjectFields: [], firstOnly: false };
  }

  let assocRowViews = $derived(
    assocRows.map((r) => ({ ...r, ...rowState(r, $outputColumns) })),
  );

  function updateRowToken(row, fields, subjectFields, firstOnly) {
    const tokens = splitTokens(get(outputColumns));
    const tk = buildAssocToken(row.prefix, fields, subjectFields, !firstOnly);
    const idx = findManagedIndex(tokens, row.prefix);
    if (idx >= 0) {
      if (tk) tokens[idx] = tk;
      else tokens.splice(idx, 1);
    } else if (tk) {
      tokens.push(tk);
    }
    writeTokens(tokens);
  }

  // Rename a row's prefix in place, carrying its token (and fields) over.
  // Clearing the prefix removes the token; picking a prefix for an empty row
  // creates a default token so the field boxes become useful immediately.
  function renameRow(row, newPrefix) {
    newPrefix = (newPrefix || "").trim();
    if (newPrefix === row.prefix) return;
    if (newPrefix) {
      if (!prefixInfoMap.has(newPrefix)) return;
      if (assocRows.some((r) => r._id !== row._id && r.prefix === newPrefix))
        return;
    }
    manualAssoc.update((m) => ({
      ...m,
      [target]: (m[target] || []).map((r) =>
        r._id === row._id ? { ...r, prefix: newPrefix } : r,
      ),
    }));
    const tokens = splitTokens(get(outputColumns));
    if (!newPrefix) {
      const idx = row.prefix ? findManagedIndex(tokens, row.prefix) : -1;
      if (idx >= 0) {
        tokens.splice(idx, 1);
        writeTokens(tokens);
      }
      return;
    }
    if (!row.prefix) {
      // Empty → prefix chosen: create default token if none exists yet.
      if (findManagedIndex(tokens, newPrefix) >= 0) return;
      const info = prefixInfoMap.get(newPrefix);
      const tk = buildAssocToken(
        newPrefix,
        DEFAULT_ROW_FIELDS,
        info?.dual ? DEFAULT_ROW_FIELDS : [],
        true,
      );
      if (tk) {
        tokens.push(tk);
        writeTokens(tokens);
      }
      return;
    }
    const idx = findManagedIndex(tokens, row.prefix);
    if (idx >= 0) {
      const p = parseAssocToken(tokens[idx], row.prefix);
      const tk =
        p && !p.raw
          ? buildAssocToken(newPrefix, p.fields, p.subjectFields || [], p.plus)
          : null;
      if (tk) tokens[idx] = tk;
      else tokens.splice(idx, 1);
      writeTokens(tokens);
    }
  }

  function removeRow(row) {
    manualAssoc.update((m) => ({
      ...m,
      [target]: (m[target] || []).filter((r) => r._id !== row._id),
    }));
    const tokens = splitTokens(get(outputColumns));
    const idx = findManagedIndex(tokens, row.prefix);
    if (idx >= 0) {
      tokens.splice(idx, 1);
      writeTokens(tokens);
    }
  }

  // "+ 关联": append an empty row — the prefix input is focused and the
  // field boxes are present immediately; picking a prefix creates the token.
  async function addManualRow() {
    if (addablePrefixes.length === 0) return;
    if (assocRows.some((r) => !r.prefix)) return;
    const newId = nextAssocId();
    manualAssoc.update((m) => ({
      ...m,
      [target]: [...(m[target] || []), { prefix: "", _id: newId }],
    }));
    await tick();
    document
      .querySelector(
        `.assoc-row[data-assoc-id="${newId}"] .assoc-prefix-box input`,
      )
      ?.focus();
  }

  function parseFieldList(v) {
    return v
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
  }

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
    const al = Math.min(100, Math.max(1, parseInt($assocLimit) || 20));
    const sort = $sortRules.filter((r) => r.field);
    try {
      const savedTarget = get(queryTarget);
      const data = await runQuery(
        filters,
        cols,
        savedTarget,
        limit,
        sort.length > 0 ? sort : undefined,
        al,
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
          // "导演.生日+" ↔ 导演.{name|生日|id}+；"CV.s.date+" 的子字段名带 s. 前缀
          const m =
            f.match(/^(.+)\.s\.([^.{}+]+)\+?$/) ||
            f.match(/^(.+)\.([^.{}+]+)\+?$/);
          if (m) {
            const prefix = m[1];
            const sub = f.includes(".s.") ? "s." + m[2] : m[2];
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
  <div class="card-header">
    <h2 class="card-title"><span class="dot-indicator"></span>输出设置</h2>
  </div>
  <div class="form-group">
    <label class="form-label" for="outputColumns">输出列（逗号分隔）</label>
    <AwesompleteInput
      id="outputColumns"
      value={$outputColumns}
      getTokenList={getColumnTokenList}
      onchange={(v) => outputColumns.set(v)}
      oninput={(v) => outputColumns.set(v)}
      placeholder="id/name/infobox字段名/..."
      multiple={true}
      separator=","
    />
  </div>
  {#if assocRowViews.length > 0 || addablePrefixes.length > 0}
    <div class="form-group">
      <span class="form-label">关联输出</span>
      {#each assocRowViews as row (row.key)}
        <div class="assoc-row" data-assoc-id={row._id}>
          <div
            class="assoc-prefix-box"
            title="切换该行输出的关联前缀；清空右侧字段即不输出该列"
          >
            <AwesompleteInput
              value={row.prefix}
              suggestions={prefixSuggestionsFor(row)}
              placeholder="关联前缀"
              onchange={(v) => renameRow(row, v)}
            />
          </div>
          {#if !row.prefix}
            <div class="assoc-fields">
              <AwesompleteInput
                value=""
                suggestions={[]}
                placeholder=""
                multiple={true}
                separator="|"
                disabled={true}
              />
            </div>
          {:else if row.dual}
            <!-- Dual boxes stacked full-width; persistent left labels tell
                 the two boxes apart even when filled. -->
            <div class="assoc-fields assoc-dual">
              <div class="assoc-field-line">
                <span class="assoc-entity">{ENTITY_LABELS[row.entity]}</span>
                <AwesompleteInput
                  value={row.fields.length ? row.fields.join("|") + "|" : ""}
                  suggestions={ENTITY_FIELDS[row.entity]}
                  placeholder="{ENTITY_LABELS[row.entity]}字段"
                  multiple={true}
                  separator="|"
                  onchange={(v) =>
                    updateRowToken(
                      row,
                      parseFieldList(v),
                      row.subjectFields,
                      row.firstOnly,
                    )}
                />
              </div>
              <div class="assoc-field-line">
                <span class="assoc-entity">{ENTITY_LABELS.subject}</span>
                <AwesompleteInput
                  value={row.subjectFields.length
                    ? row.subjectFields.join("|") + "|"
                    : ""}
                  suggestions={ENTITY_FIELDS.subject}
                  placeholder="{ENTITY_LABELS.subject}字段"
                  multiple={true}
                  separator="|"
                  onchange={(v) =>
                    updateRowToken(
                      row,
                      row.fields,
                      parseFieldList(v),
                      row.firstOnly,
                    )}
                />
              </div>
            </div>
          {:else}
            <div class="assoc-fields">
              <AwesompleteInput
                value={row.fields.length ? row.fields.join("|") + "|" : ""}
                suggestions={ENTITY_FIELDS[row.entity]}
                placeholder="{ENTITY_LABELS[row.entity]}字段"
                multiple={true}
                separator="|"
                onchange={(v) =>
                  updateRowToken(
                    row,
                    parseFieldList(v),
                    row.subjectFields,
                    row.firstOnly,
                  )}
              />
            </div>
          {/if}
          <label
            class="assoc-check"
            title={!row.prefix
              ? "请先选择关联前缀"
              : "开启后只显示首个匹配（去掉 + 聚合）"}
          >
            <input
              type="checkbox"
              checked={row.firstOnly}
              disabled={!row.prefix}
              onchange={(e) =>
                updateRowToken(
                  row,
                  row.fields,
                  row.subjectFields,
                  e.currentTarget.checked,
                )}
            />
            仅首个
          </label>
          <button
            class="tag-remove"
            title="移除该关联行"
            onclick={() => removeRow(row)}
          >
            &times;
          </button>
        </div>
      {/each}
      {#if addablePrefixes.length > 0}
        <button class="btn btn-outline btn-xs" onclick={addManualRow}>
          + 关联
        </button>
      {/if}
    </div>
  {/if}
  <div class="form-group">
    <span class="form-label">排序</span>
    {#each $sortRules as rule, i (i)}
      <div class="sort-row">
        <div style="flex:1">
          <AwesompleteInput
            value={rule.field}
            suggestions={sortSuggestions}
            maxItems={30}
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
  <div class="form-group" style="display:flex;gap:16px">
    <div>
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
    <div>
      <label class="form-label" for="assocLimit">关联列出上限</label>
      <input
        class="input"
        id="assocLimit"
        bind:value={$assocLimit}
        type="number"
        min="1"
        max="100"
        style="width:100px"
      />
    </div>
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

  .assoc-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 6px;
  }

  .assoc-prefix-box {
    flex-shrink: 0;
  }

  /* Hug the prefix text (same trick as FilterTree inputs): .input is
     width:100% globally, so override with field-sizing:content. */
  .assoc-prefix-box :global(input.input) {
    field-sizing: content;
    width: auto;
    min-width: 5em;
    font-size: 13px;
    font-weight: 500;
  }

  /* Custom checkbox: accent fill, white check mark */
  .assoc-check {
    display: flex;
    gap: 4px;
    align-items: center;
    flex-shrink: 0;
    cursor: pointer;
    font-size: 12px;
    white-space: nowrap;
  }

  .assoc-check input[type="checkbox"] {
    appearance: none;
    width: 16px;
    height: 16px;
    margin: 0;
    border: 1.5px solid var(--border);
    border-radius: 4px;
    background: var(--white);
    display: grid;
    place-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition:
      background 0.15s,
      border-color 0.15s;
  }

  .assoc-check input[type="checkbox"]:hover {
    border-color: var(--accent);
  }

  .assoc-check input[type="checkbox"]:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
  }

  .assoc-check input[type="checkbox"]:checked {
    background: var(--accent);
    border-color: var(--accent);
  }

  .assoc-check input[type="checkbox"]::before {
    content: "";
    width: 10px;
    height: 10px;
    background: #fff;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    transform: scale(0);
    transition: transform 0.12s ease-out;
  }

  .assoc-check input[type="checkbox"]:checked::before {
    transform: scale(1);
  }

  .assoc-check:has(input:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .assoc-check input[type="checkbox"]:disabled {
    background: var(--bg-alt);
    border-color: var(--border-light);
    cursor: not-allowed;
  }

  .assoc-fields {
    flex: 1;
    display: flex;
    gap: 6px;
    min-width: 0;
  }

  /* Dual (person_character/character_person) rows: the two field boxes stack
     vertically at full width, each with a persistent entity label. */
  .assoc-fields.assoc-dual {
    flex-direction: column;
    gap: 4px;
  }

  .assoc-field-line {
    display: flex;
    gap: 6px;
    align-items: center;
    min-width: 0;
  }

  .assoc-entity {
    flex-shrink: 0;
    font-size: 11px;
    line-height: 1;
    color: var(--text-secondary);
    background: var(--bg-alt);
    border: 1px solid var(--border-light);
    border-radius: 4px;
    padding: 3px 6px;
  }

  .assoc-fields :global(.aw-wrap) {
    flex: 1;
    min-width: 0;
  }
</style>

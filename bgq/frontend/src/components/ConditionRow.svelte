<script>
  import {
    removeLogicLeaf,
    updateCondition,
    queryTarget,
    updateStaffPositions,
    ctxFieldConfigs,
    fieldSelectOptions,
    opLabel,
    opInputType,
    ctxFields,
    CTX_SUBJECT,
    CTX_PERSON,
    CTX_STAFF_PERSON,
    CTX_CHARACTER,
    CTX_EPISODE,
    EPISODE_FIELD_LABELS,
    CAREER_OPTIONS,
    isPersonCtx,
  } from "../stores.js";
  import {
    relationsByType,
    positionsByType,
    META_TAGS,
    PERSON_RELATIONS,
    CHARACTER_RELATIONS,
    CHARACTER_ASSOC_TYPES,
    PERSON_CHAR_TYPES,
  } from "../schema-data.js";
  import FilterTree from "./FilterTree.svelte";
  import AwesompleteInput from "./AwesompleteInput.svelte";
  import RelationCondition from "./conditions/RelationCondition.svelte";

  /** @type {{ item: object, group: object, idx: number, ctx: string }} */
  let { item, group, idx, ctx } = $props();

  function getConditionType(item) {
    if (item.field) return "field";
    if (item.tag) return "tag";
    if (item.meta_tag) return "meta_tag";
    if (item.global) return "global";
    if (item.type) return "type";
    if (item.relation) return "relation";
    if (item.person_relation) return "person_relation";
    if (item.character_relation) return "character_relation";
    if (item.person_character) return "person_character";
    if (item.character_person) return "character_person";
    if (item.character) return "character";
    if (item.staff) return "staff";
    if (item.episode) return "episode";
    return "unknown";
  }

  const condType = $derived(getConditionType(item));
  const fc = $derived(
    condType === "field" && item.field._special
      ? ctxFieldConfigs(ctx)[item.field.field] || null
      : null,
  );
  const isEpCtx = $derived(ctx === CTX_EPISODE);
  const availOps = $derived(
    fc
      ? fc.ops
      : [
          "contains",
          "not_contains",
          "eq",
          "regex",
          "not_regex",
          "gt",
          "lt",
          "gte",
          "lte",
          "before",
          "after",
          "empty",
        ],
  );

  // Context-aware field suggestions for autocomplete
  const fieldSuggestions = $derived(ctxFields(ctx));

  // Reactive field select options
  const selectOpts = $derived(
    fc && fc.type === "select" ? fieldSelectOptions(fc) : [],
  );
</script>

<div class="cond-row">
  {#if condType === "field"}
    {#if fc}
      <span class="cond-type">{fc.label}</span>
    {:else if isEpCtx}
      <span class="cond-type"
        >{EPISODE_FIELD_LABELS[item.field.field] || item.field.field}</span
      >
    {:else}
      <span class="cond-type">字段</span>
      <AwesompleteInput
        value={item.field.field}
        suggestions={fieldSuggestions}
        onchange={(v) => updateCondition(group, idx, "field", "field", v)}
        placeholder="字段名"
      />
    {/if}

    {#if availOps.length > 1}
      <select
        class="select select-sm"
        value={item.field.operator}
        onchange={(e) =>
          updateCondition(group, idx, "field", "operator", e.target.value)}
      >
        {#each availOps as op (op)}
          <option value={op}>{opLabel(op)}</option>
        {/each}
      </select>
    {/if}

    {#if item.field.operator !== "empty"}
      {#if fc && fc.type === "select" && fc.dynamic === "platform"}
        <AwesompleteInput
          value={selectOpts.find(
            (opt) => opt[0] === String(item.field.value || ""),
          )?.[1] || ""}
          suggestions={selectOpts.map((opt) => opt[1])}
          restrict={true}
          onchange={(label) => {
            const code = selectOpts.find((opt) => opt[1] === label)?.[0] ?? "";
            updateCondition(group, idx, "field", "value", code);
          }}
          placeholder="子类型"
        />
      {:else if fc && fc.type === "select"}
        {#each selectOpts as [v, l] (v)}
          <button
            class="radio-pill"
            class:active={v === String(item.field.value)}
            onclick={() => updateCondition(group, idx, "field", "value", v)}
            >{l}</button
          >
        {/each}
      {:else if fc?.ac === "career"}
        <AwesompleteInput
          value={CAREER_OPTIONS.find(
            (opt) => opt[0] === item.field.value,
          )?.[1] || ""}
          suggestions={CAREER_OPTIONS.map((opt) => opt[1])}
          restrict={true}
          onchange={(label) => {
            const code =
              CAREER_OPTIONS.find((opt) => opt[1] === label)?.[0] ?? "";
            updateCondition(group, idx, "field", "value", code);
          }}
          placeholder="职业"
        />
      {:else}
        {@const isRef =
          typeof item.field.value === "string" &&
          item.field.value.startsWith("$")}
        <input
          class="input"
          class:input-ref={isRef}
          type={isRef
            ? "text"
            : fc
              ? fc.type || "text"
              : opInputType(item.field.operator)}
          value={item.field.value || ""}
          onchange={(e) =>
            updateCondition(group, idx, "field", "value", e.target.value)}
          placeholder={isEpCtx && item.field.field === "duration"
            ? "如: 24m / 00:23:30"
            : isRef
              ? "输入 $字段名 引用其他字段"
              : ""}
          step={fc?.step || undefined}
        />
      {/if}
    {/if}
  {:else if condType === "tag"}
    <span class="cond-type">标签</span>
    <input
      class="input"
      value={item.tag.value}
      onchange={(e) =>
        updateCondition(group, idx, "tag", "value", e.target.value)}
    />
    <select
      class="select select-sm"
      value={item.tag.negate ? "negate" : "contains"}
      onchange={(e) =>
        updateCondition(
          group,
          idx,
          "tag",
          "negate",
          e.target.value === "negate",
        )}
    >
      <option value="contains">包含</option>
      <option value="negate">排除</option>
    </select>
  {:else if condType === "meta_tag"}
    <span class="cond-type">公共标签</span>
    <AwesompleteInput
      restrict={true}
      value={item.meta_tag.value}
      suggestions={META_TAGS}
      onchange={(v) => updateCondition(group, idx, "meta_tag", "value", v)}
      placeholder="公共标签"
    />
    <select
      class="select select-sm"
      value={item.meta_tag.negate ? "negate" : "contains"}
      onchange={(e) =>
        updateCondition(
          group,
          idx,
          "meta_tag",
          "negate",
          e.target.value === "negate",
        )}
    >
      <option value="contains">包含</option>
      <option value="negate">排除</option>
    </select>
  {:else if condType === "global"}
    <span class="cond-type">全局</span>
    <select
      class="select select-sm"
      value={item.global.operator}
      onchange={(e) =>
        updateCondition(group, idx, "global", "operator", e.target.value)}
    >
      <option value="contains">包含</option>
      <option value="not_contains">不包含</option>
      <option value="not_regex">正则不符合</option>
      <option value="regex">正则</option>
    </select>
    <input
      class="input"
      value={item.global.value || ""}
      onchange={(e) =>
        updateCondition(group, idx, "global", "value", e.target.value)}
    />
  {:else if condType === "type"}
    {@const typeOpts = isPersonCtx(ctx)
      ? [
          ["", "全部"],
          ["1", "个人"],
          ["2", "公司"],
          ["3", "组合"],
        ]
      : [
          ["", "全部"],
          ["1", "书籍"],
          ["2", "动画"],
          ["3", "音乐"],
          ["4", "游戏"],
          ["6", "三次元"],
        ]}
    <span class="cond-type">分类</span>
    <select
      class="select select-sm"
      value={String(item.type.value)}
      onchange={(e) =>
        updateCondition(group, idx, "type", "value", e.target.value)}
    >
      {#each typeOpts as [v, l] (v)}
        <option value={v}>{l}</option>
      {/each}
    </select>
  {:else if condType === "relation"}
    <RelationCondition
      label="条目关系"
      typeValue={item.relation.type}
      typeSuggestions={["任意"].concat(relationsByType(0))}
      onTypeChange={(v) => updateCondition(group, idx, "relation", "type", v)}
      mode={item.relation.mode}
      onModeChange={(v) => updateCondition(group, idx, "relation", "mode", v)}
      countOp={item.relation.count_op}
      onCountOpChange={(v) =>
        updateCondition(group, idx, "relation", "count_op", v)}
      countVal={item.relation.count_val}
      onCountValChange={(v) =>
        updateCondition(group, idx, "relation", "count_val", v)}
      onDelete={() => removeLogicLeaf(group, idx)}
      logic={item.relation}
      nestedCtx={CTX_SUBJECT}
    />
  {:else if condType === "person_relation"}
    <RelationCondition
      label="人物关系"
      typeValue={item.person_relation.type}
      typeSuggestions={["任意"].concat(PERSON_RELATIONS)}
      onTypeChange={(v) =>
        updateCondition(group, idx, "person_relation", "type", v)}
      mode={item.person_relation.mode}
      onModeChange={(v) =>
        updateCondition(group, idx, "person_relation", "mode", v)}
      countOp={item.person_relation.count_op}
      onCountOpChange={(v) =>
        updateCondition(group, idx, "person_relation", "count_op", v)}
      countVal={item.person_relation.count_val}
      onCountValChange={(v) =>
        updateCondition(group, idx, "person_relation", "count_val", v)}
      onDelete={() => removeLogicLeaf(group, idx)}
      logic={item.person_relation}
      nestedCtx={CTX_PERSON}
    />
  {:else if condType === "character_relation"}
    <RelationCondition
      label="角色关系"
      typeValue={item.character_relation.type}
      typeSuggestions={["任意"].concat(CHARACTER_RELATIONS)}
      onTypeChange={(v) =>
        updateCondition(group, idx, "character_relation", "type", v)}
      mode={item.character_relation.mode}
      onModeChange={(v) =>
        updateCondition(group, idx, "character_relation", "mode", v)}
      countOp={item.character_relation.count_op}
      onCountOpChange={(v) =>
        updateCondition(group, idx, "character_relation", "count_op", v)}
      countVal={item.character_relation.count_val}
      onCountValChange={(v) =>
        updateCondition(group, idx, "character_relation", "count_val", v)}
      onDelete={() => removeLogicLeaf(group, idx)}
      logic={item.character_relation}
      nestedCtx={CTX_CHARACTER}
    />
  {:else if condType === "character"}
    <RelationCondition
      label="角色"
      typeValue={item.character.type}
      typeSuggestions={["任意"].concat(CHARACTER_ASSOC_TYPES)}
      onTypeChange={(v) => updateCondition(group, idx, "character", "type", v)}
      mode={item.character.mode}
      onModeChange={(v) => updateCondition(group, idx, "character", "mode", v)}
      countOp={item.character.count_op}
      onCountOpChange={(v) =>
        updateCondition(group, idx, "character", "count_op", v)}
      countVal={item.character.count_val}
      onCountValChange={(v) =>
        updateCondition(group, idx, "character", "count_val", v)}
      onDelete={() => removeLogicLeaf(group, idx)}
      logic={item.character}
      nestedCtx={$queryTarget === "character" ? CTX_SUBJECT : CTX_CHARACTER}
    />
  {:else if condType === "person_character" || condType === "character_person"}
    {@const ca = item[condType]}
    {@const caCfg =
      condType === "person_character"
        ? {
            label: "角色",
            condLabel: "角色条件",
            condCtx: CTX_CHARACTER,
          }
        : {
            label: "人物",
            condLabel: "人物条件",
            condCtx: CTX_PERSON,
          }}
    <div class="cond-row-inner">
      <span class="cond-type">{caCfg.label}</span>
      <AwesompleteInput
        restrict={true}
        value={ca.type || ""}
        suggestions={["任意"].concat(PERSON_CHAR_TYPES)}
        onchange={(v) => updateCondition(group, idx, condType, "type", v)}
        placeholder="出演类型"
      />
      <select
        class="select select-sm"
        value={ca.mode}
        onchange={(e) =>
          updateCondition(group, idx, condType, "mode", e.target.value)}
      >
        <option value="any">任意</option>
        <option value="all">全部</option>
        <option value="none">排除</option>
        <option value="count">数量</option>
      </select>
      {#if ca.mode === "count"}
        <select
          class="select select-sm"
          value={ca.count_op || "gte"}
          onchange={(e) =>
            updateCondition(group, idx, condType, "count_op", e.target.value)}
        >
          {#each ["gt", "gte", "lt", "lte", "eq"] as op (op)}
            <option value={op}>{opLabel(op)}</option>
          {/each}
        </select>
        <input
          class="input"
          type="number"
          value={ca.count_val || ""}
          onchange={(e) =>
            updateCondition(group, idx, condType, "count_val", e.target.value)}
        />
      {/if}
      <button
        class="tag-remove"
        onclick={() => removeLogicLeaf(group, idx)}
        title="删除">&times;</button
      >
    </div>
    {#if ca.conditions?.length > 0 && ca.conditions[0].logic}
      <div class="nested">
        <span class="cond-type">{caCfg.condLabel}</span>
        <FilterTree
          lg={ca.conditions[0].logic}
          isRoot={false}
          ctx={caCfg.condCtx}
          hideDelete={true}
        />
      </div>
    {/if}
    {#if ca.subject_conditions?.length > 0 && ca.subject_conditions[0].logic}
      <div class="nested">
        <div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">
          <span class="cond-type">相关条目</span>
          <select
            class="select select-sm"
            value={ca.subject_mode || "any"}
            onchange={(e) =>
              updateCondition(
                group,
                idx,
                condType,
                "subject_mode",
                e.target.value,
              )}
          >
            <option value="any">任意</option>
            <option value="all">全部</option>
            <option value="count">数量</option>
          </select>
          {#if (ca.subject_mode || "any") === "count"}
            <select
              class="select select-sm"
              value={ca.subject_count_op || "gte"}
              onchange={(e) =>
                updateCondition(
                  group,
                  idx,
                  condType,
                  "subject_count_op",
                  e.target.value,
                )}
            >
              {#each ["gt", "gte", "lt", "lte", "eq"] as op (op)}
                <option value={op}>{opLabel(op)}</option>
              {/each}
            </select>
            <input
              class="input"
              type="number"
              value={ca.subject_count_val || ""}
              onchange={(e) =>
                updateCondition(
                  group,
                  idx,
                  condType,
                  "subject_count_val",
                  e.target.value,
                )}
            />
          {/if}
        </div>
        <FilterTree
          lg={ca.subject_conditions[0].logic}
          isRoot={false}
          ctx={CTX_SUBJECT}
          hideDelete={true}
        />
      </div>
    {/if}
  {:else if condType === "staff"}
    {@const s = item.staff}
    {@const posText =
      s.positions?.length > 0 ? s.positions.join(",") : s.position || ""}
    <RelationCondition
      label={$queryTarget === "person" ? "关联" : "人物"}
      mode={s.mode}
      onModeChange={(v) => updateCondition(group, idx, "staff", "mode", v)}
      countOp={s.count_op}
      onCountOpChange={(v) =>
        updateCondition(group, idx, "staff", "count_op", v)}
      countVal={s.count_val}
      onCountValChange={(v) =>
        updateCondition(group, idx, "staff", "count_val", v)}
      onDelete={() => removeLogicLeaf(group, idx)}
      logic={s}
      nestedCtx={$queryTarget === "person" ? CTX_SUBJECT : CTX_STAFF_PERSON}
    >
      <AwesompleteInput
        value={posText}
        suggestions={["任意"].concat(positionsByType(0))}
        oninput={(v) => {
          const parts = v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          updateStaffPositions(group, idx, parts);
        }}
        onchange={(v) => {
          const parts = v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          updateStaffPositions(group, idx, parts);
        }}
        placeholder="职位"
        multiple={true}
        separator=","
        restrict={true}
      />
    </RelationCondition>
  {:else if condType === "episode"}
    {@const ep = item.episode}
    <div class="cond-row-inner">
      <span class="cond-type">剧集</span>
      <select
        class="select select-sm"
        value={ep.mode}
        onchange={(e) =>
          updateCondition(group, idx, "episode", "mode", e.target.value)}
      >
        <option value="any">任意</option>
        <option value="all">全部</option>
        <option value="count">数量</option>
      </select>
      {#if ep.mode === "count"}
        <select
          class="select select-sm"
          value={ep.count_op || "gte"}
          onchange={(e) =>
            updateCondition(group, idx, "episode", "count_op", e.target.value)}
        >
          {#each ["gt", "gte", "lt", "lte", "eq"] as op (op)}
            <option value={op}>{opLabel(op)}</option>
          {/each}
        </select>
        <input
          class="input"
          type="number"
          value={ep.count_val || ""}
          onchange={(e) =>
            updateCondition(group, idx, "episode", "count_val", e.target.value)}
        />
      {/if}
      <button
        class="tag-remove"
        onclick={() => removeLogicLeaf(group, idx)}
        title="删除">&times;</button
      >
    </div>
    {#if ep.logic}
      <div class="nested">
        <FilterTree
          lg={ep.logic}
          isRoot={false}
          ctx={CTX_EPISODE}
          hideDelete={true}
        />
      </div>
    {/if}
  {:else}
    <span class="cond-unknown">{JSON.stringify(item)}</span>
  {/if}

  {#if !["relation", "staff", "character", "person_relation", "character_relation", "person_character", "character_person", "episode"].includes(condType)}
    <button
      class="tag-remove"
      onclick={() => removeLogicLeaf(group, idx)}
      title="删除">&times;</button
    >
  {/if}
</div>

<style>
  .cond-row {
    display: flex;
    gap: 3px;
    align-items: center;
    flex-wrap: wrap;
    margin: 2px 0;
    width: 100%;
  }

  .cond-unknown {
    font-size: 12px;
    flex: 1;
  }

  :global(.input-ref) {
    background: var(--bg-alt);
    border-color: var(--accent);
  }
</style>

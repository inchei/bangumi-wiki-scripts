<script>
  import {
    removeLogicLeaf,
    updateCondition,
    queryTarget,
    ctxFieldConfigs,
    fieldSelectOptions,
    opLabel,
    opInputType,
    CTX_SUBJECT,
    CTX_PERSON,
    CTX_EPISODE,
    EPISODE_FIELD_LABELS,
    EPISODE_FIELD_OPS,
    schemaOptions,
    schema,
    CAREER_OPTIONS,
  } from "../stores.js";
  import FilterTree from "./FilterTree.svelte";
  import AwesompleteInput from "./AwesompleteInput.svelte";
  import RestrictedSelect from "./RestrictedSelect.svelte";

  /** @type {{ item: object, group: object, idx: number, ctx: string }} */
  let { item, group, idx, ctx } = $props();

  function getConditionType(item) {
    if (item.field) return "field";
    if (item.tag) return "tag";
    if (item.meta_tag) return "meta_tag";
    if (item.global) return "global";
    if (item.count) return "count";
    if (item.type) return "type";
    if (item.relation) return "relation";
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
  const epOps = $derived(
    condType === "field" ? EPISODE_FIELD_OPS[item.field.field] : null,
  );
  const availOps = $derived(
    fc
      ? fc.ops
      : isEpCtx && epOps
        ? epOps
        : [
            "contains",
            "not_contains",
            "eq",
            "regex",
            "gt",
            "lt",
            "gte",
            "lte",
            "before",
            "after",
            "empty",
          ],
  );

  // Reactive field select options — depends on $schema so it updates when schema loads
  const selectOpts = $derived(
    fc && fc.type === "select" ? fieldSelectOptions(fc, $schema) : [],
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
        suggestions={$schema.direct_fields || []}
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
        <RestrictedSelect
          value={String(item.field.value || "")}
          suggestions={selectOpts.map((opt) => opt[1])}
          getCode={(label) =>
            selectOpts.find((opt) => opt[1] === label)?.[0] ?? ""}
          onchange={(v) => updateCondition(group, idx, "field", "value", v)}
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
        <RestrictedSelect
          value={item.field.value || ""}
          suggestions={CAREER_OPTIONS.map((opt) => opt[1])}
          getCode={(label) =>
            CAREER_OPTIONS.find((opt) => opt[1] === label)?.[0] ?? ""}
          onchange={(v) => updateCondition(group, idx, "field", "value", v)}
          placeholder="职业"
        />
      {:else}
        <input
          class="input"
          type={fc ? fc.type || "text" : opInputType(item.field.operator)}
          value={item.field.value || ""}
          onchange={(e) =>
            updateCondition(group, idx, "field", "value", e.target.value)}
          placeholder={isEpCtx && item.field.field === "duration"
            ? "如: 24m / 00:23:30"
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
    <RestrictedSelect
      value={item.meta_tag.value}
      suggestions={$schemaOptions.meta_tags || []}
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
      <option value="regex">正则</option>
    </select>
    <input
      class="input"
      value={item.global.value || ""}
      onchange={(e) =>
        updateCondition(group, idx, "global", "value", e.target.value)}
    />
  {:else if condType === "count"}
    <span class="cond-type">数量</span>
    <RestrictedSelect
      value={item.count.what}
      suggestions={["ep"].concat($schemaOptions.relations || [])}
      onchange={(v) => updateCondition(group, idx, "count", "what", v)}
      placeholder="关联/ep"
    />
    <select
      class="select select-sm"
      value={item.count.operator}
      onchange={(e) =>
        updateCondition(group, idx, "count", "operator", e.target.value)}
    >
      {#each ["gt", "gte", "lt", "lte", "eq"] as op (op)}
        <option value={op}>{opLabel(op)}</option>
      {/each}
    </select>
    <input
      class="input"
      type="number"
      value={item.count.value || ""}
      onchange={(e) =>
        updateCondition(group, idx, "count", "value", e.target.value)}
    />
  {:else if condType === "type"}
    {@const typeOpts =
      ctx === CTX_PERSON
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
    {@const r = item.relation}
    <div class="cond-row-inner">
      <span class="cond-type">关系</span>
      <RestrictedSelect
        value={r.type}
        suggestions={["任意"].concat($schemaOptions.relations || [])}
        onchange={(v) => updateCondition(group, idx, "relation", "type", v)}
        placeholder="关系名"
      />
      <select
        class="select select-sm"
        value={r.mode}
        onchange={(e) =>
          updateCondition(group, idx, "relation", "mode", e.target.value)}
      >
        <option value="any">任意</option>
        <option value="all">全部</option>
        <option value="none">排除</option>
      </select>
      <button
        class="tag-remove"
        onclick={() => removeLogicLeaf(group, idx)}
        title="删除">&times;</button
      >
    </div>
    {#if r.conditions?.length > 0 && r.conditions[0].logic}
      <div class="nested">
        <FilterTree
          lg={r.conditions[0].logic}
          isRoot={false}
          ctx={CTX_SUBJECT}
        />
      </div>
    {/if}
  {:else if condType === "staff"}
    {@const s = item.staff}
    <div class="cond-row-inner">
      <span class="cond-type"
        >{$queryTarget === "person" ? "关联" : "人物"}</span
      >
      <RestrictedSelect
        value={s.position}
        suggestions={["任意"].concat($schemaOptions.positions || [])}
        onchange={(v) => updateCondition(group, idx, "staff", "position", v)}
        placeholder="职位名"
      />
      <select
        class="select select-sm"
        value={s.mode}
        onchange={(e) =>
          updateCondition(group, idx, "staff", "mode", e.target.value)}
      >
        <option value="any">任意</option>
        <option value="all">全部</option>
        <option value="none">排除</option>
      </select>
      <button
        class="tag-remove"
        onclick={() => removeLogicLeaf(group, idx)}
        title="删除">&times;</button
      >
    </div>
    {#if s.conditions?.length > 0 && s.conditions[0].logic}
      {@const staffCtx = $queryTarget === "person" ? CTX_SUBJECT : CTX_PERSON}
      <div class="nested">
        <FilterTree lg={s.conditions[0].logic} isRoot={false} ctx={staffCtx} />
      </div>
    {/if}
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
      </select>
      <button
        class="tag-remove"
        onclick={() => removeLogicLeaf(group, idx)}
        title="删除">&times;</button
      >
    </div>
    {#if ep.logic}
      <div class="nested">
        <FilterTree lg={ep.logic} isRoot={false} ctx={CTX_EPISODE} />
      </div>
    {/if}
  {:else}
    <span class="cond-unknown">{JSON.stringify(item)}</span>
  {/if}

  {#if condType !== "relation" && condType !== "staff" && condType !== "episode"}
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
  .cond-row-inner {
    display: flex;
    gap: 3px;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
  }
  .cond-type {
    font-size: 13px;
    color: var(--accent);
    font-weight: 600;
  }
  .cond-unknown {
    font-size: 12px;
    flex: 1;
  }
  .tag-remove {
    cursor: pointer;
    color: var(--accent);
    font-size: 18px;
    line-height: 1;
    flex-shrink: 0;
    transition: var(--transition);
    background: none;
    border: none;
    font-family: inherit;
    padding: 0;
  }
  .tag-remove:hover {
    color: var(--accent-hover);
    transform: scale(1.2);
  }
  .nested {
    margin-left: 12px;
    margin-top: 2px;
  }
  .radio-pill {
    cursor: pointer;
    font-size: 12px;
    padding: 3px 10px;
    border: 1px solid var(--border);
    border-radius: 20px;
    background: var(--white);
    color: var(--text);
    transition: var(--transition);
    user-select: none;
    display: inline-block;
    font-family: inherit;
  }
  .radio-pill:hover {
    border-color: var(--accent);
  }
  .radio-pill.active {
    background: var(--accent);
    color: var(--white);
    border-color: var(--accent);
  }
</style>

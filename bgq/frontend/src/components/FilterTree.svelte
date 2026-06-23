<script>
  import { tick } from "svelte";
  import {
    subjectRootLogic,
    personRootLogic,
    characterRootLogic,
    queryTarget,
    toggleLogicOp,
    addCondition,
    addLogicGroupTo,
    removeLogicGroup,
    ctxFieldConfigs,
    CTX_SUBJECT,
    CTX_PERSON,
    CTX_CHARACTER,
    CTX_EPISODE,
    EPISODE_FIELDS,
    EPISODE_FIELD_LABELS,
    focusRequest,
  } from "../stores.js";
  import ConditionRow from "./ConditionRow.svelte";
  import Self from "./FilterTree.svelte";

  /** @type {{ lg?: object, isRoot?: boolean, ctx?: string }} */
  let { lg = undefined, isRoot = true, ctx = CTX_SUBJECT } = $props();

  const effectiveCtx = $derived(
    isRoot
      ? $queryTarget === "person"
        ? CTX_PERSON
        : $queryTarget === "character"
          ? CTX_CHARACTER
          : CTX_SUBJECT
      : ctx,
  );
  const logic = $derived(
    lg ||
      ($queryTarget === "person"
        ? $personRootLogic
        : $queryTarget === "character"
          ? $characterRootLogic
          : $subjectRootLogic),
  );

  let containerEl;
  // Per-target state for the "add condition" dropdown
  let newTypeSelectMap = $state({
    subject: "field",
    person: "field",
    character: "field",
  });
  let newTypeSelect = $derived(newTypeSelectMap[$queryTarget] || "field");
  function setNewTypeSelect(val) {
    newTypeSelectMap[$queryTarget] = val;
  }

  $effect(() => {
    const req = $focusRequest;
    if (!req || req.groupId !== logic._id || !containerEl) return;
    tick().then(() => {
      if (req.isGroup) {
        // Nested group added — focus first focusable in the last .logic-group child
        const groups = containerEl.querySelectorAll(":scope > .logic-group");
        const lastGroup = groups[groups.length - 1];
        if (lastGroup)
          lastGroup
            .querySelector(
              'button, [href], input, select, [tabindex]:not([tabindex="-1"])',
            )
            ?.focus();
      } else {
        // Condition added — focus first input in the last .cond-row
        const rows = containerEl.querySelectorAll(":scope > .cond-row");
        const lastRow = rows[rows.length - 1];
        if (lastRow)
          lastRow
            .querySelector(
              'input, select, button.op-btn, [tabindex]:not([tabindex="-1"])',
            )
            ?.focus();
      }
      focusRequest.set(null);
    });
  });

  function getNewTypeOptions(currentCtx, qTarget) {
    const opts = [];
    if (currentCtx === CTX_EPISODE) {
      for (const f of EPISODE_FIELDS)
        opts.push({ value: "ep_" + f, label: EPISODE_FIELD_LABELS[f] });
    } else if (currentCtx === CTX_CHARACTER) {
      opts.push({ value: "field", label: "字段" });
      opts.push({ value: "global", label: "全局" });
      const cfc = ctxFieldConfigs(CTX_CHARACTER);
      for (const k in cfc) opts.push({ value: k, label: cfc[k].label });
      if (qTarget === "character") {
        opts.push({ value: "character_relation", label: "角色关系" });
        opts.push({ value: "character_person", label: "人物" });
        opts.push({ value: "character", label: "条目" });
      }
    } else if (currentCtx === CTX_PERSON) {
      opts.push({ value: "field", label: "字段" });
      opts.push({ value: "global", label: "全局" });
      const pfc = ctxFieldConfigs(CTX_PERSON);
      for (const k in pfc) opts.push({ value: k, label: pfc[k].label });
      if (qTarget === "person") {
        opts.push({ value: "person_relation", label: "人物关系" });
        opts.push({ value: "person_character", label: "角色" });
      }
      opts.push({ value: "staff", label: "关联" });
    } else {
      opts.push({ value: "field", label: "字段" });
      const fc = ctxFieldConfigs(effectiveCtx);
      for (const k in fc) opts.push({ value: k, label: fc[k].label });
      opts.push({ value: "tag", label: "标签" });
      opts.push({ value: "meta_tag", label: "公共标签" });
      opts.push({ value: "global", label: "全局" });
      if (qTarget === "subject") {
        opts.push({ value: "relation", label: "关系" });
        opts.push({ value: "character", label: "角色" });
        opts.push({ value: "episode", label: "剧集" });
      }
      opts.push({
        value: "staff",
        label: qTarget === "person" ? "关联" : "人物",
      });
    }
    return opts;
  }

  // Capture logic reference at render time for event handlers
  function handleAddCondition(lg, ctx) {
    return () => addCondition(lg, newTypeSelect, ctx);
  }
  function handleAddGroup(lg) {
    return () => addLogicGroupTo(lg);
  }
  function handleToggleOp(lg, val) {
    return () => toggleLogicOp(lg, val);
  }
</script>

<div class="logic-group" class:root={isRoot} bind:this={containerEl}>
  <div class="logic-header">
    <div class="logic-op-toggle">
      <button
        class="op-btn"
        class:active={logic.op === "and"}
        onclick={handleToggleOp(logic, "and")}>AND</button
      >
      <button
        class="op-btn"
        class:active={logic.op === "or"}
        onclick={handleToggleOp(logic, "or")}>OR</button
      >
    </div>
    {#if !isRoot}
      <button
        class="tag-remove"
        onclick={() => removeLogicGroup(logic._id)}
        title="删除此组">&times;</button
      >
    {/if}
  </div>

  {#each logic.items as item, i (item.logic?._id ?? i)}
    {#if item.logic}
      <Self
        lg={item.logic}
        isRoot={false}
        ctx={item.logic._ctx || effectiveCtx}
      />
    {:else}
      <ConditionRow {item} group={logic} idx={i} ctx={effectiveCtx} />
    {/if}
  {/each}

  <div class="add-row">
    <select
      class="select select-sm"
      value={newTypeSelect}
      onchange={(e) => setNewTypeSelect(e.target.value)}
    >
      {#each getNewTypeOptions(effectiveCtx, $queryTarget) as opt (opt.value)}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
    <button
      class="btn btn-outline btn-xs"
      onclick={handleAddCondition(logic, effectiveCtx)}>+ 添加条件</button
    >
    <button class="btn btn-outline btn-xs" onclick={handleAddGroup(logic)}
      >+ 嵌套组</button
    >
  </div>
</div>

<style>
  .logic-group {
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px;
    margin: 2px 0;
    cursor: default;
    transition: border-color 0.15s;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .logic-group.root {
    cursor: default;
  }

  .logic-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .logic-op-toggle {
    display: inline-flex;
    border: 1px solid var(--border);
    border-radius: 4px;
  }

  .op-btn {
    padding: 1px 8px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    background: var(--bg);
    color: var(--text-secondary);
    transition: all 0.15s;
    border: none;
    font-family: inherit;
  }

  .op-btn.active {
    background: var(--accent);
    color: #fff;
  }

  .tag-remove {
    cursor: pointer;
    color: var(--accent);
    font-size: 18px;
    line-height: 1;
    margin-left: auto;
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

  .add-row {
    display: flex;
    gap: 4px;
    align-items: center;
    margin-top: 4px;
    flex-wrap: wrap;
  }

  .logic-group :global(select),
  .logic-group :global(input.input) {
    field-sizing: content;
    width: auto;
    min-width: 40px;
    height: 36px;
    font-size: 13px;
    padding: 0 12px;
  }

  .logic-group :global(select) {
    padding-right: 30px !important;
  }
</style>

<script>
  import { opLabel } from "../../stores.js";
  import FilterTree from "../FilterTree.svelte";
  import AwesompleteInput from "../AwesompleteInput.svelte";

  /**
   * @type {{
   *   label: string,
   *   typeValue?: string,
   *   typeSuggestions?: string[],
   *   onTypeChange?: (v: string) => void,
   *   mode: string,
   *   onModeChange: (v: string) => void,
   *   countOp?: string,
   *   onCountOpChange?: (v: string) => void,
   *   countVal?: string,
   *   onCountValChange?: (v: string) => void,
   *   onDelete: () => void,
   *   logic?: object,
   *   nestedCtx: string,
   * }}
   */
  let {
    label,
    typeValue = undefined,
    typeSuggestions = [],
    onTypeChange = undefined,
    mode,
    onModeChange,
    countOp = "gte",
    onCountOpChange = undefined,
    countVal = "",
    onCountValChange = undefined,
    onDelete,
    logic = undefined,
    nestedCtx,
    children,
  } = $props();
</script>

<div class="cond-row-inner">
  <span class="cond-type">{label}</span>
  {#if onTypeChange}
    <AwesompleteInput
      restrict={true}
      value={typeValue || ""}
      suggestions={typeSuggestions}
      onchange={onTypeChange}
      placeholder="类型"
    />
  {/if}
  {@render children?.()}
  <select
    class="select select-sm"
    value={mode}
    onchange={(e) => onModeChange(e.target.value)}
  >
    <option value="any">任意</option>
    <option value="all">全部</option>
    <option value="none">排除</option>
    <option value="count">数量</option>
  </select>
  {#if mode === "count"}
    <select
      class="select select-sm"
      value={countOp || "gte"}
      onchange={(e) => onCountOpChange?.(e.target.value)}
    >
      {#each ["gt", "gte", "lt", "lte", "eq"] as op (op)}
        <option value={op}>{opLabel(op)}</option>
      {/each}
    </select>
    <input
      class="input"
      type="number"
      value={countVal || ""}
      onchange={(e) => onCountValChange?.(e.target.value)}
    />
  {/if}
  <button class="tag-remove" onclick={onDelete} title="删除">&times;</button>
</div>
{#if logic?.conditions?.length > 0 && logic.conditions[0].logic}
  <div class="nested">
    <FilterTree lg={logic.conditions[0].logic} isRoot={false} ctx={nestedCtx} />
  </div>
{/if}

<style>
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
  }

  .nested {
    margin-left: 12px;
    margin-top: 2px;
  }
</style>

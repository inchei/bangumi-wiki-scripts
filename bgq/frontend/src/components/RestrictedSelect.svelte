<script>
  /**
   * @type {{ value?: string, suggestions?: string[], onchange?: (v: string) => void, placeholder?: string, getCode?: (label: string) => string }}
   */
  let {
    value = "",
    suggestions = [],
    onchange = () => {},
    placeholder = "",
    getCode = undefined,
  } = $props();

  let open = $state(false);
  let filterText = $state("");
  let hoverIndex = $state(0);
  let inputEl;

  // When getCode is provided, find the display label for the current value
  const displayLabel = $derived(
    getCode
      ? suggestions.find((s) => getCode(s) === value) || value
      : value,
  );

  const filtered = $derived(
    filterText
      ? suggestions.filter((s) =>
          s.toLowerCase().includes(filterText.toLowerCase()),
        )
      : suggestions,
  );

  function handleInput(e) {
    filterText = e.target.value;
    open = true;
    hoverIndex = 0;
  }

  function handleFocus() {
    filterText = displayLabel || "";
    open = true;
  }

  function handleBlur() {
    setTimeout(() => {
      open = false;
      if (filterText && suggestions.includes(filterText)) {
        onchange(getCode ? getCode(filterText) : filterText);
      } else {
        filterText = displayLabel || "";
      }
    }, 150);
  }

  function handleKeydown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      hoverIndex = Math.min(hoverIndex + 1, filtered.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      hoverIndex = Math.max(hoverIndex - 1, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[hoverIndex]) {
        selectItem(filtered[hoverIndex]);
      }
    } else if (e.key === "Escape") {
      open = false;
      filterText = displayLabel || "";
    }
  }

  function selectItem(item) {
    onchange(getCode ? getCode(item) : item);
    filterText = item;
    open = false;
  }
</script>

<div class="rs-wrap">
  <input
    bind:this={inputEl}
    class="input"
    type="text"
    value={filterText}
    {placeholder}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    onkeydown={handleKeydown}
    role="combobox"
    aria-expanded={open}
    aria-autocomplete="list"
    aria-controls="rs-listbox"
  />
  {#if open && filtered.length > 0}
    <ul class="rs-list" role="listbox" id="rs-listbox">
      {#each filtered as item, i (item)}
        <li
          class="rs-item"
          class:hover={i === hoverIndex}
          role="option"
          aria-selected={item === displayLabel}
          onmousedown={(e) => {
            e.preventDefault();
            selectItem(item);
          }}
          onmouseover={() => (hoverIndex = i)}
          onfocus={() => (hoverIndex = i)}
        >
          {item}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .rs-wrap {
    position: relative;
  }

  .rs-list {
    position: absolute;
    left: 0;
    z-index: 100;
    min-width: 140px;
    max-height: 200px;
    overflow-y: auto;
    background: rgb(254 254 254 / 82%);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--dropdown-shadow);
    list-style: none;
    padding: 4px 0;
    margin: 2px 0 0;
    font-size: 12px;
  }

  :global([data-theme="dark"]) .rs-list {
    background: rgb(40 40 40 / 80%);
  }

  .rs-item {
    padding: 5px 10px;
    cursor: pointer;
    white-space: nowrap;
    color: var(--text);
  }

  .rs-item:hover,
  .rs-item.hover {
    background: var(--accent-light);
  }
</style>

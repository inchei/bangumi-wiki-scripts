<script>
  import { onMount } from "svelte";
  import Awesomplete from "awesomplete";

  /**
   * @type {{
   *   value?: string,
   *   suggestions?: string[],
   *   onchange?: (v: string) => void,
   *   placeholder?: string,
   *   restrict?: boolean,
   *   multiple?: boolean,
   *   separator?: string
   * }}
   */
  let {
    value = "",
    suggestions = [],
    onchange = () => {},
    placeholder = "",
    restrict = false,
    multiple = false,
    separator = ",",
  } = $props();

  let inputEl;
  let aw = $state(null);
  // eslint-disable-next-line svelte/prefer-writable-derived -- lastValidValue is also mutated in event handlers
  let lastValidValue = $state(value);
  $effect(() => {
    lastValidValue = value;
  });

  // Keep Awesomplete list in sync when suggestions prop changes
  $effect(() => {
    if (aw) {
      aw.list = suggestions;
    }
  });

  // Measure caret pixel position in <input> using canvas
  let canvas;
  function getCaretLeft() {
    if (!canvas) canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const style = getComputedStyle(inputEl);
    ctx.font = `${style.fontSize} ${style.fontFamily}`;
    const text = inputEl.value.substring(0, inputEl.selectionStart);
    const metrics = ctx.measureText(text);
    const padding = parseFloat(style.paddingLeft) || 0;
    return metrics.width + padding;
  }

  function positionDropdown() {
    const ul = inputEl.parentElement?.querySelector("ul");
    if (!ul) return;
    const left = getCaretLeft();
    ul.style.left = `${Math.max(0, left)}px`;
  }

  onMount(() => {
    if (!inputEl) return;
    const opts = {
      list: suggestions,
      minChars: 0,
      maxItems: Infinity,
      autoFirst: true,
    };
    if (multiple) {
      const sep = separator;
      const lastRe = new RegExp(`[^${sep}]*$`);
      const beforeRe = new RegExp(`^.+${sep}\\s*|`);
      opts.filter = (text, input) =>
        Awesomplete.FILTER_CONTAINS(text, input.match(lastRe)[0]);
      opts.item = (text, input) =>
        Awesomplete.ITEM(text, input.match(lastRe)[0]);
      opts.replace = (text) => {
        inputEl.value = inputEl.value.match(beforeRe)[0] + text + sep;
      };
    }
    aw = new Awesomplete(inputEl, opts);
    inputEl.addEventListener("focus", () => {
      aw.evaluate();
      positionDropdown();
    });
    inputEl.addEventListener("input", positionDropdown);
    inputEl.addEventListener("keyup", positionDropdown);
    inputEl.addEventListener("blur", () => {
      setTimeout(() => {
        if (!inputEl) return;
        if (multiple) {
          const clean = inputEl.value
            .split(separator)
            .map((s) => s.trim())
            .filter(Boolean)
            .join(separator);
          const val = clean ? clean + separator : "";
          inputEl.value = val;
          onchange(val);
          lastValidValue = val;
          return;
        }
        if (restrict) {
          const trimmed = inputEl.value.trim();
          if (trimmed && suggestions.includes(trimmed)) {
            lastValidValue = trimmed;
            onchange(trimmed);
          } else {
            inputEl.value = lastValidValue;
            onchange(lastValidValue);
          }
        } else {
          onchange(inputEl.value.trim());
        }
      }, 150);
    });
    return () => {
      aw = null;
    };
  });
</script>

<div class="aw-wrap">
  <input bind:this={inputEl} class="input aw-input" {value} {placeholder} />
</div>

<style>
  .aw-wrap :global(.awesomplete) {
    position: relative;
    display: inline-block;
  }

  .aw-input :global(~ ul) {
    position: absolute;
    left: 0;
    z-index: 100;
    min-width: 140px;
    max-height: 200px;
    overflow-y: auto;
    background: var(--dropdown-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--dropdown-shadow);
    list-style: none;
    padding: 4px 0;
    margin: 2px 0 0;
    font-size: 12px;
    transition: none;
    animation: none;
  }

  .aw-input :global(~ ul > li) {
    padding: 5px 10px;
    cursor: pointer;
    white-space: nowrap;
    color: var(--text);
    background: transparent;
    transition: none;
  }

  .aw-input :global(~ ul > li:hover) {
    background: var(--accent-light);
    color: var(--text);
  }

  .aw-input :global(~ ul > li[aria-selected="true"]) {
    background: var(--accent);
    color: #fff;
  }

  .aw-input :global(~ ul > li:hover mark) {
    background: transparent;
    color: var(--accent);
    font-weight: 600;
  }

  .aw-input :global(~ ul > li[aria-selected="true"] mark) {
    background: transparent;
    color: #fff;
    font-weight: 600;
  }

  .aw-input :global(~ ul > li mark) {
    background: transparent;
    color: var(--accent);
    font-weight: 600;
    padding: 0;
  }

  .aw-input :global(~ ul:empty) {
    display: none;
  }
</style>

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
  let lastValidValue = $state(value);

  // Keep Awesomplete list in sync when suggestions prop changes
  $effect(() => {
    if (aw) {
      aw.list = suggestions;
    }
  });

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
    });
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

<input bind:this={inputEl} class="input" {value} {placeholder} />

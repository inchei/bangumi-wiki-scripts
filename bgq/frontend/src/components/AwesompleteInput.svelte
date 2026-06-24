<script>
  import { onMount } from "svelte";
  import Awesomplete from "awesomplete";

  /**
   * @type {{
   *   value?: string,
   *   suggestions?: string[],
   *   onchange?: (v: string) => void,
   *   placeholder?: string,
   *   restrict?: boolean
   * }}
   */
  let {
    value = "",
    suggestions = [],
    onchange = () => {},
    placeholder = "",
    restrict = false,
  } = $props();

  let inputEl;
  let aw = $state(null);
  let lastValidValue = $state("");
  $effect(() => {
    lastValidValue = value;
  });

  // Keep Awesomplete list in sync when suggestions prop changes
  $effect(() => {
    if (aw) {
      aw.list = suggestions;
    }
  });

  onMount(() => {
    if (!inputEl) return;
    aw = new Awesomplete(inputEl, {
      list: suggestions,
      minChars: 0,
      maxItems: Infinity,
      autoFirst: true,
      filter(text, input) {
        return Awesomplete.FILTER_CONTAINS(
          text,
          input.match(/^\s*/)[0] + input.trim(),
        );
      },
    });
    inputEl.addEventListener("focus", () => {
      aw.evaluate();
    });
    inputEl.addEventListener("awesomplete-selectcomplete", (e) => {
      lastValidValue = e.text.value;
      onchange(e.text.value);
    });
    inputEl.addEventListener("blur", () => {
      setTimeout(() => {
        aw?.close();
        if (!inputEl) return;
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

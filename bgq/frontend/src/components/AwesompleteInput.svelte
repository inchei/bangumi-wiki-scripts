<script>
  import { onMount } from "svelte";

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
  let aw;
  let lastValidValue = value;

  onMount(() => {
    if (typeof Awesomplete === "undefined" || !inputEl) return;
    aw = new Awesomplete(inputEl, {
      list: suggestions,
      minChars: 0,
      maxItems: 20,
      autoFirst: true,
      filter(text, input) {
        return Awesomplete.FILTER_CONTAINS(
          text,
          input.match(/^\s*/)[0] + input.trim(),
        );
      },
    });
    inputEl.addEventListener("focus", () => {
      aw.list = suggestions;
      aw.evaluate();
      if (inputEl.value.trim() === "" && suggestions.length) {
        aw.ul.innerHTML = "";
        for (const s of suggestions) {
          const li = document.createElement("li");
          li.textContent = s;
          aw.ul.appendChild(li);
        }
        aw.open();
      }
    });
    inputEl.addEventListener("awesomplete-selectcomplete", (e) => {
      lastValidValue = e.text.value;
      onchange(e.text.value);
    });
    inputEl.addEventListener("blur", () => {
      setTimeout(() => {
        aw?.close();
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

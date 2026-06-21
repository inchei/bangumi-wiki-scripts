<script>
  import { onMount } from 'svelte';

  /** @type {{ value?: string, suggestions?: string[], onchange?: (v: string) => void, placeholder?: string }} */
  let { value = '', suggestions = [], onchange = () => {}, placeholder = '' } = $props();

  let inputEl;
  let aw;

  onMount(() => {
    if (typeof Awesomplete === 'undefined' || !inputEl) return;
    aw = new Awesomplete(inputEl, {
      list: suggestions,
      minChars: 0,
      maxItems: 20,
      autoFirst: true,
      filter(text, input) {
        return Awesomplete.FILTER_CONTAINS(text, input.match(/^\s*/)[0] + input.trim());
      },
    });
    inputEl.addEventListener('focus', () => {
      aw.list = suggestions; // re-read current prop value
      aw.evaluate();
      if (inputEl.value.trim() === '' && suggestions.length) {
        aw.ul.innerHTML = '';
        for (const s of suggestions) {
          const li = document.createElement('li');
          li.textContent = s;
          aw.ul.appendChild(li);
        }
        aw.open();
      }
    });
    inputEl.addEventListener('blur', () => setTimeout(() => aw?.close(), 150));
    return () => { aw = null; };
  });

  function handleChange(e) {
    onchange(e.target.value.trim());
  }
</script>

<input
  bind:this={inputEl}
  class="input"
  {value}
  {placeholder}
  onchange={handleChange}
/>

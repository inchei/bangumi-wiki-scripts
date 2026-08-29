<script>
  import { MorphIcon } from "morphicons/svelte";
  import { Check } from "lucide";

  // A toolbar button that runs an async `action` and shows transient feedback
  // on the button itself. On success the icon morphs from `icon` to
  // `successIcon` and the label shows `successText`; on error an alert is
  // shown instead of changing the button (prevents long error text from
  // causing layout jitter). Reverts after 2s.
  //
  // `action` must return a Promise resolving to:
  //   "" (or falsy)    → success → shows `successText` + successIcon morph
  //   non-empty string → error   → alert(message)
  //
  // `icon` and `successIcon` are Lucide icon *data* (IconNode), not components.
  // Width is pinned to the longest of `text` / `successText` via a hidden
  // sizer grid layer, so label swapping never changes the button size.

  let {
    icon,
    text,
    action,
    successText = "复制成功",
    successIcon = Check,
    spring = "snappy",
    size = 16,
    title = "",
    variant = "default",
    disabled = false,
  } = $props();

  let active = $state(false);
  let timer = null;
  let sizerText = $derived(
    text.length >= successText.length ? text : successText,
  );
  let label = $derived(active ? successText : text);

  function reset() {
    active = false;
  }

  async function runAction() {
    try {
      return (await action()) || "";
    } catch (e) {
      const msg =
        e instanceof Error && e.message ? e.message : e ? String(e) : "";
      if (msg && msg !== "Error") return msg;
      if (e?.name) return `${e.name}${msg ? `: ${msg}` : ""}`;
      return "操作失败";
    }
  }

  async function handleClick() {
    const feedback = await runAction();
    if (feedback) {
      alert(feedback);
      return;
    }
    active = true;
    clearTimeout(timer);
    timer = setTimeout(reset, 2000);
  }
</script>

<button
  class="btn {variant === 'outline'
    ? 'btn-outline'
    : 'btn-default'} btn-sm action-btn"
  onclick={handleClick}
  {disabled}
  {title}
>
  <!-- Hidden sizer pins width to longest text, preventing jitter on swap -->
  <span class="action-btn-sizer" aria-hidden="true">
    <MorphIcon {icon} {spring} {size} />
    {sizerText}
  </span>
  <span class="action-btn-content">
    <MorphIcon icon={active ? successIcon : icon} {spring} {size} />
    {label}
  </span>
</button>

<style>
  .action-btn {
    display: inline-grid;
    place-items: center start;
  }

  .action-btn-sizer,
  .action-btn-content {
    grid-area: 1 / 1;
  }

  .action-btn-sizer {
    visibility: hidden;
    pointer-events: none;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .action-btn-content {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
</style>

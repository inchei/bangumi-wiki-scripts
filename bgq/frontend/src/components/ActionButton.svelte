<script>
  import { MorphIcon } from "morphicons/svelte";
  import { Check } from "lucide";

  // A toolbar button that runs an async `action` and shows transient feedback
  // on the button itself. On success the icon morphs from `icon` to
  // `successIcon` (via morphicons) and the label shows `successText`; on error
  // the label shows the message with error styling. Reverts after 2s.
  //
  // `action` must return a Promise resolving to:
  //   "" (or falsy)          → success → shows `successText` + successIcon morph
  //   non-empty string       → error   → shows that message with error styling
  //
  // `icon` and `successIcon` are Lucide icon *data* (IconNode), not components.

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

  let label = $state(text);
  let active = $state(false);
  let isError = $state(false);
  let timer = null;

  function reset() {
    label = text;
    active = false;
    isError = false;
  }

  async function runAction() {
    try {
      return (await action()) || "";
    } catch {
      return "操作失败";
    }
  }

  async function handleClick() {
    const feedback = await runAction();
    label = feedback || successText;
    active = true;
    isError = !!feedback;
    clearTimeout(timer);
    timer = setTimeout(reset, 2000);
  }
</script>

<button
  class="btn {variant === 'outline' ? 'btn-outline' : 'btn-default'} btn-sm"
  class:action-error={isError}
  onclick={handleClick}
  {disabled}
  {title}
>
  <MorphIcon icon={active && !isError ? successIcon : icon} {spring} {size} />
  {label}
</button>

<style>
  .action-error {
    color: var(--error-text);
    border-color: var(--error-border);
  }
</style>

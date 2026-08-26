<script>
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { faCheck } from "@fortawesome/free-solid-svg-icons";

  // A toolbar button that runs an async `action` and shows transient feedback
  // on the button itself (text + icon swap + optional error styling), reverting
  // to the default label after 2s — unifying the copy/share button behavior.
  //
  // `action` must return a Promise resolving to:
  //   "" (or falsy)          → success → shows `successText`
  //   non-empty string       → error   → shows that message with error styling

  let {
    icon,
    text,
    action,
    successText = "复制成功",
    successIcon = faCheck,
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
  {#key active && !isError ? successIcon : icon}
    <FontAwesomeIcon icon={active && !isError ? successIcon : icon} />
  {/key}
  {label}
</button>

<style>
  .action-error {
    color: var(--error-text);
    border-color: var(--error-border);
  }
</style>

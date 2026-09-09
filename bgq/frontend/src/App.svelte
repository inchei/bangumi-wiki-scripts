<script>
  import { onMount, tick } from "svelte";
  import { MorphIcon } from "morphicons/svelte";
  import { Sun, Moon, Book, User, Drama, Film } from "lucide";
  import {
    queryTarget,
    clearFilters,
    clearOutputSettings,
    captureClearSnapshot,
    restoreClearSnapshot,
    clearClearSnapshot,
    saveTargetSettings,
    restoreTargetSettings,
    subjectRootLogic,
    personRootLogic,
    characterRootLogic,
    episodeRootLogic,
    outputColumns,
    sortRules,
    resultLimit,
    manualAssoc,
    assocSeeded,
    sortState,
  } from "./stores.js";
  import { decodeShareState, applyShareState, SHARE_PARAM } from "./share.js";
  import FilterTree from "./components/FilterTree.svelte";
  import ResultTable from "./components/ResultTable.svelte";
  import YamlEditor from "./components/YamlEditor.svelte";
  import QuerySettings from "./components/QuerySettings.svelte";

  let themeMode = $state("system");

  // Sprite logo: horizontal strip, only X changes
  const spriteCols = 7;
  const col = Math.floor(Math.random() * spriteCols);
  let logoX = $state(-col * 40);
  const logoY = 0;

  function cycleLogo() {
    const currentCol = Math.round(-logoX / 40);
    const nextCol = (currentCol + 1) % spriteCols;
    logoX = -nextCol * 40;
  }

  function applyTheme(mode) {
    const isDark =
      mode === "dark" ||
      (mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function resolvedTheme() {
    return themeMode === "system" ? systemTheme() : themeMode;
  }

  function cycleTheme() {
    if (themeMode === "system") {
      // Following the system theme: toggle to the opposite of what's visible
      // and store the literal value.
      themeMode = systemTheme() === "dark" ? "light" : "dark";
      localStorage.setItem("theme", themeMode);
    } else {
      // Explicit override: toggle to the opposite. If that happens to match
      // the system default, go back to system and remove the stored value.
      const next = themeMode === "dark" ? "light" : "dark";
      if (next === systemTheme()) {
        themeMode = "system";
        localStorage.removeItem("theme");
      } else {
        themeMode = next;
        localStorage.setItem("theme", themeMode);
      }
    }
    applyTheme(themeMode);
  }

  function setTarget(t) {
    saveTargetSettings();
    queryTarget.set(t);
    restoreTargetSettings(t);
  }

  let canUndo = $state(false);
  let ignoreNextChange = false;

  function clearAll() {
    if (canUndo) {
      restoreClearSnapshot();
      canUndo = false;
      return;
    }
    captureClearSnapshot();
    ignoreNextChange = true;
    clearFilters();
    clearOutputSettings();
    canUndo = true;
    tick().then(() => {
      ignoreNextChange = false;
    });
  }

  $effect(() => {
    void $subjectRootLogic;
    void $personRootLogic;
    void $characterRootLogic;
    void $episodeRootLogic;
    void $outputColumns;
    void $sortRules;
    void $resultLimit;
    void $manualAssoc;
    void $assocSeeded;
    void $sortState;
    void $queryTarget;
    if (canUndo && !ignoreNextChange) {
      clearClearSnapshot();
      canUndo = false;
    }
  });

  onMount(async () => {
    // Guard against the global color transition flashing on load while the
    // saved/system theme is being applied (see html.no-transitions in
    // global.css); re-enable after the initial paint.
    const root = document.documentElement;
    root.classList.add("no-transitions");

    // Restore theme
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      themeMode = saved;
    }
    applyTheme(themeMode);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("no-transitions");
      });
    });

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (themeMode === "system") applyTheme("system");
      });

    // Restore query from share link (?q=<payload>)
    const payload = new URLSearchParams(window.location.search).get(
      SHARE_PARAM,
    );
    if (payload) {
      try {
        const state = await decodeShareState(payload);
        applyShareState(state);
      } catch {
        // Ignore invalid/corrupt share links; keep current state.
      }
    }
  });
</script>

<!-- Header -->
<header class="header">
  <div class="header-logo">
    <div
      class="logo-sprite"
      style="background-position: {logoX}px {logoY}px"
      onclick={cycleLogo}
    ></div>
    <h1 class="app-name">Bangumi Query</h1>
  </div>
  <span class="spacer"></span>
  <a
    class="btn btn-default"
    href="https://github.com/inchei/bangumi-wiki-scripts/tree/main/bgq"
    target="_blank"
    rel="noopener"
    title="GitHub"
  >
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      style="transform: translateY(1px)"
      ><path
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
      /></svg
    >
  </a>
  <button
    class="btn btn-default"
    onclick={cycleTheme}
    title="主题: {resolvedTheme() === 'dark' ? '深色' : '浅色'}"
  >
    <MorphIcon icon={resolvedTheme() === "light" ? Sun : Moon} size={16} />
  </button>
</header>

<!-- Main Container -->
<main class="container">
  <!-- Left Panel -->
  <div class="panel panel-left">
    <div class="target-toggle-bar">
      <div class="target-toggle">
        <button
          class="radio-pill"
          class:active={$queryTarget === "subject"}
          onclick={() => setTarget("subject")}
          ><MorphIcon icon={Book} size={14} /> 条目</button
        >
        <button
          class="radio-pill"
          class:active={$queryTarget === "person"}
          onclick={() => setTarget("person")}
          ><MorphIcon icon={User} size={14} /> 人物</button
        >
        <button
          class="radio-pill"
          class:active={$queryTarget === "character"}
          onclick={() => setTarget("character")}
          ><MorphIcon icon={Drama} size={14} /> 角色</button
        >
        <button
          class="radio-pill"
          class:active={$queryTarget === "episode"}
          onclick={() => setTarget("episode")}
          ><MorphIcon icon={Film} size={14} /> 剧集</button
        >
      </div>
      <button class="btn btn-outline btn-xs" onclick={clearAll}
        >{canUndo ? "撤销" : "清空"}</button
      >
    </div>
    <div class="card card-filter">
      <div class="card-header">
        <h2 class="card-title"><span class="dot-indicator"></span>筛选条件</h2>
      </div>
      <FilterTree />
    </div>

    <QuerySettings />
    <YamlEditor />
  </div>

  <!-- Right Panel -->
  <div class="panel panel-right">
    <ResultTable />
  </div>
</main>

<style>
  /* ===== Header ===== */
  .header {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    height: var(--header-h);
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;

    .btn {
      padding: 0;
      border: none;
      font-size: 16px;
    }
  }

  .header-logo {
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    display: flex;
    align-items: center;
  }

  /* Real h1 for the app name; reset UA heading styles to inherit the
     header-logo typography above. */
  .app-name {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
  }

  .logo-sprite {
    width: 40px;
    height: 50px;
    background: url("/img/bg_musume_2x.png") no-repeat;
    background-size: 280px 75px;
    border-radius: var(--radius-xs);
  }

  @media (width <= 320px) {
    .logo-sprite {
      display: none;
    }
  }

  .spacer {
    flex: 1;
  }

  /* ===== Layout ===== */
  :global(.container) {
    display: flex;
    height: calc(100vh - var(--header-h));
  }

  :global(.panel) {
    overflow-y: auto;
  }

  :global(.panel-left) {
    width: 420px;
    min-width: 420px;
    background: var(--white);
    border-right: 1px solid var(--border);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scrollbar-gutter: stable both-edges;
  }

  :global(.panel-right) {
    flex: 1;
    background: var(--bg);
    padding: 20px 24px;

    /* ResultTable's sticky header bar compensates for this padding:
       sticky insets resolve against the scroller's content-box top, so the
       bar uses top: calc(-1 * var(--panel-pad-top)) to stick flush with the
       scrollport edge. Keep the two in sync. */
    --panel-pad-top: 20px;
  }

  .target-toggle-bar {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .target-toggle-bar .btn {
    margin-left: auto;
  }

  .target-toggle-bar :global(.target-toggle) {
    margin-bottom: 0;
  }

  :global(.target-toggle) {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
  }

  /* ===== Responsive ===== */
  @media (width <= 900px) {
    :global(.container) {
      flex-direction: column;
      height: auto;
      min-height: calc(100vh - var(--header-h));
    }

    :global(.panel-left) {
      width: 100%;
      min-width: 100%;
      max-height: none;
      overflow-y: visible;
    }

    :global(.panel-right) {
      flex: none;
      overflow-y: visible;
    }
  }
</style>

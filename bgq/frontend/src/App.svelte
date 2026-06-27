<script>
  import { onMount } from "svelte";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import {
    faBook,
    faUser,
    faMasksTheater,
    faCircleHalfStroke,
    faSun,
    faMoon,
    faFilm,
  } from "@fortawesome/free-solid-svg-icons";
  import { faGithub } from "@fortawesome/free-brands-svg-icons";
  import {
    queryTarget,
    clearFilters,
    saveTargetSettings,
    restoreTargetSettings,
  } from "./stores.js";
  import FilterTree from "./components/FilterTree.svelte";
  import ResultTable from "./components/ResultTable.svelte";
  import YamlEditor from "./components/YamlEditor.svelte";
  import QuerySettings from "./components/QuerySettings.svelte";

  const themeOrder = ["light", "dark", "system"];
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

  function cycleTheme() {
    const idx = themeOrder.indexOf(themeMode);
    themeMode = themeOrder[(idx + 1) % themeOrder.length];
    localStorage.setItem("theme", themeMode);
    applyTheme(themeMode);
  }

  function setTarget(t) {
    saveTargetSettings();
    queryTarget.set(t);
    restoreTargetSettings(t);
  }

  onMount(async () => {
    // Restore theme
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      themeMode = saved;
    }
    applyTheme(themeMode);
    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (themeMode === "system") applyTheme("system");
      });
  });
</script>

<!-- Header -->
<div class="header">
  <div class="header-logo">
    <div
      class="logo-sprite"
      style="background-position: {logoX}px {logoY}px"
      onclick={cycleLogo}
    ></div>
    <span>Bangumi Query</span>
  </div>
  <span class="spacer"></span>
  <a
    class="btn btn-default"
    href="https://github.com/inchei/bangumi-wiki-scripts/tree/main/bgq"
    target="_blank"
    rel="noopener"
    title="GitHub"
  >
    <FontAwesomeIcon icon={faGithub} />
  </a>
  <button
    class="btn btn-default"
    onclick={cycleTheme}
    title="主题: {themeMode}"
  >
    {#if themeMode === "light"}
      <FontAwesomeIcon icon={faSun} />
    {:else if themeMode === "dark"}
      <FontAwesomeIcon icon={faMoon} />
    {:else}
      <FontAwesomeIcon icon={faCircleHalfStroke} />
    {/if}
  </button>
</div>

<!-- Main Container -->
<div class="container">
  <!-- Left Panel -->
  <div class="panel panel-left">
    <div class="card">
      <div class="card-header">
        <span class="dot-indicator"></span>筛选条件
        <span class="spacer"></span>
        <button class="btn btn-outline btn-xs" onclick={clearFilters}
          >清除全部</button
        >
      </div>
      <div class="target-toggle">
        <button
          class="radio-pill"
          class:active={$queryTarget === "subject"}
          onclick={() => setTarget("subject")}
          ><FontAwesomeIcon icon={faBook} /> 条目</button
        >
        <button
          class="radio-pill"
          class:active={$queryTarget === "person"}
          onclick={() => setTarget("person")}
          ><FontAwesomeIcon icon={faUser} /> 人物</button
        >
        <button
          class="radio-pill"
          class:active={$queryTarget === "character"}
          onclick={() => setTarget("character")}
          ><FontAwesomeIcon icon={faMasksTheater} /> 角色</button
        >
        <button
          class="radio-pill"
          class:active={$queryTarget === "episode"}
          onclick={() => setTarget("episode")}
          ><FontAwesomeIcon icon={faFilm} /> 剧集</button
        >
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
</div>

<style>
  /* ===== Header ===== */
  .header {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    height: 56px;
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
    height: calc(100vh - 56px);
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
  }

  :global(.panel-right) {
    flex: 1;
    background: var(--bg);
    padding: 20px 24px;
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
      min-height: calc(100vh - 56px);
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

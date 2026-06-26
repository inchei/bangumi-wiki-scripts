<script>
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import {
    faDownload,
    faCheck,
    faCopy,
    faInbox,
    faClipboardList,
  } from "@fortawesome/free-solid-svg-icons";
  import {
    lastResult,
    sortState,
    queryTarget,
    queryLoading,
    getFiltersForAPI,
  } from "../stores.js";
  import { exportCSV as apiExportCSV } from "../api.js";
  import { get } from "svelte/store";

  function escapeHtml(s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isIDColumn(colName) {
    const cn = colName.toLowerCase();
    return cn === "id" || cn.endsWith("_id") || cn.endsWith("id");
  }

  function bgmLink(id, colName) {
    if (id === null || id === undefined || id === "")
      return escapeHtml(String(id));
    const s = String(id);
    const cn = colName.toLowerCase();
    const target = get(queryTarget);
    let type = "subject";
    if (target === "person" || cn.includes("person")) type = "person";
    else if (target === "character" || cn.includes("character"))
      type = "character";
    else if (target === "episode" || cn.includes("episode")) type = "ep";
    return `<a href="https://bgm.tv/${type}/${s}" target="_blank" rel="noopener">${escapeHtml(s)}</a>`;
  }

  function cellClass(col) {
    if (isIDColumn(col)) return "col-id";
    if (col === "score" || col === "评分") return "col-score";
    if (col === "name" || col === "name_cn") return "col-name";
    return "";
  }

  function cellContent(col, val) {
    if (isIDColumn(col)) return bgmLink(val, col);
    if (val === null || val === undefined || val === "")
      return '<span class="cell-null">—</span>';
    return escapeHtml(String(val));
  }

  function parseSortVal(v) {
    if (v === null || v === undefined || v === "")
      return { empty: true, num: NaN, str: "" };
    const s = String(v).trim();
    return { empty: false, num: parseFloat(s), str: s.toLowerCase() };
  }

  function sortTable(colIdx) {
    const res = $lastResult;
    if (!res?.rows) return;
    const newSort = { ...$sortState };
    if (newSort.col === colIdx) newSort.asc = !newSort.asc;
    else {
      newSort.col = colIdx;
      newSort.asc = true;
    }
    sortState.set(newSort);

    const rows = [...res.rows];
    const isNumeric = rows.some((r) => {
      const p = parseSortVal(r[colIdx]);
      return !p.empty && !isNaN(p.num);
    });
    rows.sort((a, b) => {
      const pa = parseSortVal(a[colIdx]),
        pb = parseSortVal(b[colIdx]);
      if (pa.empty && pb.empty) return 0;
      if (pa.empty) return 1;
      if (pb.empty) return -1;
      const cmp =
        isNumeric && !isNaN(pa.num) && !isNaN(pb.num)
          ? pa.num - pb.num
          : pa.str.localeCompare(pb.str, "zh");
      return newSort.asc ? cmp : -cmp;
    });
    lastResult.set({ ...res, rows });
  }

  function handleExportCSV() {
    const cols =
      document
        .getElementById("outputColumns")
        ?.value.split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];
    const limit =
      parseInt(document.getElementById("resultLimit")?.value) || 500;
    apiExportCSV(getFiltersForAPI(), cols, get(queryTarget), limit);
  }

  let copiedTable = $state(false);
  let copiedError = $state(false);

  function handleCopyTable() {
    const res = $lastResult;
    if (!res?.rows) return;
    const cols = res.columns;
    let text = cols.join("\t") + "\n";
    for (const row of res.rows)
      text += row.map((v) => v ?? "").join("\t") + "\n";
    navigator.clipboard
      .writeText(text)
      .then(() => {
        copiedTable = true;
        setTimeout(() => (copiedTable = false), 2000);
      })
      .catch(() => alert("复制失败"));
  }

  function handleCopyError() {
    const text = $lastResult?.error;
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        copiedError = true;
        setTimeout(() => (copiedError = false), 2000);
      })
      .catch(() => alert("复制失败"));
  }
</script>

<div class="results-panel">
  {#if $lastResult?.error}
    <div class="error-card">
      <div class="error-header">
        <div class="error-title">查询失败</div>
        <button class="btn btn-outline btn-sm" onclick={handleCopyError}
          >{#if copiedError}<FontAwesomeIcon
              icon={faCheck}
            />{:else}<FontAwesomeIcon icon={faCopy} />{/if}
          {copiedError ? "复制成功" : "复制"}</button
        >
      </div>
      <pre>{$lastResult.error}</pre>
    </div>
  {:else if $queryLoading}
    <div class="results-loading">
      <div class="spinner"></div>
      <div>查询中...</div>
    </div>
  {:else if $lastResult?.rows}
    {@const res = $lastResult}
    <div class="results-toolbar">
      <span class="results-count"
        >共 <b>{res.total_rows}</b> 条结果<span class="time"
          >{res.duration}</span
        ></span
      >
      <span class="results-actions">
        <button class="btn btn-outline btn-sm" onclick={handleExportCSV}
          ><FontAwesomeIcon icon={faDownload} /> 下载 CSV</button
        >
        <button class="btn btn-default btn-sm" onclick={handleCopyTable}
          >{#if copiedTable}<FontAwesomeIcon
              icon={faCheck}
            />{:else}<FontAwesomeIcon icon={faCopy} />{/if}
          {copiedTable ? "复制成功" : "复制表格"}</button
        >
      </span>
    </div>
    {#if res.rows.length === 0}
      <div class="results-empty">
        <div class="icon"><FontAwesomeIcon icon={faInbox} /></div>
        <div>没有找到符合条件的条目</div>
      </div>
    {:else}
      <div class="results-table-wrap">
        <table class="results-table">
          <thead>
            <tr>
              {#each res.columns as col, i (col)}
                <th
                  class="sortable"
                  class:sort-asc={$sortState.col === i && $sortState.asc}
                  class:sort-desc={$sortState.col === i && !$sortState.asc}
                  onclick={() => sortTable(i)}
                  title={col}
                  >{col.length > 20 ? col.substring(0, 18) + "…" : col}</th
                >
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each res.rows as row, ri (ri)}
              <tr>
                <!-- eslint-disable svelte/no-at-html-tags -->
                {#each res.columns as col, i (col)}
                  <td class={cellClass(col)}
                    >{@html cellContent(col, row[i])}</td
                  >
                {/each}
                <!-- eslint-enable svelte/no-at-html-tags -->
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {:else}
    <div class="results-empty">
      <div class="icon"><FontAwesomeIcon icon={faClipboardList} /></div>
      <div>点击 <b>"执行查询"</b> 开始筛选</div>
      <div style="font-size:12px;margin-top:8px">
        或访问 <a href="/api/debug" target="_blank">/api/debug</a> 检查状态
      </div>
    </div>
  {/if}
</div>

<style>
  .results-panel {
    height: 100%;
  }

  .results-empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-placeholder);
  }

  .results-empty .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .results-loading {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-secondary);
  }

  .results-loading .spinner {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-bottom: 16px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .results-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .results-count {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .results-count b {
    color: var(--text);
    font-weight: 600;
  }

  .results-count .time {
    color: var(--text-placeholder);
    font-size: 12px;
    margin-left: 8px;
  }

  .results-actions {
    display: flex;
    gap: 6px;
  }

  .results-table-wrap {
    overflow-x: auto;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: 1px solid var(--border-light);
  }

  .results-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    background: var(--white);
  }

  .results-table th {
    background: var(--bg-alt);
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    z-index: 2;
    border-bottom: 2px solid var(--border);
    white-space: nowrap;
  }

  .results-table th.sortable {
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
  }

  .results-table th.sortable:hover {
    background: var(--accent-light);
    color: var(--text);
  }

  .results-table th.sortable::after {
    content: "⇅";
    font-size: 10px;
    margin-left: 4px;
    opacity: 0.35;
  }

  .results-table th.sort-asc::after {
    content: "▲";
    opacity: 0.7;
  }

  .results-table th.sort-desc::after {
    content: "▼";
    opacity: 0.7;
  }

  .results-table td {
    padding: 8px 14px;
    border-bottom: 1px solid var(--bg-alt);
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .results-table tbody tr {
    transition: var(--transition);
  }

  .results-table tbody tr:hover {
    background: var(--accent-light);
  }

  :global(.results-table .col-id) {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
  }

  :global(.results-table .col-id a) {
    color: var(--link);
  }

  :global(.results-table .col-id a:hover) {
    color: var(--link-hover);
    text-decoration: underline;
  }

  :global(.results-table .col-score) {
    font-weight: 600;
    color: var(--accent);
  }

  :global(.results-table .col-name) {
    font-weight: 500;
  }

  :global(.results-table .cell-null) {
    color: var(--text-placeholder);
    font-style: italic;
  }

  .error-card {
    background: var(--error-bg);
    border: 1px solid var(--error-border);
    border-radius: var(--radius);
    padding: 16px 20px;
    color: var(--error-text);
    font-size: 14px;
  }

  .error-card .error-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .error-card .error-title {
    font-weight: 600;
  }

  .error-card pre {
    background: var(--error-pre-bg);
    padding: 12px;
    border-radius: var(--radius-xs);
    font-size: 12px;
    font-family: var(--font-mono);
    overflow-x: auto;
    max-height: 200px;
  }

  @media (width <= 900px) {
    .results-table th {
      position: relative;
      top: auto;
      z-index: auto;
    }

    .results-table-wrap {
      overflow-x: auto;
      max-height: none;
    }
  }
</style>

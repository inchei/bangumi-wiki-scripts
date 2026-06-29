<script>
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import {
    faDownload,
    faCheck,
    faCopy,
    faInbox,
    faClipboardList,
    faArrowDownWideShort,
    faArrowDownShortWide,
    faSort,
  } from "@fortawesome/free-solid-svg-icons";
  import {
    lastResult,
    sortState,
    lastQueryTarget,
    queryLoading,
  } from "../stores.js";
  import { get } from "svelte/store";

  function escapeHtml(s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const idRegex = /^((person|character|episode)_)?id$/;

  function isIDColumn(colName) {
    const cn = colName.toLowerCase();
    return idRegex.test(cn);
  }

  function bgmLink(id, colName) {
    if (id === null || id === undefined || id === "")
      return escapeHtml(String(id));
    const s = String(id);
    const cn = colName.toLowerCase();
    const target = get(lastQueryTarget);
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

  const MAX_DISPLAY_LEN = 80;
  let expanded = $state({});

  function toggleExpand(ri, ci) {
    const key = ri + "_" + ci;
    expanded = { ...expanded, [key]: !expanded[key] };
  }

  function cellHtml(col, val, ri, ci) {
    if (isIDColumn(col)) return bgmLink(val, col);
    if (val === null || val === undefined || val === "")
      return '<span class="cell-null">—</span>';
    const s = String(val);
    const key = ri + "_" + ci;
    const isExpanded = expanded[key];
    const display = isExpanded ? s : s.slice(0, MAX_DISPLAY_LEN);
    const suffix = !isExpanded && s.length > MAX_DISPLAY_LEN ? "…" : "";
    return escapeHtml(display + suffix).replace(/\n/g, "<br>");
  }

  // Keep in sync with backend builder.go:
  // - extractNum() — first number from multi-value fields like "{ [121页] [128页] }"
  // - infoboxFirstDateExpr + normalizeDate — first date from "|发售日={ [2004-08-14] }"
  function parseSortVal(v) {
    if (v === null || v === undefined || v === "")
      return { empty: true, num: NaN, str: "" };
    const s = String(v).trim();
    const m = s.match(/\d[\d,.]*(?:\.\d+)?/);
    const num = m ? parseFloat(m[0].replace(/,/g, "")) : NaN;
    // Date detection: extract first YYYY-MM-DD or YYYY年M月D日
    const re = /(\d{4})[-年](\d{1,2})(?:[-月](\d{1,2}))?/;
    const dm = s.match(re);
    const ts = dm
      ? new Date(
          parseInt(dm[1]),
          parseInt(dm[2]) - 1,
          parseInt(dm[3]) || 1,
        ).getTime()
      : NaN;
    return { empty: false, num, ts, str: s.toLowerCase() };
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
    const vals = rows.map((r) => parseSortVal(r[colIdx]));
    const hasDate = vals.some((p) => !p.empty && !isNaN(p.ts));
    const hasNumeric = vals.some((p) => !p.empty && !isNaN(p.num));
    rows.sort((a, b) => {
      const pa = parseSortVal(a[colIdx]),
        pb = parseSortVal(b[colIdx]);
      if (pa.empty && pb.empty) return 0;
      if (pa.empty) return 1;
      if (pb.empty) return -1;
      let cmp;
      if (hasDate && !isNaN(pa.ts) && !isNaN(pb.ts)) cmp = pa.ts - pb.ts;
      else if (hasNumeric && !isNaN(pa.num) && !isNaN(pb.num))
        cmp = pa.num - pb.num;
      else cmp = pa.str.localeCompare(pb.str, "zh");
      return newSort.asc ? cmp : -cmp;
    });
    lastResult.set({ ...res, rows });
  }

  function csvEscape(s) {
    if (s === null || s === undefined) return "";
    const str = String(s);
    if (str.includes('"') || str.includes(",") || str.includes("\n"))
      return '"' + str.replace(/"/g, '""') + '"';
    return str;
  }

  function handleExportCSV() {
    const res = $lastResult;
    if (!res?.rows) return;
    const cols = res.columns;
    let text = cols.map(csvEscape).join(",") + "\n";
    for (const row of res.rows) text += row.map(csvEscape).join(",") + "\n";
    const blob = new Blob(["\ufeff" + text], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bangumi_results.csv";
    a.click();
  }

  let copiedTable = $state(false);
  let copiedIds = $state(false);
  let copiedError = $state(false);

  function tsvEscape(s) {
    if (s === null || s === undefined) return "";
    const str = String(s);
    if (str.includes('"') || str.includes("\t") || str.includes("\n"))
      return '"' + str.replace(/"/g, '""') + '"';
    return str;
  }

  function handleCopyTable() {
    const res = $lastResult;
    if (!res?.rows) return;
    const cols = res.columns;
    let text = cols.map(tsvEscape).join("\t") + "\n";
    for (const row of res.rows) text += row.map(tsvEscape).join("\t") + "\n";
    navigator.clipboard
      .writeText(text)
      .then(() => {
        copiedTable = true;
        setTimeout(() => (copiedTable = false), 2000);
      })
      .catch(() => alert("复制失败"));
  }

  function handleCopyIds() {
    const res = $lastResult;
    const rows = res.rows;
    if (!rows) return;
    const cols = res.columns;
    const idCol = cols.findIndex((col) => isIDColumn(col));
    if (idCol < 0) {
      alert("未找到id列");
      return;
    }
    const text = `bgm_id=${rows.map((row) => row[idCol]).join(",")}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        copiedIds = true;
        setTimeout(() => (copiedIds = false), 2000);
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
        <button class="btn btn-default btn-sm" onclick={handleCopyIds}
          >{#if copiedIds}<FontAwesomeIcon
              icon={faCheck}
            />{:else}<FontAwesomeIcon icon={faCopy} />{/if}
          {copiedIds ? "复制成功" : "复制bgm_id"}</button
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
                  aria-sort={$sortState.col === i
                    ? $sortState.asc
                      ? "ascending"
                      : "descending"
                    : "none"}
                  title={col}
                >
                  <span
                    class="sort-btn"
                    onclick={() => sortTable(i)}
                    onkeydown={(e) => e.key === "Enter" && sortTable(i)}
                    tabindex="0"
                    role="button"
                    >{col.length > 20 ? col.substring(0, 18) + "…" : col}
                    {#if $sortState.col === i && $sortState.asc}
                      <FontAwesomeIcon icon={faArrowDownShortWide} />
                    {:else if $sortState.col === i && !$sortState.asc}
                      <FontAwesomeIcon icon={faArrowDownWideShort} />
                    {:else}
                      <FontAwesomeIcon icon={faSort} class="sort-placeholder" />
                    {/if}
                  </span>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each res.rows as row, ri (ri)}
              <tr>
                <!-- eslint-disable svelte/no-at-html-tags -->
                {#each res.columns as col, i (col)}
                  {@const long =
                    row[i] && String(row[i]).length > MAX_DISPLAY_LEN}
                  <td
                    class={cellClass(col) +
                      (expanded[ri + "_" + i] ? " cell-expanded" : "") +
                      (long ? " cell-expandable" : "")}
                    onclick={long ? () => toggleExpand(ri, i) : undefined}
                    onkeydown={long
                      ? (e) => e.key === "Enter" && toggleExpand(ri, i)
                      : undefined}
                    tabindex={long ? "0" : undefined}
                    role={long ? "button" : undefined}
                    >{@html cellHtml(col, row[i], ri, i)}</td
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
    user-select: none;
    padding: 0;
  }

  .results-table th.sortable .sort-btn {
    display: block;
    padding: 10px 14px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .results-table th.sortable .sort-btn:hover {
    background: var(--accent-light);
    color: var(--text);
  }

  .results-table th :global(svg) {
    font-size: 10px;
    margin-left: 4px;
    opacity: 0.7;
  }

  .results-table th :global(.sort-placeholder) {
    font-size: 10px;
    margin-left: 4px;
    opacity: 0.35;
  }

  .results-table td {
    padding: 8px 14px;
    border-bottom: 1px solid var(--bg-alt);
    max-width: 300px;
  }

  .results-table td.cell-expandable {
    cursor: pointer;
  }

  .results-table td:focus-visible {
    outline-offset: -2px;
  }

  .results-table td.cell-expanded {
    overflow-wrap: anywhere;
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

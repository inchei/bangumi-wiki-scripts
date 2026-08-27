<script>
  import { MorphIcon } from "morphicons/svelte";
  import {
    Copy,
    Share2,
    ArrowUpDown,
    ArrowDownWideNarrow,
    ArrowDownNarrowWide,
    Download,
    Inbox,
    ClipboardList,
  } from "lucide";
  import {
    lastResult,
    sortState,
    lastQueryTarget,
    queryLoading,
  } from "../stores.js";
  import {
    positionsByType,
    PERSON_CHAR_TYPES,
    PERSON_RELATIONS,
    CHARACTER_RELATIONS,
    relationsByType,
    CHARACTER_ASSOC_TYPES,
  } from "../schema-data.js";
  import { buildShareURL } from "../share.js";
  import { get } from "svelte/store";
  import ActionButton from "./ActionButton.svelte";

  const ALL_POSITIONS = new Set(positionsByType(0));
  const ALL_RELATIONS = new Set(relationsByType(0));
  const PERSON_CHAR_SET = new Set(PERSON_CHAR_TYPES);
  const PERSON_REL_SET = new Set(PERSON_RELATIONS);
  const CHAR_REL_SET = new Set(CHARACTER_RELATIONS);
  const CHAR_ASSOC_SET = new Set(CHARACTER_ASSOC_TYPES);

  function groupIdLinkType(prefix, target) {
    const isSubjectLevel = prefix.endsWith(".s");
    const base = isSubjectLevel ? prefix.slice(0, -2) : prefix;
    if (isSubjectLevel) return "subject";
    if (target === "subject") {
      if (ALL_POSITIONS.has(base)) return "person";
      if (ALL_RELATIONS.has(base)) return "subject";
      if (CHAR_ASSOC_SET.has(base)) return "character";
    } else if (target === "person") {
      if (ALL_POSITIONS.has(base)) return "subject";
      if (PERSON_REL_SET.has(base)) return "person";
      if (PERSON_CHAR_SET.has(base)) return "character";
    } else if (target === "character") {
      if (CHAR_REL_SET.has(base)) return "character";
      if (PERSON_CHAR_SET.has(base)) return "person";
    } else if (target === "episode") {
      return "subject";
    }
    return "subject";
  }

  function groupCellIdHref(entry, field, prefix) {
    if (!isIDColumn(field)) return null;
    const v = entry[field];
    if (v === null || v === undefined || v === "") return null;
    const type = groupIdLinkType(prefix, get(lastQueryTarget));
    return `https://bgm.tv/${type}/${encodeURIComponent(String(v))}`;
  }

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
    let field = String(colName).toLowerCase();
    if (field.endsWith("+")) field = field.slice(0, -1);
    const dot = field.lastIndexOf(".");
    if (dot >= 0) field = field.slice(dot + 1);
    return idRegex.test(field);
  }

  function bgmLink(id, colName) {
    if (id === null || id === undefined || id === "")
      return escapeHtml(String(id));
    const raw = String(colName);
    const isPlus = raw.endsWith("+");
    const s = String(id);
    // Handle comma-separated list for "+" columns (e.g. 导演.id+ -> "1, 2, 3")
    if (isPlus && s.includes(",")) {
      const baseCol = raw.slice(0, -1);
      return s
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => bgmLink(p, baseCol))
        .join(", ");
    }
    const cn = raw.toLowerCase();
    const target = get(lastQueryTarget);
    // Try association-aware type for "prefix.id" columns
    const dot = cn.lastIndexOf(".");
    if (dot >= 0) {
      const prefix = raw.slice(0, dot);
      // Only use assoc logic for id fields
      let fieldPart = cn.slice(dot + 1);
      if (fieldPart.endsWith("+")) fieldPart = fieldPart.slice(0, -1);
      if (idRegex.test(fieldPart)) {
        const t = groupIdLinkType(prefix, target);
        // groupIdLinkType returns "subject" as fallback; only use it if prefix is recognized
        const base = prefix.endsWith(".s") ? prefix.slice(0, -2) : prefix;
        const lowerBase = base.toLowerCase();
        const recognized =
          ALL_POSITIONS.has(base) ||
          ALL_POSITIONS.has(lowerBase) ||
          ALL_RELATIONS.has(base) ||
          PERSON_CHAR_SET.has(base) ||
          PERSON_REL_SET.has(base) ||
          CHAR_REL_SET.has(base) ||
          CHAR_ASSOC_SET.has(base) ||
          prefix.toLowerCase().endsWith(".s");
        if (recognized) {
          return `<a href="https://bgm.tv/${t}/${encodeURIComponent(s)}" target="_blank" rel="noopener">${escapeHtml(s)}</a>`;
        }
      }
    }
    let type = "subject";
    if (target === "person" || cn.includes("person")) type = "person";
    else if (target === "character" || cn.includes("character"))
      type = "character";
    else if (target === "episode" || cn.includes("episode")) type = "ep";
    return `<a href="https://bgm.tv/${type}/${encodeURIComponent(s)}" target="_blank" rel="noopener">${escapeHtml(s)}</a>`;
  }

  function cellClass(col) {
    if (isIDColumn(col)) return "col-id";
    if (col === "score" || col === "评分") return "col-score";
    if (col === "name" || col === "name_cn") return "col-name";
    return "";
  }

  // Parse a group JSON column: "导演.{name|生日|id}+" → { prefix, fields, plus }.
  function parseGroupCol(col) {
    const m = col.match(/^(.+)\.\{([^}]+)\}(\+)?$/);
    if (!m) return null;
    return {
      prefix: m[1],
      fields: m[2]
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
      plus: !!m[3],
    };
  }

  // Expand group columns ({f1|f2|...}[+]) into one sortable column per
  // sub-field, so each displays as an independent column (e.g. 导演.生日+).
  function expandColumns(columns) {
    const out = [];
    (columns || []).forEach((col, ci) => {
      const gc = parseGroupCol(col);
      if (gc) {
        for (const f of gc.fields) {
          out.push({
            ci,
            field: f,
            prefix: gc.prefix,
            label: `${gc.prefix}.${f}${gc.plus ? "+" : ""}`,
          });
        }
      } else {
        out.push({ ci, field: "", prefix: "", label: col });
      }
    });
    return out;
  }

  let displayCols = $derived(expandColumns($lastResult?.columns));

  // Body columns merge a group's sub-field columns into one spanning cell so
  // the entries render as real aligned sub-rows (not just <br>-separated).
  function buildBodyCols(cols) {
    const out = [];
    let i = 0;
    while (i < cols.length) {
      const dc = cols[i];
      if (dc.field) {
        const span = [];
        while (i < cols.length && cols[i].field && cols[i].ci === dc.ci) {
          span.push(cols[i]);
          i++;
        }
        out.push({
          kind: "group",
          ci: dc.ci,
          prefix: span[0].prefix,
          span: span.length,
          fields: span.map((s) => s.field),
        });
      } else {
        out.push({ kind: "single", ci: dc.ci, label: dc.label });
        i++;
      }
    }
    return out;
  }

  let bodyCols = $derived(buildBodyCols(displayCols));

  // Parse a group cell's JSON into an array of entries for subgrid rendering.
  function groupEntries(val) {
    if (val === null || val === undefined || val === "") return [];
    try {
      const d = JSON.parse(val);
      return Array.isArray(d) ? d : [d];
    } catch {
      return [];
    }
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

  function sortTable(di, ci) {
    const res = $lastResult;
    if (!res?.rows) return;
    const isActive = $sortState.col === ci && $sortState.field === "";
    const newSort = {
      col: ci,
      asc: isActive ? !$sortState.asc : true,
      field: "",
    };
    sortState.set(newSort);

    const rows = [...res.rows];
    const vals = rows.map((r) => parseSortVal(r[ci]));
    const hasDate = vals.some((p) => !p.empty && !isNaN(p.ts));
    const hasNumeric = vals.some((p) => !p.empty && !isNaN(p.num));
    rows.sort((a, b) => {
      const pa = parseSortVal(a[ci]),
        pb = parseSortVal(b[ci]);
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

  function handleHeaderClick(di) {
    const dc = displayCols[di];
    if (dc.field) sortGroupField(di, dc);
    else sortTable(di, dc.ci);
  }

  // Extract a sub-field's values across a group cell's entries and pick the
  // sort key: min for asc, max for desc — mirroring the backend's "导演.生日+"
  // (min(ASC) / max(DESC)) semantics.
  function groupSortKey(entries, field, asc) {
    const vals = entries
      .map((e) => e[field])
      .filter((v) => v !== null && v !== undefined && v !== "");
    if (vals.length === 0) return { empty: true, key: 0 };
    const parsed = vals.map((v) => parseSortVal(v));
    const hasDate = parsed.some((p) => !p.empty && !isNaN(p.ts));
    const hasNumeric = parsed.some((p) => !p.empty && !isNaN(p.num));
    let best = null;
    for (const p of parsed) {
      if (p.empty) continue;
      const k =
        hasDate && !isNaN(p.ts)
          ? p.ts
          : hasNumeric && !isNaN(p.num)
            ? p.num
            : p.str;
      if (best === null || (asc ? k < best : k > best)) best = k;
    }
    return { empty: best === null, key: best };
  }

  function sortGroupField(di, dc) {
    const res = $lastResult;
    if (!res?.rows) return;
    const isActive = $sortState.col === dc.ci && $sortState.field === dc.field;
    const asc = isActive ? !$sortState.asc : true;
    sortState.set({ col: dc.ci, asc, field: dc.field });
    const rows = [...res.rows];
    rows.sort((a, b) => {
      let pa, pb;
      try {
        pa = groupSortKey(JSON.parse(a[dc.ci]), dc.field, asc);
      } catch {
        pa = { empty: true, key: 0 };
      }
      try {
        pb = groupSortKey(JSON.parse(b[dc.ci]), dc.field, asc);
      } catch {
        pb = { empty: true, key: 0 };
      }
      if (pa.empty && pb.empty) return 0;
      if (pa.empty) return 1;
      if (pb.empty) return -1;
      let cmp;
      if (typeof pa.key === "number" && typeof pb.key === "number")
        cmp = pa.key - pb.key;
      else cmp = String(pa.key).localeCompare(String(pb.key), "zh");
      return asc ? cmp : -cmp;
    });
    // Re-order the sub-rows inside each cell by the sub-field, matching the
    // backend's cell-internal ORDER BY (导演.生日+ → entries by 生日).
    const reordered = rows.map((r) => {
      let entries;
      try {
        const d = JSON.parse(r[dc.ci]);
        if (!Array.isArray(d)) return r;
        entries = d;
      } catch {
        return r;
      }
      const sorted = [...entries].sort((x, y) => {
        const px = parseSortVal(x[dc.field]);
        const py = parseSortVal(y[dc.field]);
        if (px.empty && py.empty) return 0;
        if (px.empty) return 1;
        if (py.empty) return -1;
        let cmp;
        if (!isNaN(px.ts) && !isNaN(py.ts)) cmp = px.ts - py.ts;
        else if (!isNaN(px.num) && !isNaN(py.num)) cmp = px.num - py.num;
        else cmp = px.str.localeCompare(py.str, "zh");
        return asc ? cmp : -cmp;
      });
      const next = [...r];
      next[dc.ci] = JSON.stringify(sorted);
      return next;
    });
    lastResult.set({ ...res, rows: reordered });
  }

  function sortIcon(di) {
    const dc = displayCols[di];
    const active = $sortState.col === dc.ci && $sortState.field === dc.field;
    if (active)
      return $sortState.asc ? ArrowDownWideNarrow : ArrowDownNarrowWide;
    return ArrowUpDown;
  }

  function isSortPlaceholder(di) {
    const dc = displayCols[di];
    return !($sortState.col === dc.ci && $sortState.field === dc.field);
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

  function tsvEscape(s) {
    if (s === null || s === undefined) return "";
    const str = String(s);
    if (str.includes('"') || str.includes("\t") || str.includes("\n"))
      return '"' + str.replace(/"/g, '""') + '"';
    return str;
  }

  function copyTableAction() {
    const res = $lastResult;
    if (!res?.rows) return Promise.resolve("复制失败");
    const cols = res.columns;
    let text = cols.map(tsvEscape).join("\t") + "\n";
    for (const row of res.rows) text += row.map(tsvEscape).join("\t") + "\n";
    return navigator.clipboard
      .writeText(text)
      .then(() => "")
      .catch(() => "复制失败");
  }

  function copyIdsAction() {
    const res = $lastResult;
    const rows = res.rows;
    if (!rows) return Promise.resolve("复制失败");
    const cols = res.columns;
    const idCol = cols.findIndex((col) => isIDColumn(col));
    if (idCol < 0) return Promise.resolve("未找到id列");
    const text = `bgm_id=${rows.map((row) => row[idCol]).join(",")}`;
    return navigator.clipboard
      .writeText(text)
      .then(() => "")
      .catch(() => "复制失败");
  }

  function copyErrorAction() {
    const text = $lastResult?.error;
    if (!text) return Promise.resolve("复制失败");
    return navigator.clipboard
      .writeText(text)
      .then(() => "")
      .catch(() => "复制失败");
  }

  function shareAction() {
    return (async () => {
      let url;
      try {
        url = await buildShareURL();
      } catch {
        return "生成失败，请用YAML分享";
      }
      if (url === null) {
        return "查询过大，请用YAML分享";
      }
      try {
        await navigator.clipboard.writeText(url);
        return "";
      } catch {
        return "复制失败，请用YAML分享";
      }
    })();
  }
</script>

<div class="results-panel">
  {#if $lastResult?.error}
    <div class="error-card">
      <div class="error-header">
        <div class="error-title">查询失败</div>
        <ActionButton
          icon={Copy}
          text="复制"
          variant="outline"
          action={copyErrorAction}
        />
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
          ><MorphIcon icon={Download} size={14} /> 下载 CSV</button
        >
        <ActionButton icon={Copy} text="复制表格" action={copyTableAction} />
        <ActionButton icon={Copy} text="复制bgm_id" action={copyIdsAction} />
        <ActionButton
          icon={Share2}
          text="分享"
          successText="已复制链接"
          title="分享当前查询链接"
          action={shareAction}
        />
      </span>
    </div>
    {#if res.rows.length === 0}
      <div class="results-empty">
        <div class="icon"><MorphIcon icon={Inbox} size={48} /></div>
        <div>没有找到符合条件的条目</div>
      </div>
    {:else}
      <div class="results-table-wrap">
        <div
          class="results-table"
          role="table"
          style="grid-template-columns: repeat({displayCols.length}, minmax(0, auto))"
        >
          <div class="results-thead" role="rowgroup">
            {#each displayCols as dc, di (dc.ci + ":" + dc.field)}
              <div
                class="results-th sortable"
                class:sort-asc={$sortState.col === dc.ci &&
                  $sortState.field === dc.field &&
                  $sortState.asc}
                class:sort-desc={$sortState.col === dc.ci &&
                  $sortState.field === dc.field &&
                  !$sortState.asc}
                role="columnheader"
                aria-sort={$sortState.col === dc.ci &&
                $sortState.field === dc.field
                  ? $sortState.asc
                    ? "ascending"
                    : "descending"
                  : "none"}
                title={dc.label}
              >
                <span
                  class="sort-btn"
                  onclick={() => handleHeaderClick(di)}
                  onkeydown={(e) => e.key === "Enter" && handleHeaderClick(di)}
                  tabindex="0"
                  role="button"
                  >{dc.label.length > 20
                    ? dc.label.substring(0, 18) + "…"
                    : dc.label}
                  <MorphIcon
                    icon={sortIcon(di)}
                    class={isSortPlaceholder(di) ? "sort-placeholder" : ""}
                    size={14}
                  />
                </span>
              </div>
            {/each}
          </div>
          {#each res.rows as row, ri (ri)}
            <div class="results-tr" role="row">
              <!-- eslint-disable svelte/no-at-html-tags -->
              {#each bodyCols as bc, bi (bc.kind + ":" + bc.ci)}
                {#if bc.kind === "group"}
                  <div
                    class="results-td results-td-group"
                    role="cell"
                    style="grid-column: span {bc.span}"
                  >
                    {#each groupEntries(row[bc.ci]) as entry, ei (ei)}
                      <div class="cell-mini-row">
                        {#each bc.fields as f (f)}
                          {@const href = groupCellIdHref(entry, f, bc.prefix)}
                          <div
                            class="cell-mini-cell {isIDColumn(f)
                              ? 'col-id'
                              : ''}"
                          >
                            {#if entry[f] === null || entry[f] === undefined || entry[f] === ""}
                              <span class="cell-null">—</span>
                            {:else if href}
                              <a {href} target="_blank" rel="noopener"
                                >{entry[f]}</a
                              >
                            {:else}
                              {entry[f]}
                            {/if}
                          </div>
                        {/each}
                      </div>
                    {/each}
                  </div>
                {:else}
                  {@const val = row[bc.ci]}
                  {@const long = val && String(val).length > MAX_DISPLAY_LEN}
                  <div
                    class="results-td {cellClass(bc.label)}"
                    role={long ? "button" : "cell"}
                    class:cell-expanded={expanded[ri + "_" + bi]}
                    class:cell-expandable={long}
                    onclick={long ? () => toggleExpand(ri, bi) : undefined}
                    onkeydown={long
                      ? (e) => e.key === "Enter" && toggleExpand(ri, bi)
                      : undefined}
                    tabindex={long ? "0" : undefined}
                  >
                    {@html cellHtml(bc.label, val, ri, bi)}
                  </div>
                {/if}
              {/each}
              <!-- eslint-enable svelte/no-at-html-tags -->
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {:else}
    <div class="results-empty">
      <div class="icon"><MorphIcon icon={ClipboardList} size={48} /></div>
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
    min-width: 0;
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
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .results-table-wrap {
    overflow-x: auto;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: 1px solid var(--border-light);
  }

  .results-table {
    display: grid;
    grid-auto-rows: auto;
    min-width: 100%;
    font-size: 13px;
    background: var(--white);
  }

  .results-thead,
  .results-tr {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
  }

  .results-thead {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--bg-alt);
    border-bottom: 2px solid var(--border);
  }

  .results-th {
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    overflow-wrap: anywhere;
  }

  .results-th.sortable {
    user-select: none;
    padding: 0;
  }

  .results-th.sortable .sort-btn {
    display: block;
    padding: 10px 14px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .results-th.sortable .sort-btn:hover {
    background: var(--accent-light);
    color: var(--text);
  }

  .results-th :global(svg) {
    font-size: 10px;
    margin-left: 4px;
    opacity: 0.7;
    vertical-align: middle;
  }

  .results-th :global(.sort-placeholder) {
    font-size: 10px;
    margin-left: 4px;
    opacity: 0.35;
  }

  .results-td {
    padding: 8px 14px;
    border-bottom: 1px solid var(--bg-alt);
    max-width: 300px;
    min-width: 0;
  }

  .results-td.cell-expandable {
    cursor: pointer;
  }

  .results-td:focus-visible {
    outline-offset: -2px;
  }

  .results-td.cell-expanded {
    overflow-wrap: anywhere;
  }

  .results-tr {
    transition: var(--transition);
  }

  .results-tr:hover {
    background: var(--accent-light);
  }

  /* When hovering a sub-row, suppress the main-row highlight so only the
     hovered sub-row is highlighted — other sub-rows stay unhighlighted. */
  .results-tr:has(.cell-mini-row:hover) {
    background: transparent;
  }

  .results-tr:has(.cell-mini-row:hover) .cell-mini-row:not(:hover) {
    background: transparent;
  }

  /* Group cell: subgrid spanning its sub-field columns so the header's
     sub-column tracks are shared — sub-rows align with the header. */

  /* Subgrid: the group cell spans its sub-field tracks and reuses the header's
     column definitions, so sub-rows align exactly with the sub-field headers. */
  .results-td-group {
    display: grid;
    grid-template-columns: subgrid;
    grid-auto-rows: auto;
    padding: 0;
    max-width: none;
  }

  /* Chained subgrid: each sub-row is a real box reusing the parent's tracks,
     so cells stay aligned with the header even when content wraps. */
  .cell-mini-row {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
  }

  .cell-mini-row:not(:last-child) {
    border-bottom: 1px solid var(--border-light);
  }

  .cell-mini-row:hover {
    background: color-mix(in srgb, var(--accent) 14%, transparent);
  }

  .cell-mini-cell {
    padding: 8px 14px;
    min-width: 0;
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
    .results-thead {
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

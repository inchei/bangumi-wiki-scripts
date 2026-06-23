// YAML ↔ Filter conversion (frontend-only, no server round-trip)
import { load, dump } from "js-yaml";

/**
 * Convert filter tree (API format) to YAML string.
 * The API format uses `{ logic: { op, items } }` wrapper; the YAML format
 * uses the same structure but without the `_id` / `_ctx` internal fields.
 */
export function filtersToYAML(filters, columns, limit) {
  const cfg = {};
  if (filters && filters.length > 0) {
    cfg.filters = cleanFilters(filters);
  }
  if (columns) {
    const cols =
      typeof columns === "string"
        ? columns
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : columns;
    if (cols.length > 0) cfg.output = { columns: cols };
  }
  if (limit) cfg.limit = limit;
  return dump(cfg, { indent: 1, lineWidth: -1, noRefs: true });
}

/** Remove internal fields (_id, _ctx, _groupNumMap) from filter tree */
function cleanFilters(filters) {
  return filters.map((f) => cleanFilter(f));
}

function cleanFilter(f) {
  if (f.logic) {
    return { logic: { op: f.logic.op, items: cleanFilters(f.logic.items) } };
  }
  const out = {};
  for (const key of [
    "type",
    "field",
    "global",
    "tag",
    "meta_tag",
    "relation",
    "person_relation",
    "character_relation",
    "staff",
    "character",
    "person_character",
    "character_person",
    "episode",
  ]) {
    if (f[key]) {
      out[key] = cleanValue(f[key], key);
    }
  }
  return out;
}

function cleanValue(val, key) {
  if (
    key === "relation" ||
    key === "person_relation" ||
    key === "character_relation" ||
    key === "staff" ||
    key === "character"
  ) {
    const out = { ...val };
    if (out.conditions) {
      out.conditions = cleanFilters(out.conditions);
    }
    return out;
  }
  if (key === "person_character" || key === "character_person") {
    const out = { ...val };
    if (out.conditions) {
      out.conditions = cleanFilters(out.conditions);
    }
    if (out.subject_conditions) {
      out.subject_conditions = cleanFilters(out.subject_conditions);
    }
    return out;
  }
  if (key === "episode") {
    const out = { ...val };
    if (out.logic) {
      out.logic = { op: out.logic.op, items: cleanFilters(out.logic.items) };
    }
    return out;
  }
  return { ...val };
}

/**
 * Parse YAML string to config object.
 * Returns { filters, output, sort, limit } or throws on parse error.
 */
export function parseYAML(raw) {
  const text = raw.trim();
  if (!text) throw new Error("YAML 内容为空");

  // Try YAML first, fallback to JSON
  let cfg;
  try {
    cfg = load(text);
  } catch (e1) {
    try {
      cfg = JSON.parse(text);
    } catch (e2) {
      throw new Error(`YAML: ${e1.message}\nJSON: ${e2.message}`, {
        cause: e2,
      });
    }
  }

  if (!cfg || typeof cfg !== "object") {
    throw new Error("配置格式错误：需要一个对象");
  }

  const result = {};
  if (cfg.filters) result.filters = normalizeFilters(cfg.filters);
  if (cfg.output) result.output = cfg.output;
  if (cfg.sort) result.sort = cfg.sort;
  if (cfg.limit) result.limit = cfg.limit;
  return result;
}

/** Normalize YAML filters to API format (wrap in logic if needed) */
function normalizeFilters(filters) {
  if (!Array.isArray(filters)) return [];
  return filters.map((f) => normalizeFilter(f));
}

function normalizeFilter(f) {
  // Already in API format with logic wrapper
  if (f.logic) {
    return {
      logic: {
        op: f.logic.op || "and",
        items: normalizeFilters(f.logic.items || []),
      },
    };
  }
  // Direct filter types
  const out = {};
  for (const key of [
    "type",
    "field",
    "global",
    "tag",
    "meta_tag",
    "relation",
    "person_relation",
    "character_relation",
    "staff",
    "character",
    "person_character",
    "character_person",
    "episode",
  ]) {
    if (f[key] !== undefined && f[key] !== null) {
      out[key] = normalizeFilterValue(f[key], key);
    }
  }
  return out;
}

function normalizeFilterValue(val, key) {
  if (
    key === "relation" ||
    key === "person_relation" ||
    key === "character_relation" ||
    key === "staff" ||
    key === "character"
  ) {
    const out = { ...val };
    if (out.conditions) {
      out.conditions = normalizeFilters(out.conditions);
    }
    return out;
  }
  if (key === "person_character" || key === "character_person") {
    const out = { ...val };
    if (out.conditions) {
      out.conditions = normalizeFilters(out.conditions);
    }
    if (out.subject_conditions) {
      out.subject_conditions = normalizeFilters(out.subject_conditions);
    }
    return out;
  }
  if (key === "episode") {
    const out = { ...val };
    if (out.logic) {
      out.logic = {
        op: out.logic.op || "and",
        items: normalizeFilters(out.logic.items || []),
      };
    }
    if (out.conditions && !out.logic) {
      out.logic = { op: "and", items: normalizeFilters(out.conditions) };
      delete out.conditions;
    }
    return out;
  }
  // Shorthand: type: 2 → type: { value: 2 }
  if (key === "type" && typeof val !== "object") {
    return { value: val };
  }
  // Shorthand: field: "name" → field: { field: "name", operator: "contains", value: "" }
  if (key === "field" && typeof val === "string") {
    return { field: val, operator: "contains", value: "" };
  }
  // Shorthand: tag: "轻小说" → tag: { value: "轻小说", negate: false }
  if ((key === "tag" || key === "meta_tag") && typeof val === "string") {
    return { value: val, negate: false };
  }
  // Shorthand: global: "text" → global: { operator: "contains", value: "text" }
  if (key === "global" && typeof val === "string") {
    return { operator: "contains", value: val };
  }
  return { ...val };
}

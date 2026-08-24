// YAML ↔ Filter conversion (frontend-only, no server round-trip)
import { load, dump } from "js-yaml";

/**
 * Convert filter tree (API format) to YAML string.
 * The API format uses `{ logic: { op, items } }` wrapper; the YAML format
 * uses the same structure but without the `_id` / `_ctx` internal fields.
 */
export function filtersToYAML(target, filters, columns, limit, sort) {
  const cfg = {};
  if (target && target !== "subject") cfg.target = target;
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
  if (sort && sort.length > 0) cfg.sort = sort;
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
  const out = { ...val };
  delete out._special;
  return out;
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
  if (cfg.target) result.target = cfg.target;
  if (cfg.filters) result.filters = normalizeFilters(cfg.filters);
  if (cfg.output) result.output = cfg.output;
  if (cfg.sort) result.sort = cfg.sort;
  if (cfg.limit) result.limit = cfg.limit;
  return result;
}

/** Normalize YAML filters to API format (wrap in logic if needed) */
function normalizeFilters(filters) {
  if (!Array.isArray(filters)) return [];
  return filters
    .map((f) => normalizeFilter(f))
    .filter((f) => f && Object.keys(f).length > 0);
}

function normalizeFilter(f) {
  if (!f || typeof f !== "object") return f;

  if (f.logic) {
    const lg = f.logic;
    return {
      logic: {
        op: lg.op === "or" ? "or" : "and",
        items: normalizeFilters(lg.items || []),
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

/**
 * Normalize a nested conditions array into the UI structure: a single logic
 * group wrapping the items (rendered from conditions[0].logic). A pre-wrapped
 * logic group is kept as-is (with its items normalized); flat arrays are
 * wrapped in an "and" group, preserving the backend's implicit AND over
 * conditions. Missing conditions get an empty group so the nested editor is
 * still available.
 */
function normalizeNestedConditions(conditions) {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return [{ logic: { op: "and", items: [] } }];
  }
  const items = normalizeFilters(conditions);
  if (items.length === 1 && items[0].logic) return items;
  return [{ logic: { op: "and", items } }];
}

function normalizeFilterValue(val, key) {
  // Scalar shorthands, mirroring the Go UnmarshalYAML
  if (typeof val !== "object" || val === null) {
    switch (key) {
      case "type":
        return { value: val };
      case "field":
        return { field: String(val), operator: "contains", value: "" };
      case "tag":
      case "meta_tag":
        return { operator: "contains", value: String(val), negate: false };
      case "global":
        return { operator: "contains", value: String(val) };
      case "relation":
      case "person_relation":
      case "character_relation":
        return { type: String(val), mode: "any" };
      case "staff":
        return { position: String(val), mode: "any" };
      default:
        return val;
    }
  }

  const out = { ...val };

  if (
    key === "relation" ||
    key === "person_relation" ||
    key === "character_relation" ||
    key === "staff" ||
    key === "character"
  ) {
    if (out.mode === undefined) out.mode = "any";
    out.conditions = normalizeNestedConditions(out.conditions);
    return out;
  }
  if (key === "person_character" || key === "character_person") {
    if (out.mode === undefined) out.mode = "any";
    out.conditions = normalizeNestedConditions(out.conditions);
    out.subject_conditions = normalizeNestedConditions(out.subject_conditions);
    return out;
  }
  if (key === "episode") {
    if (out.mode === undefined) out.mode = "any";
    if (out.logic) {
      out.logic = normalizeFilter({ logic: out.logic }).logic;
    }
    return out;
  }
  // field/global/tag/meta_tag full forms: operator is required by the backend
  if (
    (key === "field" ||
      key === "global" ||
      key === "tag" ||
      key === "meta_tag") &&
    out.operator === undefined
  ) {
    out.operator = "contains";
  }
  return out;
}

// YAML ↔ Filter conversion (frontend-only, no server round-trip)
import { load, dump } from "js-yaml";
import {
  relationsByType,
  positionsByType,
  PERSON_RELATIONS,
  CHARACTER_RELATIONS,
  CHARACTER_ASSOC_TYPES,
  PERSON_CHAR_TYPES,
  META_TAGS,
  PLATFORMS,
} from "./schema-data.js";

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
  return dump(cfg, { indent: 2, lineWidth: -1, noRefs: true });
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
  // Keep unrecognized items (don't drop) so validateConfig can flag them.
  return filters.map((f) => normalizeFilter(f)).filter(Boolean);
}

function normalizeFilter(f) {
  if (!f || typeof f !== "object") return f;

  if (f.logic) {
    const lg = f.logic;
    if (lg.op && lg.op !== "and" && lg.op !== "or") {
      throw new Error(`logic op 必须为 and 或 or，收到「${lg.op}」`);
    }
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
  return out;
}

/**
 * Semantic validation mirroring the backend's query-time existence errors
 * (unknown relation/position/operator/type names). Returns deduplicated
 * Chinese error strings; empty array = valid.
 */
export function validateConfig(cfg) {
  const errors = new Set();
  if (cfg.target && !TARGETS.has(cfg.target)) {
    errors.add(`target「${cfg.target}」不存在`);
  }
  walkFilters(cfg.filters, errors);
  return [...errors];
}

const TARGETS = new Set(["subject", "person", "character", "episode"]);
const PLATFORM_CODES = new Set(PLATFORMS.map((p) => p.code));
const OPERATORS = new Set([
  "eq",
  "contains",
  "not_contains",
  "regex",
  "not_regex",
  "empty",
  "gt",
  "gte",
  "lt",
  "lte",
  "before",
  "after",
]);
const MODES = new Set(["any", "all", "none", "count"]);
const SUBJECT_TYPE_NUMS = new Set([1, 2, 3, 4, 6]);
const SUBJECT_TYPE_NAMES = new Set(["书籍", "动画", "音乐", "游戏", "三次元"]);
const FILTER_KEYS = [
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
];

function walkFilters(filters, errors) {
  if (!Array.isArray(filters)) return;
  for (const f of filters) {
    if (!f || typeof f !== "object") continue;
    if (f.logic) {
      checkKeys("logic", f.logic, errors);
      walkFilters(f.logic.items, errors);
      continue;
    }
    for (const k of Object.keys(f)) {
      if (!FILTER_KEYS.includes(k) && !k.startsWith("_")) {
        errors.add(`未知筛选键「${k}」`);
      }
    }
    if (!FILTER_KEYS.some((k) => f[k])) {
      errors.add("筛选条件未包含任何有效的过滤类型");
      continue;
    }
    for (const key of FILTER_KEYS) {
      if (f[key]) {
        checkKeys(key, f[key], errors);
        checkNode(key, f[key], errors);
      }
    }
  }
}

const FILTER_KEYS_BY_KIND = {
  logic: ["op", "items"],
  type: ["value"],
  field: ["field", "operator", "value"],
  global: ["operator", "value"],
  tag: ["operator", "value", "negate"],
  meta_tag: ["operator", "value", "negate"],
  relation: ["type", "mode", "count_op", "count_val", "conditions"],
  person_relation: ["type", "mode", "count_op", "count_val", "conditions"],
  character_relation: ["type", "mode", "count_op", "count_val", "conditions"],
  staff: [
    "position",
    "positions",
    "mode",
    "count_op",
    "count_val",
    "conditions",
  ],
  character: ["type", "mode", "count_op", "count_val", "conditions"],
  person_character: [
    "type",
    "mode",
    "count_op",
    "count_val",
    "subject_mode",
    "subject_count_op",
    "subject_count_val",
    "conditions",
    "subject_conditions",
  ],
  character_person: [
    "type",
    "mode",
    "count_op",
    "count_val",
    "subject_mode",
    "subject_count_op",
    "subject_count_val",
    "conditions",
    "subject_conditions",
  ],
  episode: ["mode", "count_op", "count_val", "logic"],
};

function checkKeys(kind, obj, errors) {
  const allowed = FILTER_KEYS_BY_KIND[kind];
  if (!allowed || !obj || typeof obj !== "object") return;
  for (const k of Object.keys(obj)) {
    if (!allowed.includes(k) && !k.startsWith("_")) {
      errors.add(`${kind} 中未知键「${k}」`);
    }
  }
}

function checkNode(key, v, errors) {
  switch (key) {
    case "type": {
      const val = v.value;
      if (val === "" || val == null) return;
      const str = String(val);
      if (/^\d+$/.test(str) || typeof val === "number") {
        if (!SUBJECT_TYPE_NUMS.has(Number(str))) {
          errors.add(`type.value「${val}」不存在`);
        }
      } else if (!SUBJECT_TYPE_NAMES.has(str)) {
        errors.add(`type.value「${val}」不存在`);
      }
      break;
    }
    case "field":
    case "global":
    case "tag":
    case "meta_tag":
      if (v.operator == null || v.operator === "") {
        errors.add(`${key}.operator 不能为空`);
      } else if (!OPERATORS.has(v.operator)) {
        errors.add(`operator「${v.operator}」不存在`);
      }
      // Only eq pins an exact platform code; contains/regex are substring
      // queries over the code column and can't be existence-checked.
      if (
        key === "field" &&
        v.field === "platform" &&
        v.operator === "eq" &&
        v.value !== "" &&
        v.value != null &&
        !PLATFORM_CODES.has(Number(v.value))
      ) {
        errors.add(`platform「${v.value}」不存在`);
      }
      if (key === "meta_tag" && v.value && !META_TAGS.includes(v.value)) {
        errors.add(`meta_tag「${v.value}」不存在`);
      }
      break;
    case "relation":
      checkName("relation.type", v.type, relationsByType(0), errors);
      checkModeAndConditions(v, errors);
      break;
    case "person_relation":
      checkName("person_relation.type", v.type, PERSON_RELATIONS, errors);
      checkModeAndConditions(v, errors);
      break;
    case "character_relation":
      checkName("character_relation.type", v.type, CHARACTER_RELATIONS, errors);
      checkModeAndConditions(v, errors);
      break;
    case "staff": {
      const names = v.positions?.length ? v.positions : [v.position];
      for (const n of names) {
        checkName("staff.position", n, positionsByType(0), errors);
      }
      checkModeAndConditions(v, errors);
      break;
    }
    case "character":
      checkName("character.type", v.type, CHARACTER_ASSOC_TYPES, errors);
      checkModeAndConditions(v, errors);
      break;
    case "person_character":
    case "character_person":
      checkName(`${key}.type`, v.type, PERSON_CHAR_TYPES, errors);
      checkModeAndConditions(v, errors);
      checkMode(v.subject_mode, errors);
      if (v.subject_count_op && !OPERATORS.has(v.subject_count_op)) {
        errors.add(`subject_count_op「${v.subject_count_op}」不存在`);
      }
      walkLogicItems(v.subject_conditions, errors);
      break;
    case "episode":
      checkMode(v.mode, errors);
      if (v.count_op && !OPERATORS.has(v.count_op)) {
        errors.add(`count_op「${v.count_op}」不存在`);
      }
      if (v.logic) {
        checkKeys("logic", v.logic, errors);
        walkFilters(v.logic.items, errors);
      }
      break;
  }
}

function checkName(label, name, set, errors) {
  if (name === "" || name == null || name === "任意") return;
  if (!set.includes(name)) errors.add(`${label}「${name}」不存在`);
}

function checkMode(mode, errors) {
  if (mode && !MODES.has(mode)) errors.add(`mode「${mode}」不存在`);
}

function checkModeAndConditions(v, errors) {
  checkMode(v.mode, errors);
  if (v.count_op && !OPERATORS.has(v.count_op)) {
    errors.add(`count_op「${v.count_op}」不存在`);
  }
  walkLogicItems(v.conditions, errors);
}

// Conditions arrive normalized as [{ logic: { op, items } }] groups.
function walkLogicItems(conditions, errors) {
  if (!Array.isArray(conditions)) return;
  for (const c of conditions) {
    if (c?.logic) walkFilters(c.logic.items, errors);
  }
}

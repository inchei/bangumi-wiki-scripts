// State management using svelte/store
import { writable, get } from "svelte/store";

import { PLATFORMS } from "./schema-data.js";

// Subject direct fields for autocomplete
const SUBJECT_DIRECT_FIELDS = [
  "id",
  "type",
  "name",
  "name_cn",
  "platform",
  "summary",
  "nsfw",
  "score",
  "rank",
  "date",
  "series",
];

// Version counter — incremented on every mutation to trigger reactivity
export const logicVersion = writable(0);

// Focus request — set after add operations so FilterTree can focus the new element
export const focusRequest = writable(null);
function bumpVersion() {
  logicVersion.update((n) => n + 1);
}

export const lastResult = writable(null);
export const queryLoading = writable(false);
export const sortState = writable({ col: -1, asc: true });
export const queryTarget = writable("subject");
export const outputColumns = writable("id,name,name_cn,type,");
export const sortRules = writable([]); // [{field: string, direction: "asc"|"desc"}]
export const resultLimit = writable(500);

// Per-target output settings: { [target]: { outputColumns, sortRules, resultLimit } }
const _targetSettings = {};

const DEFAULT_SETTINGS = {
  subject: {
    outputColumns: "id,name,name_cn,type,",
    sortRules: [],
    resultLimit: 500,
  },
  person: {
    outputColumns: "person_id,name,简体中文名,",
    sortRules: [],
    resultLimit: 500,
  },
  character: {
    outputColumns: "character_id,name,简体中文名,",
    sortRules: [],
    resultLimit: 500,
  },
  episode: {
    outputColumns: "id,name,name_cn,",
    sortRules: [],
    resultLimit: 500,
  },
};

export function saveTargetSettings() {
  const target = get(queryTarget);
  _targetSettings[target] = {
    outputColumns: get(outputColumns),
    sortRules: get(sortRules),
    resultLimit: get(resultLimit),
  };
}

export function restoreTargetSettings(target) {
  const saved =
    _targetSettings[target] ||
    DEFAULT_SETTINGS[target] ||
    DEFAULT_SETTINGS.subject;
  outputColumns.set(saved.outputColumns);
  sortRules.set(saved.sortRules);
  resultLimit.set(saved.resultLimit);
}

// Logic tree ID counter
let _logicIdCounter = 0;

export function newLogicGroup(op) {
  return { op: op || "and", items: [], _id: ++_logicIdCounter };
}

export const subjectRootLogic = writable(newLogicGroup("and"));
export const personRootLogic = writable(newLogicGroup("and"));
export const characterRootLogic = writable(newLogicGroup("and"));
export const episodeRootLogic = writable(newLogicGroup("and"));

function getTargetStore() {
  const target = get(queryTarget);
  if (target === "person") return personRootLogic;
  if (target === "character") return characterRootLogic;
  if (target === "episode") return episodeRootLogic;
  return subjectRootLogic;
}

export function getRootLogic() {
  return get(getTargetStore());
}

export function updateRootLogic(lg) {
  getTargetStore().set(lg);
  bumpVersion();
}

export function resetLogicBuilder() {
  _logicIdCounter = 0;
  subjectRootLogic.set(newLogicGroup("and"));
  personRootLogic.set(newLogicGroup("and"));
  characterRootLogic.set(newLogicGroup("and"));
  episodeRootLogic.set(newLogicGroup("and"));
}

// ---- Logic tree helpers ----

// Iterate all condition arrays in an item (relation, staff, character, etc.)
// Calls fn(conditions, key) for each `.conditions` and `.subject_conditions` array.
function forEachCondArray(item, fn) {
  for (const key of Object.keys(item)) {
    const val = item[key];
    if (val && typeof val === "object") {
      if (Array.isArray(val.conditions)) fn(val.conditions, key);
      if (Array.isArray(val.subject_conditions))
        fn(val.subject_conditions, key);
    }
  }
}

// Immutable tree replacement: find node by `id`, apply `replacer`, propagate new refs up.
function findAndReplace(node, id, replacer) {
  if (node._id === id) return replacer(node);
  const newItems = [];
  let changed = false;
  for (const item of node.items) {
    let found = false;
    // Direct logic group: { logic: { _id, op, items } }
    if (
      item.logic &&
      typeof item.logic === "object" &&
      !Array.isArray(item.logic)
    ) {
      const updated = findAndReplace(item.logic, id, replacer);
      if (updated !== item.logic) {
        newItems.push({ ...item, logic: updated });
        found = true;
        changed = true;
      }
    }
    if (!found) {
      // Nested conditions: { relation: { conditions: [{ logic: ... }] } }
      forEachCondArray(item, (conds, key) => {
        if (found) return;
        const newConds = [];
        let condChanged = false;
        for (const c of conds) {
          if (c.logic) {
            const updated = findAndReplace(c.logic, id, replacer);
            if (updated !== c.logic) {
              condChanged = true;
              newConds.push({ logic: updated });
              continue;
            }
          }
          newConds.push(c);
        }
        if (condChanged) {
          const val = item[key];
          const newVal = { ...val, conditions: newConds };
          newItems.push({ ...item, [key]: newVal });
          found = true;
          changed = true;
        }
      });
    }
    if (!found) {
      // Nested logic in other structures: { episode: { logic: ... } }
      for (const key of Object.keys(item)) {
        if (found) break;
        const val = item[key];
        if (
          val &&
          typeof val === "object" &&
          val.logic &&
          typeof val.logic === "object" &&
          !Array.isArray(val.logic)
        ) {
          const updated = findAndReplace(val.logic, id, replacer);
          if (updated !== val.logic) {
            newItems.push({ ...item, [key]: { ...val, logic: updated } });
            found = true;
            changed = true;
          }
        }
      }
    }
    if (!found) newItems.push(item);
  }
  return changed ? { ...node, items: newItems } : node;
}

export function findLogicGroup(node, id) {
  if (node._id === id) return node;
  for (const item of node.items) {
    if (item.logic) {
      const r = findLogicGroup(item.logic, id);
      if (r) return r;
    }
    let found = null;
    forEachCondArray(item, (conds) => {
      if (found) return;
      for (const c of conds) {
        if (c.logic) {
          found = findLogicGroup(c.logic, id);
          if (found) return;
        }
      }
    });
    if (found) return found;
    // episode.logic (direct, not in conditions array)
    for (const key of Object.keys(item)) {
      const val = item[key];
      if (
        val &&
        typeof val === "object" &&
        val.logic &&
        typeof val.logic === "object" &&
        !Array.isArray(val.logic) &&
        !val.conditions
      ) {
        const r = findLogicGroup(val.logic, id);
        if (r) return r;
      }
    }
  }
  return null;
}

export function removeLogicItemById(node, id) {
  for (let i = 0; i < node.items.length; i++) {
    const item = node.items[i];
    if (item.logic) {
      if (item.logic._id === id) {
        node.items.splice(i, 1);
        return true;
      }
      if (removeLogicItemById(item.logic, id)) return true;
    }
    let found = false;
    forEachCondArray(item, (conds) => {
      if (found) return;
      for (const c of conds) {
        if (c.logic && removeLogicItemById(c.logic, id)) {
          found = true;
          return;
        }
      }
    });
    if (found) return true;
    // episode.logic (direct, not in conditions array)
    for (const key of Object.keys(item)) {
      const val = item[key];
      if (
        val &&
        typeof val === "object" &&
        val.logic &&
        typeof val.logic === "object" &&
        !Array.isArray(val.logic) &&
        !val.conditions
      ) {
        if (removeLogicItemById(val.logic, id)) return true;
      }
    }
  }
  return false;
}

export function logicToFilter(lg) {
  return {
    logic: {
      op: lg.op,
      items: lg.items.map((item) => {
        if (item.logic) return logicToFilter(item.logic);
        return item;
      }),
    },
  };
}

export function getFiltersForAPI() {
  const root = getRootLogic();
  if (root.items.length === 0) return [];
  return [logicToFilter(root)];
}

export function createEmptyCondition(type) {
  switch (type) {
    case "field":
      return { field: { field: "", operator: "contains", value: "" } };
    case "tag":
      return { tag: { operator: "contains", value: "", negate: false } };
    case "meta_tag":
      return { meta_tag: { operator: "contains", value: "", negate: false } };
    case "global":
      return { global: { operator: "contains", value: "" } };
    case "type":
      return { type: { value: "" } };
    case "relation":
      return {
        relation: {
          type: "",
          mode: "any",
          conditions: [{ logic: newLogicGroup("and") }],
        },
      };
    case "person_relation":
      return {
        person_relation: {
          type: "",
          mode: "any",
          conditions: [{ logic: newLogicGroup("and") }],
        },
      };
    case "character_relation":
      return {
        character_relation: {
          type: "",
          mode: "any",
          conditions: [{ logic: newLogicGroup("and") }],
        },
      };
    case "character":
      return {
        character: {
          type: "",
          mode: "any",
          conditions: [{ logic: newLogicGroup("and") }],
        },
      };
    case "person_character":
      return {
        person_character: {
          type: "",
          mode: "any",
          subject_mode: "any",
          conditions: [{ logic: newLogicGroup("and") }],
          subject_conditions: [{ logic: newLogicGroup("and") }],
        },
      };
    case "character_person":
      return {
        character_person: {
          type: "",
          mode: "any",
          subject_mode: "any",
          conditions: [{ logic: newLogicGroup("and") }],
          subject_conditions: [{ logic: newLogicGroup("and") }],
        },
      };
    case "staff":
      return {
        staff: {
          position: "",
          mode: "any",
          conditions: [{ logic: newLogicGroup("and") }],
        },
      };
    case "episode":
      return { episode: { mode: "any", logic: newLogicGroup("and") } };
    default:
      return { field: { field: "", operator: "contains", value: "" } };
  }
}

// Clone the tree path to `targetId`, applying `mutator` to the target group's new items array.
// Returns a new root with new references at every level — Svelte detects the change.
function updateGroupInTree(node, targetId, mutator) {
  return findAndReplace(node, targetId, (n) => ({
    ...n,
    items: mutator([...n.items]),
  }));
}

function applyMutation(targetGroupId, mutator) {
  getTargetStore().update((root) =>
    updateGroupInTree(root, targetGroupId, mutator),
  );
}

export function addToGroup(group, filter) {
  applyMutation(group._id, (items) => {
    items.push(filter);
    return items;
  });
}

// Default operator for episode fields
const EP_FIELD_DEFAULT_OP = {
  airdate: "before",
  sort: "gte",
  type: "eq",
  disc: "gte",
  id: "eq",
};

export function addCondition(group, type, ctx) {
  if (type.startsWith("ep_")) {
    const fieldName = type.slice(3);
    const fc = EPISODE_FIELD_CONFIGS[fieldName];
    if (fc) {
      const val = fc.type === "select" ? fc.options?.[0]?.[0] || "" : "";
      addToGroup(group, {
        field: {
          field: fieldName,
          operator: fc.ops[0],
          value: val,
          _special: true,
        },
      });
    } else {
      const op = EP_FIELD_DEFAULT_OP[fieldName] || "contains";
      addToGroup(group, {
        field: { field: fieldName, operator: op, value: "" },
      });
    }
  } else {
    ctx = ctx || group._ctx || "subject";
    const fc = ctxFieldConfigs(ctx)[type];
    if (fc) {
      const val = fc.type === "select" ? fc.options?.[0]?.[0] || "" : "";
      addToGroup(group, {
        field: { field: type, operator: fc.ops[0], value: val, _special: true },
      });
    } else {
      addToGroup(group, createEmptyCondition(type));
    }
  }
  focusRequest.set({ groupId: group._id, isGroup: false });
}

export function removeLogicGroup(groupId) {
  getTargetStore().update((root) => removeItemById(root, groupId));
}

// Immutable removal: returns a new tree with the item removed.
function removeItemById(node, id) {
  // Check if any direct child matches
  const newItems = [];
  let changed = false;
  for (const item of node.items) {
    if (item.logic && item.logic._id === id) {
      changed = true;
      continue; // skip this item
    }
    // Recurse into nested logic groups
    if (
      item.logic &&
      typeof item.logic === "object" &&
      !Array.isArray(item.logic)
    ) {
      const updated = removeItemById(item.logic, id);
      if (updated !== item.logic) {
        newItems.push({ ...item, logic: updated });
        changed = true;
        continue;
      }
    }
    // Recurse into condition arrays
    let found = false;
    forEachCondArray(item, (conds, key) => {
      if (found) return;
      const newConds = [];
      let condChanged = false;
      for (const c of conds) {
        if (c.logic) {
          const updated = removeItemById(c.logic, id);
          if (updated !== c.logic) {
            condChanged = true;
            newConds.push({ logic: updated });
            continue;
          }
        }
        newConds.push(c);
      }
      if (condChanged) {
        const val = item[key];
        newItems.push({ ...item, [key]: { ...val, conditions: newConds } });
        found = true;
        changed = true;
      }
    });
    if (!found) newItems.push(item);
  }
  return changed ? { ...node, items: newItems } : node;
}

export function removeLogicLeaf(group, idx) {
  applyMutation(group._id, (items) => {
    items.splice(idx, 1);
    return items;
  });
}

export function addLogicGroupTo(group) {
  const ng = newLogicGroup(group.op === "and" ? "or" : "and");
  applyMutation(group._id, (items) => {
    items.push({ logic: ng });
    return items;
  });
  focusRequest.set({ groupId: group._id, isGroup: true });
}

export function toggleLogicOp(group, val) {
  getTargetStore().update((root) =>
    findAndReplace(root, group._id, (n) => ({ ...n, op: val })),
  );
}

export function updateCondition(group, idx, kind, field, value) {
  if (!group || !group.items[idx]) return;
  const oldItem = group.items[idx];
  const oldTarget = oldItem[kind];
  if (!oldTarget || typeof oldTarget !== "object") return;
  // Create new item with updated field — immutable so Svelte detects the change
  const updated = { ...oldTarget, [field]: value };
  // When switching to "count" mode, initialize count_op/count_val defaults
  if (field === "mode" && value === "count") {
    if (!updated.count_op) updated.count_op = "gte";
    if (!updated.count_val) updated.count_val = "";
  }
  // When switching subject_mode to "count", initialize subject_count_op/subject_count_val defaults
  if (field === "subject_mode" && value === "count") {
    if (!updated.subject_count_op) updated.subject_count_op = "gte";
    if (!updated.subject_count_val) updated.subject_count_val = "";
  }
  const newItem = { ...oldItem, [kind]: updated };
  applyMutation(group._id, (items) => {
    items[idx] = newItem;
    return items;
  });
}

export function applyFiltersFromAPI(apiFilters) {
  _logicIdCounter = 0;
  let newRoot;
  if (apiFilters.length === 1 && apiFilters[0].logic) {
    newRoot = assignLogicIds(apiFilters[0].logic);
  } else {
    newRoot = { op: "and", items: apiFilters, _id: ++_logicIdCounter };
  }
  getTargetStore().set(newRoot);
}

function assignLogicIds(lg) {
  if (!lg._id) lg._id = ++_logicIdCounter;
  for (const item of lg.items) {
    if (item.logic) assignLogicIds(item.logic);
  }
  return lg;
}

// ---- Field config constants ----

export const CTX_SUBJECT = "subject";
export const CTX_PERSON = "person";
export const CTX_CHARACTER = "character";
export const CTX_EPISODE = "episode";

export const EPISODE_FIELDS = [
  "name",
  "name_cn",
  "description",
  "airdate",
  "duration",
  "sort",
  "type",
  "disc",
  "id",
];
export const EPISODE_FIELD_LABELS = {
  name: "名称",
  name_cn: "中文名",
  description: "简介",
  airdate: "播出日期",
  duration: "时长",
  sort: "排序",
  type: "类型",
  disc: "碟片",
  id: "ID",
};
export const EPISODE_FIELD_OPS = {
  name: ["contains", "not_contains", "eq", "regex"],
  name_cn: ["contains", "not_contains", "eq", "regex"],
  description: ["contains", "not_contains", "eq", "regex"],
  airdate: ["before", "after"],
  duration: ["contains", "not_contains", "eq", "regex"],
  sort: ["gt", "gte", "lt", "lte", "eq"],
  type: ["gt", "gte", "lt", "lte", "eq"],
  disc: ["gt", "gte", "lt", "lte", "eq"],
  id: ["gt", "gte", "lt", "lte", "eq"],
};

export const EPISODE_FIELD_CONFIGS = {
  type: {
    label: "类型",
    ops: ["eq"],
    type: "select",
    options: [
      ["0", "本篇"],
      ["1", "特别篇"],
      ["2", "OP"],
      ["3", "ED"],
      ["4", "CM"],
      ["5", "MAD"],
      ["6", "其他"],
    ],
  },
};

export const PERSON_FIELDS = [
  "name",
  "id",
  "type",
  "career",
  "appear_eps",
  "简体中文名",
  "别名",
  "性别",
  "生日",
];

export const CHARACTER_FIELDS = [
  "name",
  "id",
  "role",
  "comments",
  "collects",
  "简体中文名",
  "别名",
  "性别",
  "生日",
];

export const SUBJECT_FIELD_CONFIGS = {
  type: { label: "类型", ops: ["eq"], type: "select", dynamic: "type" },
  platform: {
    label: "子类型",
    ops: ["eq"],
    type: "select",
    dynamic: "platform",
  },
  nsfw: {
    label: "NSFW",
    ops: ["eq"],
    type: "select",
    options: [
      ["true", "是"],
      ["false", "否"],
    ],
  },
  score: {
    label: "评分",
    ops: ["gt", "gte", "lt", "lte", "eq", "empty"],
    type: "number",
    step: "0.1",
  },
  rank: {
    label: "排名",
    ops: ["gt", "gte", "lt", "lte", "eq", "empty"],
    type: "number",
    step: "1",
  },
  date: { label: "日期", ops: ["before", "after", "empty"], type: "date" },
  series: {
    label: "系列",
    ops: ["eq"],
    type: "select",
    options: [
      ["true", "是"],
      ["false", "否"],
    ],
  },
};

export const CAREER_OPTIONS = [
  ["mangaka", "漫画家"],
  ["writer", "作家"],
  ["illustrator", "绘师"],
  ["seiyu", "声优"],
  ["actor", "演员"],
  ["artist", "音乐家"],
  ["producer", "制作人员"],
];

export const PERSON_FIELD_CONFIGS = {
  type: {
    label: "类型",
    ops: ["eq"],
    type: "select",
    options: [
      ["1", "个人"],
      ["2", "公司"],
      ["3", "组合"],
    ],
  },
  性别: {
    label: "性别",
    ops: ["contains"],
    type: "select",
    options: [
      ["男", "男"],
      ["女", "女"],
      ["其他", "其他"],
    ],
  },
  生日: { label: "生日", ops: ["before", "after", "empty"], type: "date" },
  career: {
    label: "职业",
    ops: ["contains", "not_contains", "empty"],
    type: "text",
    ac: "career",
  },
};

export const CHARACTER_FIELD_CONFIGS = {
  role: {
    label: "类型",
    ops: ["eq"],
    type: "select",
    options: [
      ["1", "角色"],
      ["2", "机体"],
      ["3", "舰船"],
      ["4", "组织机构"],
    ],
  },
  性别: {
    label: "性别",
    ops: ["contains"],
    type: "select",
    options: [
      ["男", "男"],
      ["女", "女"],
      ["其他", "其他"],
    ],
  },
  comments: {
    label: "评论数",
    ops: ["gt", "gte", "lt", "lte", "eq"],
    type: "number",
    step: "1",
  },
  collects: {
    label: "收藏数",
    ops: ["gt", "gte", "lt", "lte", "eq"],
    type: "number",
    step: "1",
  },
};

export function ctxFieldConfigs(ctx) {
  if (ctx === CTX_PERSON) return PERSON_FIELD_CONFIGS;
  if (ctx === CTX_CHARACTER) return CHARACTER_FIELD_CONFIGS;
  if (ctx === CTX_EPISODE) return EPISODE_FIELD_CONFIGS;
  return SUBJECT_FIELD_CONFIGS;
}

export function ctxFields(ctx) {
  if (ctx === CTX_EPISODE) return EPISODE_FIELDS;
  if (ctx === CTX_PERSON) return PERSON_FIELDS;
  if (ctx === CTX_CHARACTER) return CHARACTER_FIELDS;
  return SUBJECT_DIRECT_FIELDS;
}

export function ctxTypeOpts(ctx) {
  if (ctx === CTX_PERSON)
    return [
      ["", "全部"],
      ["1", "个人"],
      ["2", "公司"],
      ["3", "组合"],
    ];
  if (ctx === CTX_EPISODE) return [];
  return [
    ["", "全部"],
    ["1", "书籍"],
    ["2", "动画"],
    ["3", "音乐"],
    ["4", "游戏"],
    ["6", "三次元"],
  ];
}

export function fieldSelectOptions(fc) {
  if (fc.dynamic === "type") {
    return [
      ["1", "书籍"],
      ["2", "动画"],
      ["3", "音乐"],
      ["4", "游戏"],
      ["6", "三次元"],
    ];
  }
  if (fc.dynamic === "platform") {
    return PLATFORMS.map((p) => [String(p.code), p.name]);
  }
  return fc.options || [];
}

export function isSpecialField(f, ctx) {
  return f in ctxFieldConfigs(ctx || CTX_SUBJECT);
}

export function opLabel(op) {
  const m = {
    eq: "=",
    contains: "包含",
    not_contains: "不包含",
    regex: "正则",
    gt: ">",
    gte: ">=",
    lt: "<",
    lte: "<=",
    before: "早于",
    after: "晚于",
    empty: "为空",
  };
  return m[op] || op;
}

export function opInputType(op) {
  if (["gt", "gte", "lt", "lte"].includes(op)) return "number";
  if (["before", "after"].includes(op)) return "date";
  return "text";
}

export function clearFilters() {
  resetLogicBuilder();
  bumpVersion();
}

// State management using svelte/store
import { writable, get } from "svelte/store";

// Version counter — incremented on every mutation to trigger reactivity
export const logicVersion = writable(0);

// Focus request — set after add operations so FilterTree can focus the new element
export const focusRequest = writable(null);
function bumpVersion() {
  logicVersion.update((n) => n + 1);
}

export const schema = writable({
  direct_fields: [],
  subject_types: {},
  relation_types: {},
  staff_positions: {},
});

export const schemaOptions = writable({
  types: {},
  platforms: [],
  relations: [],
  positions: [],
  meta_tags: [],
});

export const lastResult = writable(null);
export const queryLoading = writable(false);
export const sortState = writable({ col: -1, asc: true });
export const queryTarget = writable("subject");

// Logic tree ID counter
let _logicIdCounter = 0;

export function newLogicGroup(op) {
  return { op: op || "and", items: [], _id: ++_logicIdCounter };
}

export const subjectRootLogic = writable(newLogicGroup("and"));
export const personRootLogic = writable(newLogicGroup("and"));

export function getRootLogic() {
  const target = get(queryTarget);
  return target === "person" ? get(personRootLogic) : get(subjectRootLogic);
}

export function updateRootLogic(lg) {
  const target = get(queryTarget);
  if (target === "person") personRootLogic.set(lg);
  else subjectRootLogic.set(lg);
  bumpVersion();
}

export function resetLogicBuilder() {
  _logicIdCounter = 0;
  subjectRootLogic.set(newLogicGroup("and"));
  personRootLogic.set(newLogicGroup("and"));
}

// ---- Logic tree helpers ----

export function findLogicGroup(node, id) {
  if (node._id === id) return node;
  for (const item of node.items) {
    if (item.logic) {
      const r = findLogicGroup(item.logic, id);
      if (r) return r;
    }
    if (item.relation?.conditions) {
      for (const c of item.relation.conditions) {
        if (c.logic) {
          const r = findLogicGroup(c.logic, id);
          if (r) return r;
        }
      }
    }
    if (item.person_relation?.conditions) {
      for (const c of item.person_relation.conditions) {
        if (c.logic) {
          const r = findLogicGroup(c.logic, id);
          if (r) return r;
        }
      }
    }
    if (item.staff?.conditions) {
      for (const c of item.staff.conditions) {
        if (c.logic) {
          const r = findLogicGroup(c.logic, id);
          if (r) return r;
        }
      }
    }
    if (item.episode?.logic) {
      const r = findLogicGroup(item.episode.logic, id);
      if (r) return r;
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
    if (item.relation?.conditions) {
      for (const c of item.relation.conditions) {
        if (c.logic && removeLogicItemById(c.logic, id)) return true;
      }
    }
    if (item.person_relation?.conditions) {
      for (const c of item.person_relation.conditions) {
        if (c.logic && removeLogicItemById(c.logic, id)) return true;
      }
    }
    if (item.staff?.conditions) {
      for (const c of item.staff.conditions) {
        if (c.logic && removeLogicItemById(c.logic, id)) return true;
      }
    }
    if (item.episode?.logic && removeLogicItemById(item.episode.logic, id))
      return true;
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
    case "count":
      return { count: { what: "", operator: "gt", value: "" } };
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
  // Target is this node itself
  if (node._id === targetId) {
    return { ...node, items: mutator([...node.items]) };
  }
  const newItems = [...node.items];
  for (let i = 0; i < newItems.length; i++) {
    const item = newItems[i];
    if (item.logic) {
      if (item.logic._id === targetId) {
        // Spread all group properties (op, _id, _ctx) + new items from mutator
        const newLogic = {
          ...item.logic,
          items: mutator([...item.logic.items]),
        };
        newItems[i] = { logic: newLogic };
        return { ...node, items: newItems };
      }
      const updated = updateGroupInTree(item.logic, targetId, mutator);
      if (updated !== item.logic) {
        newItems[i] = { logic: updated };
        return { ...node, items: newItems };
      }
    }
    // relation
    if (item.relation?.conditions) {
      let changed = false;
      const newConds = item.relation.conditions.map((c) => {
        if (c.logic && !changed) {
          if (c.logic._id === targetId) {
            changed = true;
            return {
              logic: { ...c.logic, items: mutator([...c.logic.items]) },
            };
          }
          const updated = updateGroupInTree(c.logic, targetId, mutator);
          if (updated !== c.logic) {
            changed = true;
            return { logic: updated };
          }
        }
        return c;
      });
      if (changed) {
        newItems[i] = { relation: { ...item.relation, conditions: newConds } };
        return { ...node, items: newItems };
      }
    }
    // person_relation
    if (item.person_relation?.conditions) {
      let changed = false;
      const newConds = item.person_relation.conditions.map((c) => {
        if (c.logic && !changed) {
          if (c.logic._id === targetId) {
            changed = true;
            return {
              logic: { ...c.logic, items: mutator([...c.logic.items]) },
            };
          }
          const updated = updateGroupInTree(c.logic, targetId, mutator);
          if (updated !== c.logic) {
            changed = true;
            return { logic: updated };
          }
        }
        return c;
      });
      if (changed) {
        newItems[i] = {
          person_relation: { ...item.person_relation, conditions: newConds },
        };
        return { ...node, items: newItems };
      }
    }
    // staff
    if (item.staff?.conditions) {
      let changed = false;
      const newConds = item.staff.conditions.map((c) => {
        if (c.logic && !changed) {
          if (c.logic._id === targetId) {
            changed = true;
            return {
              logic: { ...c.logic, items: mutator([...c.logic.items]) },
            };
          }
          const updated = updateGroupInTree(c.logic, targetId, mutator);
          if (updated !== c.logic) {
            changed = true;
            return { logic: updated };
          }
        }
        return c;
      });
      if (changed) {
        newItems[i] = { staff: { ...item.staff, conditions: newConds } };
        return { ...node, items: newItems };
      }
    }
    // episode
    if (item.episode?.logic) {
      if (item.episode.logic._id === targetId) {
        newItems[i] = {
          episode: {
            ...item.episode,
            logic: {
              ...item.episode.logic,
              items: mutator([...item.episode.logic.items]),
            },
          },
        };
        return { ...node, items: newItems };
      }
      const updated = updateGroupInTree(item.episode.logic, targetId, mutator);
      if (updated !== item.episode.logic) {
        newItems[i] = { episode: { ...item.episode, logic: updated } };
        return { ...node, items: newItems };
      }
    }
  }
  return node; // not found
}

function applyMutation(targetGroupId, mutator) {
  const target = get(queryTarget);
  const store = target === "person" ? personRootLogic : subjectRootLogic;
  store.update((root) => updateGroupInTree(root, targetGroupId, mutator));
}

export function addToGroup(group, filter) {
  applyMutation(group._id, (items) => {
    items.push(filter);
    return items;
  });
}

export function addCondition(group, type, ctx) {
  if (type.startsWith("ep_")) {
    addToGroup(group, {
      field: { field: type.slice(3), operator: "contains", value: "" },
    });
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
  // Remove from parent — needs tree search
  const root = getRootLogic();
  removeLogicItemById(root, groupId);
  const target = get(queryTarget);
  const store = target === "person" ? personRootLogic : subjectRootLogic;
  store.update((v) => ({ ...v }));
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
  const target = get(queryTarget);
  const store = target === "person" ? personRootLogic : subjectRootLogic;
  store.update((root) => {
    function cloneAndUpdate(node) {
      if (node._id === group._id) return { ...node, op: val };
      const newItems = [...node.items];
      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];
        if (item.logic) {
          if (item.logic._id === group._id) {
            newItems[i] = { logic: { ...item.logic, op: val } };
            return { ...node, items: newItems };
          }
          const updated = cloneAndUpdate(item.logic);
          if (updated !== item.logic) {
            newItems[i] = { logic: updated };
            return { ...node, items: newItems };
          }
        }
        if (item.relation?.conditions) {
          let changed = false;
          const newConds = item.relation.conditions.map((c) => {
            if (c.logic && !changed) {
              if (c.logic._id === group._id) {
                changed = true;
                return { logic: { ...c.logic, op: val } };
              }
              const updated = cloneAndUpdate(c.logic);
              if (updated !== c.logic) {
                changed = true;
                return { logic: updated };
              }
            }
            return c;
          });
          if (changed) {
            newItems[i] = {
              relation: { ...item.relation, conditions: newConds },
            };
            return { ...node, items: newItems };
          }
        }
        if (item.person_relation?.conditions) {
          let changed = false;
          const newConds = item.person_relation.conditions.map((c) => {
            if (c.logic && !changed) {
              if (c.logic._id === group._id) {
                changed = true;
                return { logic: { ...c.logic, op: val } };
              }
              const updated = cloneAndUpdate(c.logic);
              if (updated !== c.logic) {
                changed = true;
                return { logic: updated };
              }
            }
            return c;
          });
          if (changed) {
            newItems[i] = {
              person_relation: {
                ...item.person_relation,
                conditions: newConds,
              },
            };
            return { ...node, items: newItems };
          }
        }
        if (item.staff?.conditions) {
          let changed = false;
          const newConds = item.staff.conditions.map((c) => {
            if (c.logic && !changed) {
              if (c.logic._id === group._id) {
                changed = true;
                return { logic: { ...c.logic, op: val } };
              }
              const updated = cloneAndUpdate(c.logic);
              if (updated !== c.logic) {
                changed = true;
                return { logic: updated };
              }
            }
            return c;
          });
          if (changed) {
            newItems[i] = { staff: { ...item.staff, conditions: newConds } };
            return { ...node, items: newItems };
          }
        }
        if (item.episode?.logic) {
          if (item.episode.logic._id === group._id) {
            newItems[i] = {
              episode: {
                ...item.episode,
                logic: { ...item.episode.logic, op: val },
              },
            };
            return { ...node, items: newItems };
          }
          const updated = cloneAndUpdate(item.episode.logic);
          if (updated !== item.episode.logic) {
            newItems[i] = { episode: { ...item.episode, logic: updated } };
            return { ...node, items: newItems };
          }
        }
      }
      return node;
    }
    return cloneAndUpdate(root);
  });
}

export function updateCondition(group, idx, kind, field, value) {
  if (!group || !group.items[idx]) return;
  const oldItem = group.items[idx];
  const oldTarget = oldItem[kind];
  if (!oldTarget || typeof oldTarget !== "object") return;
  // Create new item with updated field — immutable so Svelte detects the change
  const newItem = { ...oldItem, [kind]: { ...oldTarget, [field]: value } };
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
  const target = get(queryTarget);
  if (target === "person") personRootLogic.set(newRoot);
  else subjectRootLogic.set(newRoot);
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

export function ctxFieldConfigs(ctx) {
  return ctx === CTX_PERSON ? PERSON_FIELD_CONFIGS : SUBJECT_FIELD_CONFIGS;
}

export function ctxFields(ctx) {
  if (ctx === CTX_EPISODE) return EPISODE_FIELDS;
  if (ctx === CTX_PERSON) return PERSON_FIELDS;
  const s = get(schema);
  return s.direct_fields || [];
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

export function getTypeOptions() {
  const s = get(schema);
  const types = s.subject_types || {};
  return Object.entries(types).map(([name, val]) => [String(val), name]);
}

export function getPlatformOptions() {
  const opts = get(schemaOptions);
  return (opts.platforms || []).map((p) => [String(p.code), p.name]);
}

export function fieldSelectOptions(fc, schemaVal) {
  if (fc.dynamic === "type") {
    const types = (schemaVal || get(schema)).subject_types || {};
    return Object.entries(types).map(([name, val]) => [String(val), name]);
  }
  if (fc.dynamic === "platform") {
    const opts = get(schemaOptions);
    return (opts.platforms || []).map((p) => [String(p.code), p.name]);
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
    regex: "~=",
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

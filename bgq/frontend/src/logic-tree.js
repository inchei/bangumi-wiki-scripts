import {
  newLogicGroup,
  getTargetStore,
  getRootLogic,
  focusRequest,
  ctxFieldConfigs,
  EPISODE_FIELD_CONFIGS,
  resetLogicIdCounter,
  incLogicIdCounter,
} from "./stores.js";

// ---- Logic tree helpers ----

// Iterate all condition arrays in an item (relation, staff, character, etc.)
// Calls fn(conditions, key, condKey) for each `.conditions` and
// `.subject_conditions` array. `key` is the filter kind ("person_character"
// etc.), `condKey` is the array field name so callers can write updates back
// to the correct array.
function forEachCondArray(item, fn) {
  for (const key of Object.keys(item)) {
    const val = item[key];
    if (val && typeof val === "object") {
      if (Array.isArray(val.conditions)) fn(val.conditions, key, "conditions");
      if (Array.isArray(val.subject_conditions))
        fn(val.subject_conditions, key, "subject_conditions");
      if (Array.isArray(val.character_conditions))
        fn(val.character_conditions, key, "character_conditions");
      if (Array.isArray(val.person_conditions))
        fn(val.person_conditions, key, "person_conditions");
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
      forEachCondArray(item, (conds, key, condKey) => {
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
          const newVal = { ...val, [condKey]: newConds };
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
    // episode.logic (direct, not in conditions array)
    if (!found) {
      for (const key of Object.keys(item)) {
        if (found) break;
        const val = item[key];
        if (
          val?.logic &&
          typeof val.logic === "object" &&
          !Array.isArray(val.logic) &&
          !val.conditions
        ) {
          if (val.logic._id === id) {
            newItems.push({ ...item, [key]: { ...val, logic: undefined } });
            found = true;
            changed = true;
            break;
          }
          const updated = removeItemById(val.logic, id);
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
    case "person_cast_subject":
      return {
        person_cast_subject: {
          type: "",
          mode: "any",
          character_mode: "any",
          conditions: [{ logic: newLogicGroup("and") }],
          character_conditions: [{ logic: newLogicGroup("and") }],
        },
      };
    case "subject_cast":
      return {
        subject_cast: {
          type: "",
          mode: "any",
          person_conditions: [{ logic: newLogicGroup("and") }],
          character_conditions: [{ logic: newLogicGroup("and") }],
        },
      };
    case "appear_eps":
      return {
        field: { field: "appear_eps", operator: "contains", value: "" },
      };
    case "staff":
      return {
        staff: {
          position: "",
          positions: [],
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
  episode_id: "eq",
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
    forEachCondArray(item, (conds, key, condKey) => {
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
        newItems.push({ ...item, [key]: { ...val, [condKey]: newConds } });
        found = true;
        changed = true;
      }
    });
    // episode.logic (direct, not in conditions array)
    if (!found) {
      for (const key of Object.keys(item)) {
        if (found) break;
        const val = item[key];
        if (
          val?.logic &&
          typeof val.logic === "object" &&
          !Array.isArray(val.logic) &&
          !val.conditions
        ) {
          if (val.logic._id === id) {
            newItems.push({ ...item, [key]: { ...val, logic: undefined } });
            found = true;
            changed = true;
            break;
          }
          const updated = removeItemById(val.logic, id);
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

export function updateStaffPositions(group, idx, parts) {
  applyMutation(group._id, (items) => {
    const oldItem = items[idx];
    const oldTarget = oldItem.staff || {};
    const updated = {
      ...oldTarget,
      position: parts[0] || "",
      positions: parts,
    };
    items[idx] = { ...oldItem, staff: updated };
    return items;
  });
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
  // When switching character_mode to "count", initialize character_count_op/character_count_val defaults
  if (field === "character_mode" && value === "count") {
    if (!updated.character_count_op) updated.character_count_op = "gte";
    if (!updated.character_count_val) updated.character_count_val = "";
  }
  const newItem = { ...oldItem, [kind]: updated };
  applyMutation(group._id, (items) => {
    items[idx] = newItem;
    return items;
  });
}

export function applyFiltersFromAPI(apiFilters) {
  resetLogicIdCounter();
  let newRoot;
  if (apiFilters.length === 1 && apiFilters[0].logic) {
    newRoot = assignLogicIds(apiFilters[0].logic);
  } else {
    newRoot = { op: "and", items: apiFilters, _id: incLogicIdCounter() };
    for (const item of newRoot.items) assignFilterIds(item);
  }
  getTargetStore().set(newRoot);
}

function assignLogicIds(lg) {
  if (!lg._id) lg._id = incLogicIdCounter();
  for (const item of lg.items) {
    assignFilterIds(item);
  }
  return lg;
}

// assignFilterIds assigns _id to every nested logic group reachable from a
// filter item: plain logic groups, relation/staff/character conditions, and
// person_character/character_person (subject_)conditions / episode logic.
// Nested groups without _id are not addressable by tree mutations (toggle op,
// add/remove condition) keyed by group id.
function assignFilterIds(item) {
  if (!item || typeof item !== "object") return;
  if (item.logic) {
    assignLogicIds(item.logic);
    return;
  }
  for (const key of [
    "relation",
    "person_relation",
    "character_relation",
    "staff",
    "character",
    "person_character",
    "person_cast_subject",
    "character_person",
    "subject_cast",
  ]) {
    const v = item[key];
    if (!v) continue;
    for (const c of v.conditions || []) assignFilterIds(c);
    for (const c of v.subject_conditions || []) assignFilterIds(c);
    for (const c of v.character_conditions || []) assignFilterIds(c);
    for (const c of v.person_conditions || []) assignFilterIds(c);
  }
  if (item.episode?.logic) assignLogicIds(item.episode.logic);
}

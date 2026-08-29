// Association output column helpers: prefix registry, token parse/build, and
// suggestion generators for the output/sort inputs in QuerySettings.
//
// Backend syntax mirrored here (see internal/query/builder.go):
//   前缀.字段        first match, scalar
//   前缀.字段+       all matches, comma-joined
//   前缀.count       count of matches
//   前缀.{f1|f2}[+]  group JSON (object / array); members prefixed "s." are
//                    subject-level fields (person_character/character_person)
//
// Name collisions: a BARE token identical to an association prefix (e.g. "导演"
// alone) is a plain (infobox/direct) column — the row editors below only ever
// manage tokens containing "." with a recognized prefix and never rewrite
// bare tokens.

import {
  relationsByType,
  positionsByType,
  PERSON_CHAR_TYPES,
  PERSON_RELATIONS,
  CHARACTER_RELATIONS,
  CHARACTER_ASSOC_TYPES,
} from "./schema-data.js";
import {
  ctxFields,
  CTX_SUBJECT,
  CTX_PERSON,
  CTX_CHARACTER,
  CTX_EPISODE,
} from "./stores.js";

// Curated per-entity field lists (direct fields + commonly used infobox keys,
// matching the filter UI's notion of entity fields). Stage-3 suggestions use
// these; free-form infobox fields remain allowed via manual input.
export const ENTITY_FIELDS = {
  subject: ctxFields(CTX_SUBJECT),
  person: ctxFields(CTX_PERSON),
  character: ctxFields(CTX_CHARACTER),
  episode: ctxFields(CTX_EPISODE),
};

export const ENTITY_LABELS = {
  subject: "条目",
  person: "人物",
  character: "角色",
  episode: "剧集",
};

// assocPrefixesForTarget returns the association prefixes usable in output
// columns for a query target:
//   { prefix, entity, dual }
// entity = which entity the non-"s." fields resolve against; dual marks
// person_character/character_person prefixes whose group members may also
// include subject-level "s." fields (GUI exposes them as a second field box).
export function assocPrefixesForTarget(target) {
  const positions = positionsByType(0);
  switch (target) {
    case "person":
      return [
        ...positions.map((prefix) => ({ prefix, entity: "subject" })),
        ...PERSON_RELATIONS.map((prefix) => ({ prefix, entity: "person" })),
        ...PERSON_CHAR_TYPES.map((prefix) => ({
          prefix,
          entity: "character",
          dual: true,
        })),
      ];
    case "character":
      return [
        ...CHARACTER_RELATIONS.map((prefix) => ({
          prefix,
          entity: "character",
        })),
        ...PERSON_CHAR_TYPES.map((prefix) => ({
          prefix,
          entity: "person",
          dual: true,
        })),
      ];
    case "episode":
      return [];
    default:
      return [
        ...relationsByType(0).map((prefix) => ({ prefix, entity: "subject" })),
        ...positions.map((prefix) => ({ prefix, entity: "person" })),
        ...CHARACTER_ASSOC_TYPES.map((prefix) => ({
          prefix,
          entity: "character",
        })),
        { prefix: "episode", entity: "episode" },
      ];
  }
}

// assocRowsFromFilters scans the FIRST level of the filter tree (root logic
// group's direct items; nested associations intentionally have no GUI) and
// returns one row descriptor per distinct association prefix.
export function assocRowsFromFilters(target, rootItems) {
  const rows = [];
  const seen = new Set();
  const push = (prefix, entity, dual) => {
    if (!prefix || seen.has(prefix)) return;
    seen.add(prefix);
    rows.push({ key: `${target}:${prefix}`, prefix, entity, dual: !!dual });
  };
  for (const item of rootItems || []) {
    if (!item || item.logic) continue;
    if (target === "subject") {
      if (item.relation) push(item.relation.type, "subject");
      if (item.staff) {
        const parts =
          item.staff.positions?.length > 0
            ? item.staff.positions
            : [item.staff.position];
        for (const p of parts) push(p, "person");
      }
      if (item.character) push(item.character.type, "character");
      if (item.episode) push("episode", "episode");
    } else if (target === "person") {
      if (item.staff) {
        const parts =
          item.staff.positions?.length > 0
            ? item.staff.positions
            : [item.staff.position];
        for (const p of parts) push(p, "subject");
      }
      if (item.person_relation) push(item.person_relation.type, "person");
      if (item.person_character)
        push(item.person_character.type, "character", true);
    } else if (target === "character") {
      if (item.character_relation)
        push(item.character_relation.type, "character");
      if (item.character_person)
        push(item.character_person.type, "person", true);
    }
  }
  return rows;
}

// parseAssocToken parses one output-column token belonging to `prefix`.
// Returns null when the token does not belong to the prefix, and { raw: true }
// for forms the row editor does not manage (count / ~min / ~max), leaving them
// to manual editing in the main input. "前缀.s.*" tokens are NOT managed here
// either (GUI merges subject fields into the shared group token instead).
export function parseAssocToken(token, prefix) {
  const head = prefix + ".";
  if (!token.startsWith(head) || token.startsWith(head + "s.")) return null;
  const rest = token.slice(head.length);
  if (!rest) return null;
  if (rest === "count" || /~min|~max/.test(rest)) return { raw: true };
  if (rest.startsWith("{")) {
    const m = rest.match(/^\{([^}]*)\}(\+)?$/);
    if (!m) return { raw: true };
    const fields = [];
    const subjectFields = [];
    for (const f of m[1].split("|")) {
      const v = f.trim();
      if (!v) continue;
      if (v.startsWith("s.")) subjectFields.push(v.slice(2));
      else fields.push(v);
    }
    return { fields, subjectFields, plus: !!m[2] };
  }
  const plus = rest.endsWith("+");
  const field = plus ? rest.slice(0, -1) : rest;
  if (!field || field.includes(".")) return { raw: true };
  return { fields: [field], subjectFields: [], plus };
}

// buildAssocToken renders a row's fields back into a token. A single field
// with first-only collapses to the scalar form (前缀.name); everything else is
// the group form. Returns null when no fields remain.
export function buildAssocToken(prefix, fields, subjectFields, plus) {
  const all = [
    ...(fields || []),
    ...(subjectFields || []).map((f) => "s." + f),
  ].filter(Boolean);
  if (all.length === 0) return null;
  if (all.length === 1 && !plus) return `${prefix}.${all[0]}`;
  return `${prefix}.{${all.join("|")}}${plus ? "+" : ""}`;
}

// Default fields when an association filter first appears: {id|name}+
// (dual rows also get the subject-level pair → CV.{id|name|s.id|s.name}+).
export const DEFAULT_ROW_FIELDS = ["id", "name"];

// makeOutputTokenLister builds the 3-stage autocomplete for the output
// columns input:
//   stage 1 (no "."):          plain fields + bare prefixes (full tokens)
//   stage 2 ("前缀."):          前缀.count and 前缀.{  (full tokens; non-field
//                              entries only — fields live inside the group,
//                              per UX design)
//   stage 3 ("前缀.{..." open): BARE field names suffixed "|" (e.g. "生日|",
//                              "s.发售日|" for dual prefixes). They are spliced
//                              into the braces at the caret position by the
//                              input (whole-column replacement only happens
//                              for full-token stages). Trailing "|" is
//                              harmless — the backend skips empty members.
export function makeOutputTokenLister(target, plainFields) {
  const infos = assocPrefixesForTarget(target);
  const prefixMap = new Map(infos.map((i) => [i.prefix, i]));
  const stage1 = [...new Set([...plainFields, ...infos.map((i) => i.prefix)])];
  return (token) => {
    const t = token.trim();
    if (!t.includes(".")) return stage1;
    const dot = t.indexOf(".");
    const prefix = t.slice(0, dot);
    const info = prefixMap.get(prefix);
    if (!info) return [];
    const rest = t.slice(dot + 1);
    if (rest.startsWith("{")) {
      if (rest.includes("}")) return [];
      let content = rest.slice(1);
      if (content.endsWith("+")) content = content.slice(0, -1);
      const members = content
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
      const existing = new Set(members);
      const out = [];
      for (const f of ENTITY_FIELDS[info.entity]) {
        if (!existing.has(f)) out.push(f + "|");
      }
      if (info.dual) {
        for (const f of ENTITY_FIELDS.subject) {
          if (!existing.has("s." + f)) out.push("s." + f + "|");
        }
      }
      return out;
    }
    // Stage 2: only while the remainder is empty or a partial of "count".
    if (rest === "" || (rest !== "count" && "count".startsWith(rest))) {
      return [`${prefix}.count`, `${prefix}.{`];
    }
    return [];
  };
}

// sortColumnSuggestions: flat combos for the sort field input (sorting uses
// scalar fields; group columns are not sortable, count is). Typing a prefix
// name surfaces all its "前缀.字段" / "前缀.字段+" combos without needing ".".
export function sortColumnSuggestions(target, plainFields) {
  const out = [...plainFields];
  for (const info of assocPrefixesForTarget(target)) {
    out.push(`${info.prefix}.count`);
    for (const f of ENTITY_FIELDS[info.entity]) {
      out.push(`${info.prefix}.${f}`, `${info.prefix}.${f}+`);
    }
    if (info.dual) {
      for (const f of ENTITY_FIELDS.subject) {
        out.push(`${info.prefix}.s.${f}`, `${info.prefix}.s.${f}+`);
      }
    }
  }
  return [...new Set(out)];
}

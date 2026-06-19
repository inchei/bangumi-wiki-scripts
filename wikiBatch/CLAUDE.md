# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A Tampermonkey userscript for batch-updating wiki entries (subject/character/person) on [Bangumi](https://bgm.tv/). Users upload a CSV, the script fetches current wiki state, shows a diff preview, and submits updates via either the Private (PATCH) API or legacy form (POST) API.

- `node build.js` — concatenates `src/` modules in dependency order, wraps in an IIFE, prepends `header.js` (UserScript metadata), and writes `dist/wikiBatch.user.js`
- No package manager, no test suite, no linter — plain standalone JS

## Architecture

**Module concatenation, not ESM.** `build.js` lists source files explicitly in dependency order. All `src/*.js` are plain scripts that define functions and variables in a shared scope. The `styles` module runs first (GM_addStyle is side-effectful), then `core` (defines `state` and `saveState`), then everything else. `dom.js` is last because `createStaticDOM()` is the entry point called at IIFE end.

**Function hoisting solves circular dependencies.** Every function is declared with `function` (not `const` or arrow), so they all exist by the time any of them run, regardless of concatenation order.

**Single `state` object** (defined in `core.js`) holds all mutable application state: credentials, CSV data, current processing index, UI view, current entity data, edit-region values, retry counts, commit message lock. `saveState()` persists relevant keys to `GM_setValue` (cross-page) and `localStorage` (session), enabling pause/resume across page reloads.

**View switching** (`views.js`): each view (`setup`, `processing`, `completed`, plus error variants) is rendered by a `switchTo*View()` function that overwrites `#core-content` and `#static-buttons-container` innerHTML, then re-binds inputs.

**Button delegation** (`dom.js` → `handlers.js`): a single click listener on `#static-buttons-container` dispatches by `state.currentView` to `handleSetupViewButtons`, `handleProcessingViewButtons`, or `handleCompletedViewButtons`.

**API layer** (`api.js`): `getEntityApiConfig(type, id)` maps entity types to wiki/history API paths and patch body keys. `submitUpdate()` handles both PATCH (via `GM_fetch`) and POST (via `GM.xmlHttpRequest` + form data). Characters/persons only support PATCH.

**Diff/update logic** (`diff.js`): `updateInfobox()` applies field-level changes to Wcode text using regex. `updateDiffDisplay()` uses `Diff.createPatch` + `Diff2HtmlUI` for the visual preview. Tags use set union/difference; series is a boolean toggle.

## Key constraints

- Runs only on `https://next.bgm.tv/` (@match in header.js)
- Requires Tampermonkey grants: `GM_addStyle`, `GM_setValue`, `GM_getValue`, `GM.xmlHttpRequest`
- External CDN dependencies declared in `@require`: `@trim21/gm-fetch`, `jsdiff`, `diff2html-ui`
- `dist/wikiBatch.user.js` is the built artifact — never edit it directly
- CSV must have an `id` column; optional `type` column (subject/character/crt/person/prsn, defaults to subject). Other columns are treated as Wcode field names. `tags` and `series` columns only apply to subjects.
- All DOM element IDs start with `bgm-` or `static-` prefix — follow this convention when adding new elements

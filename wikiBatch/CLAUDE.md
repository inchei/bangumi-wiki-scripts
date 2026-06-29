# CLAUDE.md

## Build

```bash
pnpm install         # Install dependencies
pnpm build           # esbuild bundle → dist/wikiBatch.user.js
pnpm typecheck       # tsc --noEmit (type checking only)
pnpm lint            # ESLint (src/)
pnpm lint:css        # Stylelint (src/*.css)
```

## Project Overview

Tampermonkey userscript for batch-updating wiki entries (subject/character/person) on [Bangumi](https://bgm.tv/). Users upload a CSV, the script fetches current wiki state, shows a diff preview, and submits updates via either the Private (PATCH) API or legacy form (POST) API.

## Build Process

1. `tsc` compiles `src/*.ts` → `.tsc-output/*.js` (module: none, functions stay in shared scope)
2. `build.js` reads `header.js` + `src/styles.css` (wraps in GM_addStyle) + compiled `.tsc-output/*.js` in dependency order
3. Wraps everything in an IIFE, writes `dist/wikiBatch.user.js`

## Architecture

**Module concatenation, not ESM.** `build.js` lists source files explicitly in dependency order. All `src/*.ts` are scripts that define functions and variables in a shared scope. The CSS block (from `styles.css`) is injected first (GM_addStyle is side-effectful), then `core` (defines `state` and `saveState`), then everything else. `dom.js` is last because `createStaticDOM()` is the entry point called at IIFE end.

**Function hoisting solves circular dependencies.** Every function is declared with `function` (not `const` or arrow), so they all exist by the time any of them run, regardless of concatenation order.

**TypeScript interfaces are declared in the same scope** (no modules). All shared types (`State`, `CsvItem`, `WikiData`, `EntityConfig`, etc.) are defined in `core.ts` as global interfaces, accessible to all subsequent files without imports.

**Single `state` object** (defined in `core.ts`) holds all mutable application state: credentials, CSV data, current processing index, UI view, current entity data, edit-region values, retry counts, commit message lock. `saveState()` persists relevant keys to `GM_setValue` (cross-page) and `localStorage` (session), enabling pause/resume across page reloads.

**View switching** (`views.ts`): each view (`setup`, `processing`, `completed`, plus error variants) is rendered by a `switchTo*View()` function that overwrites `#core-content` and `#static-buttons-container` innerHTML, then re-binds inputs.

**Button delegation** (`dom.ts` → `handlers.ts`): a single click listener on `#static-buttons-container` dispatches by `state.currentView` to `handleSetupViewButtons`, `handleProcessingViewButtons`, or `handleCompletedViewButtons`.

**API layer** (`api.ts`): `getEntityApiConfig(type, id)` maps entity types to wiki/history API paths and patch body keys. `submitUpdate()` handles both PATCH (via `GM_fetch`) and POST (via `GM.xmlHttpRequest` + form data). Characters/persons only support PATCH.

**Diff/update logic** (`diff.ts`): `updateInfobox()` applies field-level changes to Wcode text using regex. `updateDiffDisplay()` uses `Diff.createPatch` + `Diff2HtmlUI` for the visual preview. Tags use set union/difference; series is a boolean toggle.

## Key Constraints

- Runs only on `https://next.bgm.tv/` (@match in header.js)
- Requires Tampermonkey grants: `GM_addStyle`, `GM_setValue`, `GM_getValue`, `GM.xmlHttpRequest`
- External CDN dependencies declared in `@require`: `@trim21/gm-fetch`, `jsdiff`, `diff2html-ui`
- `dist/wikiBatch.user.js` is the built artifact — never edit it directly
- CSV must have an `id` column; optional `type` column (subject/character/crt/person/prsn, defaults to subject). Other columns are treated as Wcode field names. `tags` and `series` columns only apply to subjects.
- All DOM element IDs start with `bgm-` or `static-` prefix — follow this convention when adding new elements
- `src/styles.css` is the CSS source; edit there (not inside the GM_addStyle call in build output)

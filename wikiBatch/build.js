/**
 * Build script for wikiBatch userscript.
 * Concatenates source modules into a single userscript file.
 *
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

// Source files in dependency order
const MODULES = [
    'styles.js',    // GM_addStyle CSS + external stylesheets
    'core.js',      // State management
    'utils.js',     // Utility functions
    'ui.js',        // UI helpers
    'csv.js',       // CSV parsing
    'diff.js',      // Diff display & wiki text manipulation
    'api.js',       // API interaction
    'views.js',     // View switching
    'handlers.js',  // Button click handlers
    'dom.js',       // DOM creation & event binding
];

// Read header
const header = fs.readFileSync(path.join(ROOT, 'header.js'), 'utf8').trim();

// Read and combine all source modules
const sourceCode = MODULES
    .map((file) => {
        const content = fs.readFileSync(path.join(SRC, file), 'utf8').trim();
        return `// ===== ${file} =====\n\n${content}`;
    })
    .join('\n\n');

// Ensure dist directory exists
if (!fs.existsSync(DIST)) {
    fs.mkdirSync(DIST, { recursive: true });
}

// Assemble the final userscript
const output = [
    header,
    '',
    '(function () {',
    "    'use strict';",
    '',
    sourceCode,
    '',
    '    // ===== Initialization =====',
    '    createStaticDOM();',
    '})();',
    '',
].join('\n');

const outPath = path.join(DIST, 'wikiBatch.user.js');
fs.writeFileSync(outPath, output);
console.log(`Build complete: ${outPath}`);
console.log(`  ${MODULES.length} modules bundled`);
console.log(`  ${output.split('\n').length} lines total`);

/**
 * Build script for wikiBatch userscript.
 * Uses esbuild to bundle TypeScript + npm dependencies into a single file.
 *
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const sveltePlugin = require('esbuild-svelte');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const HEADER = fs.readFileSync(path.join(ROOT, 'header.js'), 'utf8').trim();

async function build() {
    if (!fs.existsSync(DIST)) {
        fs.mkdirSync(DIST, { recursive: true });
    }

    const result = await esbuild.build({
        entryPoints: [path.join(SRC, 'index.ts')],
        bundle: true,
        format: 'iife',
        outfile: path.join(DIST, 'wikiBatch.user.js'),
        loader: {
            '.css': 'text',
        },
        plugins: [sveltePlugin()],
        alias: {
            '@git-diff-view/lowlight': path.join(SRC, 'stubs/lowlight.ts'),
        },
        external: ['@git-diff-view/shiki'],
        logLevel: 'error',
        minify: true,
        banner: {
            js: HEADER + '\n',
        },
    });

    console.log(`Build complete: ${path.join(DIST, 'wikiBatch.user.js')}`);
}

build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});

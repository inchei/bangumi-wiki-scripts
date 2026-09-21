/**
 * Build script for wbt frontend.
 * Bundles TypeScript + CSS into dist/app.js + dist/app.css.
 */

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

async function build() {
    if (!fs.existsSync(DIST)) {
        fs.mkdirSync(DIST, { recursive: true });
    }

    const result = await esbuild.build({
        entryPoints: [path.join(SRC, 'index.ts')],
        bundle: true,
        format: 'iife',
        outfile: path.join(DIST, 'app.js'),
        loader: {
            '.css': 'text',
        },
        logLevel: 'error',
        minify: true,
        charset: 'utf8',
    });

    // Extract CSS loaded as text and write it to a separate file.
    // esbuild's '.css': 'text' loader inlines it; we instead import from app css chunk:
    // Simpler approach: copy styles.css directly.
    fs.copyFileSync(path.join(SRC, 'styles.css'), path.join(DIST, 'app.css'));

    const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Wiki 批量审核</title>
    <link rel="stylesheet" href="/assets/app.css">
    <style>html, body { margin: 0; height: 100%; }</style>
</head>
<body>
    <script src="/assets/app.js"></script>
</body>
</html>
`;
    fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml);

    if (result.warnings) {
        for (const w of result.warnings) console.warn(w);
    }
    console.log(`Build complete: ${path.join(DIST)}`);
}

build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});

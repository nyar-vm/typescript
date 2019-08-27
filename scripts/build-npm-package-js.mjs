#!/usr/bin/env node
/**
 * Generate publishable JS entries for npm packages.
 *
 * Node refuses to strip types from `.ts` files inside `node_modules`, so `main` /
 * `exports` / `bin` cannot point at TypeScript sources. This mirrors `src/` into
 * `dist/` with the built-in `stripTypeScriptTypes` and rewrites `.ts` specifiers
 * to `.js`.
 *
 * Usage:
 *   node scripts/build-npm-package-js.mjs
 *   node scripts/build-npm-package-js.mjs packages/typescript.ts/packages/typescript
 */

import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Packages that need a JS publish entry (relative to the repo root). */
const PACKAGE_DIRS = [
    'packages/typescript.ts/packages/typescript',
    'packages/typescript.ts/packages/typescript-harness',
];

/** Rewrite only relative specifiers: `'./x.ts'`, `"../x.ts"` → `.js`. */
const TS_SPECIFIER = /(['"])(\.{1,2}\/[^'"]*?)\.ts\1/g;

/** Recursively list every file under a directory. */
function listFiles(dir) {
    const out = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...listFiles(full));
        else if (entry.isFile()) out.push(full);
    }
    return out;
}

/**
 * Compile one package's `src/` into `dist/`.
 *
 * @param {string} packageDir package directory relative to the repo root
 */
export function buildNpmPackageJs(packageDir) {
    if (typeof stripTypeScriptTypes !== 'function') {
        throw new Error(`stripTypeScriptTypes requires Node >= 22.13 (current ${process.version})`);
    }
    const srcDir = path.join(ROOT, packageDir, 'src');
    const outDir = path.join(ROOT, packageDir, 'dist');
    if (!statSync(srcDir).isDirectory()) {
        throw new Error(`missing ${path.relative(ROOT, srcDir)}`);
    }

    rmSync(outDir, { recursive: true, force: true });
    const written = [];
    for (const file of listFiles(srcDir)) {
        if (!file.endsWith('.ts')) continue;
        const relative = path.relative(srcDir, file).replace(/\\/g, '/');
        const target = path.join(outDir, relative.replace(/\.ts$/, '.js'));
        const source = readFileSync(file, 'utf8');
        const stripped = stripTypeScriptTypes(source, { mode: 'strip' }).replace(TS_SPECIFIER, '$1$2.js$1');
        mkdirSync(path.dirname(target), { recursive: true });
        writeFileSync(target, stripped);
        written.push(path.relative(ROOT, target).replace(/\\/g, '/'));
    }
    return written;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const requested = process.argv.slice(2);
    const targets = requested.length > 0 ? requested : PACKAGE_DIRS;
    for (const dir of targets) {
        for (const file of buildNpmPackageJs(dir)) console.log(`built ${file}`);
    }
}

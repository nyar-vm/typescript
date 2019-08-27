#!/usr/bin/env node
/**
 * `typescript-napi` native binding build entry.
 *
 * Builds `packages/typescript.rs/typescript-npai` only, then copies the artifact into
 * `packages/typescript.ts/platforms/typescript-<short>/lib/typescript.<triple>.node`.
 *
 * Usage:
 *   node scripts/build.mjs napi
 *   node scripts/build.mjs napi --debug
 *   node scripts/build.mjs napi --all
 */

import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** @typedef {{ triple: string, packageDir: string, npmTriple: string, short: string }} NativeTarget */

const NATIVE_TARGETS = [
    { triple: 'x86_64-pc-windows-msvc', packageDir: 'typescript-win32-x64', npmTriple: 'win32-x64-msvc', short: 'win32-x64' },
    { triple: 'x86_64-unknown-linux-gnu', packageDir: 'typescript-linux-x64', npmTriple: 'linux-x64-gnu', short: 'linux-x64' },
    { triple: 'x86_64-apple-darwin', packageDir: 'typescript-darwin-x64', npmTriple: 'darwin-x64', short: 'darwin-x64' },
    { triple: 'aarch64-apple-darwin', packageDir: 'typescript-darwin-arm64', npmTriple: 'darwin-arm64', short: 'darwin-arm64' },
];

function parseArgs(argv) {
    const flags = argv.filter((arg) => arg.startsWith('-'));
    const positionals = argv.filter((arg) => !arg.startsWith('-'));
    return {
        mode: positionals.find((arg) => arg === 'napi') ?? 'napi',
        all: flags.includes('--all'),
        debug: flags.includes('--debug'),
    };
}

function run(command, args) {
    const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
    if ((result.status ?? 1) !== 0) {
        process.exit(result.status ?? 1);
    }
}

function hostTriple() {
    if (process.platform === 'win32') return 'x86_64-pc-windows-msvc';
    if (process.platform === 'darwin') return process.arch === 'arm64' ? 'aarch64-apple-darwin' : 'x86_64-apple-darwin';
    return process.arch === 'arm64' ? 'aarch64-unknown-linux-gnu' : 'x86_64-unknown-linux-gnu';
}

function selectTargets(targets, all) {
    if (all) return targets;
    const host = hostTriple();
    const exact = targets.find((target) => target.triple === host);
    return exact ? [exact] : [targets[0]];
}

function nativeLibCandidates(triple, release, libName) {
    const profile = release ? 'release' : 'debug';
    const dir = triple === hostTriple() ? join(ROOT, 'target', profile) : join(ROOT, 'target', triple, profile);
    if (triple.includes('windows')) return [join(dir, `${libName}.dll`)];
    if (triple.includes('apple')) return [join(dir, `lib${libName}.dylib`)];
    return [join(dir, `lib${libName}.so`), join(dir, `${libName}.so`)];
}

function findNativeArtifact(triple, release, libName) {
    const candidates = nativeLibCandidates(triple, release, libName);
    for (const candidate of candidates) {
        if (existsSync(candidate)) return candidate;
    }
    const profile = release ? 'release' : 'debug';
    const depsDir = triple === hostTriple()
        ? join(ROOT, 'target', profile, 'deps')
        : join(ROOT, 'target', triple, profile, 'deps');
    if (existsSync(depsDir)) {
        for (const name of readdirSync(depsDir)) {
            if (
                (name === libName || name.startsWith(`${libName}.`) || name.startsWith(`lib${libName}.`)) &&
                (name.endsWith('.dll') || name.endsWith('.so') || name.endsWith('.dylib') || name.endsWith('.node'))
            ) {
                return join(depsDir, name);
            }
        }
    }
    throw new Error(`missing build artifact (tried: ${candidates.join(', ')})`);
}

function buildNapi(opts) {
    const release = !opts.debug;
    const targets = selectTargets(NATIVE_TARGETS, opts.all);
    console.log(`build:napi → typescript-napi cdylib (${release ? 'release' : 'debug'}, ${targets.length} target(s))`);

    for (const target of targets) {
        const host = hostTriple();
        const profile = release ? ['--release'] : [];
        const targetArgs = target.triple === host ? [] : ['--target', target.triple];
        console.log(`\n→ ${target.triple} → packages/typescript.ts/platforms/${target.packageDir}`);
        run('cargo', ['build', ...profile, ...targetArgs, '-p', 'typescript-napi']);

        const source = findNativeArtifact(target.triple, release, 'typescript_napi');
        const destination = join(ROOT, 'packages', 'typescript.ts', 'platforms', target.packageDir, 'lib', `typescript.${target.npmTriple}.node`);
        mkdirSync(dirname(destination), { recursive: true });
        copyFileSync(source, destination);
        console.log(`  copied lib/typescript.${target.npmTriple}.node`);
    }
}

const opts = parseArgs(process.argv.slice(2));
if (opts.mode === 'napi') {
    buildNapi(opts);
} else {
    console.error(`unsupported mode '${opts.mode}' (only 'napi' is published from this repository)`);
    process.exit(1);
}

console.log('\nbuild complete');

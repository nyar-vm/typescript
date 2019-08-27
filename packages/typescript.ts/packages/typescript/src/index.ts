import { createRequire } from 'node:module';

/**
 * `@nyar/typescript` — npm wrapper for TypeScript language services.
 *
 * This package declares commands and package identity only; parsing, lexing and
 * formatting are delegated to `typescript-napi`, whose Rust implementation is owned
 * by Boost `language.typescript`.
 */

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { name: string; version: string };

/** npm package name (matches `package.json` `name`). */
export const PACKAGE_NAME = pkg.name;

/** Wrapper version (matches `package.json` `version`). */
export const PACKAGE_VERSION = pkg.version;

/** Commands provided after installation. */
export const COMMANDS = ['typescript'] as const;

/** Command name. */
export type Command = (typeof COMMANDS)[number];

export {
    check,
    format,
    loadNative,
    nativeBinaryName,
    parse,
    platformShort,
    platformTriple,
    resolveNativePath,
    tokens,
    version,
    type FormatOutcome,
    type ParseOutcome,
    type SyntaxNode,
    type TokenSpan,
} from './native.ts';

export { runTypeScriptCli } from './cli/typescript-cli.ts';

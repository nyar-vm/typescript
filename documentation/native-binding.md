# Native binding

## Crate

`packages/typescript.rs/typescript-npai` builds the `typescript-napi` crate. It is a
`cdylib` for Node and an `rlib` for tests.

Dependencies come from Boost by pinned revision:

```toml
language-typescript   = { git = "https://github.com/oovm/boost.rs", rev = "<sha>" }
data-text-core        = { git = "https://github.com/oovm/boost.rs", rev = "<sha>" }
data-text-typescript  = { git = "https://github.com/oovm/boost.rs", rev = "<sha>" }
```

All three use the same revision so Cargo resolves a single copy of each crate.
Raising the revision is a deliberate change: run the smoke tests before committing.

## Exports

| Rust | JS | Returns |
|------|----|---------|
| `typescript_version` | `typescriptVersion()` | crate version |
| `typescript_parse` | `typescriptParse(source)` | `{ ok, error, diagnostics, root, tokenCount }` |
| `typescript_tokens` | `typescriptTokens(source)` | `TokenSpan[]` |
| `typescript_check` | `typescriptCheck(source)` | `string[]` |
| `typescript_format` | `typescriptFormat(source)` | `{ ok, code, error }` |

N-API converts field names to camelCase on the JS side.

Boost `language.typescript` ships a CST formatter but no highlighter, so this addon
exposes formatting instead of highlight spans. Do not add a lexer-based highlighter
here; the ownership boundary puts language semantics in Boost.

## `.node` names

| Host | Target triple | Platform package | File |
|------|---------------|------------------|------|
| Windows x64 | `x86_64-pc-windows-msvc` | `typescript-win32-x64` | `typescript.win32-x64-msvc.node` |
| Linux x64 | `x86_64-unknown-linux-gnu` | `typescript-linux-x64` | `typescript.linux-x64-gnu.node` |
| macOS x64 | `x86_64-apple-darwin` | `typescript-darwin-x64` | `typescript.darwin-x64.node` |
| macOS arm64 | `aarch64-apple-darwin` | `typescript-darwin-arm64` | `typescript.darwin-arm64.node` |

`scripts/build.mjs` maps these automatically and copies the artifact into the
matching `platforms/typescript-<short>/lib/` directory.

## Adding an export

1. Add the pure function to Boost if it does not exist.
2. Wrap it in `typescript-napi` with `#[napi]` and an English doc comment.
   `deny(missing_docs)` is enabled.
3. Re-export it from `packages/typescript.ts/packages/typescript/src/native.ts` and
   `index.ts`.
4. Add a CLI command or flag only if users need it.
5. Rebuild and run the smoke tests:

```bash
node scripts/build.mjs napi
node packages/typescript.ts/packages/typescript/bin/typescript.mjs parse path/to/file.ts
```

`TYPESCRIPT_NATIVE=/absolute/path/to/typescript.node` lets you validate an addon
without rebuilding platform packages.

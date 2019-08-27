# Maintainer handbook

This handbook is for people changing the repository. End-user documentation lives
in the homepage at `/d/*` and is translated; this handbook is English-only.

## What this repository owns

The TypeScript language implementation is not here. Parsing, tokens and CST
formatting come from Boost `language.typescript` / `data.text.typescript`. This
repository owns:

- the Node-API addon (`typescript-napi`) that exposes those Rust capabilities to Node.js;
- the prebuilt `.node` platform packages;
- the npm packages (`@nyar/typescript`, `@nyar/typescript-harness`,
  `@nyar/typescript-skills`);
- the VMZ homepage and its multilingual user docs.

## Layout

| Path | Role |
|------|------|
| `packages/typescript.rs/typescript-npai` | `typescript-napi` Node-API addon (Rust) |
| `packages/typescript.ts/platforms/*` | Prebuilt `.node` addons per host |
| `packages/typescript.ts/packages/typescript` | Main package: CLI + API |
| `packages/typescript.ts/packages/typescript-harness` | Diagnostics and tuning harness |
| `packages/typescript.ts/packages/typescript-skills` | Agent guides |
| `packages/typescript.ts/homepage` | VMZ homepage and `/d/*` user docs |
| `documentation` | This maintainer handbook |
| `scripts` | Native build, JS emit and publish preparation |

## Quick start

```bash
pnpm install
cargo check --workspace
pnpm build                 # native addon + JS entries
pnpm --filter @nyar/typescript-homepage run build
```

Smoke test:

```bash
node packages/typescript.ts/packages/typescript/bin/typescript.mjs version
node packages/typescript.ts/packages/typescript/bin/typescript.mjs parse path/to/file.ts
```

## Rules of thumb

1. Keep the Rust crate a bridge. Do not implement parsing, formatting or type
   checking in JavaScript or in `typescript-napi`.
2. Bump the Boost revision in `Cargo.toml` when you need new language behaviour.
3. Translate user-facing docs; keep code, comments, CI and maintainer docs English.
4. Add a platform package only with a matching build target and `.node` name.

Continue with [Architecture](./architecture.md).

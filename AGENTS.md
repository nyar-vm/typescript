# AGENTS

Guidance for AI agents working in this repository. Humans should start with
[readme.md](./readme.md) and the [maintainer handbook](./documentation/index.md).

## What this repository is

`typescript` packages TypeScript language services for Node.js. The grammar, lexer
and CST formatter are owned by Boost `language.typescript` / `data.text.typescript`.
This repository owns only:

- the `typescript-napi` Node-API addon (`packages/typescript.rs/typescript-npai`);
- the prebuilt platform packages;
- the npm packages (`@nyar/typescript`, `@nyar/typescript-harness`,
  `@nyar/typescript-skills`);
- the VMZ homepage and its multilingual user docs.

There is no compiler, no emitter and no `nyar-vm` dependency here. Type checking and
emit belong to the official TypeScript toolchain; this repository is read-only
language tooling.

## Hard rules

1. The default branch is `dev`; CI targets only `dev`.
2. Rust is nightly because Boost enables unstable features.
3. `typescript-napi` stays a projection layer. Do not add parsing or formatting
   fallbacks in Rust or JavaScript. Extend Boost and bump the pinned revision.
4. Rust and npm dependencies are pinned to the Boost revision in `Cargo.toml`.
5. Repository content is English except translated user docs under
   `packages/typescript.ts/homepage/documents/`.
6. `documentation/` is plain Markdown with no build step.

## Commands

```bash
cargo check --workspace
cargo test --workspace
node scripts/build.mjs napi
pnpm install && pnpm build
```

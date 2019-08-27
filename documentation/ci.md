# CI and branches

## Branch policy

Only `dev` is targeted. There is no `main` branch and the workflows do not
reference one (or `master`).

```yaml
on:
  push:
    branches: [dev]
  pull_request:
    branches: [dev]
```

## Workflows

| File | Trigger | Jobs |
|------|---------|------|
| `check-rust.yml` | push/PR to `dev` | `cargo check --workspace --all-targets`, `cargo test --workspace` on ubuntu, macOS and Windows |
| `check-typescript.yml` | push/PR to `dev` | pnpm install, JS emit, homepage build, native addon build, CLI/harness smoke |
| `publish-npm.yml` | manual | four-host addon matrix, then `pnpm -r publish` |

Rust uses nightly because Boost enables unstable features. Cargo caches
`~/.cargo/git`, `~/.cargo/registry` and `target` keyed by `Cargo.lock`.

## Reproduce CI locally

```bash
cargo check --workspace --all-targets
cargo test --workspace

pnpm install --frozen-lockfile
pnpm build:js
pnpm --filter @nyar/typescript-homepage run build
node scripts/build.mjs napi
node packages/typescript.ts/packages/typescript/bin/typescript.mjs version
```

## Common failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| `failed to load source for dependency language-typescript` | Boost revision unreachable or mistyped | Check `git ls-remote https://github.com/oovm/boost.rs`, rerun `cargo check` |
| `frozen-lockfile` error | `pnpm-lock.yaml` out of date | `pnpm install`, commit the lockfile |
| Homepage build: missing markdown engine | `vmz.config.ts` lost the markdown plugin | Keep `@vmz/plugin-markdown-it` and `engines.markdown` |
| CLI: `typescript native addon not found` | platform package has no `.node` | `node scripts/build.mjs napi` |

## Docs in CI

`documentation/` is plain Markdown and has no build step. The homepage user docs
are built by `pnpm --filter @nyar/typescript-homepage run build` in the Node job.

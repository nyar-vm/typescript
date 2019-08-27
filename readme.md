# typescript

TypeScript language services packaged for Node.js.

The parser, lexer and CST formatter live in Boost `language.typescript` /
`data.text.typescript`. This repository ships the Node-API export layer and the npm
packages around it. It does not implement or embed a TypeScript compiler.

## Layout

| Path | Role |
|------|------|
| `packages/typescript.rs/typescript-npai` | `typescript-napi` Node-API addon (Rust) |
| `packages/typescript.ts/platforms/*` | Prebuilt `.node` addons per host |
| `packages/typescript.ts/packages/typescript` | Main package: CLI (`@vmz/commander`) + API |
| `packages/typescript.ts/packages/typescript-harness` | Diagnostics and parse-latency tuning |
| `packages/typescript.ts/packages/typescript-skills` | Agent guides |
| `packages/typescript.ts/homepage` | VMZ homepage; user docs at `/d/*` (multilingual) |
| `documentation` | Maintainer handbook (English) |

## Build

```bash
cargo check --workspace
node scripts/build.mjs napi          # build addon, copy into the host platform package
node scripts/build-npm-package-js.mjs
```

## CLI

```bash
typescript version
typescript parse file.ts --json
typescript tokens file.ts
typescript check src/*.ts
typescript format file.ts
typescript-harness bench file.ts -n 200
```

## License

AGPL-3.0-only. See [License.md](./License.md).

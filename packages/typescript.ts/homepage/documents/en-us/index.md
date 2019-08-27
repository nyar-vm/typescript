# TypeScript language services

`@nyar/typescript` brings TypeScript parsing to Node.js through a native Node-API
addon. It is read-only: you give it source text, it gives you syntax trees, tokens,
diagnostics and CST-formatted output. It does not type check or emit JavaScript.

## What you get

| Export | Returns |
|--------|---------|
| `parse(source)` | `{ ok, error, diagnostics, root, tokenCount }` |
| `tokens(source)` | `TokenSpan[]` with byte offsets |
| `check(source)` | `string[]` diagnostics |
| `format(source)` | `{ ok, code, error }` from the CST formatter |
| `version()` | native binding version |

## Install

```bash
npm install @nyar/typescript
```

The matching platform package is installed automatically.

## CLI

```bash
typescript version
typescript parse path/to/file.ts --json
typescript tokens path/to/file.ts
typescript check src/*.ts
typescript format path/to/file.ts
```

## Next

- [CLI](./cli.md)
- [API](./api.md)
- [Platforms and troubleshooting](./native.md)

---
name: typescript-language
description: Use @nyar/typescript and typescript-harness to parse TypeScript, inspect tokens, triage diagnostics, format source, and tune native parse throughput.
---

# TypeScript Language Services

Use this skill when a user asks to parse TypeScript, list tokens, collect parser
diagnostics, format TypeScript source, or benchmark the native binding.

## Ownership boundary

- The parser, lexer and CST formatter live in Boost `language.typescript` /
  `data.text.typescript`.
- `@nyar/typescript` is only an npm surface over the `typescript-napi` Node-API addon.
- Do not add parsing or formatting fallbacks in JavaScript. If a capability is
  missing, extend `typescript-napi` and rebuild the platform binding.
- `@nyar/typescript` does not type check or emit JavaScript. That belongs to the
  official TypeScript toolchain.

## Commands

| Command | Purpose |
|---------|---------|
| `typescript version` | Binding version |
| `typescript parse <file> [--json]` | Syntax tree with byte spans |
| `typescript tokens <file> [--json]` | Token kinds and spans |
| `typescript check <file...>` | Parser diagnostics |
| `typescript format <file> [--json]` | CST-formatted source |
| `typescript-harness bench <file> -n 200` | Repeated parse latency |
| `typescript-harness tokens <file>` | Token counts by kind |

## API

```ts
import { parse, tokens, check, format } from '@nyar/typescript';

const outcome = parse('const x: number = 1;');
if (!outcome.ok) console.error(outcome.error, outcome.diagnostics);
```

## Native resolution

`@nyar/typescript` loads `@nyar/typescript-<platform>/lib/typescript.<triple>.node`.
Set `TYPESCRIPT_NATIVE` to validate a freshly built addon without reinstalling
platform packages.

## Rebuild

```bash
node scripts/build.mjs napi
node scripts/build.mjs napi --all
```

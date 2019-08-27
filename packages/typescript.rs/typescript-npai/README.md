# typescript-napi

Node-API export layer for TypeScript language services. All parsing, lexing and CST
formatting behaviour comes from Boost `language.typescript` / `data.text.typescript`;
this crate only moves arguments across the bridge.

| Export | Returns |
|--------|---------|
| `typescript_version` | crate version |
| `typescript_parse` | `{ ok, error, diagnostics, root, tokenCount }` |
| `typescript_tokens` | `TokenSpan[]` |
| `typescript_check` | `string[]` |
| `typescript_format` | `{ ok, code, error }` |

Build with `node scripts/build.mjs napi` from the repository root.

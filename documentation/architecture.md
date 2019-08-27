# Architecture

## One pipeline

```
Boost language.typescript / data.text.typescript
        │  pure Rust parsing, lexing, CST formatting
        ▼
packages/typescript.rs/typescript-npai  (crate typescript-napi, cdylib + rlib)
        │  N-API objects: parse tree, token spans, diagnostics, formatted source
        ▼
packages/typescript.ts/platforms/typescript-<platform>/lib/typescript.<triple>.node
        │  prebuilt addon selected by host OS/arch
        ▼
@nyar/typescript (native.ts → CLI + API) · @nyar/typescript-harness
```

The homepage (`@nyar/typescript-homepage`) is a separate VMZ application. Its user
docs are Markdown under `packages/typescript.ts/homepage/documents/` and mount at
`/d/`.

## Ownership boundary

| Layer | Owner | May change |
|-------|-------|-----------|
| TypeScript grammar, lexer, formatter | Boost `language.typescript` / `data.text.typescript` | No (bump the revision) |
| N-API object shape and exports | `typescript-napi` | Yes |
| Host binding resolution and CLI | `@nyar/typescript` | Yes |
| Diagnostics and latency loop | `@nyar/typescript-harness` | Yes |
| User docs | homepage `documents/` | Yes (all locales) |

`typescript-napi` must stay a projection layer. If a capability is missing, add it to
Boost and raise the pinned revision instead of reimplementing it here.

## Parse data flow

1. `typescriptParse(source)` builds a `TypeScriptLanguage`, `TypeScriptParser`,
   `TypeScriptLexer` and a `ParseSession`, then calls `data_text_core::parser::parse`.
2. The green tree is walked once. Nodes become `SyntaxNode`; leaves become both
   `SyntaxNode` children and `TokenSpan` rows. Offsets are byte offsets.
3. `typescriptCheck` returns the session diagnostics; a fatal error is placed first.
4. `typescriptFormat` calls `language_typescript::formatter::format_source` with
   default `FormatOptions` (4-space indent, 144-column soft wrap) and returns the
   formatted text without touching token text.
5. `typescriptTokens` reuses the same parse entry point so spans stay consistent
   across commands.

## Binding resolution

`native.ts` resolves the addon in this order:

1. `TYPESCRIPT_NATIVE` when set;
2. `@nyar/typescript-<short>/lib/typescript.<triple>.node` via `require.resolve`;
3. repository-relative `platforms/typescript-<short>/lib/...` (local development);
4. `node_modules/@nyar/typescript-<short>/...`.

If none exist the error lists every path tried. Rebuild with
`node scripts/build.mjs napi`.

## Deliberate non-goals

- No JavaScript parser or formatter fallback.
- No type checker, emitter or virtual machine in this repository.
- No per-language code in the CLI.
- No committed `.node` binaries: platform packages are populated at release time.

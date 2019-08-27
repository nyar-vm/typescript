# @nyar/typescript-skills

Agent guides for the TypeScript language services package. Install the skill, then
ask the agent to parse files, inspect tokens, triage diagnostics, format source, or
tune throughput.

## Install

```bash
npx skills add @nyar/typescript-skills --skill typescript-language -y
```

## Scope

The `typescript-language` skill covers the `@nyar/typescript` CLI/API, native binding
resolution, the `typescript-harness` diagnostics loop, and the Boost
`language.typescript` ownership boundary. It does not teach TypeScript application
development, type check code, emit JavaScript, or replace the parser.

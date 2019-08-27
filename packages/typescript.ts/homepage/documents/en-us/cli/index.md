# CLI

The `typescript` command is a thin wrapper over the native binding. It parses and
formats TypeScript; it does not type check or emit JavaScript.

## Commands

| Command | Purpose |
|---------|---------|
| `typescript version` | Print the binding version |
| `typescript parse <file> [--json]` | Parse a file and report the syntax tree |
| `typescript tokens <file> [--json]` | List tokens with byte spans |
| `typescript check <file...>` | Report diagnostics for one or more files |
| `typescript format <file> [--json]` | Print CST-formatted source |

## Examples

```bash
typescript version
typescript parse src/index.ts
typescript parse src/index.ts --json
typescript tokens src/index.ts
typescript check src/*.ts
typescript format src/index.ts
```

## Output

- `parse` prints `parsed <file> (<n> token(s), <m> diagnostic(s))`, or the fatal
  error. With `--json` it prints the full `ParseOutcome`.
- `tokens` prints `kind`, `start`, `end` per line. With `--json` it prints
  `TokenSpan[]`.
- `check` prints `ok` or the diagnostics per file and a summary line.
- `format` prints the formatted source. With `--json` it prints the full
  `FormatOutcome`.

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | success |
| 1 | parse or format failed, or diagnostics were reported by `check` |
| 2 | missing or unreadable input |

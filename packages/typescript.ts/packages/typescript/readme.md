# @nyar/typescript

TypeScript language services for Node.js: syntax trees, tokens, diagnostics and CST
formatting over a native Node-API binding. It is read-only — you give it source text,
it gives you structured results. Type checking and emit belong to the official
TypeScript toolchain, not to this package.

## Usage

```bash
npx @nyar/typescript version
npx @nyar/typescript parse path/to/file.ts --json
npx @nyar/typescript tokens path/to/file.ts
npx @nyar/typescript check src/*.ts
npx @nyar/typescript format path/to/file.ts
```

## API

```ts
import { parse, tokens, check, format } from '@nyar/typescript';

const outcome = parse('const x: number = 1;');
console.log(outcome.ok, outcome.tokenCount);

const formatted = format('const x:number=1;');
if (formatted.ok) console.log(formatted.code);
```

The matching platform package is installed automatically.

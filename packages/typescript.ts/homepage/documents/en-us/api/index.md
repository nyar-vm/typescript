# API

All offsets are byte offsets into the source string.

## Parse

```ts
import { parse } from '@nyar/typescript';

const outcome = parse('const x: number = 1;');

outcome.ok;          // true when a tree was produced
outcome.error;       // fatal error message, or null
outcome.diagnostics; // non-fatal messages
outcome.tokenCount;  // number of leaves
outcome.root;        // SyntaxNode | null
```

`SyntaxNode`:

```ts
type SyntaxNode = {
    kind: string;
    start: number;
    end: number;
    children: SyntaxNode[];
};
```

## Tokens

```ts
import { tokens } from '@nyar/typescript';

for (const token of tokens('function f(): void {}')) {
    console.log(token.kind, token.start, token.end);
}
```

## Diagnostics

```ts
import { check } from '@nyar/typescript';

const messages = check('function f( {');
for (const message of messages) console.error(message);
```

A fatal error, when present, is the first entry.

## Formatting

```ts
import { format } from '@nyar/typescript';

const result = format('const x:number=1;');
if (result.ok) console.log(result.code);
```

The CST formatter edits whitespace only; token text is preserved.

## Version

```ts
import { version } from '@nyar/typescript';
console.log(version());
```

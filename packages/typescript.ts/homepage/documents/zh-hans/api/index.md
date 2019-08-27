# API

所有偏移都是源码字符串中的字节偏移。

## 解析

```ts
import { parse } from '@nyar/typescript';

const outcome = parse('const x: number = 1;');

outcome.ok;          // 产出语法树时为 true
outcome.error;       // 致命错误信息，或 null
outcome.diagnostics; // 非致命信息
outcome.tokenCount;  // 叶子数量
outcome.root;        // SyntaxNode | null
```

`SyntaxNode`：

```ts
type SyntaxNode = {
    kind: string;
    start: number;
    end: number;
    children: SyntaxNode[];
};
```

## 词法单元

```ts
import { tokens } from '@nyar/typescript';

for (const token of tokens('function f(): void {}')) {
    console.log(token.kind, token.start, token.end);
}
```

## 诊断

```ts
import { check } from '@nyar/typescript';

const messages = check('function f( {');
for (const message of messages) console.error(message);
```

如果存在致命错误，它会是第一条。

## 格式化

```ts
import { format } from '@nyar/typescript';

const result = format('const x:number=1;');
if (result.ok) console.log(result.code);
```

CST 格式化只调整空白，token 文本保持不变。

## 版本

```ts
import { version } from '@nyar/typescript';
console.log(version());
```

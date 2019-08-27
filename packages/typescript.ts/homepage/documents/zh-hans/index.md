# TypeScript 语言服务

`@nyar/typescript` 通过原生 Node-API 插件，把 TypeScript 解析能力带到 Node.js。
它是只读的：输入源码文本，输出语法树、词法单元、诊断信息与 CST 格式化结果。
它不做类型检查，也不产出 JavaScript。

## 能力

| 导出 | 返回 |
|------|------|
| `parse(source)` | `{ ok, error, diagnostics, root, tokenCount }` |
| `tokens(source)` | 带字节偏移的 `TokenSpan[]` |
| `check(source)` | `string[]` 诊断信息 |
| `format(source)` | CST 格式化结果 `{ ok, code, error }` |
| `version()` | 原生绑定版本 |

## 安装

```bash
npm install @nyar/typescript
```

会自动安装与当前平台匹配的原生包。

## 命令行

```bash
typescript version
typescript parse path/to/file.ts --json
typescript tokens path/to/file.ts
typescript check src/*.ts
typescript format path/to/file.ts
```

## 下一步

- [命令行](./cli.md)
- [API](./api.md)
- [平台与故障排查](./native.md)

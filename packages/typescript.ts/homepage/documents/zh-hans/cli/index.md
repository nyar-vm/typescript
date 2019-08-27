# 命令行

`typescript` 命令是原生绑定的一层薄包装。它只解析和格式化 TypeScript，
不做类型检查，也不产出 JavaScript。

## 命令

| 命令 | 用途 |
|------|------|
| `typescript version` | 打印绑定版本 |
| `typescript parse <file> [--json]` | 解析文件并输出语法树 |
| `typescript tokens <file> [--json]` | 输出带字节跨距的词法单元 |
| `typescript check <file...>` | 输出一个或多个文件的诊断 |
| `typescript format <file> [--json]` | 输出 CST 格式化结果 |

## 示例

```bash
typescript version
typescript parse src/index.ts
typescript parse src/index.ts --json
typescript tokens src/index.ts
typescript check src/*.ts
typescript format src/index.ts
```

## 输出

- `parse` 打印 `parsed <file> (<n> token(s), <m> diagnostic(s))`，失败时打印致命错误。
  加 `--json` 输出完整的 `ParseOutcome`。
- `tokens` 每行打印 `kind`、`start`、`end`。加 `--json` 输出 `TokenSpan[]`。
- `check` 对每个文件打印 `ok` 或诊断，并输出一行汇总。
- `format` 打印格式化后的源码。加 `--json` 输出完整的 `FormatOutcome`。

## 退出码

| 码 | 含义 |
|----|------|
| 0 | 成功 |
| 1 | 解析或格式化失败，或 `check` 报告了诊断 |
| 2 | 缺少输入或无法读取 |

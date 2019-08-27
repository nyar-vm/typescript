# 平台与排障

## 支持的平台

| 平台 | 平台包 | 二进制 |
|------|--------|--------|
| Windows x64 | `@nyar/typescript-win32-x64` | `typescript.win32-x64-msvc.node` |
| Linux x64 | `@nyar/typescript-linux-x64` | `typescript.linux-x64-gnu.node` |
| macOS x64 | `@nyar/typescript-darwin-x64` | `typescript.darwin-x64.node` |
| macOS arm64 | `@nyar/typescript-darwin-arm64` | `typescript.darwin-arm64.node` |

## 找不到原生插件

`typescript version` 会列出尝试过的所有路径。常见原因：

1. 包管理器跳过了可选依赖（`--no-optional`）。去掉该参数重新安装。
2. 你的系统/CPU 不在上表中。
3. 你在源码检出目录运行，但还没有构建插件。

本地构建：

```bash
node scripts/build.mjs napi
```

然后把 `TYPESCRIPT_NATIVE` 指向生成的文件，或等脚本把产物复制进平台包后直接重跑。

## 平台不匹配

每个平台包都声明了 `os` 与 `cpu`，避免安装到错误的二进制。如果你把
`node_modules` 从别的机器拷过来，删除后重新安装。

## 反馈解析问题

解析器由 Boost `language.typescript` 拥有，`@nyar/typescript` 不会改写结果。
若诊断看起来不对，请用 `typescript parse file.ts --json` 复现，并把该输出附在
报告里。

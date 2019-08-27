# 安装

## 环境要求

- Node.js 22.18 或更高版本。
- 受支持的平台：Windows x64、Linux x64、macOS x64、macOS arm64。

## npm

```bash
npm install @nyar/typescript
```

`@nyar/typescript` 为每个平台声明了一个可选依赖
（`@nyar/typescript-win32-x64`、`@nyar/typescript-linux-x64`、
`@nyar/typescript-darwin-x64`、`@nyar/typescript-darwin-arm64`）。
npm 只会安装与你的系统和 CPU 匹配的那一个。

## 验证

```bash
typescript version
typescript parse example.ts
```

如果找不到原生插件，`typescript version` 会打印尝试过的所有路径。参见
[平台与排障](../native.md)。

## 使用自定义插件

把 `TYPESCRIPT_NATIVE` 指向某个 `.node` 文件即可绕过平台解析：

```bash
TYPESCRIPT_NATIVE=/absolute/path/typescript.win32-x64-msvc.node typescript version
```

在发布平台包之前验证本地构建时很有用。

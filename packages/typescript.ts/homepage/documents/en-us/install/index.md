# Install

## Requirements

- Node.js 22.18 or newer.
- A supported host: Windows x64, Linux x64, macOS x64 or macOS arm64.

## npm

```bash
npm install @nyar/typescript
```

`@nyar/typescript` declares one optional dependency per host
(`@nyar/typescript-win32-x64`, `@nyar/typescript-linux-x64`,
`@nyar/typescript-darwin-x64`, `@nyar/typescript-darwin-arm64`). npm installs only
the one matching your OS and CPU.

## Verify

```bash
typescript version
typescript parse example.ts
```

If the addon cannot be found, `typescript version` prints every path it tried. See
[Platforms and troubleshooting](../native.md).

## Using a custom addon

Point `TYPESCRIPT_NATIVE` at a `.node` file to bypass platform resolution:

```bash
TYPESCRIPT_NATIVE=/absolute/path/typescript.win32-x64-msvc.node typescript version
```

This is useful when testing a local build before publishing a platform package.

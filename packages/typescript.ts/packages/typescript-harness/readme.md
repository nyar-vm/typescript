# @nyar/typescript-harness

Diagnostics and tuning harness for `@nyar/typescript`. It links the same native
binding through the platform optional dependencies, so a failing harness points at
the same addon the product CLI uses.

## Usage

```bash
typescript-harness version
typescript-harness check src/*.ts
typescript-harness bench path/to/file.ts --iterations 200
typescript-harness tokens path/to/file.ts
```

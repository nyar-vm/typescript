# Releasing

## Packages

| Package | Published | Notes |
|---------|-----------|-------|
| `@nyar/typescript` | yes | CLI and API; optional deps on platform packages |
| `@nyar/typescript-harness` | yes | Diagnostics and tuning |
| `@nyar/typescript-skills` | yes | Markdown guides only |
| `@nyar/typescript-<platform>` | yes | One `.node` per host |
| `@nyar/typescript-homepage` | no | private VMZ app |

`documentation/` is plain Markdown and is not a package.

All packages share version `0.1.0` today; bump them together.

## Platform packages as optional dependencies

Both `@nyar/typescript` and `@nyar/typescript-harness` declare:

```json
"optionalDependencies": {
  "@nyar/typescript-darwin-arm64": "workspace:*",
  "@nyar/typescript-darwin-x64": "workspace:*",
  "@nyar/typescript-linux-x64": "workspace:*",
  "@nyar/typescript-win32-x64": "workspace:*"
}
```

pnpm rewrites `workspace:*` to the published version at pack time. The host package
manager installs only the matching `os`/`cpu` optional dependency, so users download
one addon.

## Local release rehearsal

```bash
pnpm install
pnpm build                       # node scripts/build.mjs napi && build:js
pnpm -r publish --dry-run --no-git-checks
```

`prepack` runs `scripts/build-npm-package-js.mjs` and
`scripts/prepare-npm-publish.mjs`. The latter copies `readme.md` to `README.md` for
npm rendering.

## GitHub Actions

`.github/workflows/publish-npm.yml` is manual (`workflow_dispatch`). It:

1. builds the addon on `ubuntu-latest`, `windows-latest`, `macos-13`, `macos-14`;
2. uploads each `packages/typescript.ts/platforms/typescript-*/lib/*.node`;
3. downloads all artifacts into one checkout and runs `pnpm -r publish`.

Required secret: `NPM_TOKEN` (npm automation token). Without it the manual job
fails at the publish step; the regular CI does not run this workflow.

## Version checklist

1. Update `version` in the workspace and each npm package.
2. Bump the Boost revision only when language behaviour changed.
3. Run `pnpm build` and the CLI smoke test.
4. Run the publish workflow, then verify
   `npm view @nyar/typescript optionalDependencies`.

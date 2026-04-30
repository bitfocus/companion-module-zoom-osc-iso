---
name: 'tooling-ignore-squad'
description: 'Exclude the top-level .squad workspace from repo lint automation without disabling linting for real source files.'
domain: 'tooling'
confidence: 'high'
source: 'observed'
---

## Context

Use this when repo tooling should continue linting source, tests, configs, and docs, but should not process agent coordination files under the top-level `.squad/` directory.

## Patterns

### `lint-staged` in `package.json`

- Avoid basename-only globs like `"*.md"` when `.squad/` should be excluded, because `lint-staged` enables `matchBase` for patterns without slashes.
- Split patterns into:
  - root-only files with `"./*.{ext}"`
  - nested files outside `.squad/` with `"!(.squad)/**/*.{ext}"`

Example:

```json
{
  "./*.{css,json,md,scss}": ["prettier --write"],
  "!(.squad)/**/*.{css,json,md,scss}": ["prettier --write"]
}
```

### ESLint flat config

- Add a dedicated ignore-only config object near the top-level config array:

```js
{
	ignores: ['.squad/**'],
}
```

- Keep the rest of the generated/project config unchanged unless another exclusion is required.

## Examples

- `package.json` — use `./*` + `!(.squad)/**/*` patterns for staged file routing.
- `eslint.config.mjs` — add `ignores: ['.squad/**']` before spreading base config.

## Anti-Patterns

- Using basename-only `lint-staged` globs and assuming they only match repo-root files.
- Broadly disabling linting for all markdown or config files just to avoid `.squad/`.

# Decisions

## Exclude `.squad/` from repo lint tooling

- **By:** Kaylee
- **Requested by:** Justin James
- **Scope:** `package.json`, `eslint.config.mjs`

### Decision

Treat the top-level `.squad/` workspace as agent coordination content, not project source, in local lint automation.

### Implementation

- `lint-staged` now uses root-only `./*` globs plus `!(.squad)/**/*` nested globs so staged source/config files still run through Prettier/ESLint while `.squad/` is skipped.
- ESLint flat config now adds `ignores: ['.squad/**']` before the generated base config.

### Why it matters

This keeps team coordination notes, histories, and skill docs out of code-quality automation meant for module source files and operator-facing assets.

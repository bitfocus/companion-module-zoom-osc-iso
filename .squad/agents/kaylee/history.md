# Project Context

- **Owner:** Justin James
- **Project:** BitFocus Companion module for Zoom OSC and Zoom ISO applications communicating via OSC protocol
- **Stack:** TypeScript, Node.js, BitFocus Companion SDK
- **Created:** 2026-03-13

## Recent Updates

📌 **2026-04-28T00-41-22Z** — Config exclusion task completed. Orchestration log written. Decision merged to decisions.md.

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->
- Tooling now explicitly excludes the top-level `.squad/` workspace from both `lint-staged` in `package.json` and ESLint flat config in `eslint.config.mjs`.
- For `lint-staged`, root files are matched with `./*` patterns and nested repo files use `!(.squad)/**/*` so staged docs/config still run while `.squad/` stays untouched.
- Validation commands confirmed in this repo: `yarn lint`, `yarn build`, and `yarn test`.

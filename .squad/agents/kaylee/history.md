# Project Context

- **Owner:** Justin James
- **Project:** BitFocus Companion module for Zoom OSC and Zoom ISO applications communicating via OSC protocol
- **Stack:** TypeScript, Node.js, BitFocus Companion SDK
- **Created:** 2026-03-13

## Recent Updates

📌 **2026-04-28T03-57-11Z** — Scribe completed manifest routing: orchestration log, session log, and team history updates all finalized. Config exclusion work fully documented in squad records.
📌 **2026-04-28T01-07-35Z** — Committed eslint config exclusions (commit 61bdb7f). Both package.json and eslint.config.mjs now explicitly exclude `.squad/**`. Working tree clean.
📌 **2026-04-28T00-41-22Z** — Config exclusion task completed. Orchestration log written. Decision merged to decisions.md.

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->
- Tooling now explicitly excludes the top-level `.squad/` workspace from both `lint-staged` in `package.json` and ESLint flat config in `eslint.config.mjs`.
- For `lint-staged`, root files are matched with `./*` patterns and nested repo files use `!(.squad)/**/*` so staged docs/config still run while `.squad/` stays untouched.
- Validation commands confirmed in this repo: `yarn lint`, `yarn build`, and `yarn test`.

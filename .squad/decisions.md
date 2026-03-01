# Team Decisions

Canonical decision ledger. Append-only. Updated by Scribe from `.squad/decisions/inbox/`.

---

## 2026-02-28: New skill — companion-add-action

**By:** Merry (requested by Justin James)
**What:** Created companion-add-action skill covering the 3-step workflow for adding an action to an existing action category file.
**Why:** Complements companion-action-file-pattern; agents now have clear guidance for both the "new file" and "extend existing file" cases.

---

## 2026-03-01: New skill — companion-preset-category-file

**By:** Merry (requested by Justin James)
**What:** Created skill for adding a new preset category file + wiring into presets.ts aggregator.
**Why:** Complements companion-action-file-pattern for the presets layer; enables consistent multi-file preset architecture.

---

## 2026-03-01: New skill — companion-add-preset-to-category-file

**By:** Merry (requested by Justin James)
**What:** Created skill for adding a preset to an existing preset category file (3-step, no aggregator changes needed).
**Why:** Complements companion-add-action-to-category-file for the presets layer.

---

## 2026-02-21: Team formed

**By:** Justin James
**Decision:** Hired a Lord of the Rings–cast team for companion-module-zoom-osc-iso.
**Roster:** Gandalf (Lead), Samwise (Integration Dev), Merry (Module Dev), Eowyn (Tester), Scribe, Ralph.
**Rationale:** BitFocus handles the UI layer; this team focuses on OSC protocol integration, Companion API definitions, and quality.

---

## 2026-02-28: Project Structure Review — Technical Findings

**By:** Gandalf (Lead)  
**Status:** Assessment complete

### Strengths

- Build & lint toolchain: passes cleanly, zero errors or warnings
- Module architecture: clean separation — actions, feedbacks, presets, variables, OSC, upgrades in dedicated files/directories
- Actions layer: 28 files, each scoped to single domain; clear type-safe aggregation pattern
- Presets layer: 18 files covering major Zoom workflows; clean aggregation
- Feedback system: comprehensive multi-state with icon overlays, thorough state machine covering all 16 boolean combinations
- Config: well-structured with input validation, regex constraints, sensible defaults
- Upgrade scripts: 4 scripts properly registered, covering v2→v3 migration and config additions
- TypeScript/ESLint: proper configs, Husky + lint-staged pre-commit hooks, developer tooling solid
- Documentation: thorough README with workflow patterns, HELP.md for in-app help

### Bugs (3 identified)

1. **Duplicate upgrade registration** (`index.ts:191-192`): `UpgradeV2ToV3` registered twice in `runEntrypoint()` upgrade array. Likely idempotent but unintentional.
2. **Duplicate config field IDs** (`config.ts`):
   - `id: 'socialStreamNote'` on lines 128 and 183
   - `id: 'actionPresetAndFeedbackSyncNote'` on lines 206 and 221
   - Could cause Companion config rendering issues.
3. **Type mismatches in `destroy()` method** (`index.ts:144-153`): Object-typed properties assigned `[]` instead of `{}`. TypeScript doesn't catch this due to `disableVariableValidation`, but intent is wrong.

### Code Quality Concerns

- **`require()` in TS files**: `feedback-state-machine.ts:4` (`./images`), `osc.ts:30` (osc package). Local module should use ESM.
- **Orphan file**: `src/v2CommandsToUpgradeTov3.ts` at root; duplicate logic in `src/upgrades/` version.
- **`no-explicit-any` disabled globally**: ESLint config disables this rule. `osc.ts` and `utils.ts` use `any` widely, eroding type safety in critical paths.

### Architectural Concerns

- **Zero test coverage**: No test files across entire project (~4,500+ lines of source, 50+ files). tsconfig.build.json shows test patterns were planned.
- **`osc.ts` monolith**: 1,040 lines handling connection management, message parsing, all Zoom OSC response handling, variable updates, group/gallery management, ZoomISO polling. Single highest-risk file; hardest to safely refactor.

### Recommended Actions

1. **Quick wins (Merry)**: Fix duplicate `UpgradeV2ToV3` registration, duplicate config IDs, remove orphan file
2. **Type safety (Merry)**: Fix `destroy()` to use `{}` instead of `[]`; convert `./images` require to ESM import
3. **Testing foundation (Eowyn)**: Set up vitest; start with unit tests for `utils.ts` helpers and action/feedback callbacks (pure functions)
4. **Long-term (Samwise)**: Plan phased `osc.ts` decomposition (connection, message router, response handlers) — not urgent but core architectural debt
5. **Optional**: Re-enable `no-explicit-any` as warning; gradually type `any` usages in `udpPort` and OSC response handlers

---

## 2026-02-28: User directives — Gandalf review clarifications

**By:** Justin James (via Copilot)  
**Decision:** Clarify intent on flagged items from Gandalf's review

### Clarifications

1. `UpgradeV2ToV3` registered twice is **intentional** — it runs (not registers) and must run twice. Not a bug.
2. `require()` in osc.ts and feedback-state-machine.ts is **intentional** — the OSC library does not support ESM. Do not convert to ESM imports.
3. `src/v2CommandsToUpgradeTov3.ts` orphan file at root is **intentional** — leave it alone.
4. `no-explicit-any` disabled globally — acknowledged as legacy, defer typing improvements to later.

**Rationale:** User clarification captured for team memory so agents do not re-flag these as issues.

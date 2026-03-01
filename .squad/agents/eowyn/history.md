# Eowyn — Project History

## Core Context

**Project:** companion-module-zoom-osc-iso
**What it does:** BitFocus Companion module enabling control of Zoom meetings via the Zoom OSC and Zoom ISO applications using the OSC (Open Sound Control) protocol.
**Stack:** TypeScript, Node.js, BitFocus `@companion-module/base` library
**User:** Justin James
**My domain:** Testing, quality assurance, code review, and gating

**Key areas to watch:**

- OSC message parsing correctness (`src/osc.ts`)
- Action handler edge cases (`src/actions/`)
- Feedback state transitions (`src/feedback-state-machine.ts`)
- Variable correctness (`src/variables/`)
- Upgrade script migrations (`src/upgrades/`)
- TypeScript type safety across all files

**Important:** BitFocus provides the UI — this module only defines actions, feedbacks, variables, and presets. Test against Zoom OSC/ISO protocol specs and Companion module API behavior.

## Learnings

<!-- Append entries below -->

### 2025 — Tests moved to root-level `tests/` directory

**Task:** Migrated all tests from `src/__tests__/` to `tests/` and mocks from `src/__mocks__/` to `tests/__mocks__/`.

**Key learnings:**
- When moving test files up one level (from `src/__tests__/actions/` to `tests/actions/`), all `../../` relative imports that previously pointed into `src/` must become `../../src/`. This applies to imports AND to `jest.unstable_mockModule()` path strings — both need the `src/` segment inserted.
- The `moduleNameMapper` in `jest.config.ts` uses `<rootDir>` anchoring; updating those two paths (`feedback-state-machine` and `images`) was sufficient since no mock files have src-relative imports.
- `perl -i -pe` is more reliable than `sed -i ''` on macOS for substitutions with special characters in paths.
- After migration, 318/318 tests pass with 28 test suites.

# Gandalf — Project History

## Core Context

**Project:** companion-module-zoom-osc-iso
**What it does:** BitFocus Companion module enabling control of Zoom meetings via the Zoom OSC and Zoom ISO applications using the OSC (Open Sound Control) protocol.
**Stack:** TypeScript, Node.js, BitFocus `@companion-module/base` library
**User:** Justin James
**Team:** Gandalf (Lead), Samwise (Integration Dev), Merry (Module Dev), Eowyn (Tester)

**Key source files:**

- `src/index.ts` — module entry point
- `src/osc.ts` — OSC socket handling
- `src/actions.ts` + `src/actions/` — action definitions and handlers
- `src/feedback.ts` + `src/feedback-state-machine.ts` — feedback logic
- `src/variables/` — variable definitions
- `src/presets.ts` + `src/presets/` — preset button definitions
- `src/config.ts` — module configuration
- `src/upgrades/` — upgrade scripts between module versions

**Important:** BitFocus provides the UI — this module only defines actions, feedbacks, variables, and presets that Companion exposes to the user.

## Learnings

<!-- Append entries below -->

### 2026-02-21 — Initial Project Review

- Build and lint both pass clean. Toolchain is solid.
- Module is well-structured: 28 action files, 18 preset files, clean separation of concerns.
- `osc.ts` is 1,040 lines and is the riskiest file — handles all OSC message parsing, connection, polling, and state updates in one monolith.
- Zero test files exist. This is the biggest gap in the project.
- Bug: `UpgradeV2ToV3` is registered twice in `runEntrypoint()` (index.ts:191-192).
- Bug: Duplicate config field IDs (`socialStreamNote` × 2, `actionPresetAndFeedbackSyncNote` × 2).
- Bug: `destroy()` assigns `[]` to object-typed properties (`ZoomUserOffline`, `ZoomAudioLevelData`, `ZoomAudioRoutingData`).
- Orphan file: `src/v2CommandsToUpgradeTov3.ts` duplicates the file in `src/upgrades/`.
- Two `require()` calls remain instead of ESM imports (`osc` package, local `./images`).
- `@typescript-eslint/no-explicit-any` is disabled globally — `any` used in critical paths.
- Recommended priorities: fix bugs → add test framework → decompose osc.ts.

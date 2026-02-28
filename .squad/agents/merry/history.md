# Merry — Project History

## Core Context

**Project:** companion-module-zoom-osc-iso
**What it does:** BitFocus Companion module enabling control of Zoom meetings via the Zoom OSC and Zoom ISO applications using the OSC (Open Sound Control) protocol.
**Stack:** TypeScript, Node.js, BitFocus `@companion-module/base` library
**User:** Justin James
**My domain:** Companion API layer — how actions, feedbacks, variables, and presets are defined and exposed to BitFocus

**Key source files I own:**

- `src/index.ts` — module entry point, registration
- `src/config.ts` — module configuration schema
- `src/actions.ts` (definitions side) — action option schemas
- `src/feedback.ts` (definitions side) — feedback option schemas
- `src/variables/` — variable definitions
- `src/presets.ts` + `src/presets/` — preset button layouts
- `src/upgrades/` + `src/v2CommandsToUpgradeTov3.ts` — upgrade migration scripts

**Coordinate with Samwise on:** action/feedback handler implementation (I define structure, Sam wires behavior)

**Important:** BitFocus provides the UI — this module only defines actions, feedbacks, variables, and presets that Companion exposes to the user. Must follow `@companion-module/base` API standards.

## Learnings

<!-- Append entries below -->

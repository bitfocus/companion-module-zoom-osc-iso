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

### 2026-02-28: Created `companion-action-file-pattern` skill

- **Location:** `.squad/skills/companion-action-file-pattern/SKILL.md`
- **Covers:**
  - Pattern 1 — Action file structure: TypeScript imports, the `ActionId*` enum, the `GetActions*()` factory function shape, all option types (textinput, number, dropdown, checkbox, etc.), accessing instance state in callbacks
  - Pattern 2 — The aggregator (`actions.ts`): how it imports each file, calls each factory with typed locals, builds the union-typed combined object via spread, and returns it for `setActionDefinitions()`
  - Pattern 3 — Step-by-step recipe with a fully generic file template and exact lines to add to `actions.ts`
  - Common mistakes table (duplicate IDs, missing `.js` extension, missing async, missing type casts)
- **Key insight:** `actions.ts` returns `CompanionActionDefinitions`; `index.ts` calls `this.setActionDefinitions(GetActions(this))`. The combined `actions` object uses a union of all category enums as its key type — adding a new file requires both adding to the union type AND spreading the factory result.
- **Skill is generic** — no Zoom-specific references; placeholder names like `{Category}` and `myDevice_*` used throughout.

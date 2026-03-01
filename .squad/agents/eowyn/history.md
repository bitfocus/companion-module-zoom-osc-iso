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

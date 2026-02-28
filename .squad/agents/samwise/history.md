# Samwise — Project History

## Core Context

**Project:** companion-module-zoom-osc-iso
**What it does:** BitFocus Companion module enabling control of Zoom meetings via the Zoom OSC and Zoom ISO applications using the OSC (Open Sound Control) protocol.
**Stack:** TypeScript, Node.js, BitFocus `@companion-module/base` library
**User:** Justin James
**My domain:** OSC protocol layer, action handlers, feedback state machine

**Key source files I own:**

- `src/osc.ts` — OSC socket handling, connections, message sending/receiving
- `src/actions.ts` + `src/actions/` — action handlers (execution logic)
- `src/feedback.ts` + `src/feedback-state-machine.ts` — feedback state tracking
- `src/socialstream.ts` — Social stream integration

**Coordinate with Merry on:** action/feedback definition interfaces (Merry defines structure, I wire behavior)

**Important:** BitFocus provides the UI — this module only defines actions, feedbacks, variables, and presets that Companion exposes to the user.

## Learnings

<!-- Append entries below -->

### 2026-02-28: Created `osc-integration` skill

Wrote `.squad/skills/osc-integration/SKILL.md` — a generic, reusable skill covering the full OSC infrastructure pattern used in this codebase:
- Why `require('osc')` is used instead of ESM import (CJS-only package)
- `UDPPort` setup with `metadata: true`, tx/rx port split, and TCP alternative
- Module lifecycle: `init` → `configUpdated` (destroy old OSC, create new) → `destroy`
- `sendCommand` method with try/catch wrapping
- `processMessage` address-splitting router pattern with try/catch
- State update + `checkFeedbacks` pattern triggered by incoming OSC messages
- Action-to-OSC wiring via `sendActionCommand` helper in `action-utils.ts`
- Keepalive/polling timer pattern with nullable `NodeJS.Timeout` handles
- `InstanceStatus` reporting at each connection lifecycle stage
- Error handling table and troubleshooting guide
- Key file pointers: `src/osc.ts`, `src/index.ts`, `src/actions/action-utils.ts`, `src/actions/action-global.ts`

Skill is intentionally generic — no Zoom-specific address patterns included.

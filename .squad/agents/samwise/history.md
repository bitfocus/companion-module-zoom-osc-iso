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

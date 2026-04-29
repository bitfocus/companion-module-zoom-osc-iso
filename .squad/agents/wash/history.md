# Project Context

- **Owner:** Justin James
- **Project:** BitFocus Companion module for Zoom OSC and Zoom ISO applications communicating via OSC protocol
- **Stack:** TypeScript, Node.js, BitFocus Companion SDK
- **Created:** 2026-03-13

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->
- `src/osc/handlers/session.ts`: when meeting status reports idle (`0`) or ended (`7`), clear `ZoomUserData` together with `ZoomVariableLink` and the other meeting-reset state so stale user context does not survive call teardown.

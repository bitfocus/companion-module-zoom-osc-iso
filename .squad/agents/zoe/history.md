# Project Context

- **Owner:** Justin James
- **Project:** BitFocus Companion module for Zoom OSC and Zoom ISO applications communicating via OSC protocol
- **Stack:** TypeScript, Node.js, BitFocus Companion SDK
- **Created:** 2026-03-13

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-04-25: Merge validation — origin/main → feature/preset-architecture

**Review scope:** Post-merge quality validation for 6 upstream commits

**Validation results:**

- Build: passing ✅
- Lint: passing ✅
- Tests: 323/323 across 30 test suites ✅
- Type safety: maintained across all changes ✅
- Backward compatibility: confirmed (new polling config defaults to true = existing behavior) ✅
- Dropped functionality: none detected ✅

**Regression risk:** LOW

**Pattern observed:** Polling config changes include comprehensive upgrade script that properly initializes new fields, preventing data migration issues.

**Quality checkpoint:** New config toggle actions properly implemented following existing action patterns (enum-based IDs, type-safe config updates, state persistence).

### 2026-03-13: Merge origin/main → feature/preset-architecture

- **Commits merged**: 6 commits including v4.10.0 (ZoomISO v3 support) and v4.11.0 (ISO polling config options)
- **Conflicts**: Only yarn.lock (resolved via regeneration)
- **Validation**: Build ✅, Lint ✅, Tests ✅ (323/323 passing)
- **Key changes**:
  - Added 4 new config checkboxes for granular ZoomISO polling control
  - New upgrade script `addPollingConfigOptions.ts` sets defaults to true (maintains existing behavior)
  - 4 new toggle actions for runtime polling control
  - Updated osc.ts to conditionally poll based on config flags
  - Security updates: picomatch, flatted, tar
- **Regression risk**: LOW - All changes backward compatible, no dropped behavior
- **Pattern observed**: Config changes require upgrade script + new action toggles for runtime control
- **Test strategy**: Existing test suite validates merge quality - no test updates needed for config additions
### 2026-04-28: Session handler meeting-end regression coverage

- `tests/osc/handlers/session.test.ts` is the right place for focused `handleSessionMessage()` regression tests around `/zoomosc/meetingStatus` branches.
- For meeting-ended behavior, cover both Zoom OSC statuses `0` (idle) and `7` (ended) with `it.each(...)` because the handler treats both as the same teardown path.
- `src/osc/handlers/session.ts` now clears `ZoomUserData` in the meeting-ended branch, so the regression assertion should pin that behavior directly.

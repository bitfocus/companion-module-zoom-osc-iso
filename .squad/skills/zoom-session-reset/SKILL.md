---
name: zoom-session-reset
description: Keep Zoom session teardown branches consistent when meeting state resets user context.
---

# Zoom Session Reset

## Pattern

When a Zoom session teardown path clears user-selection state (for example on `/meetingStatus` idle `0` or ended `7`), clear both `ZoomVariableLink` and `ZoomUserData`, then refresh user-based variables and feedbacks.

## Why

`ZoomUserData` caches per-user context. If teardown clears selection arrays but leaves that cache intact, stale user information can leak into the next meeting.

## Reference

- `src/osc/handlers/session.ts`

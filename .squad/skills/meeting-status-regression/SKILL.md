---
name: meeting-status-regression
description: Focused Jest pattern for OSC session handler regressions around Zoom meeting-ended statuses.
---

## Pattern

When `handleSessionMessage()` routes multiple Zoom meeting statuses into the same "meeting ended" branch, write one focused `it.each([...])` regression test instead of duplicating nearly identical test bodies.

## When to Use

- Testing `src/osc/handlers/session.ts`
- Guarding teardown/reset behavior triggered by `/zoomosc/meetingStatus`
- Covering equivalent Zoom statuses like `0` (idle) and `7` (ended)

## Example

```ts
it.each([0, 7])('clears ZoomUserData when meeting status %i indicates the call has ended', (callStatus) => {
const context = createContext()
context.instance.ZoomUserData = {
1: { zoomId: 1, userName: 'Alice', targetIndex: 0, galleryIndex: 0, users: [] } as never,
}

handleSessionMessage(
context,
{ address: '/zoomosc/meetingStatus', args: [{ type: 'i', value: callStatus }] },
'meetingStatus',
)

expect(context.instance.ZoomUserData).toEqual({})
})
```

## Why

This keeps the regression tight, fast, and aligned with existing session handler tests while still proving both status codes hit the same cleanup behavior.

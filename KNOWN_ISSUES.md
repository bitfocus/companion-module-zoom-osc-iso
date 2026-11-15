# Known Issues

Known issues in ZoomOSC, ZoomISO and the Zoom SDK they use that affect this module: the versions affected, what happens, and what the module does about it.

| #   | Issue                                                                                                                                         | Affected                                 | Module status                |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------- |
| 1   | [getSpotOrder returns no one after joining a meeting](#1-getspotorder-returns-no-one-after-joining-a-meeting-with-people-already-spotlighted) | ZoomOSC 5, 5.0.1; ZoomISO 3              | No workaround                |
| 2   | [galCount renamed to galleryCount](#2-galcount-renamed-to-gallerycount)                                                                       | ZoomOSC 5; ZoomISO 3                     | Handled                      |
| 3   | [64-bit Zoom IDs in gallery and spot order](#3-gallery-and-spot-order-send-zoom-ids-as-64-bit-integers)                                       | ZoomOSC 5.0.1; ZoomISO 3.0.7             | Worked around                |
| 4   | [No chat emojis or threaded replies](#4-chat-has-no-emojis-or-threaded-replies)                                                               | The Zoom SDK used by ZoomOSC and ZoomISO | Can't be fixed in the module |
| 5   | [NDI stops capturing after video off and on](#5-ndi-stops-capturing-after-a-participant-turns-their-video-off-and-on)                         | ZoomISO 3                                | Can't be fixed in the module |
| 6   | [Duplicated participants](#6-duplicated-participants)                                                                                         | ZoomISO 3.0.6                            | Can't be fixed in the module |
| 7   | [Clearing an output selection no longer uses -2](#7-clearing-an-output-selection-no-longer-uses--2)                                           | ZoomISO 3                                | Handled                      |
| 8   | [Emojis in participant names arrive as ??](#8-emojis-in-participant-names-arrive-as-)                                                         | ZoomOSC 5; ZoomISO 3                     | No workaround                |

## 1. getSpotOrder returns no one after joining a meeting with people already spotlighted

- **Affected:** ZoomOSC 5, ZoomOSC 5.0.1 and ZoomISO 3.
- **Works as expected:** ZoomOSC 4 and ZoomISO 2.

When ZoomOSC or ZoomISO joins a meeting where participants are already spotlighted, `/zoom/getSpotOrder` returns no one. In ZoomOSC 4 and ZoomISO 2 it returns the spotlighted participants as expected.

**Module status:** no workaround. The module asks for the spot order, but gets an empty answer, so the Spotlights group and the spotlight feedbacks stay empty for anyone spotlighted before ZoomOSC/ZoomISO joined, until their spotlight changes.

## 2. galCount renamed to galleryCount

- **Affected:** ZoomOSC 5 and ZoomISO 3.

The gallery count command was renamed from `galCount` to `galleryCount`.

**Module status:** handled. The **Request GalleryCount (New for OSC v5+ and ISO v3+)** action sends `/zoom/galleryCount`. The old **Request GalleryCount** action still sends `/zoom/galCount` for older versions and is marked deprecated ([src/actions/action-global-gallery-tracking-and-data-request.ts](src/actions/action-global-gallery-tracking-and-data-request.ts)). Receiving `/zoomosc/galleryCount` was already handled.

## 3. Gallery and spot order send Zoom IDs as 64-bit integers

- **Affected:** ZoomOSC 5.0.1 and ZoomISO 3.0.7.
- **Earlier versions:** ZoomOSC 4 and ZoomISO 3.0.6 send 32-bit integers.

`/zoomosc/galleryOrder` and `/zoomosc/spotOrder` now send each Zoom ID as a 64-bit integer (OSC type `h`), while the participant list (`/zoomosc/user/list`) still sends Zoom IDs as 32-bit integers (OSC type `i`). The change wasn't announced. The values are the same either way. For example, the same participant arrives as:

```text
/zoomosc/galleryOrder  {"type":"h","value":33557504}   ZoomOSC 5.0.1 / ZoomISO 3.0.7
/zoomosc/galleryOrder  {"type":"i","value":33557504}   ZoomOSC 4 / ZoomISO 3.0.6
```

**Module status:** worked around (commit `6caa77a`). The module reads each argument by its own type: a 64-bit integer becomes a plain number, and a 32-bit integer is used as it is. The gallery and the Spotlights group populate with both old and new versions, and no version check is needed. See `toZoomOSCResponse` in [src/osc/transport.ts](src/osc/transport.ts).

Before this, the module used node-osc, which can't read 64-bit integers at all: it rejected every gallery order and spot order packet from these versions without logging anything.

## 4. Chat has no emojis or threaded replies

- **Affected:** the Zoom SDK used by ZoomOSC and ZoomISO.

The SDK doesn't render or support chat emojis, and gives no information about threaded chat replies.

**Module status:** can't be fixed in the module. Chat reaches the module exactly as the SDK delivers it.

## 5. NDI stops capturing after a participant turns their video off and on

- **Affected:** ZoomISO 3.

If a participant turns their video off and back on, the NDI video for that participant appears to stop capturing.

**Workaround:** change the NDI source to another participant, then back to the participant. Capturing starts again.

**Module status:** can't be fixed in the module.

## 6. Duplicated participants

- **Affected:** ZoomISO 3.0.6.

At one event, ZoomISO duplicated many of the people in the meeting, and only some of the duplicates had valid information to take action against.

**Module status:** can't be fixed in the module.

## 7. Clearing an output selection no longer uses -2

- **Affected:** ZoomISO 3.

The way to unselect a ZoomISO output selection changed. It used to be `-2`; it now depends on the picker, through `/zoom/setOutputSelection`.

**Module status:** handled. **Set ISO Output to None**, and **output ISO** with "If No User Selected, Set Output to None" ticked, send `/zoom/zoomID/outputISO` with Zoom ID `1` when the pong reports ZoomISO 3 or later (`ZISO_3.x.x`). That puts a Participant output back to "Select Participant". With ZoomISO 2, or before the first pong, they still send `-2` ([src/actions/action-utils.ts](src/actions/action-utils.ts), using `isZoomISO3OrLater` in [src/utils.ts](src/utils.ts)).

Zoom ID `1` was found by testing and isn't in ZoomISO's documentation, so a later version could change it. The documented way to clear an output is `/zoom/setOutputSelection {output} 0`, described below.

The note from Zoom on the new behaviour:

> **Participant / Screen Share**
>
> /zoom/setOutputSelection (input)
>
> - 0 clears ("Select Participant").
> - 1 turns Auto on.
> - 2 through the last visible picker row selects that row.
> - Any other integer is a Zoom ID, if that person is already in the list. An integer that falls inside the picker range is the row, not a Zoom ID.
>
> /zoom/outputRouting (output)
>
> - 0 when the picker is on Select (not Auto, no participant).
> - 1 when Auto is on and nobody has been assigned yet. This is a new change, currently returns 0 in that case
> - The participant's Zoom ID when Auto has assigned someone, or when a person was chosen directly. This is a new change for screenshare, currently returns selection Index from the picker, not the Zoom ID
>
> **Active Speaker / Unique Speaker**
>
> /zoom/setOutputSelection (input)
>
> - Any selection value triggers an Error (there is not selection value available)
>
> /zoom/outputRouting (output)
>
> - 0 if there's effectively no one on the output
> - Zoom ID if there is someone on the output. This is a new change, currently returns 0 in that case
>
> **Spotlight**
>
> /zoom/setOutputSelection (input)
>
> - 0 sets to "Select Spotlight" and clears.
> - 1-9 targets Spotlight 1-9 respectively
>
> /zoom/outputRouting (output)
>
> - 0 if on "Select Spotlight". This is a new change, currently returns -1 in that case
> - 1-9 for Spotlight 1-9
>
> Another change for Spotlight, currently the UI list has "Select Spotlight" at -1 index, moving it to 0 to match other pickers
>
> **Active Screenshare**
>
> /zoom/setOutputSelection (input)
>
> - Any selection value triggers an Error. This is a new change, currently can target first active screenshare with 0 and any second active screenshare with any other number. Does not match the UI which doesn't offer that option.
>
> /zoom/outputRouting (output)
>
> - Send 0. This is a new change, currently sends the "index" of the selected active screenshare, even if the UI doesn't provide an option for selection.

## 8. Emojis in participant names arrive as ??

- **Affected:** ZoomOSC 5 and ZoomISO 3.
- **Works as expected:** ZoomOSC 4 and ZoomISO 2.

ZoomOSC 5 and ZoomISO 3 send `??` in place of each emoji in a participant's name, instead of the emoji itself. ZoomOSC 4 and ZoomISO 2 send the emoji, and it renders on the buttons and in the variables.

**Module status:** no workaround. The `??` is already in the name when it reaches the module, so the emoji can't be recovered. The module decodes OSC strings as UTF-8, so it shows the emojis once ZoomOSC and ZoomISO send them again.

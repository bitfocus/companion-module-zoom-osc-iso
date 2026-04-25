# Session: Polling Options Configuration

## Date

2026-04-01T18:10:00Z

## Agent

Samwise (Integration Dev)

## Overview

Implementation of per-command polling toggle options to allow granular control over which ISO polling commands are executed.

## Key Additions

1. **Configuration Interface** (src/config.ts)

   - `pollEngineState`: Toggle engine state polling
   - `pollOutputRouting`: Toggle output routing polling
   - `pollAudioRouting`: Toggle audio routing polling
   - `pollAudioLevels`: Toggle audio levels polling

2. **Default Initialization** (src/index.ts)

   - All polling toggles initialized with default values

3. **Execution Control** (src/osc.ts)

   - sendISOPullingCommands function now respects individual polling flags

4. **User Actions** (Multiple action files)
   - togglePollEngineState
   - togglePollOutputRouting
   - togglePollAudioRouting
   - togglePollAudioLevels

## Outcome

Users can now selectively enable/disable polling for specific Zoom ISO functions, improving control and reducing unnecessary polling overhead.

## Build Status

✓ Verified passing

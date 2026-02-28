---
name: osc-integration
description: 'Patterns for integrating OSC (Open Sound Control) protocol into a BitFocus Companion module using the `osc` npm package. Use when adding OSC UDP/TCP communication, wiring OSC send/receive into a Companion module lifecycle (init, configUpdated, destroy), writing action handlers that send OSC commands, or handling incoming OSC messages to update module state and trigger feedbacks.'
---

# OSC Integration for BitFocus Companion Modules

A reference skill for wiring the `osc` npm package into a Companion module. Covers the full infrastructure lifecycle: socket setup, send, receive, action wiring, state update, and teardown.

## When to Use This Skill

- Adding OSC communication to a new or existing Companion module
- Setting up UDP or TCP sockets that need to survive `configUpdated` / `destroy` cycles
- Writing action handlers that send OSC commands to a device
- Processing incoming OSC messages to update module state and trigger feedbacks
- Structuring the OSC class so it is encapsulated away from the main `InstanceBase` class

## Prerequisites

- `@companion-module/base` installed
- `osc` npm package installed (`npm install osc` or `yarn add osc`)
- TypeScript project (tsconfig with `"module": "Node16"` or similar)

## Why `require()` Instead of ESM `import`

The `osc` npm package does not ship ESM-compatible exports. Attempting `import osc from 'osc'` will fail at runtime in Node ESM mode. Use a `require()` call at the top of the file:

```ts
// At the top of your osc.ts — ESM import does NOT work for this package
const osc = require('osc') // eslint-disable-line
```

Add `// eslint-disable-line` to suppress the `@typescript-eslint/no-require-imports` lint rule if your project enforces it.

---

## Step-by-Step Workflows

### 1. Define the OSC Message Interface

Define a typed interface for the incoming OSC message shape. The `osc` library delivers raw objects; typing them prevents silent runtime errors.

```ts
interface OSCMessage {
  address: string
  args: {
    type: string   // OSC type tag: 'i' = int, 'f' = float, 's' = string, etc.
    value: any
  }[]
}
```

---

### 2. Encapsulate in an OSC Class

Keep the socket and all connection logic inside a dedicated `OSC` class. The `InstanceBase` subclass holds a nullable reference to it and replaces it on config changes.

```ts
export class OSC {
  private readonly instance: InstanceBase<YourConfig>
  private host = '127.0.0.1'
  private txPort = 9000   // port we SEND to
  private rxPort = 1234   // port we LISTEN on
  private udpPort: any    // typed as any — osc package has no TS declarations

  constructor(instance: InstanceBase<YourConfig>) {
    this.instance = instance
    this.connect()
  }

  // ...
}
```

On your main module class:

```ts
public OSC: OSC | null = null
```

---

### 3. Connection Lifecycle — `connect()`

Open a `UDPPort` listening on `localPort` (rx), then bind event handlers before calling `.open()`.

```ts
private readonly connect = (): void => {
  this.host    = this.instance.config.host    || '127.0.0.1'
  this.txPort  = this.instance.config.tx_port || 9000
  this.rxPort  = this.instance.config.rx_port || 1234

  this.instance.updateStatus(InstanceStatus.Connecting)

  this.udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: this.rxPort,
    metadata: true,   // required: delivers typed {type, value} args instead of raw values
  })

  // Incoming messages
  this.udpPort.on('message', (msg: OSCMessage) => {
    this.processMessage(msg)
  })

  // Error handling
  this.udpPort.on('error', (err: { code: string; message: string }) => {
    if (err.code === 'EADDRINUSE') {
      this.instance.log('error', `RX port ${this.rxPort} already in use: ${err.message}`)
    } else {
      this.instance.log('error', `OSC error: ${err.message}`)
    }
  })

  // Socket open — safe to send now
  this.udpPort.on('ready', () => {
    this.instance.log('info', `OSC listening on port ${this.rxPort}`)
    this.instance.updateStatus(InstanceStatus.Connecting, 'Waiting for first response')
    // Start any keepalive / polling timers here
  })

  this.udpPort.open()
}
```

> **TCP alternative:** Replace `new osc.UDPPort(...)` with `new osc.TCPSocketPort({ address: this.host, port: this.txPort })` and call `.open()`. TCP uses a single bidirectional socket; there is no separate tx/rx port concept.

---

### 4. Destroy — Teardown on Disable / Config Change

Always close the socket and clear any timers in `destroy()`. The main module class calls this before creating a new `OSC` instance on config change.

```ts
public readonly destroy = (): void => {
  if (this.udpPort) {
    this.udpPort.close()
  }
  this.clearTimers()
}

private clearTimers = (): void => {
  if (this.pingInterval) {
    clearInterval(this.pingInterval)
    this.pingInterval = null
  }
  // clear any other timers...
}
```

---

### 5. Wiring Into the Module Lifecycle

In your `InstanceBase` subclass, delegate entirely to the `OSC` class:

```ts
public async init(config: YourConfig): Promise<void> {
  await this.configUpdated(config)
}

public async configUpdated(config: YourConfig): Promise<void> {
  this.config = config
  this.saveConfig(config)
  if (this.OSC) this.OSC.destroy()   // tear down old socket first
  this.OSC = new OSC(this)           // create new socket with new config
  this.updateInstance()
}

async destroy(): Promise<void> {
  this.OSC?.destroy()
}
```

---

### 6. Sending OSC Messages

Add a `sendCommand` method on the `OSC` class. Wrap the send in a `try/catch` — the `osc` library throws synchronously on invalid state.

```ts
public readonly sendCommand = (path: string, args?: OSCSomeArguments): void => {
  try {
    this.udpPort.send(
      {
        address: path,
        args: args ?? [],
      },
      this.host,
      this.txPort,
    )
  } catch (error) {
    this.instance.log(
      'error',
      `sendCommand failed for "${path}": ${JSON.stringify(error)}`,
    )
  }
}
```

`OSCSomeArguments` is exported from `@companion-module/base` and is an alias for an array of `{ type: string; value: any }`.

**Typed argument example:**

```ts
// Integer argument
{ type: 'i', value: 42 }

// String argument
{ type: 's', value: 'hello' }

// Float argument
{ type: 'f', value: 3.14 }

// Sending a command with mixed args
instance.OSC?.sendCommand('/device/command', [
  { type: 'i', value: channelNumber },
  { type: 's', value: label },
])
```

---

### 7. Wiring OSC to Action Handlers

The standard pattern keeps the `sendCommand` call out of the action callback directly — use a helper function in `action-utils.ts`:

```ts
// action-utils.ts
export const sendActionCommand = (
  instance: InstanceBaseExt<YourConfig>,
  action: { options: { command: string; args: any[] } },
): void => {
  if (instance.OSC) {
    instance.OSC.sendCommand(action.options.command, action.options.args)
  }
}
```

Then in an action definition:

```ts
// actions/my-actions.ts
export function GetMyActions(instance: InstanceBaseExt<YourConfig>): { [id: string]: CompanionActionDefinition } {
  return {
    myAction: {
      name: 'Trigger device command',
      options: [],
      callback: (): void => {
        const command = {
          options: {
            command: '/device/command',
            args: [{ type: 'i', value: 1 }],
          },
        }
        sendActionCommand(instance, command)
      },
    },
  }
}
```

---

### 8. Receiving OSC Messages — `processMessage()`

Parse the incoming address by splitting on `/`, then use a `switch` block to route to handlers. Always wrap in `try/catch`.

```ts
private processMessage = (data: OSCMessage): void => {
  try {
    const parts = data.address.split('/')
    // parts[0] is '' (empty, before the leading slash)
    // parts[1] is the first segment, etc.
    const namespace = parts[1]
    const category  = parts[2]
    const action    = parts[3]

    switch (category) {
      case 'status':
        this.handleStatus(action, data)
        break
      case 'data':
        this.handleData(action, data)
        break
      default:
        // Unknown address — optionally log at debug level
        break
    }
  } catch (error) {
    this.instance.log('error', `processMessage failed for ${JSON.stringify(data)}: ${JSON.stringify(error)}`)
  }
}
```

---

### 9. State Update + `checkFeedbacks` Pattern

When an incoming OSC message changes device state, update the in-memory state object and then call `checkFeedbacks()` with the relevant feedback IDs. Also update any Companion variables.

```ts
private handleStatus = (action: string, data: OSCMessage): void => {
  switch (action) {
    case 'on':
      // 1. Update state
      this.instance.deviceState.channelEnabled = true

      // 2. Update Companion variables if needed
      const variables: CompanionVariableValues = {}
      variables['channel_enabled'] = 'true'
      this.instance.setVariableValues(variables)

      // 3. Trigger feedback re-evaluation
      this.instance.checkFeedbacks(
        FeedbackId.channelEnabled,
        FeedbackId.channelStatus,
      )
      break

    case 'off':
      this.instance.deviceState.channelEnabled = false
      this.instance.checkFeedbacks(
        FeedbackId.channelEnabled,
        FeedbackId.channelStatus,
      )
      break
  }
}
```

---

### 10. Keepalive / Polling Timer Pattern

For devices that require periodic polling or a heartbeat, store timer handles as class properties so they can be reliably cleared in `destroy()`.

```ts
private pingInterval: NodeJS.Timeout | null = null

public readonly startPingTimer = (): void => {
  if (this.pingInterval) clearInterval(this.pingInterval)
  this.pingInterval = setInterval(() => {
    this.sendCommand('/device/ping')
  }, 5000)
}

private readonly stopPingTimer = (): void => {
  if (this.pingInterval) {
    clearInterval(this.pingInterval)
    this.pingInterval = null
  }
}
```

Start the timer inside the `'ready'` event handler; stop it inside `destroy()`.

---

### 11. Connection Status Reporting

Use `InstanceStatus` from `@companion-module/base` to communicate OSC connection state to the Companion UI:

```ts
// Before socket opens
this.instance.updateStatus(InstanceStatus.Connecting)

// On 'ready' — socket is open but not yet confirmed alive
this.instance.updateStatus(InstanceStatus.Connecting, 'Waiting for first response')

// On receiving first valid response from device
this.instance.updateStatus(InstanceStatus.Ok)

// On fatal error
this.instance.updateStatus(InstanceStatus.ConnectionFailure, 'Port in use')
```

---

## Error Handling Summary

| Scenario | Where to handle | Action |
|---|---|---|
| `EADDRINUSE` on UDP open | `udpPort.on('error')` | Log error + `updateStatus(ConnectionFailure)` |
| `sendCommand` throws | `try/catch` in `sendCommand` | Log error, do not rethrow |
| Malformed incoming message | `try/catch` in `processMessage` | Log error with raw data |
| Config changed mid-session | `configUpdated()` in module class | `destroy()` old OSC, create new |

---

## Key File Locations in This Repo (for reference)

These files demonstrate the patterns above applied to a real Companion module (Zoom OSC):

| Pattern | File |
|---|---|
| OSC class, socket, `sendCommand`, `processMessage` | `src/osc.ts` |
| Module lifecycle (`init`, `configUpdated`, `destroy`) | `src/index.ts` |
| Action-to-OSC wiring helpers (`createCommand`, `sendActionCommand`) | `src/actions/action-utils.ts` |
| Sample action definition using `sendActionCommand` | `src/actions/action-global.ts` |

---

## Troubleshooting

| Issue | Likely Cause | Fix |
|---|---|---|
| `import osc from 'osc'` fails at runtime | osc package is CJS only | Use `const osc = require('osc')` |
| No `args` on incoming message | `metadata: true` missing in UDPPort config | Add `metadata: true` |
| `sendCommand` silently does nothing | `udpPort` not yet open | Ensure send is called after `'ready'` event |
| Port conflict on config reload | Old socket not closed | Always call `destroy()` before creating new `OSC` instance |
| Feedbacks not updating on message | `checkFeedbacks` not called | Call after updating state in `processMessage` handlers |

## References

- `osc` npm package: <https://www.npmjs.com/package/osc>
- `@companion-module/base` API: <https://companion-module-base.readthedocs.io/>
- OSC 1.0 spec: <http://opensoundcontrol.org/spec-1_0>

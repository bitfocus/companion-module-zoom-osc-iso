---
name: companion-actions
description: 'Reference for Bitfocus Companion module action definitions using @companion-module/base. Use when asked to add an action, implement a button command, define action options, or wire up a device control. Also use when user needs help with action callbacks, subscribe/unsubscribe lifecycle, or the CompanionActionDefinition API.'
---

# Companion Actions Skill

## When to Use This Skill

- User asks to "add an action", "create a button action", or "implement a command"
- User wants to add interactive controls that trigger device operations
- User needs help defining action options (textinput, number, dropdown, checkbox)
- User is implementing action callbacks or handling button press events
- User asks about subscribe/unsubscribe lifecycle for stateful actions
- User needs to update or re-register actions dynamically based on device state

## Key API Types

### `CompanionActionDefinition`

Defines a single action with its name, options, and callback.

**Properties:**

- `name: string` — Human-readable name shown in the UI
- `description?: string` — Optional help text
- `options: SomeCompanionActionInputField[]` — User-configurable parameters
- `callback: (event: CompanionActionEvent) => Promise<void> | void` — Executed when triggered
- `subscribe?: (event: CompanionActionEvent) => Promise<void> | void` — Called when action is added to a button
- `unsubscribe?: (event: CompanionActionEvent) => Promise<void> | void` — Called when action is removed
- `learn?: (event: CompanionActionEvent) => Promise<CompanionActionEventInfo | undefined> | CompanionActionEventInfo | undefined` — For learning action parameters from device

### `SomeCompanionActionInputField`

Union type covering all option field types: `textinput`, `number`, `dropdown`, `checkbox`, `colorpicker`, `multidropdown`, `bonjourdevice`, `static-text`, `custom-variable`.

Each field requires: `id`, `type`, `label`. Additional properties vary by type (e.g., `min`/`max` for `number`, `choices` for `dropdown`).

### `CompanionActionEvent`

Passed to callbacks when action is triggered.

**Properties:**

- `options: { [id: string]: any }` — User-configured values for all option fields
- `controlId: string` — Unique ID of the control triggering the action
- `surfaceId: string | undefined` — ID of the surface (hardware device) if applicable

## Patterns & Examples

### Basic Action Definition

```typescript
import type { ModuleInstance } from './main.js'

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		sample_action: {
			name: 'My First Action',
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Test',
					default: 5,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				console.log('Hello world!', event.options.num)
			},
		},
	})
}
```

### Multiple Actions with Different Option Types

```typescript
export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		send_command: {
			name: 'Send Command',
			options: [
				{
					id: 'command',
					type: 'dropdown',
					label: 'Command',
					choices: [
						{ id: 'play', label: 'Play' },
						{ id: 'stop', label: 'Stop' },
						{ id: 'pause', label: 'Pause' },
					],
					default: 'play',
				},
				{
					id: 'value',
					type: 'textinput',
					label: 'Value',
					default: '',
				},
			],
			callback: async (event) => {
				const cmd = event.options.command as string
				const val = event.options.value as string
				// Send to device via connection module
				await self.connection.sendCommand(cmd, val)
			},
		},

		set_level: {
			name: 'Set Level',
			options: [
				{
					id: 'level',
					type: 'number',
					label: 'Level',
					min: 0,
					max: 100,
					default: 50,
					range: true, // Shows as slider
				},
			],
			callback: async (event) => {
				const level = event.options.level as number
				await self.connection.setLevel(level)
			},
		},
	})
}
```

### Using Subscribe/Unsubscribe for Stateful Actions

```typescript
export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		start_polling: {
			name: 'Start Status Polling',
			options: [],
			subscribe: async (event) => {
				// Start polling when action is added to a button
				self.startPolling(event.controlId)
			},
			unsubscribe: async (event) => {
				// Stop polling when action is removed
				self.stopPolling(event.controlId)
			},
			callback: async (event) => {
				// Toggle or trigger on button press
				self.log('info', `Polling triggered from ${event.controlId}`)
			},
		},
	})
}
```

### Accessing Module State in Callbacks

```typescript
export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		toggle_mute: {
			name: 'Toggle Mute',
			options: [],
			callback: async (event) => {
				// Access module state via 'self'
				const currentMute = self.deviceState.muted
				const newMute = !currentMute

				await self.connection.setMute(newMute)

				// Update internal state
				self.deviceState.muted = newMute

				// Trigger feedback updates
				self.checkFeedbacks('is_muted')
			},
		},
	})
}
```

### Dynamic Action Re-registration

When device capabilities change (e.g., after connection or config update):

```typescript
// In main.ts or connection handler
async function onDeviceConnected(self: ModuleInstance): Promise<void> {
	// Query device for available commands
	const capabilities = await self.connection.getCapabilities()

	// Store in module state
	self.deviceCapabilities = capabilities

	// Re-register actions with updated options
	UpdateActions(self)
}
```

## Common Pitfalls

1. **Forgetting to call `setActionDefinitions` on update**
   - Always call `UpdateActions(self)` after module state changes that affect available actions

2. **Not typing event.options correctly**
   - TypeScript doesn't enforce option types — cast them: `event.options.num as number`

3. **Blocking the callback**
   - Mark callbacks as `async` and use `await` for device commands
   - Don't use long synchronous operations

4. **Mutating options directly**
   - `event.options` is read-only — don't attempt to modify it

5. **Not handling errors**
   - Wrap device calls in try/catch and log errors via `self.log('error', ...)`

## Import Reference

```typescript
import type {
	CompanionActionDefinition,
	CompanionActionDefinitions,
	CompanionActionEvent,
	CompanionActionContext,
	SomeCompanionActionInputField,
} from '@companion-module/base'
```

## Related Skills

- **companion-config** — For understanding option field types (they match config field types)
- **companion-feedbacks** — Actions often trigger feedback updates via `self.checkFeedbacks()`
- **companion-variables** — Actions may update variable values via `self.setVariableValues()`

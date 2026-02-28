---
name: companion-variables
description: 'Reference for Bitfocus Companion module variable definitions using @companion-module/base. Use when asked to add variables, expose device state as text, create dynamic button text, or display status values. Also use when user needs help with setVariableDefinitions, setVariableValues, or the CompanionVariableDefinition API.'
---

# Companion Variables Skill

## When to Use This Skill

- User asks to "add a variable", "create dynamic text", or "expose device state as text"
- User wants to display counters, timers, status messages, or device properties on buttons
- User needs to provide values that can be referenced in button text or other fields
- User is working on updating variable values when device state changes
- User asks about variable naming rules or the $(module:variable_id) syntax
- User needs help with setVariableDefinitions() or setVariableValues()

## Key API Types

### `CompanionVariableDefinition`

Defines a single variable with its ID and human-readable name.

**Properties:**

- `variableId: string` — Unique identifier (alphanumeric + underscore only, no spaces)
- `name: string` — Human-readable description shown in the UI

### Variable Value Types

Variables can hold: `string | number | boolean | undefined`

## Patterns & Examples

### Basic Variable Definitions

```typescript
import type { ModuleInstance } from './main.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions([
		{ variableId: 'variable1', name: 'My first variable' },
		{ variableId: 'variable2', name: 'My second variable' },
		{ variableId: 'variable3', name: 'Another variable' },
	])
}
```

### Typical Device State Variables

```typescript
export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions([
		{ variableId: 'device_name', name: 'Device Name' },
		{ variableId: 'firmware_version', name: 'Firmware Version' },
		{ variableId: 'current_input', name: 'Current Input' },
		{ variableId: 'volume_level', name: 'Volume Level' },
		{ variableId: 'mute_state', name: 'Mute State' },
		{ variableId: 'temperature', name: 'Device Temperature' },
		{ variableId: 'uptime', name: 'Device Uptime' },
	])
}
```

### Setting Variable Values

Variable values are set separately from definitions:

```typescript
// In init() or after connecting
async function initializeVariables(self: ModuleInstance): Promise<void> {
	// Set initial values
	self.setVariableValues({
		device_name: 'Unknown',
		firmware_version: 'N/A',
		current_input: '1',
		volume_level: 0,
		mute_state: 'Unmuted',
		temperature: 0,
		uptime: '0:00:00',
	})
}
```

### Updating Variables on State Change

```typescript
// When device sends status update
function handleDeviceStatus(self: ModuleInstance, status: DeviceStatus): void {
	self.setVariableValues({
		current_input: status.input.toString(),
		volume_level: status.volume,
		mute_state: status.muted ? 'Muted' : 'Unmuted',
		temperature: status.temperature,
	})
}

// Update a single variable
function updateCurrentInput(self: ModuleInstance, input: string): void {
	self.setVariableValues({
		current_input: input,
	})
}
```

### Reading Variable Values

```typescript
// Get current value of a variable
const currentVolume = self.getVariableValue('volume_level')

if (currentVolume !== undefined) {
	console.log(`Current volume: ${currentVolume}`)
}
```

### Complete Lifecycle Example

```typescript
// variables.ts
import type { ModuleInstance } from './main.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
  self.setVariableDefinitions([
    { variableId: 'input_name', name: 'Current Input Name' },
    { variableId: 'volume_db', name: 'Volume (dB)' },
    { variableId: 'message_count', name: 'Messages Received' },
  ])
}

// main.ts - init()
async init(config: ModuleConfig): Promise<void> {
  this.config = config

  // Define variables first
  this.updateVariableDefinitions()

  // Set initial values
  this.setVariableValues({
    input_name: 'Unknown',
    volume_db: '-∞',
    message_count: 0,
  })

  // Connect and update
  await this.connect()
}

// Connection handler
async connect(): Promise<void> {
  try {
    await this.connection.connect()

    // Query initial state
    const state = await this.connection.getState()
    this.setVariableValues({
      input_name: state.inputName,
      volume_db: state.volumeDb.toFixed(1),
    })
  } catch (error) {
  }
}

// Message handler
handleMessage(message: DeviceMessage): void {
  const currentCount = (this.getVariableValue('message_count') as number) || 0

  this.setVariableValues({
    message_count: currentCount + 1,
  })
}
```

### Dynamic Variable Registration

If the set of variables depends on device capabilities:

```typescript
export function UpdateVariableDefinitions(self: ModuleInstance): void {
	const definitions: CompanionVariableDefinition[] = [{ variableId: 'device_name', name: 'Device Name' }]

	// Add per-channel variables based on device capabilities
	const channelCount = self.deviceCapabilities?.channels || 0
	for (let i = 1; i <= channelCount; i++) {
		definitions.push({
			variableId: `channel_${i}_name`,
			name: `Channel ${i} Name`,
		})
		definitions.push({
			variableId: `channel_${i}_level`,
			name: `Channel ${i} Level`,
		})
	}

	self.setVariableDefinitions(definitions)

	// Initialize values
	const values: { [id: string]: string | number } = {
		device_name: self.deviceName || 'Unknown',
	}

	for (let i = 1; i <= channelCount; i++) {
		values[`channel_${i}_name`] = `CH${i}`
		values[`channel_${i}_level`] = 0
	}

	self.setVariableValues(values)
}
```

## Common Pitfalls

1. **Invalid variable IDs**
   - Variable IDs must be alphanumeric + underscore only
   - ❌ `'my-variable'`, `'My Variable'`, `'var.1'`
   - ✅ `'my_variable'`, `'var1'`, `'input_A_level'`

2. **Not initializing values**
   - Always call `setVariableValues()` after `setVariableDefinitions()`
   - Undefined variables show as `$(internal:variable_not_found)` in buttons

3. **Setting values before definitions**
   - Always call `setVariableDefinitions()` before `setVariableValues()`

4. **Forgetting to update values**
   - Variables don't auto-update — you must call `setVariableValues()` when state changes

5. **Using complex objects as values**
   - Variables only support primitives: string, number, boolean
   - Convert objects to strings: `JSON.stringify(obj)` if needed

6. **Not handling undefined when reading**
   - Always check: `self.getVariableValue('var') ?? defaultValue`

## Import Reference

```typescript
import type { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'
```

## Related Skills

- **companion-feedbacks** — Advanced feedbacks can display variable values
- **companion-actions** — Actions can update variable values
- **companion-config** — Device config may determine which variables are available

## Usage in Companion

Users reference variables in button text or other fields using:

```
$(module_label:variable_id)
```

Example: `Volume: $(my_device:volume_db) dB`

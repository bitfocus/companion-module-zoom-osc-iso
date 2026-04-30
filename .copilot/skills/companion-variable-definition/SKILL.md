---
name: companion-variable-definition
description: "Reference for declaring and registering Companion module variables using setVariableDefinitions and CompanionVariableDefinition. Use when you need to register variables, define variable ID naming, expose state as text in Companion's variable picker, or build dynamic variable sets from device capabilities. Do NOT use to update values — use companion-variable-set-value to update values after they are defined."
---

# Companion Variable Definition Skill

Covers **declaring** variables that Companion knows about. Value-setting is handled by the sibling skill `companion-variable-set-value`.

## When to Use This Skill

### ✅ Use when:

- Declaring new variables the module exposes to Companion
- Adding a variable ID so it appears in Companion's variable picker
- Building dynamic variable sets where channel count (or other device capability) drives the variable count
- Calling `setVariableDefinitions()` in `init()` or after device capabilities change

### ❌ Do NOT use when:

- Updating the value of an existing variable → use **`companion-variable-set-value`**
- Reading a variable's current value → use **`companion-variable-set-value`**

---

## Pattern

### `UpdateVariableDefinitions(self)` function

This is the standard function exported from `src/variables.ts` (or equivalent) that registers all variable definitions with Companion.

```typescript
import type { CompanionVariableDefinition } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	// Build the array of definitions
	const definitions: CompanionVariableDefinition[] = [
		{ variableId: 'device_name', name: 'Device Name' }, // variableId: alphanumeric + underscore only
		{ variableId: 'firmware_version', name: 'Firmware Version' },
		{ variableId: 'current_input', name: 'Current Input' },
	]

	// Register all definitions with Companion in one call
	self.setVariableDefinitions(definitions)
	// ↑ Replaces the entire registered set — call again whenever the set changes
}
```

**Call this function:**

- Inside `init()` — so variables appear in Companion's picker as soon as the module loads
- Whenever the set of available variables changes (e.g. device reports a different channel count)

**Wire it in `main.ts`:**

```typescript
async init(config: ModuleConfig): Promise<void> {
	this.config = config
	UpdateVariableDefinitions(this)   // ← register definitions first
	// then set initial values via companion-variable-set-value
}
```

---

## variableId Naming Rules

`variableId` must contain **alphanumeric characters and underscores only**. No spaces, hyphens, dots, or other special characters.

| Example           | Valid? | Reason                             |
| ----------------- | ------ | ---------------------------------- |
| `device_name`     | ✅     | Underscores allowed                |
| `channel_1_level` | ✅     | Numbers allowed                    |
| `inputA`          | ✅     | Mixed case allowed                 |
| `my-variable`     | ❌     | Hyphens not allowed                |
| `My Variable`     | ❌     | Spaces not allowed                 |
| `var.1`           | ❌     | Dots not allowed                   |
| `volume (dB)`     | ❌     | Parentheses and spaces not allowed |

Users reference variables in button text using:

```
$(module_label:variable_id)
```

Example: `Volume: $(my_device:volume_db) dB`

---

## Dynamic Registration

When the set of variables depends on device capabilities (e.g. channel count), build the definitions array programmatically before calling `setVariableDefinitions()`.

```typescript
export function UpdateVariableDefinitions(self: ModuleInstance): void {
	// Start with static variables
	const definitions: CompanionVariableDefinition[] = [{ variableId: 'device_name', name: 'Device Name' }]

	// Add per-channel variables based on reported device capabilities
	const channelCount = self.deviceCapabilities?.channels ?? 0
	for (let i = 1; i <= channelCount; i++) {
		definitions.push(
			{ variableId: `channel_${i}_name`, name: `Channel ${i} Name` },
			{ variableId: `channel_${i}_level`, name: `Channel ${i} Level` },
		)
	}

	// Register the complete set
	self.setVariableDefinitions(definitions)
}
```

Re-call `UpdateVariableDefinitions(self)` any time the device reports a new capability set (e.g. channel count changes after reconnect). `setVariableDefinitions()` replaces the entire registered set each time it is called.

---

## Common Mistakes

| Mistake                                                      | Fix                                                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Calling `setVariableDefinitions()` before `init()` completes | Call it inside `init()` after `this.config` is set                             |
| Spaces or hyphens in `variableId`                            | Use underscores only: `my_variable` not `my-variable` or `my variable`         |
| Not re-calling after device capabilities change              | Call `UpdateVariableDefinitions(self)` again whenever the variable set changes |
| Setting values for IDs that haven't been defined yet         | Always define first, then set values via `companion-variable-set-value`        |
| Expecting `setVariableDefinitions()` to set values           | Definitions only declare the variable exists; values are set separately        |

---

## Import Reference

```typescript
import type { CompanionVariableDefinition } from '@companion-module/base'
```

---

## Related Skills

- **`companion-variable-set-value`** — sibling skill; handles `setVariableValues()`, `getVariableValue()`, updating values on state change, and setting initial values after definitions are registered
- **`companion-action-file-pattern`** — actions can trigger value updates
- **`companion-feedbacks`** — feedbacks can display variable values

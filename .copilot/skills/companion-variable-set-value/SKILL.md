---
name: companion-variable-set-value
description: 'How to set variable values with setVariableValues() and read them with getVariableValue() in a Bitfocus Companion module. Use when you need to update variable state, set variable value on init, handle device state update, or read a variable to compute its next value. Use companion-variable-definition to declare new variables first before setting values.'
---

# Companion Variable Set Value Skill

Set and read variable **values** at runtime. This skill covers only the value side of the variable API. To declare new variables (register their IDs and labels), use **`companion-variable-definition`** first.

## When to Use This Skill

### ✅ Use when:

- Setting initial values on `init()` after variable definitions are registered
- Updating variable values when device state changes (event handlers, polling, message handlers)
- Reading a variable's current value to compute its next value

### ❌ Do NOT use when:

- Adding a new variable that doesn't exist yet → use **`companion-variable-definition`** first to declare it
- Renaming a variable's label or changing its ID → use **`companion-variable-definition`**

---

## The Golden Rule

> **Always call `setVariableDefinitions()` BEFORE `setVariableValues()`.**

If you set values for variables that haven't been declared yet, Companion cannot resolve them and buttons will display `$(internal:variable_not_found)`.

See **`companion-variable-definition`** for how to declare variables.

---

## Pattern: Setting Values

Use `self.setVariableValues(values)` to set one or many variable values at once. Pass an object whose keys are `variableId` strings.

```typescript
// In init() — set initial values after definitions are registered
async init(config: ModuleConfig): Promise<void> {
  this.config = config

  // 1. Declare variables first (companion-variable-definition)
  UpdateVariableDefinitions(this)

  // 2. Set initial values immediately after
  this.setVariableValues({
    device_name: 'Unknown',      // string
    volume_db: '-∞',             // string
    mute_state: false,           // boolean
    message_count: 0,            // number
  })

  await this.connect()
}

// In a device state-change handler — update only what changed
function handleDeviceStatus(self: ModuleInstance, status: DeviceStatus): void {
  self.setVariableValues({
    volume_db: status.volumeDb.toFixed(1),
    mute_state: status.muted,
  })
}
```

---

## Pattern: Reading Values

Use `self.getVariableValue(variableId)` to read the current value. It returns `string | number | boolean | undefined` — always guard against `undefined`.

```typescript
// Guard with ?? to supply a safe default
const currentCount = (self.getVariableValue('message_count') as number) ?? 0

self.setVariableValues({
	message_count: currentCount + 1,
})
```

---

## Partial Updates

You only need to pass the keys you are changing. Companion merges the new values into its internal state — untouched variables keep their current values.

```typescript
// Only volume_db is updated; all other variables are unchanged
self.setVariableValues({
	volume_db: '-12.0',
})
```

---

## Value Type Rules

| Allowed     | Example                    |
| ----------- | -------------------------- |
| `string`    | `'Unmuted'`, `'-12.0 dB'`  |
| `number`    | `0`, `42`, `-12.5`         |
| `boolean`   | `true`, `false`            |
| `undefined` | clears the displayed value |

| NOT allowed        | What to do instead                        |
| ------------------ | ----------------------------------------- |
| Plain objects `{}` | `JSON.stringify(obj)`                     |
| Arrays `[]`        | `JSON.stringify(arr)` or join to a string |

---

## Common Mistakes

| Mistake                                                  | Result / Fix                                                                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Setting values before calling `setVariableDefinitions()` | Buttons show `$(internal:variable_not_found)` — always declare first                                   |
| Passing an object or array as a value                    | Runtime error or `[object Object]` displayed — use `JSON.stringify()`                                  |
| Not guarding `getVariableValue()` for `undefined`        | Arithmetic on `undefined` produces `NaN` — always use `?? defaultValue`                                |
| Forgetting to update values when device state changes    | Values go stale; buttons show outdated data — call `setVariableValues()` in every state-change handler |

---

## Import Reference

```typescript
import type { CompanionVariableValues } from '@companion-module/base'
```

`CompanionVariableValues` is the type accepted by `setVariableValues()`:

```typescript
// Explicit typing (optional — TypeScript can infer from inline object literals)
const values: CompanionVariableValues = {
	volume_db: '-12.0',
	mute_state: false,
}
self.setVariableValues(values)
```

---

## Related Skills

- **`companion-variable-definition`** — sibling skill; use this to declare variable IDs and labels with `setVariableDefinitions()` before setting values
- **`companion-actions`** — actions can call `setVariableValues()` to update state in response to button presses
- **`companion-feedbacks`** — feedbacks can read variables to drive button colour/style

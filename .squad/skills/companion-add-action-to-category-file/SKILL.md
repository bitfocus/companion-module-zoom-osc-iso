---
name: companion-add-action-to-category-file
description: 'Add one or more actions to an existing action category file in a Companion module. Use when you need to extend actions in an existing src/actions/action-{category}.ts file, add action to an action category file, or grow the action list of an existing category file. Does NOT apply when no action category file exists yet — use companion-action-file-pattern instead.'
---

# Companion Add Action to Category File

Add a new action to an **existing** action category file. Three steps — nothing else changes.

## When to Use This Skill

### ✅ Use when:

- Adding 1+ actions to an **existing** `src/actions/action-{category}.ts` file
- The category file already exists and you just need to extend it

### ❌ Do NOT use when:

- No `src/actions/action-{category}.ts` file exists yet for the category → use **`companion-action-file-pattern`** instead (it creates the file and wires the aggregator)
- Modifying or deleting an existing action definition

**The rule:** file already exists → this skill. File doesn't exist yet → `companion-action-file-pattern`.

---

## The Pattern

### Step 1 — Open the target file

```
src/actions/action-{category}.ts
```

### Step 2 — Add an enum member

```typescript
// Before
export enum ActionIdGlobalRecording {
	startLocalRecording = 'startLocalRecording',
	stopLocalRecording = 'stopLocalRecording',
}

// After — add the new member
export enum ActionIdGlobalRecording {
	startLocalRecording = 'startLocalRecording',
	stopLocalRecording = 'stopLocalRecording',
	archiveLocalRecording = 'archiveLocalRecording', // ← new
}
```

> The string value is the action ID registered with Companion. It **must be globally unique** across all enums in the module.

### Step 3 — Add the action definition

Add a matching entry in the `actions` object inside `GetActions{Category}()`.

**Sync callback (no options, no async work):**

```typescript
[ActionIdGlobalRecording.archiveLocalRecording]: {
  name: 'Archive Local Recording',
  options: [],
  callback: (): void => {
    const command = createCommand(instance, '/archiveLocalRecording')
    const sendToCommand = {
      id: ActionIdGlobalRecording.archiveLocalRecording,
      options: { command: command.oscPath, args: command.args },
    }
    sendActionCommand(instance, sendToCommand)
  },
},
```

**Async callback (options that need variable parsing):**

```typescript
[ActionIdUserVideoMic.someUserAction]: {
  name: 'Some User Action',
  options: [options.userName],
  callback: async (action): Promise<void> => {
    const userName = await instance.parseVariablesInString(action.options.userName as string)
    const command = createCommand(instance, '/someOscPath', userName, select.multi)
    if (command.isValidCommand) {
      const sendToCommand = {
        id: ActionIdUserVideoMic.someUserAction,
        options: { command: command.oscPath, args: command.args },
      }
      sendActionCommand(instance, sendToCommand)
    }
  },
},
```

#### Callback forms

| Form  | Signature                                          | Use when                                      |
| ----- | -------------------------------------------------- | --------------------------------------------- |
| Sync  | `callback: (): void => { … }`                      | No `await`, no option parsing                 |
| Async | `callback: async (action): Promise<void> => { … }` | Uses `await` (e.g., `parseVariablesInString`) |

#### Zoom OSC `createCommand` + `sendActionCommand` pattern

This module uses helpers from `./action-utils.js`:

```typescript
import { createCommand, sendActionCommand } from './action-utils.js'
// optionally: import { select } from './action-utils.js'  // for user-targeting
```

- `createCommand(instance, oscPath)` — builds the OSC path + args object for global commands
- `createCommand(instance, oscPath, userName, select.multi)` — adds user targeting
- `sendActionCommand(instance, sendToCommand)` — dispatches the command via OSC

> This is module-specific. In a generic Companion module the callback body would simply call instance methods directly (e.g., `instance.sendToDevice(...)`).

---

## Option Types Quick Reference

| Type        | Required extra fields               | Notes                                    |
| ----------- | ----------------------------------- | ---------------------------------------- |
| `textinput` | `default: string`                   | Supports Companion variable substitution |
| `number`    | `default`, `min`, `max`             | Add `range: true` for a slider           |
| `dropdown`  | `choices: [{id, label}]`, `default` | Single selection                         |
| `checkbox`  | `default: boolean`                  | On/off toggle                            |

**Examples:**

```typescript
// textinput (supports variables like $(zoom:userName))
{ id: 'userName', type: 'textinput', label: 'User Name', default: '' }

// dropdown
{ id: 'mode', type: 'dropdown', label: 'Mode',
  choices: [{ id: 'auto', label: 'Auto' }, { id: 'manual', label: 'Manual' }],
  default: 'auto' }

// number with slider
{ id: 'level', type: 'number', label: 'Level', min: 0, max: 100, default: 50, range: true }

// checkbox
{ id: 'enabled', type: 'checkbox', label: 'Enable Feature', default: false }
```

---

## Common Mistakes

| Mistake                                                        | Fix                                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Duplicate enum string value                                    | String IDs must be unique across **all** category enums — check the others |
| `callback` uses `await` but isn't `async`                      | Add `async` keyword; change return type to `Promise<void>`                 |
| `action.options.x` used without a cast                         | Cast explicitly: `as string`, `as number`, `as boolean`                    |
| Enum member name doesn't match the key in the `actions` object | They must match: `ActionIdFoo.bar` → `[ActionIdFoo.bar]: { … }`            |

---

## References

- **`companion-action-file-pattern`** skill — use this when creating a brand-new action category file (includes aggregator wiring)
- `src/actions/action-global-recording.ts` — clean example of sync callbacks with `createCommand` / `sendActionCommand`
- `src/actions/action-user-video-mic.ts` — example with async callbacks and user-targeting options

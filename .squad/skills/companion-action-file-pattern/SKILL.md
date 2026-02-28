---
name: companion-action-file-pattern
description: 'Teaches the multi-file action pattern used in split-file Companion modules. Use when asked to add a new action category, create an action file, register actions in an aggregator, or extend the actions layer of a Companion module that splits actions across multiple files with a GetActions aggregator.'
confidence: high
---

# Companion Action File Pattern

This module splits action definitions across many files (one per category), then aggregates them in a single `actions.ts` that calls `setActionDefinitions()`. This skill documents the exact structure and wiring required to add a new action category.

## When to Use This Skill

- Adding a new category of actions to a Companion module with split action files
- Creating a new `src/actions/action-{category}.ts` file
- Registering a new action file in the aggregator (`actions.ts`)
- Understanding the TypeScript types and export shape for action files

## Pattern Overview

```
src/
  actions.ts                        ← aggregator (imports + combines all categories)
  actions/
    action-{category-a}.ts          ← one file per action category
    action-{category-b}.ts
    action-{category-c}.ts
    action-utils.ts                 ← shared helpers used by action files
```

`index.ts` calls:

```typescript
this.setActionDefinitions(GetActions(this))
```

`GetActions()` (in `actions.ts`) calls each category's `GetActions{Category}(instance)`, collects the typed objects, spreads them into one combined object, and returns it.

---

## Pattern 1 — The Action File Structure

### Imports

```typescript
import { CompanionActionDefinition } from '@companion-module/base'
import { YourConfig } from '../config.js'
import { InstanceBaseExt } from '../utils.js'
// Add any other helpers you need, e.g.:
// import { someHelper } from './action-utils.js'
```

> `InstanceBaseExt<YourConfig>` is the typed instance — it provides access to module state, `parseVariablesInString`, `log`, `checkFeedbacks`, `saveConfig`, etc.

### Enum of Action IDs

Every action file exports an enum that names all its actions. This enum is the key type for the return object and is re-exported to the aggregator.

```typescript
export enum ActionIdMyCategory {
	doSomething = 'myDevice_doSomething',
	doSomethingElse = 'myDevice_doSomethingElse',
}
```

> Convention: enum member names are camelCase; string values are the action IDs registered with Companion (snake_case or camelCase, your choice — just be consistent).

### The Factory Function

```typescript
export function GetActionsMyCategory(instance: InstanceBaseExt<YourConfig>): {
	[id in ActionIdMyCategory]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdMyCategory]: CompanionActionDefinition | undefined } = {
		[ActionIdMyCategory.doSomething]: {
			name: 'Do Something',
			options: [],
			callback: (): void => {
				// call a method on the instance to trigger device behavior
				instance.someDeviceMethod()
			},
		},

		[ActionIdMyCategory.doSomethingElse]: {
			name: 'Do Something Else',
			description: 'Optional help text shown in Companion UI',
			options: [
				{
					id: 'targetName',
					type: 'textinput',
					label: 'Target Name',
					default: '',
				},
			],
			callback: async (action): Promise<void> => {
				// Parse Companion variables embedded in text options
				const name = await instance.parseVariablesInString(action.options.targetName as string)
				instance.someDeviceMethodWithArg(name)
			},
		},
	}

	return actions
}
```

### Option Types — Quick Reference

| Type            | Required extra fields                   | Notes                                    |
| --------------- | --------------------------------------- | ---------------------------------------- |
| `textinput`     | `default: string`                       | Supports Companion variable substitution |
| `number`        | `default`, `min`, `max`                 | Add `range: true` for slider             |
| `dropdown`      | `choices: [{id, label}]`, `default`     | Single selection                         |
| `multidropdown` | `choices: [{id, label}]`, `default: []` | Multi selection                          |
| `checkbox`      | `default: boolean`                      | On/off toggle                            |
| `static-text`   | `value: string`                         | Read-only label/note                     |

**Examples:**

```typescript
// dropdown
{
  id: 'mode',
  type: 'dropdown',
  label: 'Mode',
  choices: [
    { id: 'auto', label: 'Auto' },
    { id: 'manual', label: 'Manual' },
  ],
  default: 'auto',
}

// number with slider
{
  id: 'level',
  type: 'number',
  label: 'Level',
  min: 0,
  max: 100,
  default: 50,
  range: true,
}

// checkbox
{
  id: 'enabled',
  type: 'checkbox',
  label: 'Enable Feature',
  default: false,
}
```

### Accessing Instance State in Callbacks

The `instance` parameter is the full module instance. Common patterns:

```typescript
callback: async (action): Promise<void> => {
	// Read module state
	const currentValue = instance.someStateProperty

	// Parse Companion variables in string options
	const text = await instance.parseVariablesInString(action.options.someText as string)

	// Log messages
	instance.log('info', `Doing something with ${text}`)
	instance.log('warn', 'Something unexpected')
	instance.log('error', 'Something failed')

	// Trigger feedbacks to re-evaluate
	instance.checkFeedbacks('someFeedbackId')

	// Mutate config and save
	instance.config.someFlag = true
	instance.saveConfig(instance.config)

	// Call your device integration layer
	instance.sendToDevice(text)
}
```

> Cast `action.options.*` values explicitly — TypeScript types them as `any`: `action.options.level as number`, `action.options.name as string`.

---

## Pattern 2 — The Aggregator (`actions.ts`)

`actions.ts` has three responsibilities:

1. Import every category's enum and factory function
2. Call each factory, store the typed result in a local variable
3. Build a combined object (spread all categories) and return it

### Import each file

```typescript
import { ActionIdMyCategory, GetActionsMyCategory } from './actions/action-my-category.js'
```

### Call each factory and type the local variable

```typescript
const actionsMyCategory: { [id in ActionIdMyCategory]: CompanionActionDefinition | undefined } =
	GetActionsMyCategory(instance)
```

### Extend the union type on the combined `actions` object

The `actions` const has a mapped type whose key is a union of **all** category enums:

```typescript
const actions: {
	[id in
		| ActionId // ← local enum for one-off actions defined inline
		| ActionIdMyCategory
		| ActionIdOtherCategory]: /* ... */ CompanionActionDefinition | undefined
} = {
	...actionsMyCategory,
	...actionsOtherCategory,
	/* ... inline one-off actions ... */
}
```

### Return and hand off to Companion

```typescript
export function GetActions(instance: InstanceBaseExt<YourConfig>): CompanionActionDefinitions {
	// ... (all the above) ...
	return actions
}
```

`index.ts` then calls:

```typescript
this.setActionDefinitions(GetActions(this))
```

---

## Pattern 3 — Step-by-Step Recipe

### 1. Create the file

```
src/actions/action-{category}.ts
```

Use the template below (copy verbatim, replace all `{placeholders}`).

### 2. File template

```typescript
import { CompanionActionDefinition } from '@companion-module/base'
import { YourConfig } from '../config.js'
import { InstanceBaseExt } from '../utils.js'

export enum ActionId{Category} {
  firstAction = '{category}_firstAction',
  secondAction = '{category}_secondAction',
}

export function GetActions{Category}(instance: InstanceBaseExt<YourConfig>): {
  [id in ActionId{Category}]: CompanionActionDefinition | undefined
} {
  const actions: { [id in ActionId{Category}]: CompanionActionDefinition | undefined } = {

    [ActionId{Category}.firstAction]: {
      name: 'First Action',
      options: [],
      callback: (): void => {
        instance.log('debug', 'firstAction triggered')
        // TODO: call device integration layer
      },
    },

    [ActionId{Category}.secondAction]: {
      name: 'Second Action',
      options: [
        {
          id: 'param',
          type: 'textinput',
          label: 'Parameter',
          default: '',
        },
      ],
      callback: async (action): Promise<void> => {
        const param = await instance.parseVariablesInString(action.options.param as string)
        instance.log('debug', `secondAction triggered with param: ${param}`)
        // TODO: call device integration layer with param
      },
    },

  }

  return actions
}
```

### 3. Import in `actions.ts`

Add at the top of `actions.ts` alongside the other imports:

```typescript
import { ActionId{Category}, GetActions{Category} } from './actions/action-{category}.js'
```

### 4. Call the factory in `GetActions()`

Add inside `GetActions()`, alongside the other factory calls:

```typescript
const actions{Category}: { [id in ActionId{Category}]: CompanionActionDefinition | undefined } =
  GetActions{Category}(instance)
```

### 5. Extend the union type and spread into `actions`

In the `actions` const, add `ActionId{Category}` to the union type:

```typescript
const actions: {
  [id in
    | ActionId
    | /* ... existing enums ... */
    | ActionId{Category}   // ← add here
    ]: CompanionActionDefinition | undefined
} = {
  /* ... existing spreads ... */
  ...actions{Category},   // ← add here
}
```

### 6. Build and verify

```bash
yarn build
# or: npm run build
```

Zero TypeScript errors means your new file is properly typed and wired.

---

## Common Mistakes

| Mistake                                            | Fix                                                             |
| -------------------------------------------------- | --------------------------------------------------------------- |
| Enum string value duplicates an existing action ID | Check all other enums — IDs must be globally unique             |
| Added spread but forgot to add enum to union type  | TypeScript will error — add the enum to the `[id in ...]` union |
| Forgot `.js` extension on import in `actions.ts`   | This is ESM — always use `.js` extension on relative imports    |
| `callback` not marked `async` but uses `await`     | Add `async` keyword and change return type to `Promise<void>`   |
| Used `action.options.x` without casting            | Cast: `action.options.x as string` / `as number` / `as boolean` |

## References

- `src/actions.ts` — the aggregator (authoritative example of the full pattern)
- `src/actions/action-user-video-mic.ts` — clean example of a simple multi-action file
- `src/actions/action-social-stream.ts` — example showing non-OSC side effects (HTTP API call, config mutation)
- `src/actions/action-global.ts` — example with more complex callbacks and state access
- **companion-actions** skill — covers the `@companion-module/base` API types in depth

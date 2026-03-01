---
name: companion-upgrades
description: 'Reference for Bitfocus Companion module upgrade scripts using @companion-module/base. Use when asked to create upgrade scripts, migrate user data, handle breaking changes to actions/feedbacks/config, or rename IDs. Also use when user needs help with CompanionStaticUpgradeScript, version migrations, or the upgrade helper functions.'
---

# Companion Upgrades Skill

## When to Use This Skill

- User asks to "create an upgrade script", "migrate user data", or "handle breaking changes"
- User needs to rename config fields, action IDs, feedback IDs, or option IDs
- User is making breaking changes to the module and needs to preserve user configurations
- User wants to convert advanced feedbacks to boolean feedbacks
- User needs to migrate from custom invert logic to built-in invert support
- User asks about CompanionStaticUpgradeScript, upgrade helpers, or version numbering

## Key API Types

### `CompanionStaticUpgradeScript<TConfig>`

An array of upgrade functions, indexed by version number.

**CRITICAL:** Once added, scripts are NEVER removed or reordered. Each index = a version.

```typescript
export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	// Index 0 = upgrade from v0 to v1
	function (context, props) {
		return {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}
	},
	// Index 1 = upgrade from v1 to v2
	function (context, props) {
		// ...
	},
]
```

### `CompanionStaticUpgradeProps<TConfig>`

Passed to each upgrade function.

**Properties:**

- `actions: CompanionMigrationAction[]` — Array of user's saved actions to mutate
- `feedbacks: CompanionMigrationFeedback[]` — Array of user's saved feedbacks to mutate
- `config: TConfig` — Current module config to mutate

### `CompanionStaticUpgradeResult`

Returned from each upgrade function.

**Properties:**

- `updatedConfig: TConfig | null` — Mutated config or `null` if unchanged
- `updatedActions: CompanionMigrationAction[]` — Mutated actions array
- `updatedFeedbacks: CompanionMigrationFeedback[]` — Mutated feedbacks array

### `CompanionMigrationAction`

Represents a saved action instance.

**Properties:**

- `actionId: string` — The action definition ID
- `options: { [id: string]: any }` — User-configured option values

### `CompanionMigrationFeedback`

Represents a saved feedback instance.

**Properties:**

- `feedbackId: string` — The feedback definition ID
- `options: { [id: string]: any }` — User-configured option values
- `style?: CompanionButtonStyleProps` — Custom style overrides
- `isInverted?: boolean` — Invert state (for boolean feedbacks)

## Patterns & Examples

### Empty Upgrade Script (Placeholder)

Use when you need to bump version but have no migrations:

```typescript
import type { CompanionStaticUpgradeScript } from '@companion-module/base'
import type { ModuleConfig } from './config.js'
import { EmptyUpgradeScript } from '@companion-module/base'

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	EmptyUpgradeScript, // v0 -> v1: no changes needed
]
```

### Basic Config Migration

Rename a config field:

```typescript
export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	function (context, props) {
		const config = props.config as any

		// Rename 'ipAddress' to 'host'
		if (config.ipAddress !== undefined) {
			config.host = config.ipAddress
			delete config.ipAddress
		}

		return {
			updatedConfig: config as ModuleConfig,
			updatedActions: props.actions,
			updatedFeedbacks: props.feedbacks,
		}
	},
]
```

### Migrating Action Options

Rename an action or change option IDs:

```typescript
export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	function (context, props) {
		const updatedActions = props.actions.map((action) => {
			// Rename action ID
			if (action.actionId === 'old_action_name') {
				action.actionId = 'new_action_name'
			}

			// Rename option ID
			if (action.actionId === 'send_command') {
				if (action.options.cmd !== undefined) {
					action.options.command = action.options.cmd
					delete action.options.cmd
				}
			}

			return action
		})

		return {
			updatedConfig: null,
			updatedActions,
			updatedFeedbacks: props.feedbacks,
		}
	},
]
```

### Migrating Feedback Options

```typescript
export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	function (context, props) {
		const updatedFeedbacks = props.feedbacks.map((feedback) => {
			// Rename feedback ID
			if (feedback.feedbackId === 'channel_active') {
				feedback.feedbackId = 'is_channel_active'
			}

			// Update option values
			if (feedback.feedbackId === 'is_channel_active') {
				// Convert channel number from 1-indexed to 0-indexed
				if (typeof feedback.options.channel === 'number') {
					feedback.options.channel = feedback.options.channel - 1
				}
			}

			return feedback
		})

		return {
			updatedConfig: null,
			updatedActions: props.actions,
			updatedFeedbacks,
		}
	},
]
```

### Helper: Convert to Boolean Feedbacks

Migrate advanced feedbacks to boolean feedbacks:

```typescript
import { CreateConvertToBooleanFeedbackUpgradeScript } from '@companion-module/base'

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	// Map of old feedback IDs to new boolean feedback IDs
	CreateConvertToBooleanFeedbackUpgradeScript({
		old_advanced_feedback: 'new_boolean_feedback',
		status_display: 'status_active',
	}),
]
```

**What it does:**

- Converts `type: 'advanced'` feedbacks to `type: 'boolean'`
- Preserves user options
- Maps old feedback IDs to new ones

### Helper: Use Built-in Invert

Migrate custom invert logic to Companion's built-in invert:

```typescript
import { CreateUseBuiltinInvertForFeedbacksUpgradeScript } from '@companion-module/base'

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	// List feedback IDs that should use built-in invert
	CreateUseBuiltinInvertForFeedbacksUpgradeScript(['is_muted', 'connection_ok', 'device_ready']),
]
```

**What it does:**

- Enables `showInvert: true` on specified boolean feedbacks
- Migrates custom `invert` option to built-in `isInverted` property
- Removes custom invert handling from options

### Complete Example: Multiple Migrations

```typescript
import type { CompanionStaticUpgradeScript } from '@companion-module/base'
import type { ModuleConfig } from './config.js'
import {
	EmptyUpgradeScript,
	CreateConvertToBooleanFeedbackUpgradeScript,
	CreateUseBuiltinInvertForFeedbacksUpgradeScript,
} from '@companion-module/base'

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	// v0 -> v1: Rename config fields
	function (context, props) {
		const config = props.config as any

		if (config.ipAddress !== undefined) {
			config.host = config.ipAddress
			delete config.ipAddress
		}

		if (config.tcpPort !== undefined) {
			config.port = config.tcpPort
			delete config.tcpPort
		}

		return {
			updatedConfig: config as ModuleConfig,
			updatedActions: props.actions,
			updatedFeedbacks: props.feedbacks,
		}
	},

	// v1 -> v2: Rename action and update options
	function (context, props) {
		const updatedActions = props.actions.map((action) => {
			if (action.actionId === 'setInput') {
				action.actionId = 'set_input'

				// Convert 'inputNum' to 'input'
				if (action.options.inputNum !== undefined) {
					action.options.input = action.options.inputNum
					delete action.options.inputNum
				}
			}

			return action
		})

		return {
			updatedConfig: null,
			updatedActions,
			updatedFeedbacks: props.feedbacks,
		}
	},

	// v2 -> v3: Convert advanced feedbacks to boolean
	CreateConvertToBooleanFeedbackUpgradeScript({
		channel_status: 'is_channel_active',
		connection_display: 'connection_ok',
	}),

	// v3 -> v4: Use built-in invert for boolean feedbacks
	CreateUseBuiltinInvertForFeedbacksUpgradeScript(['is_channel_active', 'connection_ok', 'is_muted']),

	// v4 -> v5: No changes needed, just version bump
	EmptyUpgradeScript,
]
```

### Testing Upgrades

```typescript
// During development, log to verify migrations work
export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	function (context, props) {
		console.log('Upgrade v0->v1: Input config:', props.config)

		const config = props.config as any
		if (config.oldField !== undefined) {
			config.newField = config.oldField
			delete config.oldField
		}

		console.log('Upgrade v0->v1: Output config:', config)

		return {
			updatedConfig: config as ModuleConfig,
			updatedActions: props.actions,
			updatedFeedbacks: props.feedbacks,
		}
	},
]
```

## Common Pitfalls

1. **Removing or reordering scripts**
   - ❌ NEVER remove or reorder scripts in the array
   - ✅ Add new scripts to the end, use `EmptyUpgradeScript` for no-op versions

2. **Not returning all three properties**
   - Always return `{ updatedConfig, updatedActions, updatedFeedbacks }`
   - Return original values if unchanged (or `null` for config)

3. **Forgetting to delete old properties**
   - After renaming, delete the old property to avoid confusion
   - `delete config.oldField`

4. **Not handling undefined values**
   - Always check if property exists before migrating
   - `if (config.oldField !== undefined) { ... }`

5. **Mutating without returning**
   - Must return the mutated arrays/config, not just mutate in place
   - Scripts should modify AND return

6. **Wrong TypeScript types**
   - Cast config to `any` when accessing renamed fields: `const config = props.config as any`
   - Cast back to `ModuleConfig` when returning: `updatedConfig: config as ModuleConfig`

7. **Breaking changes without upgrades**
   - ALWAYS add an upgrade script when:
     - Renaming actions, feedbacks, or config fields
     - Changing option IDs or types
     - Removing features users may have configured

## Import Reference

```typescript
import type {
	CompanionStaticUpgradeScript,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
	CompanionMigrationAction,
	CompanionMigrationFeedback,
} from '@companion-module/base'

import {
	EmptyUpgradeScript,
	CreateConvertToBooleanFeedbackUpgradeScript,
	CreateUseBuiltinInvertForFeedbacksUpgradeScript,
} from '@companion-module/base'
```

## Related Skills

- **companion-config** — Config structure changes require upgrade scripts
- **companion-actions** — Action definition changes require migration
- **companion-feedbacks** — Feedback definition changes require migration

## Version Numbering

The upgrade script array index determines the version:

- Empty array = v0 (no upgrades)
- 1 script = v1 (users on v0 will run script[0])
- 2 scripts = v2 (users on v1 will run script[1])
- etc.

When users update a module, Companion runs all scripts from their saved version to current version in sequence.

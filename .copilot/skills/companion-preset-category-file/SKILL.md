---
name: companion-preset-category-file
description: 'Teaches the enum-based preset category file pattern used in split-file Companion modules. Use when asked to create preset file, add preset category, add preset category file, wire presets, extend presets.ts aggregator, or use enum-based preset IDs in a src/presets/preset-{category}.ts file.'
---

# Companion Preset Category File Pattern

This module splits preset definitions across many files (one per category), then aggregates them in `presets.ts`. This skill documents the exact structure and wiring required to add a new preset category using the **enum-based preset ID pattern** — mirroring how action category files work.

## When to Use This Skill

### ✅ Use this skill when:

- You are adding a **new logical category** of presets that does not fit into any existing `src/presets/preset-*.ts` file
- You need to create a brand new `src/presets/preset-{category}.ts` file from scratch
- You need to wire a new file into the `presets.ts` aggregator for the first time
- The new presets are conceptually distinct from existing categories

### ❌ Do NOT use this skill when:

- You only need to **add a preset to an existing category file** — just open the existing `src/presets/preset-{category}.ts`, add the new enum member(s) and preset definition(s), and you're done. No new file, no aggregator changes needed.
- You are modifying or renaming an existing preset definition
- You are adding a single preset that logically belongs to a category that already has a file

**The rule of thumb:** If a file for your category already exists → edit it directly. If no file exists for your category → use this skill to create one and wire it up.

---

## Pattern Overview

```
src/
  presets.ts                        ← aggregator (imports + combines all categories)
  presets/
    preset-{category-a}.ts          ← one file per preset category
    preset-{category-b}.ts
    preset-utils.ts                 ← CompanionPresetExt / CompanionPresetDefinitionsExt types
```

`index.ts` calls:

```typescript
this.setPresetDefinitions(GetPresetList(this))
```

`GetPresetList()` (in `presets.ts`) calls each category's `GetPresets{Category}()`, stores the typed result in a local variable, spreads all results into one combined object, and returns it.

---

## Pattern 1 — The Preset Category File

### Imports

```typescript
import { CompanionPresetExt, CompanionPresetDefinitionsExt } from './preset-utils.js'
import { ActionIdMyCategory } from '../actions/action-my-category.js'
import { colorBlack, colorLightGray } from '../utils.js'
// Add any other ActionId enums or helpers you need
```

> Always use `.js` extensions on relative imports — this is ESM.

### Enum of Preset IDs

Every preset file exports an enum that names all its presets. This enum is the key type for the return object and is re-exported to the aggregator.

```typescript
export enum PresetIdMyCategory {
	myPreset = 'myCategory_myPreset',
	anotherPreset = 'myCategory_anotherPreset',
}
```

> Convention: enum member names are camelCase; string values follow `'{category}_{presetName}'` to namespace IDs and avoid collisions across categories.

### The Factory Function — Two Forms

**Without `instance`** (static presets — most categories):

```typescript
export function GetPresetsMyCategory(): {
	[id in PresetIdMyCategory]: CompanionPresetExt | undefined
} {
	const presets: { [id in PresetIdMyCategory]: CompanionPresetExt | undefined } = {
		[PresetIdMyCategory.myPreset]: {
			type: 'button',
			category: 'My Category',
			name: 'My Preset',
			style: {
				text: 'Button Label',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdMyCategory.someAction,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},

		[PresetIdMyCategory.anotherPreset]: {
			// ...
		},
	}

	return presets
}
```

**With `instance`** (when presets need dynamic data — participant lists, config values):

```typescript
import { InstanceBaseExt } from '../utils.js'
import { ZoomConfig } from '../config.js'

export function GetPresetsMyCategory(instance: InstanceBaseExt<ZoomConfig>): {
	[id in PresetIdMyCategory]: CompanionPresetExt | undefined
} {
	const presets: { [id in PresetIdMyCategory]: CompanionPresetExt | undefined } = {
		[PresetIdMyCategory.myPreset]: {
			type: 'button',
			category: 'My Category',
			name: instance.config.someConfigValue ?? 'Default Name',
			// ...
		},
	}

	return presets
}
```

Use the `instance` form only when required — `preset-recording.ts` is a no-instance example; `preset-participants.ts` is an instance example.

> **Why enum over plain string keys?**
>
> - TypeScript catches duplicate IDs at compile time — two enum members cannot have the same string value without a type error
> - Rename-refactoring works across the whole codebase via IDE tooling
> - The aggregator's union type enforces that every enum member is covered in the combined object
> - `actionId` references inside steps are already typed enums — preset IDs should follow the same discipline

---

## Pattern 2 — The Aggregator (`presets.ts`)

`presets.ts` has three responsibilities:

1. Import every category's enum and factory function
2. Call each factory, store the typed result in a local variable
3. Build a combined object (spread all categories), cast, and return it

### 1. Import the enum and factory

```typescript
import { PresetIdMyCategory, GetPresetsMyCategory } from './presets/preset-my-category.js'
```

### 2. Call the factory and type the local variable

Inside `GetPresetList()`, alongside the other factory calls:

```typescript
// no-instance form:
const presetsMyCategory: { [id in PresetIdMyCategory]: CompanionPresetExt | undefined } = GetPresetsMyCategory()

// instance form:
const presetsMyCategory: { [id in PresetIdMyCategory]: CompanionPresetExt | undefined } = GetPresetsMyCategory(instance)
```

### 3. Extend the union type on the combined `presets` object

The `presets` const has a mapped type whose key is a union of **all** category enums. Add the new enum to the union and its spread to the object:

```typescript
const presets: {
	[id in PresetIdCategoryOne | PresetIdCategoryTwo | PresetIdMyCategory]: CompanionPresetExt | undefined // ← add new enum here
} = {
	...presetsCategoryOne,
	...presetsCategoryTwo,
	...presetsMyCategory, // ← add new spread here
}

return presets as CompanionPresetDefinitions
```

> **Why the union type is required:** Unlike the old `[id: string]` index, the mapped type gives TypeScript visibility of every preset ID across the module. Adding an enum to the union without spreading (or vice versa) is a compile-time error.

> **`as CompanionPresetDefinitions` cast:** The mapped type is more specific than `CompanionPresetDefinitions` — the cast is needed on the return value. This is identical to how `actions.ts` returns `actions` typed as `CompanionActionDefinitions`.

---

## Step-by-Step Recipe

### 1. Create the file

```
src/presets/preset-{category}.ts
```

Use the template below (copy verbatim, replace all `{placeholders}`).

### 2. File template

```typescript
import { CompanionPresetExt } from './preset-utils.js'
import { ActionId{RelatedCategory} } from '../actions/action-{related-category}.js'
import { colorBlack, colorLightGray } from '../utils.js'

export enum PresetId{Category} {
  firstPreset = '{category}_firstPreset',
  secondPreset = '{category}_secondPreset',
}

export function GetPresets{Category}(): {
  [id in PresetId{Category}]: CompanionPresetExt | undefined
} {
  const presets: { [id in PresetId{Category}]: CompanionPresetExt | undefined } = {

    [PresetId{Category}.firstPreset]: {
      type: 'button',
      category: '{Category Display Name}',
      name: 'First Preset',
      style: {
        text: 'First Preset',
        size: '14',
        color: colorBlack,
        bgcolor: colorLightGray,
      },
      steps: [
        {
          down: [
            {
              actionId: ActionId{RelatedCategory}.someAction,
              options: {},
            },
          ],
          up: [],
        },
      ],
      feedbacks: [],
    },

    [PresetId{Category}.secondPreset]: {
      type: 'button',
      category: '{Category Display Name}',
      name: 'Second Preset',
      style: {
        text: 'Second Preset',
        size: '14',
        color: colorBlack,
        bgcolor: colorLightGray,
      },
      steps: [
        {
          down: [
            {
              actionId: ActionId{RelatedCategory}.anotherAction,
              options: {},
            },
          ],
          up: [],
        },
      ],
      feedbacks: [],
    },

  }

  return presets
}
```

### 3. Import in `presets.ts`

Add at the top of `presets.ts` alongside the other imports:

```typescript
import { PresetId{Category}, GetPresets{Category} } from './presets/preset-{category}.js'
```

### 4. Call the factory in `GetPresetList()`

Add inside `GetPresetList()`, alongside the other factory calls:

```typescript
const presets{Category}: { [id in PresetId{Category}]: CompanionPresetExt | undefined } =
  GetPresets{Category}()
// or: GetPresets{Category}(instance)  ← if the factory needs instance
```

### 5. Extend the union type and spread into `presets`

In the `presets` const, add `PresetId{Category}` to the union and the spread to the object:

```typescript
const presets: {
  [id in
    | /* ... existing enums ... */
    | PresetId{Category}   // ← add here
    ]: CompanionPresetExt | undefined
} = {
  /* ... existing spreads ... */
  ...presets{Category},   // ← add here
}
```

### 6. Build and verify

```bash
yarn build
# or: npm run build
```

Zero TypeScript errors means your new file is properly typed and wired.

---

## Preset Button Shape

Full annotated reference for a `CompanionPresetExt` entry:

```typescript
[PresetIdMyCategory.myPreset]: {
  type: 'button',                    // always 'button' for button presets
  category: 'My Category',           // groups presets in Companion UI by this label
  name: 'My Preset',                 // display name shown in the preset picker
  style: {
    text: 'Button Label',            // text rendered on the button face
    size: '14',                      // font size as string
    color: colorBlack,               // foreground color — import from '../utils.js'
    bgcolor: colorLightGray,         // background color — import from '../utils.js'
  },
  steps: [
    {
      down: [
        {
          actionId: ActionIdMyCategory.someAction,  // typed ActionId* enum value
          options: {},                               // action options object
        },
      ],
      up: [],                        // actions fired on button release (usually empty)
    },
  ],
  feedbacks: [],                     // feedback definitions ([] if none needed)
}
```

---

## Common Mistakes

| Mistake                                                           | Fix                                                                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Enum string value duplicates an existing preset ID                | Check all other `PresetId*` enums — IDs must be globally unique; namespacing via `{category}_` prefix prevents this |
| Added spread but forgot to add enum to union type in `presets.ts` | TypeScript will error — add the enum to the `[id in ...]` union                                                     |
| Added enum to union but forgot to spread the result               | TypeScript will error — spread the factory result into the `presets` object                                         |
| Forgot `.js` extension on import in `presets.ts`                  | This is ESM — always use `.js` extension on relative imports                                                        |
| Using a string literal for `actionId` inside `steps`              | Use the typed `ActionId*` enum value — TypeScript cannot catch typos in raw strings                                 |
| Factory returns `CompanionPresetDefinitionsExt` (old pattern)     | Return the enum-mapped type `{ [id in PresetId{Category}]: CompanionPresetExt \| undefined }`                       |
| Forgot `as CompanionPresetDefinitions` cast on `return presets`   | The mapped union type is more specific — cast is required to satisfy the return type                                |

---

## References

- `src/presets.ts` — the aggregator (authoritative wiring pattern, mirrors `actions.ts`)
- `src/actions.ts` — the action aggregator this pattern exactly mirrors
- `src/presets/preset-recording.ts` — existing no-instance preset category file (shows old string-key style; target for enum migration)
- `src/presets/preset-participants.ts` — existing instance-form preset category file
- `src/presets/preset-utils.ts` — `CompanionPresetExt` and `CompanionPresetDefinitionsExt` type definitions
- Sibling skill: `companion-action-file-pattern` — the parallel pattern this skill mirrors

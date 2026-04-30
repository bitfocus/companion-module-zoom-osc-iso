---
name: companion-add-preset-to-category-file
description: 'Add one or more presets to an existing enum-based preset category file in a Companion module. Use when you need to add preset, extend preset enum, add preset to an existing src/presets/preset-{category}.ts file, or grow the preset list of an existing preset category file. Does NOT apply when no preset category file exists yet — use companion-preset-category-file instead.'
---

# Companion Add Preset to Category File

Add a new preset to an **existing** enum-based preset category file. Two steps — nothing else changes.

## When to Use This Skill

### ✅ Use when:

- Adding 1+ presets to an **existing** `src/presets/preset-{category}.ts` file
- The category file already exists and you just need to extend the preset enum and definition

### ❌ Do NOT use when:

- No `src/presets/preset-{category}.ts` file exists yet → use **`companion-preset-category-file`** instead (it creates the file and wires the aggregator)
- Modifying or deleting an existing preset definition

**The rule:** file already exists → this skill. File doesn't exist yet → `companion-preset-category-file`.

---

## The Pattern

### Step 1 — Add an enum member

```typescript
// Before
export enum PresetIdRecording {
	startLocalRecording = 'recording_startLocalRecording',
	stopLocalRecording = 'recording_stopLocalRecording',
}

// After — add the new member
export enum PresetIdRecording {
	startLocalRecording = 'recording_startLocalRecording',
	stopLocalRecording = 'recording_stopLocalRecording',
	archiveLocalRecording = 'recording_archiveLocalRecording', // ← new
}
```

> The string value is the preset ID registered with Companion. It **must be globally unique** across all preset enums in the module. Namespace it with the category prefix (e.g. `recording_`).

### Step 2 — Add the preset definition

Add a matching entry in the `presets` object inside `GetPresets{Category}()`.

**Simple (no feedbacks):**

```typescript
[PresetIdRecording.archiveLocalRecording]: {
  type: 'button',
  category: 'Recording Actions',
  name: 'Archive Local Recording',
  style: {
    text: 'Archive Local Recording',
    size: '14',
    color: colorBlack,
    bgcolor: colorLightGray,
  },
  steps: [
    {
      down: [
        {
          actionId: ActionIdGlobalRecording.archiveLocalRecording,
          options: {},
        },
      ],
      up: [],
    },
  ],
  feedbacks: [],
},
```

**With feedbacks:**

```typescript
[PresetIdRecording.archiveLocalRecording]: {
  type: 'button',
  category: 'Recording Actions',
  name: 'Archive Local Recording',
  style: {
    text: 'Archive Local Recording',
    size: '14',
    color: colorBlack,
    bgcolor: colorLightGray,
  },
  steps: [
    {
      down: [
        {
          actionId: ActionIdGlobalRecording.archiveLocalRecording,
          options: {},
        },
      ],
      up: [],
    },
  ],
  feedbacks: [
    {
      feedbackId: FeedbackId.someFeedback,
      options: {},
      style: getFeedbackStyleSelected(),
    },
  ],
},
```

---

## Preset Button Shape Reference

```typescript
[PresetId{Category}.myNewPreset]: {
  type: 'button',                  // always 'button'
  category: 'My Category',        // must match existing category string in this file
  name: 'My New Preset',          // human-readable name shown in Companion UI
  style: {
    text: 'Button Label',         // label shown on Companion button
    size: '14',                   // font size as string
    color: colorBlack,            // text color — import from '../utils.js'
    bgcolor: colorLightGray,      // background color — import from '../utils.js'
  },
  steps: [
    {
      down: [
        {
          actionId: ActionIdMyCategory.someAction,  // enum value, NOT a string literal
          options: {},
        },
      ],
      up: [],                     // leave empty unless you need an up-press action
    },
  ],
  feedbacks: [],                  // empty array when no feedbacks needed
},
```

---

## Common Mistakes

| Mistake                                                             | Fix                                                                                                           |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Duplicate enum string value                                         | String IDs must be unique across **all** preset enums — check the others and use a category-namespaced prefix |
| Using string literal for key instead of enum member                 | Use `[PresetId{Category}.member]` as the key, never `'My_String_Key'`                                         |
| Using string literal for `actionId` instead of an action enum value | Use `ActionIdFoo.bar`, never a bare string                                                                    |
| Mismatched `category` string creating an unintended new UI group    | Copy the exact category string from an existing preset in this file                                           |

---

## References

- **`companion-preset-category-file`** skill — use this when creating a brand-new preset category file (includes aggregator wiring)

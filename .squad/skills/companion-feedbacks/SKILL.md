---
name: companion-feedbacks
description: 'Reference for Bitfocus Companion module feedback definitions using @companion-module/base. Use when asked to add a feedback, change button colors based on state, render button graphics, or create visual indicators. Also use when user needs help with boolean vs advanced feedbacks, subscribe/unsubscribe, or the CompanionFeedbackDefinition API.'
---

# Companion Feedbacks Skill

## When to Use This Skill

- User asks to "add a feedback", "make the button change color", or "show device state on buttons"
- User wants to create visual indicators for connection status, mute state, or device levels
- User needs to render custom graphics or images on buttons (advanced feedbacks)
- User asks about boolean vs advanced feedback types or when to use each
- User is implementing subscribe/unsubscribe for feedback polling or state monitoring
- User needs help triggering feedback updates with checkFeedbacks() or checkAllFeedbacks()

## Key API Types

### `CompanionBooleanFeedbackDefinition`

Simplest feedback type — returns `true` to apply a style, `false` to use default.

**Properties:**

- `type: 'boolean'` — Required type discriminator
- `name: string` — Human-readable name
- `description?: string` — Optional help text
- `options: SomeCompanionInputField[]` — User-configurable parameters
- `defaultStyle: CompanionButtonStyleProps` — Style applied when callback returns `true`
- `showInvert?: boolean` — If `true`, shows "Invert" checkbox in UI (default: `false`)
- `callback: (feedback: CompanionFeedbackContext) => boolean | Promise<boolean>` — Returns `true` to apply style
- `subscribe?: (feedback: CompanionFeedbackContext) => void | Promise<void>` — Called when feedback is added
- `unsubscribe?: (feedback: CompanionFeedbackContext) => void | Promise<void>` — Called when removed

### `CompanionAdvancedFeedbackDefinition`

Advanced feedback — returns full button rendering properties.

**Properties:**

- `type: 'advanced'` — Required type discriminator
- `name: string` — Human-readable name
- `description?: string` — Optional help text
- `options: SomeCompanionInputField[]` — User-configurable parameters
- `callback: (feedback: CompanionFeedbackContext) => CompanionAdvancedFeedbackResult | Promise<CompanionAdvancedFeedbackResult>` — Returns rendering properties
- `subscribe?: (feedback: CompanionFeedbackContext) => void | Promise<void>`
- `unsubscribe?: (feedback: CompanionFeedbackContext) => void | Promise<void>`

**CompanionAdvancedFeedbackResult properties:**

- `png?: string | Buffer` — Base64 PNG or Buffer to render
- `text?: string` — Text to display
- `size?: 'auto' | '7' | '14' | '18' | '24' | '30' | '44'` — Font size
- `color?: number` — Text color (from `combineRgb()`)
- `bgcolor?: number` — Background color
- `alignment?: 'left:top' | 'center:top' | ... ` — Text alignment
- `pngalignment?: 'left:top' | 'center:center' | ...` — Image alignment

### `defaultStyle` Properties

Used in boolean feedbacks to define the applied style.

Common properties:

- `bgcolor?: number` — Background color from `combineRgb(r, g, b)`
- `color?: number` — Foreground/text color
- `text?: string` — Override button text
- `size?: string` — Font size
- `alignment?: string` — Text alignment
- `pngalignment?: string` — Image alignment
- `png64?: string` — Base64-encoded PNG image

## Patterns & Examples

### Basic Boolean Feedback

```typescript
import { combineRgb } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		ChannelState: {
			name: 'Example Feedback',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Test',
					default: 5,
					min: 0,
					max: 10,
				},
			],
			callback: (feedback) => {
				console.log('Hello world!', feedback.options.num)
				if (Number(feedback.options.num) > 5) {
					return true
				} else {
					return false
				}
			},
		},
	})
}
```

### State-Based Boolean Feedback

```typescript
export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		is_muted: {
			name: 'Is Muted',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0), // Red when muted
				color: combineRgb(255, 255, 255),
			},
			showInvert: true, // Allow user to invert logic
			options: [],
			callback: (feedback) => {
				// Access module state
				return self.deviceState.muted === true
			},
		},

		connection_ok: {
			name: 'Connection OK',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0), // Green when connected
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				return self.connection.isConnected()
			},
		},
	})
}
```

### Advanced Feedback with Custom Text

```typescript
export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		level_display: {
			name: 'Level Display',
			type: 'advanced',
			options: [
				{
					id: 'channel',
					type: 'number',
					label: 'Channel',
					default: 1,
					min: 1,
					max: 16,
				},
			],
			callback: (feedback) => {
				const channel = feedback.options.channel as number
				const level = self.deviceState.levels[channel] || 0

				// Return custom rendering
				return {
					text: `CH${channel}: ${level}%`,
					size: '18',
					color: combineRgb(255, 255, 255),
					bgcolor: level > 75 ? combineRgb(255, 0, 0) : combineRgb(0, 0, 255),
					alignment: 'center:center',
				}
			},
		},
	})
}
```

### Triggering Feedback Updates

When device state changes, notify Companion to re-evaluate feedbacks:

```typescript
// Re-check a specific feedback
self.checkFeedbacks('is_muted')

// Re-check all feedbacks
self.checkAllFeedbacks()

// Common pattern: update state + check feedbacks
async function handleDeviceUpdate(self: ModuleInstance, data: DeviceUpdate): Promise<void> {
	self.deviceState.muted = data.muted
	self.deviceState.levels = data.levels

	// Trigger re-evaluation
	self.checkFeedbacks('is_muted', 'level_display')
}
```

### Subscribe/Unsubscribe for Polling

```typescript
export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		device_temperature: {
			name: 'Device Temperature Warning',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 128, 0), // Orange warning
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'threshold',
					type: 'number',
					label: 'Warning Threshold (°C)',
					default: 70,
					min: 0,
					max: 100,
				},
			],
			subscribe: (feedback) => {
				// Start polling temperature when feedback is added to a button
				self.startTemperaturePolling()
			},
			unsubscribe: (feedback) => {
				// Stop polling when no buttons use this feedback
				self.stopTemperaturePolling()
			},
			callback: (feedback) => {
				const threshold = feedback.options.threshold as number
				return self.deviceState.temperature >= threshold
			},
		},
	})
}
```

## Common Pitfalls

1. **Using integers instead of `combineRgb()`**
   - Always use `combineRgb(r, g, b)` for colors, not raw integers

2. **Forgetting to trigger re-checks**
   - Call `self.checkFeedbacks()` or `self.checkAllFeedbacks()` when state changes

3. **Blocking callbacks**
   - Callbacks should be fast — compute from cached state, don't query devices synchronously

4. **Not handling missing state**
   - Always provide fallback values: `self.deviceState.level ?? 0`

5. **Confusing boolean vs. advanced**
   - Use boolean for simple on/off styling
   - Use advanced only when you need full rendering control (custom text, images)

6. **Not cleaning up subscriptions**
   - Always implement `unsubscribe` if you use `subscribe` to avoid resource leaks

## Import Reference

```typescript
import { combineRgb, splitRgb, splitHsl, splitHsv, splitHex } from '@companion-module/base'

import type {
	CompanionBooleanFeedbackDefinition,
	CompanionAdvancedFeedbackDefinition,
	CompanionFeedbackDefinitions,
	CompanionFeedbackContext,
	CompanionAdvancedFeedbackResult,
	CompanionButtonStyleProps,
} from '@companion-module/base'
```

## Related Skills

- **companion-actions** — Actions often trigger feedback updates
- **companion-variables** — Variables can be displayed via advanced feedbacks
- **companion-config** — Feedback options use the same field types as config

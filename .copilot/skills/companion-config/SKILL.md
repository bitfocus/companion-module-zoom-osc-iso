---
name: companion-config
description: 'Reference for Bitfocus Companion module configuration fields using @companion-module/base. Use when asked to add config fields, define connection settings (host, port, credentials), create module options, or validate user input. Also use when user needs help with config field types, regex validation, or the configUpdated lifecycle.'
---

# Companion Config Skill

## When to Use This Skill

- User asks to "add a config field", "define connection settings", or "create module options"
- User wants to add IP address, port, username, password, or other connection parameters
- User needs to create dropdowns, checkboxes, number inputs, or other configuration options
- User is working on validating user input with regex patterns or min/max constraints
- User asks about config field types (textinput, number, dropdown, checkbox, etc.)
- User needs help with the configUpdated() lifecycle method or handling config changes

## Key API Types

### `SomeCompanionConfigField`

Union type covering all config field types. Each field requires: `id`, `type`, `label`, plus type-specific properties.

### `ModuleConfig` Interface

User-defined TypeScript interface matching the config field IDs and types.

```typescript
export interface ModuleConfig {
	host: string
	port: number
	username?: string
	enable_feature: boolean
}
```

## Config Field Types

### `textinput` — Text Input Field

```typescript
{
  type: 'textinput',
  id: 'host',
  label: 'Target IP',
  width: 8,              // Grid columns (1-12)
  regex: Regex.IP,       // Optional validation
  required: true,        // Optional: prevents empty values
  default: '192.168.1.1',
}
```

**Common regex patterns:**

- `Regex.IP` — IPv4 address
- `Regex.HOSTNAME` — Valid hostname
- `Regex.URL` — URL format
- `Regex.SOMETHING` — Non-empty string
- Custom: `/^[A-Z]{3}$/` — Three uppercase letters

### `number` — Numeric Input

```typescript
{
  type: 'number',
  id: 'port',
  label: 'Target Port',
  width: 4,
  min: 1,
  max: 65535,
  default: 8000,
  required: true,
  range: false,          // If true, shows as slider
}
```

### `dropdown` — Single Selection

```typescript
{
  type: 'dropdown',
  id: 'protocol',
  label: 'Protocol',
  width: 6,
  choices: [
    { id: 'tcp', label: 'TCP' },
    { id: 'udp', label: 'UDP' },
    { id: 'http', label: 'HTTP' },
  ],
  default: 'tcp',
}
```

### `multidropdown` — Multiple Selection

```typescript
{
  type: 'multidropdown',
  id: 'enabled_features',
  label: 'Enabled Features',
  width: 12,
  choices: [
    { id: 'feature_a', label: 'Feature A' },
    { id: 'feature_b', label: 'Feature B' },
    { id: 'feature_c', label: 'Feature C' },
  ],
  default: ['feature_a'],  // Array of selected IDs
  minSelection: 1,         // Optional: minimum selections required
  maxSelection: 2,         // Optional: maximum selections allowed
}
```

### `checkbox` — Boolean Toggle

```typescript
{
  type: 'checkbox',
  id: 'enable_ssl',
  label: 'Enable SSL',
  width: 6,
  default: false,
}
```

### `colorpicker` — Color Selection

```typescript
import { combineRgb } from '@companion-module/base'

{
  type: 'colorpicker',
  id: 'default_color',
  label: 'Default Button Color',
  width: 6,
  default: combineRgb(255, 0, 0),  // Red
}
```

### `static-text` — Display-Only Text

```typescript
{
  type: 'static-text',
  id: 'info',
  label: 'Information',
  width: 12,
  value: 'This module requires firmware v2.0 or higher.',
}
```

### `secret` — Password/Masked Input

```typescript
{
  type: 'secret',
  id: 'api_key',
  label: 'API Key',
  width: 8,
  required: true,
}
```

### `bonjourdevice` — Network Device Discovery

```typescript
{
  type: 'bonjourdevice',
  id: 'device',
  label: 'Device',
  width: 12,
}
```

### `custom-variable` — Variable Reference

```typescript
{
  type: 'custom-variable',
  id: 'target_variable',
  label: 'Target Variable',
  width: 8,
}
```

## Patterns & Examples

### Basic Config

```typescript
import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	port: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Target Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 8000,
		},
	]
}
```

### Config with Authentication

```typescript
export interface ModuleConfig {
	host: string
	port: number
	username: string
	password: string
	use_ssl: boolean
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			label: 'Device Connection',
			width: 12,
			value: 'Enter the IP address and credentials for your device.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP Address',
			width: 8,
			regex: Regex.IP,
			required: true,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 80,
		},
		{
			type: 'checkbox',
			id: 'use_ssl',
			label: 'Use SSL/TLS',
			width: 12,
			default: false,
		},
		{
			type: 'textinput',
			id: 'username',
			label: 'Username',
			width: 6,
			default: 'admin',
		},
		{
			type: 'secret',
			id: 'password',
			label: 'Password',
			width: 6,
			required: true,
		},
	]
}
```

### Config with Conditional Fields

While there's no built-in conditional field visibility, you can handle it in `configUpdated()`:

```typescript
export interface ModuleConfig {
	connection_type: 'serial' | 'network'
	host?: string
	port?: number
	serial_port?: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'dropdown',
			id: 'connection_type',
			label: 'Connection Type',
			width: 12,
			choices: [
				{ id: 'network', label: 'Network (TCP)' },
				{ id: 'serial', label: 'Serial Port' },
			],
			default: 'network',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP Address (network only)',
			width: 8,
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Port (network only)',
			width: 4,
			min: 1,
			max: 65535,
			default: 9000,
		},
		{
			type: 'textinput',
			id: 'serial_port',
			label: 'Serial Port (serial only)',
			width: 12,
			default: '/dev/ttyUSB0',
		},
	]
}
```

### Handling Config Updates

```typescript
// In main.ts
async configUpdated(config: ModuleConfig): Promise<void> {
  // ALWAYS update this.config first
  this.config = config

  // Reconnect if connection settings changed
  if (this.connection) {
    await this.connection.disconnect()
  }

  await this.connect()

  // Re-register actions/feedbacks if config affects them
  this.updateActions()
  this.updateFeedbacks()
}
```

### Using Config Values

```typescript
// In main.ts or other modules
async connect(): Promise<void> {
  const url = `http://${this.config.host}:${this.config.port}`

  if (this.config.use_ssl) {
    url = `https://${this.config.host}:${this.config.port}`
  }

  await this.connection.connect(url, {
    username: this.config.username,
    password: this.config.password,
  })
}
```

## Common Pitfalls

1. **Not matching `ModuleConfig` interface to field IDs**
   - Ensure every field `id` has a corresponding interface property with matching type

2. **Forgetting `default` values**
   - Always provide defaults to avoid `undefined` values on first init

3. **Wrong width values**
   - Width is 1-12 (12-column grid). Typically: 12 = full width, 8 = main field, 4 = secondary

4. **Not updating `this.config` in `configUpdated()`**
   - ALWAYS: `this.config = config` as first line

5. **Using invalid regex**
   - Test your regex patterns. Use built-in `Regex.*` constants when possible

6. **Not handling optional fields**
   - Use optional properties (`?`) in interface or provide defaults to avoid undefined errors

7. **Blocking `configUpdated()`**
   - Mark as `async` and await connection/state changes

## Import Reference

```typescript
import {
	Regex,
	combineRgb,
	type SomeCompanionConfigField,
	type CompanionInputFieldTextInput,
	type CompanionInputFieldNumber,
	type CompanionInputFieldDropdown,
	type CompanionInputFieldCheckbox,
	type CompanionInputFieldColor,
	type CompanionInputFieldStaticText,
	type CompanionInputFieldMultiDropdown,
} from '@companion-module/base'
```

## Related Skills

- **companion-actions** — Action options use the same field type system
- **companion-feedbacks** — Feedback options use the same field type system
- **companion-upgrades** — Config structure changes require upgrade scripts

## Regex Constants Reference

```typescript
Regex.IP // IPv4 address: 192.168.1.1
Regex.HOSTNAME // Valid hostname
Regex.NUMBER // Integer number
Regex.FLOAT // Floating point number
Regex.SOMETHING // Non-empty string
Regex.URL // URL format
```

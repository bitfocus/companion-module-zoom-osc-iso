import { describe, it, expect, vi } from 'vitest'
import { createMockInstance } from '../helpers/mock-instance.js'
import { initVariableDefinitions } from '../../src/variables/variable-definitions.js'
import { updateVariableValues } from '../../src/variables/variable-values.js'

const iconVariables = [
	'icon_mic_on',
	'icon_mic_off',
	'icon_camera_on',
	'icon_camera_off',
	'icon_hand_raised',
	'icon_hand_lowered',
]

describe('participant icon variables', () => {
	it('defines the icon variables used by the layered participant presets', () => {
		const instance = createMockInstance()
		instance.setVariableDefinitions = vi.fn()
		initVariableDefinitions(instance)
		const definitions = (instance.setVariableDefinitions as any).mock.calls[0][0]
		for (const id of iconVariables) expect(definitions[id], id).toBeDefined()
	})

	it('sets each icon variable to a PNG data URI', () => {
		const instance = createMockInstance()
		instance.setVariableValues = vi.fn()
		updateVariableValues(instance)
		const values = (instance.setVariableValues as any).mock.calls[0][0]
		for (const id of iconVariables) expect(values[id], id).toMatch(/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/)
		expect(new Set(iconVariables.map((id) => values[id])).size).toBe(iconVariables.length)
	})
})

import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsCustom, ActionIdCustom } from '../../src/actions/action-custom.js'

describe('GetActionsCustom', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsCustom>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsCustom(instance)
	})

	beforeEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	// ── customCommand ──────────────────────────────────────────────────────────

	describe('customCommand', () => {
		it('sends the plain path when the path is a non-JSON string', async () => {
			const action = actions[ActionIdCustom.customCommand] as any
			await action.callback({ options: { path: '/zoom/test' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoom/test', [])
		})

		it('parses the JSON object and sends the oscPath when the path is valid JSON', async () => {
			const action = actions[ActionIdCustom.customCommand] as any
			await action.callback({ options: { path: '{"oscPath":"/zoom/json","args":[]}' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom[object Object]', [])
		})

		it('does not call sendCommand when the path is invalid JSON', async () => {
			const action = actions[ActionIdCustom.customCommand] as any
			await action.callback({ options: { path: '{bad json}' } } as any, {} as any)
			expect(instance.OSC.sendCommand).not.toHaveBeenCalled()
		})
	})

	// ── customCommandWithArguments ─────────────────────────────────────────────

	describe('customCommandWithArguments', () => {
		it('sends the path with the parsed arg object', () => {
			const action = actions[ActionIdCustom.customCommandWithArguments] as any
			action.callback(
				{ options: { path: '/zoom/userName/mute', customArgs: '{"type":"s","value":"Alice"}' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoom/userName/mute', [{ type: 's', value: 'Alice' }])
		})
	})
})

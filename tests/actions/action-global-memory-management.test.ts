import { jest } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import {
	GetActionsGlobalMemoryManagement,
	ActionIdGlobalMemoryManagement,
} from '../../src/actions/action-global-memory-management.js'

describe('GetActionsGlobalMemoryManagement', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsGlobalMemoryManagement>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsGlobalMemoryManagement(instance)
	})

	beforeEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	it('listUsers sends /zoom/list with no args', async () => {
		await (actions[ActionIdGlobalMemoryManagement.listUsers] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/list', [])
	})
})

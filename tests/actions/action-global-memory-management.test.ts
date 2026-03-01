import { describe, it, expect, beforeEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import {
	GetActionsGlobalMemoryManagement,
	ActionIdGlobalMemoryManagement,
} from '../../src/actions/action-global-memory-management.js'

describe('GetActionsGlobalMemoryManagement', () => {
	let instance: ReturnType<typeof createMockInstance>

	beforeEach(() => {
		instance = createMockInstance()
		;(instance.OSC.sendCommand as any).mockClear()
	})

	it('listUsers sends /zoom/list with no args', async () => {
		const actions = GetActionsGlobalMemoryManagement(instance)
		await (actions[ActionIdGlobalMemoryManagement.listUsers] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/list', [])
	})
})

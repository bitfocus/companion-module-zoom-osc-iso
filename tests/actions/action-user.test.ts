import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals'
import type { InstanceBaseExt } from '../../src/utils.js'
import type { ZoomConfig } from '../../src/config.js'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUsers, ActionIdUsers } from '../../src/actions/action-user.js'
import { selectionMethod } from '../../src/actions/action-utils.js'

describe('GetActionsUsers', () => {
	let instance: InstanceBaseExt<ZoomConfig>
	let actions: ReturnType<typeof GetActionsUsers>

	beforeAll(() => {
		instance = createMockInstance({ selectedCallers: [1001] })
		actions = GetActionsUsers(instance)
	})

	beforeEach(() => {
		const anyInstance = instance as any
		anyInstance.saveConfig = jest.fn()
		instance.ZoomUserData = {
			1001: { zoomId: 1001, userName: 'Alice', videoOn: true },
			1002: { zoomId: 1002, userName: 'Bob', videoOn: false },
		} as any
		instance.ZoomVariableLink = [
			{ zoomId: 1001, userName: 'Alice' },
			{ zoomId: 1002, userName: 'Bob' },
			{ zoomId: 1003, userName: 'Charlie' },
		]
		instance.ZoomClientDataObj.selectedCallers = [1001]
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	describe('selectionMethod', () => {
		it('sets selectionMethod to MultiSelection', () => {
			const callback = (actions[ActionIdUsers.selectionMethod] as any).callback
			callback({ options: { selectionMethod: selectionMethod.MultiSelection } } as any, {} as any)
			expect(instance.config.selectionMethod).toBe(selectionMethod.MultiSelection)
		})

		it('sets selectionMethod to SingleSelection', () => {
			instance.config.selectionMethod = selectionMethod.MultiSelection as number
			const callback = (actions[ActionIdUsers.selectionMethod] as any).callback
			callback({ options: { selectionMethod: selectionMethod.SingleSelection } } as any, {} as any)
			expect(instance.config.selectionMethod).toBe(selectionMethod.SingleSelection)
		})

		it('toggles from Single to Multi when ToggleSelection option is used', () => {
			instance.config.selectionMethod = selectionMethod.SingleSelection as number
			const callback = (actions[ActionIdUsers.selectionMethod] as any).callback
			callback({ options: { selectionMethod: selectionMethod.ToggleSelection } } as any, {} as any)
			expect(instance.config.selectionMethod).toBe(selectionMethod.MultiSelection)
		})

		it('toggles from Multi to Single when ToggleSelection option is used', () => {
			instance.config.selectionMethod = selectionMethod.MultiSelection as number
			const callback = (actions[ActionIdUsers.selectionMethod] as any).callback
			callback({ options: { selectionMethod: selectionMethod.ToggleSelection } } as any, {} as any)
			expect(instance.config.selectionMethod).toBe(selectionMethod.SingleSelection)
		})

		it('calls saveConfig with updated config', () => {
			const callback = (actions[ActionIdUsers.selectionMethod] as any).callback
			callback({ options: { selectionMethod: selectionMethod.MultiSelection } } as any, {} as any)
			expect((instance as any).saveConfig).toHaveBeenCalledWith(instance.config)
		})
	})

	describe('selectUserByName', () => {
		it('selects user by name with select option', async () => {
			instance.ZoomClientDataObj.selectedCallers = []
			await (actions[ActionIdUsers.selectUserByName] as any).callback(
				{ options: { name: 'Alice', option: 'select' } } as any,
				{} as any,
			)
			expect(instance.ZoomClientDataObj.selectedCallers).toContain(1001)
		})

		it('removes user by name with remove option', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			await (actions[ActionIdUsers.selectUserByName] as any).callback(
				{ options: { name: 'Alice', option: 'remove' } } as any,
				{} as any,
			)
			expect(instance.ZoomClientDataObj.selectedCallers).not.toContain(1001)
		})

		it('does nothing for an unknown name', async () => {
			instance.ZoomClientDataObj.selectedCallers = []
			await (actions[ActionIdUsers.selectUserByName] as any).callback(
				{ options: { name: 'Unknown', option: 'select' } } as any,
				{} as any,
			)
			expect(instance.ZoomClientDataObj.selectedCallers).toHaveLength(0)
		})
	})

	describe('selectFromIndexPosition', () => {
		it('selects user at index position when enableVariablesForParticipants is true', () => {
			instance.config.enableVariablesForParticipants = true
			instance.ZoomClientDataObj.selectedCallers = []
			const callback = (actions[ActionIdUsers.selectFromIndexPosition] as any).callback
			callback({ options: { position: 1, option: 'select' } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).toContain(1001)
		})

		it('does nothing when enableVariablesForParticipants is false', () => {
			instance.config.enableVariablesForParticipants = false
			instance.ZoomClientDataObj.selectedCallers = []
			const callback = (actions[ActionIdUsers.selectFromIndexPosition] as any).callback
			callback({ options: { position: 1, option: 'select' } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).toHaveLength(0)
		})
	})

	describe('clearParticipants', () => {
		it('clears all selected callers', () => {
			const callback = (actions[ActionIdUsers.clearParticipants] as any).callback
			callback({} as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).toHaveLength(0)
		})

		it('saves previous selection before clearing', () => {
			instance.ZoomClientDataObj.selectedCallers = [1001, 1002]
			const callback = (actions[ActionIdUsers.clearParticipants] as any).callback
			callback({} as any, {} as any)
			expect(instance.ZoomClientDataObj.PreviousSelectedCallers).toEqual([1001, 1002])
		})

		it('calls checkFeedbacks after clearing', () => {
			const callback = (actions[ActionIdUsers.clearParticipants] as any).callback
			callback({} as any, {} as any)
			expect(instance.checkFeedbacks).toHaveBeenCalled()
		})
	})

	describe('restorePreviousSelection', () => {
		it('restores previous selection into selectedCallers', () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			instance.ZoomClientDataObj.PreviousSelectedCallers = [1002, 1003]
			const callback = (actions[ActionIdUsers.restorePreviousSelection] as any).callback
			callback({} as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).toEqual([1002, 1003])
		})

		it('calls checkFeedbacks after restoring', () => {
			instance.ZoomClientDataObj.PreviousSelectedCallers = [1002]
			const callback = (actions[ActionIdUsers.restorePreviousSelection] as any).callback
			callback({} as any, {} as any)
			expect(instance.checkFeedbacks).toHaveBeenCalled()
		})
	})

	describe('nextParticipants', () => {
		it('rotates ZoomVariableLink forward by the given shift amount', () => {
			const callback = (actions[ActionIdUsers.nextParticipants] as any).callback
			callback({ options: { shift: 2 } } as any, {} as any)
			expect(instance.ZoomVariableLink[0]).toEqual({ zoomId: 1003, userName: 'Charlie' })
			expect(instance.ZoomVariableLink[1]).toEqual({ zoomId: 1001, userName: 'Alice' })
			expect(instance.ZoomVariableLink[2]).toEqual({ zoomId: 1002, userName: 'Bob' })
		})

		it('calls setVariableValues after shifting', () => {
			const callback = (actions[ActionIdUsers.nextParticipants] as any).callback
			callback({ options: { shift: 1 } } as any, {} as any)
			expect(instance.setVariableValues).toHaveBeenCalled()
		})
	})

	describe('previousParticipants', () => {
		it('rotates ZoomVariableLink backward by the given shift amount', () => {
			const callback = (actions[ActionIdUsers.previousParticipants] as any).callback
			callback({ options: { shift: 1 } } as any, {} as any)
			expect(instance.ZoomVariableLink[0]).toEqual({ zoomId: 1003, userName: 'Charlie' })
			expect(instance.ZoomVariableLink[1]).toEqual({ zoomId: 1001, userName: 'Alice' })
			expect(instance.ZoomVariableLink[2]).toEqual({ zoomId: 1002, userName: 'Bob' })
		})

		it('calls checkFeedbacks after shifting', () => {
			const callback = (actions[ActionIdUsers.previousParticipants] as any).callback
			callback({ options: { shift: 1 } } as any, {} as any)
			expect(instance.checkFeedbacks).toHaveBeenCalled()
		})
	})

	describe('resetParticipants', () => {
		it('rebuilds ZoomVariableLink from ZoomUserData', () => {
			instance.ZoomVariableLink = []
			const callback = (actions[ActionIdUsers.resetParticipants] as any).callback
			callback({} as any, {} as any)
			const zoomIds = instance.ZoomVariableLink.map((u) => u.zoomId)
			expect(zoomIds).toContain(1001)
			expect(zoomIds).toContain(1002)
		})

		it('clears ZoomVariableLink before rebuilding', () => {
			const callback = (actions[ActionIdUsers.resetParticipants] as any).callback
			callback({} as any, {} as any)
			// Only users from ZoomUserData (Alice + Bob) should be present
			expect(instance.ZoomVariableLink).toHaveLength(2)
		})

		it('calls setVariableValues after reset', () => {
			const callback = (actions[ActionIdUsers.resetParticipants] as any).callback
			callback({} as any, {} as any)
			expect(instance.setVariableValues).toHaveBeenCalled()
		})
	})
})

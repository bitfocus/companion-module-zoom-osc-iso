import { jest } from '@jest/globals'
import type { InstanceBaseExt } from '../../src/utils.js'
import type { ZoomConfig } from '../../src/config.js'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsGroups, ActionIdGroups } from '../../src/actions/action-group.js'

describe('GetActionsGroups', () => {
	let instance: InstanceBaseExt<ZoomConfig>
	let actions: ReturnType<typeof GetActionsGroups>

	beforeAll(() => {
		instance = createMockInstance({ selectedCallers: [1001] })
		actions = GetActionsGroups(instance)
	})

	beforeEach(() => {
		// Index 0 = All, 1 = Host/Me, 2+ = user-defined groups
		instance.ZoomGroupData = [
			{ groupName: 'All', users: [] },
			{ groupName: 'Host', users: [] },
			{ groupName: 'Group A', users: [] },
			{ groupName: 'Group B', users: [] },
			{ groupName: 'Group C', users: [] },
		]
		instance.ZoomUserData = {
			1001: { zoomId: 1001, userName: 'Alice', videoOn: true },
			1002: { zoomId: 1002, userName: 'Bob', videoOn: false },
		} as any
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	describe('addToGroup', () => {
		it('adds selected callers to the specified group', () => {
			const callback = (actions[ActionIdGroups.addToGroup] as any).callback
			callback({ options: { group: 2, groupOption: 'add' } } as any, {} as any)
			expect(instance.ZoomGroupData[2].users).toHaveLength(1)
			expect(instance.ZoomGroupData[2].users[0].zoomID).toBe(1001)
		})

		it('replaces group users when groupOption is replace', () => {
			instance.ZoomGroupData[2].users = [{ zoomID: 9999, userName: 'Old User' }]
			const callback = (actions[ActionIdGroups.addToGroup] as any).callback
			callback({ options: { group: 2, groupOption: 'replace' } } as any, {} as any)
			expect(instance.ZoomGroupData[2].users).toHaveLength(1)
			expect(instance.ZoomGroupData[2].users[0].zoomID).toBe(1001)
		})

		it('does not add duplicate users', () => {
			instance.ZoomGroupData[2].users = [{ zoomID: 1001, userName: 'Alice' }]
			const callback = (actions[ActionIdGroups.addToGroup] as any).callback
			callback({ options: { group: 2, groupOption: 'add' } } as any, {} as any)
			expect(instance.ZoomGroupData[2].users).toHaveLength(1)
		})

		it('calls checkFeedbacks after adding', () => {
			const callback = (actions[ActionIdGroups.addToGroup] as any).callback
			callback({ options: { group: 2, groupOption: 'add' } } as any, {} as any)
			expect(instance.checkFeedbacks).toHaveBeenCalled()
		})
	})

	describe('clearGroup', () => {
		it('clears all users from the specified group', () => {
			instance.ZoomGroupData[2].users = [
				{ zoomID: 1001, userName: 'Alice' },
				{ zoomID: 1002, userName: 'Bob' },
			]
			const callback = (actions[ActionIdGroups.clearGroup] as any).callback
			callback({ options: { group: 2 } } as any, {} as any)
			expect(instance.ZoomGroupData[2].users).toHaveLength(0)
		})

		it('calls checkFeedbacks after clearing', () => {
			const callback = (actions[ActionIdGroups.clearGroup] as any).callback
			callback({ options: { group: 2 } } as any, {} as any)
			expect(instance.checkFeedbacks).toHaveBeenCalled()
		})
	})

	describe('removeFromGroup', () => {
		it('removes selected caller from group when no name is given', async () => {
			instance.ZoomGroupData[2].users = [{ zoomID: 1001, userName: 'Alice' }]
			await (actions[ActionIdGroups.removeFromGroup] as any).callback(
				{ options: { group: 2, userName: '' } } as any,
				{} as any,
			)
			expect(instance.ZoomGroupData[2].users).toHaveLength(0)
		})

		it('removes user from group by name', async () => {
			instance.ZoomGroupData[2].users = [
				{ zoomID: 1001, userName: 'Alice' },
				{ zoomID: 1002, userName: 'Bob' },
			]
			await (actions[ActionIdGroups.removeFromGroup] as any).callback(
				{ options: { group: 2, userName: 'Alice' } } as any,
				{} as any,
			)
			expect(instance.ZoomGroupData[2].users).toHaveLength(1)
			expect(instance.ZoomGroupData[2].users[0].zoomID).toBe(1002)
		})

		it('logs a warning for invalid group', async () => {
			await (actions[ActionIdGroups.removeFromGroup] as any).callback(
				{ options: { group: 99, userName: '' } } as any,
				{} as any,
			)
			expect(instance.log).toHaveBeenCalledWith('warn', 'No correct group selected')
		})
	})

	describe('renameGroup', () => {
		it('renames the specified group', async () => {
			await (actions[ActionIdGroups.renameGroup] as any).callback(
				{ options: { group: 2, name: 'New Name' } } as any,
				{} as any,
			)
			expect(instance.ZoomGroupData[2].groupName).toBe('New Name')
		})

		it('calls setVariableValues after renaming', async () => {
			await (actions[ActionIdGroups.renameGroup] as any).callback(
				{ options: { group: 2, name: 'Updated' } } as any,
				{} as any,
			)
			expect(instance.setVariableValues).toHaveBeenCalled()
		})
	})

	describe('selectGroup', () => {
		it('sets selectedCallers to the group user IDs', () => {
			instance.ZoomGroupData[2].users = [
				{ zoomID: 1001, userName: 'Alice' },
				{ zoomID: 1002, userName: 'Bob' },
			]
			const callback = (actions[ActionIdGroups.selectGroup] as any).callback
			callback({ options: { group: 2 } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).toEqual([1001, 1002])
		})

		it('clears selectedCallers when the group is empty', () => {
			const callback = (actions[ActionIdGroups.selectGroup] as any).callback
			callback({ options: { group: 2 } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).toHaveLength(0)
		})

		it('saves previous selection before selecting group', () => {
			instance.ZoomClientDataObj.selectedCallers = [9999]
			instance.ZoomGroupData[2].users = [{ zoomID: 1001, userName: 'Alice' }]
			const callback = (actions[ActionIdGroups.selectGroup] as any).callback
			callback({ options: { group: 2 } } as any, {} as any)
			expect(instance.ZoomClientDataObj.PreviousSelectedCallers).toContain(9999)
		})
	})

	describe('selectUserFromGroupPosition', () => {
		it('selects user at position 1 from group with select option', () => {
			instance.ZoomGroupData[2].users = [
				{ zoomID: 1001, userName: 'Alice' },
				{ zoomID: 1002, userName: 'Bob' },
			]
			instance.ZoomClientDataObj.selectedCallers = []
			const callback = (actions[ActionIdGroups.selectUserFromGroupPosition] as any).callback
			callback({ options: { group: 2, position: 1, option: 'select' } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).toContain(1001)
		})

		it('selects user at position 2 from group with select option', () => {
			instance.ZoomGroupData[2].users = [
				{ zoomID: 1001, userName: 'Alice' },
				{ zoomID: 1002, userName: 'Bob' },
			]
			instance.ZoomClientDataObj.selectedCallers = []
			const callback = (actions[ActionIdGroups.selectUserFromGroupPosition] as any).callback
			callback({ options: { group: 2, position: 2, option: 'select' } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).toContain(1002)
		})

		it('calls checkFeedbacks after selection', () => {
			instance.ZoomGroupData[2].users = [{ zoomID: 1001, userName: 'Alice' }]
			const callback = (actions[ActionIdGroups.selectUserFromGroupPosition] as any).callback
			callback({ options: { group: 2, position: 1, option: 'select' } } as any, {} as any)
			expect(instance.checkFeedbacks).toHaveBeenCalled()
		})
	})
})

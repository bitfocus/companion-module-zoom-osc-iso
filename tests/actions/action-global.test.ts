import { jest, describe, it, expect, beforeEach } from '@jest/globals'

// Must be registered before any static import of modules that transitively
// require feedback-state-machine (which uses a CJS require() for images).
await jest.unstable_mockModule('../../feedback-state-machine.js', () => ({
	feedbackResultsMultiState: jest.fn().mockReturnValue([]),
}))

const { createMockInstance } = await import('../helpers/mock-instance.js')
const { GetActionsGlobal, ActionIdGlobal } = await import('../../src/actions/action-global.js')

describe('GetActionsGlobal', () => {
	let instance: ReturnType<typeof createMockInstance>

	beforeEach(() => {
		instance = createMockInstance()
		;(instance.OSC.sendCommand as any).mockClear()
	})

	it('enableUsersToUnmute sends /zoom/enableUsersUnmute with no args', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.enableUsersToUnmute] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/enableUsersUnmute', [])
	})

	it('disableUsersToUnmute sends /zoom/disableUsersUnmute with no args', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.disableUsersToUnmute] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/disableUsersUnmute', [])
	})

	it('muteAll sends /zoom/allExcept/ZoomID/Mute with the host zoomId', async () => {
		instance.ZoomUserData = { '1': { zoomId: 42, userName: 'Host', userRole: 1 } } as any
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.muteAll] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith(
			expect.stringContaining('/Mute'),
			expect.arrayContaining([{ type: 'i', value: 42 }]),
		)
	})

	it('unmuteAll sends /zoom/all/unMute with no args', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.unmuteAll] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/all/unMute', [])
	})

	it('lowerAllHands sends /zoom/lowerAllHands with no args', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.lowerAllHands] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/lowerAllHands', [])
	})

	it('clearSpotlight sends /zoom/clearSpot with no args', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.clearSpotlight] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/clearSpot', [])
	})

	it('pingZoomOSC sends /zoom/ping with no args', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.pingZoomOSC] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/ping', [])
	})

	it('startMeetng sends /zoom/startMeeting with meetingID, password, name args', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.startMeetng] as any).callback(
			{ options: { meetingID: '123456', password: 'pass', name: 'TestUser' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/startMeeting', [
			{ type: 's', value: '123456' },
			{ type: 's', value: 'pass' },
			{ type: 's', value: 'TestUser' },
		])
	})

	it('joinMeeting sends /zoom/joinMeeting with meetingID, password, name args', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.joinMeeting] as any).callback(
			{ options: { meetingID: '789', password: 'secret', name: 'Jane' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/joinMeeting', [
			{ type: 's', value: '789' },
			{ type: 's', value: 'secret' },
			{ type: 's', value: 'Jane' },
		])
	})

	it('leaveMeeting sends /zoom/leaveMeeting with no args', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.leaveMeeting] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/leaveMeeting', [])
	})

	it('endMeeting sends /zoom/endMeeting with no args', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.endMeeting] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/endMeeting', [])
	})

	it('sendAChatToEveryone sends /zoom/chatAll with message arg', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.sendAChatToEveryone] as any).callback(
			{ options: { message: 'Hello everyone' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/chatAll', [
			{ type: 's', value: 'Hello everyone' },
		])
	})

	it('ejectAll sends /zoom/ejectAttendees with no args', async () => {
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.ejectAll] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/ejectAttendees', [])
	})

	it('muteAllExcept sends /zoom/allExcept/userName/Mute with name arg when user found', async () => {
		instance.ZoomUserData = { '1': { zoomId: 99, userName: 'Alice', userRole: 0 } } as any
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.muteAllExcept] as any).callback(
			{ options: { userName: 'Alice' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith(
			expect.stringContaining('/Mute'),
			expect.arrayContaining([{ type: 's', value: 'Alice' }]),
		)
	})

	it('muteAllExceptHost sends /zoom/.../Mute for users in group 0', async () => {
		instance.ZoomGroupData = [
			{ users: [{ zoomID: 10 }, { zoomID: 11 }] },
			{ users: [] },
		] as any
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.muteAllExceptHost] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith(
			expect.stringContaining('/Mute'),
			expect.arrayContaining([{ type: 'i', value: 10 }]),
		)
	})

	it('muteAllExceptSpot sends /zoom/.../Mute for users in group 1', async () => {
		instance.ZoomGroupData = [
			{ users: [] },
			{ users: [{ zoomID: 20 }, { zoomID: 21 }] },
		] as any
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.muteAllExceptSpot] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith(
			expect.stringContaining('/Mute'),
			expect.arrayContaining([{ type: 'i', value: 20 }]),
		)
	})

	it('updateActionFeedbackPresets calls updateInstance and checkFeedbacks', async () => {
		;(instance as any).updateInstance = jest.fn()
		const actions = GetActionsGlobal(instance)
		await (actions[ActionIdGlobal.updateActionFeedbackPresets] as any).callback({} as any, {} as any)
		expect((instance as any).updateInstance).toHaveBeenCalled()
		expect(instance.checkFeedbacks).toHaveBeenCalled()
	})
})

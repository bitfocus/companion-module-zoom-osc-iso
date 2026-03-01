import { describe, it, expect, beforeEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import {
	GetActionsGlobalWaitingRoomsAndZak,
	ActionIdGlobalWaitingRoomsAndZak,
} from '../../src/actions/action-global-waitingrooms-and-zak.js'

describe('GetActionsGlobalWaitingRoomsAndZak', () => {
	let instance: ReturnType<typeof createMockInstance>

	beforeEach(() => {
		instance = createMockInstance()
		;(instance.OSC.sendCommand as any).mockClear()
	})

	it('enableWaitingRoom sends /zoom/enableWaitingRoom with no args', async () => {
		const actions = GetActionsGlobalWaitingRoomsAndZak(instance)
		await (actions[ActionIdGlobalWaitingRoomsAndZak.enableWaitingRoom] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/enableWaitingRoom', [])
	})

	it('disableWaitingRoom sends /zoom/disableWaitingRoom with no args', async () => {
		const actions = GetActionsGlobalWaitingRoomsAndZak(instance)
		await (actions[ActionIdGlobalWaitingRoomsAndZak.disableWaitingRoom] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/disableWaitingRoom', [])
	})

	it('admitEveryoneFromWaitingRoom sends /zoom/admitAll with no args', async () => {
		const actions = GetActionsGlobalWaitingRoomsAndZak(instance)
		await (actions[ActionIdGlobalWaitingRoomsAndZak.admitEveryoneFromWaitingRoom] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/admitAll', [])
	})

	it('sendMessageToWaitingRoom sends /zoom/messageWaitingRoom with message arg', async () => {
		const actions = GetActionsGlobalWaitingRoomsAndZak(instance)
		await (actions[ActionIdGlobalWaitingRoomsAndZak.sendMessageToWaitingRoom] as any).callback(
			{ options: { message: 'Hello waiting room' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/messageWaitingRoom', [
			{ type: 's', value: 'Hello waiting room' },
		])
	})

	it('ZAKStartMeeting sends /zoom/zakStart with zak, meetingID, name args', async () => {
		const actions = GetActionsGlobalWaitingRoomsAndZak(instance)
		await (actions[ActionIdGlobalWaitingRoomsAndZak.ZAKStartMeeting] as any).callback(
			{ options: { zak: 'my-zak-token', meetingID: '123456789', name: 'Host Name' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zakStart', [
			{ type: 's', value: 'my-zak-token' },
			{ type: 's', value: '123456789' },
			{ type: 's', value: 'Host Name' },
		])
	})

	it('ZAKJoinMeeting sends /zoom/zakJoin with zak, meetingID, name args', async () => {
		const actions = GetActionsGlobalWaitingRoomsAndZak(instance)
		await (actions[ActionIdGlobalWaitingRoomsAndZak.ZAKJoinMeeting] as any).callback(
			{ options: { zak: 'join-zak-token', meetingID: '987654321', name: 'Attendee Name' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zakJoin', [
			{ type: 's', value: 'join-zak-token' },
			{ type: 's', value: '987654321' },
			{ type: 's', value: 'Attendee Name' },
		])
	})
})

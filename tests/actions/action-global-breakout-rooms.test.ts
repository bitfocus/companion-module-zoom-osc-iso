import { describe, it, expect, beforeEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import {
	GetActionsGlobalBreakoutRooms,
	ActionIdGlobalBreakoutRooms,
} from '../../src/actions/action-global-breakout-rooms.js'

describe('GetActionsGlobalBreakoutRooms', () => {
	let instance: ReturnType<typeof createMockInstance>

	beforeEach(() => {
		instance = createMockInstance()
		;(instance.OSC.sendCommand as any).mockClear()
	})

	it('requestListOfBreakoutRooms sends /zoom/listBreakouts with no args', async () => {
		const actions = GetActionsGlobalBreakoutRooms(instance)
		await (actions[ActionIdGlobalBreakoutRooms.requestListOfBreakoutRooms] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/listBreakouts', [])
	})

	it('openBreakoutRooms sends /zoom/openBreakouts with no args', async () => {
		const actions = GetActionsGlobalBreakoutRooms(instance)
		await (actions[ActionIdGlobalBreakoutRooms.openBreakoutRooms] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/openBreakouts', [])
	})

	it('closeBreakoutRooms sends /zoom/closeBreakouts with no args', async () => {
		const actions = GetActionsGlobalBreakoutRooms(instance)
		await (actions[ActionIdGlobalBreakoutRooms.closeBreakoutRooms] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/closeBreakouts', [])
	})

	it('deleteAllBreakoutRooms sends /zoom/deleteAllBreakouts with no args', async () => {
		const actions = GetActionsGlobalBreakoutRooms(instance)
		await (actions[ActionIdGlobalBreakoutRooms.deleteAllBreakoutRooms] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/deleteAllBreakouts', [])
	})

	it('createBreakoutRoom sends /zoom/createBreakout with name arg', async () => {
		const actions = GetActionsGlobalBreakoutRooms(instance)
		await (actions[ActionIdGlobalBreakoutRooms.createBreakoutRoom] as any).callback(
			{ options: { name: 'Room A' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/createBreakout', [{ type: 's', value: 'Room A' }])
	})

	it('deleteBreakoutRoom sends /zoom/deleteBreakout with name arg', async () => {
		const actions = GetActionsGlobalBreakoutRooms(instance)
		await (actions[ActionIdGlobalBreakoutRooms.deleteBreakoutRoom] as any).callback(
			{ options: { name: 'Room A' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/deleteBreakout', [{ type: 's', value: 'Room A' }])
	})

	it('configureBreakoutRooms sends /zoom/configureBreakouts with numeric args', async () => {
		const actions = GetActionsGlobalBreakoutRooms(instance)
		await (actions[ActionIdGlobalBreakoutRooms.configureBreakoutRooms] as any).callback(
			{
				options: {
					postCloseSeconds: 60,
					allowChooseBreakout: 1,
					allowReturnAtWill: 1,
					autoMoveParticipants: 0,
					useTimer: 1,
					closeWithTimer: 1,
					breakoutDurrationSeconds: 300,
				},
			} as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/configureBreakouts', [
			{ type: 'i', value: 60 },
			{ type: 'i', value: 1 },
			{ type: 'i', value: 1 },
			{ type: 'i', value: 0 },
			{ type: 'i', value: 1 },
			{ type: 'i', value: 1 },
			{ type: 'i', value: 300 },
		])
	})

	it('broadcastMessageToBreakoutRooms sends /zoom/broadcastToBreakouts with message arg', async () => {
		const actions = GetActionsGlobalBreakoutRooms(instance)
		await (actions[ActionIdGlobalBreakoutRooms.broadcastMessageToBreakoutRooms] as any).callback(
			{ options: { message: 'Hello rooms!' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/broadcastToBreakouts', [
			{ type: 's', value: 'Hello rooms!' },
		])
	})
})

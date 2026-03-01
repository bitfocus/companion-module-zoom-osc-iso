import { describe, it, expect } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserWaitingRoom, ActionIdUserWaitingRoom } from '../../src/actions/action-user-waiting-room.js'

describe('GetActionsUserWaitingRoom', () => {
	// ── admitSomeoneFromWaitingRoom ───────────────────────────────────────────
	describe('admitSomeoneFromWaitingRoom', () => {
		describe('with userName override', () => {
			it('sends /zoom/userName/admit', async () => {
				const instance = createMockInstance()
				const actions = GetActionsUserWaitingRoom(instance)
				await (actions[ActionIdUserWaitingRoom.admitSomeoneFromWaitingRoom] as any).callback(
					{ options: { userName: 'John Smith' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/admit', [
					{ type: 's', value: 'John Smith' },
				])
			})
		})

		describe('with single selected caller', () => {
			it('sends /zoom/zoomID/admit', async () => {
				const instance = createMockInstance({ selectedCallers: [1001] })
				const actions = GetActionsUserWaitingRoom(instance)
				await (actions[ActionIdUserWaitingRoom.admitSomeoneFromWaitingRoom] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/admit', [
					{ type: 'i', value: 1001 },
				])
			})
		})

		describe('with multiple selected callers', () => {
			it('sends /zoom/users/zoomID/admit', async () => {
				const instance = createMockInstance({ selectedCallers: [1001, 1002] })
				const actions = GetActionsUserWaitingRoom(instance)
				await (actions[ActionIdUserWaitingRoom.admitSomeoneFromWaitingRoom] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/admit', [
					{ type: 'i', value: 1001 },
					{ type: 'i', value: 1002 },
				])
			})
		})
	})

	// ── sendSomeoneToWaitingRoom ──────────────────────────────────────────────
	describe('sendSomeoneToWaitingRoom', () => {
		describe('with userName override', () => {
			it('sends /zoom/userName/sendToWaitingRoom', async () => {
				const instance = createMockInstance()
				const actions = GetActionsUserWaitingRoom(instance)
				await (actions[ActionIdUserWaitingRoom.sendSomeoneToWaitingRoom] as any).callback(
					{ options: { userName: 'Jane Doe' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/sendToWaitingRoom', [
					{ type: 's', value: 'Jane Doe' },
				])
			})
		})

		describe('with single selected caller', () => {
			it('sends /zoom/zoomID/sendToWaitingRoom', async () => {
				const instance = createMockInstance({ selectedCallers: [2002] })
				const actions = GetActionsUserWaitingRoom(instance)
				await (actions[ActionIdUserWaitingRoom.sendSomeoneToWaitingRoom] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/sendToWaitingRoom', [
					{ type: 'i', value: 2002 },
				])
			})
		})

		describe('with multiple selected callers', () => {
			it('sends /zoom/users/zoomID/sendToWaitingRoom', async () => {
				const instance = createMockInstance({ selectedCallers: [2002, 2003] })
				const actions = GetActionsUserWaitingRoom(instance)
				await (actions[ActionIdUserWaitingRoom.sendSomeoneToWaitingRoom] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/sendToWaitingRoom', [
					{ type: 'i', value: 2002 },
					{ type: 'i', value: 2003 },
				])
			})
		})
	})
})

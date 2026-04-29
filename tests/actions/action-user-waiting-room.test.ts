import { jest } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserWaitingRoom, ActionIdUserWaitingRoom } from '../../src/actions/action-user-waiting-room.js'

describe('GetActionsUserWaitingRoom', () => {
	// ── admitSomeoneFromWaitingRoom ───────────────────────────────────────────
	describe('admitSomeoneFromWaitingRoom', () => {
		describe('with userName override', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserWaitingRoom>

			beforeAll(() => {
				instance = createMockInstance()
				actions = GetActionsUserWaitingRoom(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/userName/admit', async () => {
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
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserWaitingRoom>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [1001] })
				actions = GetActionsUserWaitingRoom(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/zoomID/admit', async () => {
				await (actions[ActionIdUserWaitingRoom.admitSomeoneFromWaitingRoom] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/admit', [{ type: 'i', value: 1001 }])
			})
		})

		describe('with multiple selected callers', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserWaitingRoom>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [1001, 1002] })
				actions = GetActionsUserWaitingRoom(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/users/zoomID/admit', async () => {
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
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserWaitingRoom>

			beforeAll(() => {
				instance = createMockInstance()
				actions = GetActionsUserWaitingRoom(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/userName/sendToWaitingRoom', async () => {
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
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserWaitingRoom>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [2002] })
				actions = GetActionsUserWaitingRoom(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/zoomID/sendToWaitingRoom', async () => {
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
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserWaitingRoom>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [2002, 2003] })
				actions = GetActionsUserWaitingRoom(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/users/zoomID/sendToWaitingRoom', async () => {
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

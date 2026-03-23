import { describe, it, expect, beforeAll, afterEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserBreakoutRooms, ActionIdUserBreakoutRooms } from '../../src/actions/action-user-breakout-rooms.js'

describe('GetActionsUserBreakoutRooms', () => {
	// ── sendParticipantToBreakoutRoom ─────────────────────────────────────────
	describe('sendParticipantToBreakoutRoom', () => {
		describe('with userName override', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance()
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/userName/sendToBreakout with breakoutName arg', async () => {
				await (actions[ActionIdUserBreakoutRooms.sendParticipantToBreakoutRoom] as any).callback(
					{ options: { userName: 'John Smith', breakoutName: 'Room A' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/sendToBreakout', [
					{ type: 's', value: 'John Smith' },
					{ type: 's', value: 'Room A' },
				])
			})
		})

		describe('with single selected caller', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [1001] })
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/zoomID/sendToBreakout with breakoutName arg', async () => {
				await (actions[ActionIdUserBreakoutRooms.sendParticipantToBreakoutRoom] as any).callback(
					{ options: { userName: '', breakoutName: 'Room A' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/sendToBreakout', [
					{ type: 'i', value: 1001 },
					{ type: 's', value: 'Room A' },
				])
			})
		})

		describe('with multiple selected callers', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [1001, 1002] })
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/users/zoomID/sendToBreakout with breakoutName arg', async () => {
				await (actions[ActionIdUserBreakoutRooms.sendParticipantToBreakoutRoom] as any).callback(
					{ options: { userName: '', breakoutName: 'Room B' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/sendToBreakout', [
					{ type: 'i', value: 1001 },
					{ type: 'i', value: 1002 },
					{ type: 's', value: 'Room B' },
				])
			})
		})
	})

	// ── removeParticipantFromBreakoutRoom ─────────────────────────────────────
	describe('removeParticipantFromBreakoutRoom', () => {
		describe('with userName override', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance()
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/userName/removeFromBreakout', async () => {
				await (actions[ActionIdUserBreakoutRooms.removeParticipantFromBreakoutRoom] as any).callback(
					{ options: { userName: 'Jane Doe' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/removeFromBreakout', [
					{ type: 's', value: 'Jane Doe' },
				])
			})
		})

		describe('with single selected caller', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [2002] })
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/zoomID/removeFromBreakout', async () => {
				await (actions[ActionIdUserBreakoutRooms.removeParticipantFromBreakoutRoom] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/removeFromBreakout', [
					{ type: 'i', value: 2002 },
				])
			})
		})
	})

	// ── assignParticipantToBreakoutRoom ───────────────────────────────────────
	describe('assignParticipantToBreakoutRoom', () => {
		describe('with userName override', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance()
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/userName/assignToBreakout with breakoutName arg', async () => {
				await (actions[ActionIdUserBreakoutRooms.assignParticipantToBreakoutRoom] as any).callback(
					{ options: { userName: 'John Smith', breakoutName: 'Room C' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/assignToBreakout', [
					{ type: 's', value: 'John Smith' },
					{ type: 's', value: 'Room C' },
				])
			})
		})

		describe('with single selected caller', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [3003] })
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/zoomID/assignToBreakout with breakoutName arg', async () => {
				await (actions[ActionIdUserBreakoutRooms.assignParticipantToBreakoutRoom] as any).callback(
					{ options: { userName: '', breakoutName: 'Room C' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/assignToBreakout', [
					{ type: 'i', value: 3003 },
					{ type: 's', value: 'Room C' },
				])
			})
		})

		describe('with multiple selected callers', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [3003, 3004] })
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/users/zoomID/assignToBreakout with breakoutName arg', async () => {
				await (actions[ActionIdUserBreakoutRooms.assignParticipantToBreakoutRoom] as any).callback(
					{ options: { userName: '', breakoutName: 'Room D' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/assignToBreakout', [
					{ type: 'i', value: 3003 },
					{ type: 'i', value: 3004 },
					{ type: 's', value: 'Room D' },
				])
			})
		})
	})

	// ── unassignParticipantFromBreakoutRoom ───────────────────────────────────
	describe('unassignParticipantFromBreakoutRoom', () => {
		describe('with userName override', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance()
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/userName/unassignFromBreakout', async () => {
				await (actions[ActionIdUserBreakoutRooms.unassignParticipantFromBreakoutRoom] as any).callback(
					{ options: { userName: 'John Smith' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/unassignFromBreakout', [
					{ type: 's', value: 'John Smith' },
				])
			})
		})

		describe('with single selected caller', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [4004] })
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/zoomID/unassignFromBreakout', async () => {
				await (actions[ActionIdUserBreakoutRooms.unassignParticipantFromBreakoutRoom] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/unassignFromBreakout', [
					{ type: 'i', value: 4004 },
				])
			})
		})
	})

	// ── returnSelfToMainMeeting ───────────────────────────────────────────────
	describe('returnSelfToMainMeeting', () => {
		describe('with userName override', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance()
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/userName/returnToMainMeeting', async () => {
				await (actions[ActionIdUserBreakoutRooms.returnSelfToMainMeeting] as any).callback(
					{ options: { userName: 'Jane Doe' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/returnToMainMeeting', [
					{ type: 's', value: 'Jane Doe' },
				])
			})
		})

		describe('with single selected caller', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [5005] })
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/zoomID/returnToMainMeeting', async () => {
				await (actions[ActionIdUserBreakoutRooms.returnSelfToMainMeeting] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/returnToMainMeeting', [
					{ type: 'i', value: 5005 },
				])
			})
		})

		describe('with multiple selected callers', () => {
			let instance: ReturnType<typeof createMockInstance>
			let actions: ReturnType<typeof GetActionsUserBreakoutRooms>

			beforeAll(() => {
				instance = createMockInstance({ selectedCallers: [5005, 5006] })
				actions = GetActionsUserBreakoutRooms(instance)
			})

			afterEach(() => {
				const sendCommand = instance.OSC.sendCommand as jest.Mock
				sendCommand.mockClear()
			})

			it('sends /zoom/users/zoomID/returnToMainMeeting', async () => {
				await (actions[ActionIdUserBreakoutRooms.returnSelfToMainMeeting] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/returnToMainMeeting', [
					{ type: 'i', value: 5005 },
					{ type: 'i', value: 5006 },
				])
			})
		})
	})
})

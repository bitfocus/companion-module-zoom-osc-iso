import { jest } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserRolesAndAction, ActionIdUserRolesAndAction } from '../../src/actions/action-user-roles-action.js'

describe('GetActionsUserRolesAndAction', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsUserRolesAndAction>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsUserRolesAndAction(instance)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
		instance.ZoomClientDataObj.selectedCallers = []
	})

	// ── makeHost ────────────────────────────────────────────────────────────
	describe('makeHost', () => {
		it('sends /zoom/userName/makeHost with string arg when userName is provided', async () => {
			await (actions[ActionIdUserRolesAndAction.makeHost] as any).callback(
				{ options: { userName: 'Alice' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/makeHost', [{ type: 's', value: 'Alice' }])
		})

		it('sends /zoom/zoomID/makeHost with int arg for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			await (actions[ActionIdUserRolesAndAction.makeHost] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/makeHost', [{ type: 'i', value: 1001 }])
		})

		it('sends /zoom/users/zoomID/makeHost for multiple selected callers', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001, 1002]
			await (actions[ActionIdUserRolesAndAction.makeHost] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/makeHost', [
				{ type: 'i', value: 1001 },
				{ type: 'i', value: 1002 },
			])
		})
	})

	// ── makeCoHost ──────────────────────────────────────────────────────────
	describe('makeCoHost', () => {
		it('sends /zoom/userName/makeCoHost with string arg when userName is provided', async () => {
			await (actions[ActionIdUserRolesAndAction.makeCoHost] as any).callback(
				{ options: { userName: 'Bob' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/makeCoHost', [{ type: 's', value: 'Bob' }])
		})

		it('sends /zoom/zoomID/makeCoHost with int arg for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [2002]
			await (actions[ActionIdUserRolesAndAction.makeCoHost] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/makeCoHost', [{ type: 'i', value: 2002 }])
		})
	})

	// ── reclaimHost ─────────────────────────────────────────────────────────
	describe('reclaimHost', () => {
		it('sends /zoom/reclaimHost with no args (global command)', () => {
			const callback = (actions[ActionIdUserRolesAndAction.reclaimHost] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/reclaimHost', [])
		})
	})

	// ── revokeCoHost ─────────────────────────────────────────────────────────
	describe('revokeCoHost', () => {
		it('sends /zoom/userName/revokeCoHost when userName is provided', async () => {
			await (actions[ActionIdUserRolesAndAction.revokeCoHost] as any).callback(
				{ options: { userName: 'Carol' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/revokeCoHost', [
				{ type: 's', value: 'Carol' },
			])
		})

		it('sends /zoom/zoomID/revokeCoHost for each selected caller when userName is empty', async () => {
			instance.ZoomClientDataObj.selectedCallers = [3003]
			await (actions[ActionIdUserRolesAndAction.revokeCoHost] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/revokeCoHost', [{ type: 'i', value: 3003 }])
		})
	})

	// ── makePanelist ────────────────────────────────────────────────────────
	describe('makePanelist', () => {
		it('sends /zoom/userName/makePanelist with string arg when userName is provided', async () => {
			await (actions[ActionIdUserRolesAndAction.makePanelist] as any).callback(
				{ options: { userName: 'Dave' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/makePanelist', [
				{ type: 's', value: 'Dave' },
			])
		})

		it('sends /zoom/zoomID/makePanelist for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [4004]
			await (actions[ActionIdUserRolesAndAction.makePanelist] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/makePanelist', [{ type: 'i', value: 4004 }])
		})
	})

	// ── makeAttendee ────────────────────────────────────────────────────────
	describe('makeAttendee', () => {
		it('sends /zoom/userName/makeAttendee with string arg when userName is provided', async () => {
			await (actions[ActionIdUserRolesAndAction.makeAttendee] as any).callback(
				{ options: { userName: 'Eve' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/makeAttendee', [
				{ type: 's', value: 'Eve' },
			])
		})

		it('sends /zoom/zoomID/makeAttendee for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [5005]
			await (actions[ActionIdUserRolesAndAction.makeAttendee] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/makeAttendee', [{ type: 'i', value: 5005 }])
		})
	})

	// ── ejectParticipant ────────────────────────────────────────────────────
	describe('ejectParticipant', () => {
		it('sends /zoom/userName/eject with string arg when userName is provided', async () => {
			await (actions[ActionIdUserRolesAndAction.ejectParticipant] as any).callback(
				{ options: { userName: 'Frank' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/eject', [{ type: 's', value: 'Frank' }])
		})

		it('sends /zoom/zoomID/eject for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [6006]
			await (actions[ActionIdUserRolesAndAction.ejectParticipant] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/eject', [{ type: 'i', value: 6006 }])
		})
	})

	// ── allowToRecord ───────────────────────────────────────────────────────
	describe('allowToRecord', () => {
		it('sends /zoom/userName/allowToRecord with string arg when userName is provided', async () => {
			await (actions[ActionIdUserRolesAndAction.allowToRecord] as any).callback(
				{ options: { userName: 'Grace' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/allowToRecord', [
				{ type: 's', value: 'Grace' },
			])
		})

		it('sends /zoom/zoomID/allowToRecord for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [7007]
			await (actions[ActionIdUserRolesAndAction.allowToRecord] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/allowToRecord', [{ type: 'i', value: 7007 }])
		})
	})

	// ── disallowToRecord ────────────────────────────────────────────────────
	describe('disallowToRecord', () => {
		it('sends /zoom/userName/disallowToRecord with string arg when userName is provided', async () => {
			await (actions[ActionIdUserRolesAndAction.disallowToRecord] as any).callback(
				{ options: { userName: 'Hank' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/disallowToRecord', [
				{ type: 's', value: 'Hank' },
			])
		})

		it('sends /zoom/zoomID/disallowToRecord for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [8008]
			await (actions[ActionIdUserRolesAndAction.disallowToRecord] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/disallowToRecord', [
				{ type: 'i', value: 8008 },
			])
		})
	})
})

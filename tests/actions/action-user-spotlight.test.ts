import { describe, it, expect, beforeAll, afterEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserSpotlight, ActionIdUserSpotlight } from '../../src/actions/action-user-spotlight.js'

describe('GetActionsUserSpotlight', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsUserSpotlight>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsUserSpotlight(instance)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
		instance.ZoomClientDataObj.selectedCallers = []
	})

	describe('spotLight (select.single)', () => {
		it('sends /zoom/userName/spot with string arg when userName is provided', async () => {
			await (actions[ActionIdUserSpotlight.spotLight] as any).callback(
				{ options: { userName: 'Alice' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/spot', [{ type: 's', value: 'Alice' }])
		})

		it('sends /zoom/zoomID/spot with first zoomId when single caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			await (actions[ActionIdUserSpotlight.spotLight] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/spot', [{ type: 'i', value: 1001 }])
		})

		it('sends /zoom/zoomID/spot using only first caller when multiple are selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001, 1002]
			await (actions[ActionIdUserSpotlight.spotLight] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/spot', [{ type: 'i', value: 1001 }])
		})
	})

	describe('addSpotlight (select.multi)', () => {
		it('sends /zoom/userName/addSpot with string arg when userName is provided', async () => {
			await (actions[ActionIdUserSpotlight.addSpotlight] as any).callback(
				{ options: { userName: 'Bob' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/addSpot', [{ type: 's', value: 'Bob' }])
		})

		it('sends /zoom/zoomID/addSpot with zoomId when single caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [2001]
			await (actions[ActionIdUserSpotlight.addSpotlight] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/addSpot', [{ type: 'i', value: 2001 }])
		})

		it('sends /zoom/users/zoomID/addSpot with multiple callers', async () => {
			instance.ZoomClientDataObj.selectedCallers = [2001, 2002]
			await (actions[ActionIdUserSpotlight.addSpotlight] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/addSpot', [
				{ type: 'i', value: 2001 },
				{ type: 'i', value: 2002 },
			])
		})
	})

	describe('unSpotLight (select.multi)', () => {
		it('sends /zoom/userName/unSpot with string arg when userName is provided', async () => {
			await (actions[ActionIdUserSpotlight.unSpotLight] as any).callback(
				{ options: { userName: 'Carol' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/unSpot', [{ type: 's', value: 'Carol' }])
		})

		it('sends /zoom/zoomID/unSpot with zoomId when single caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [3001]
			await (actions[ActionIdUserSpotlight.unSpotLight] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/unSpot', [{ type: 'i', value: 3001 }])
		})
	})

	describe('toggleSpotlight (select.multi)', () => {
		it('sends /zoom/userName/toggleSpot with string arg when userName is provided', async () => {
			await (actions[ActionIdUserSpotlight.toggleSpotlight] as any).callback(
				{ options: { userName: 'Dave' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/toggleSpot', [{ type: 's', value: 'Dave' }])
		})

		it('sends /zoom/zoomID/toggleSpot with zoomId when single caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [4001]
			await (actions[ActionIdUserSpotlight.toggleSpotlight] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/toggleSpot', [{ type: 'i', value: 4001 }])
		})
	})

	it('does not send a command when no userName and no selected callers', async () => {
		await (actions[ActionIdUserSpotlight.spotLight] as any).callback({ options: { userName: '' } } as any, {} as any)
		expect(instance.OSC.sendCommand).not.toHaveBeenCalled()
	})
})

import { jest } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserHandRaised, ActionIdUserHandRaised } from '../../src/actions/action-user-hand-raised.js'

describe('GetActionsUserHandRaised', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsUserHandRaised>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsUserHandRaised(instance)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
		instance.ZoomClientDataObj.selectedCallers = []
	})

	describe('raiseHand (select.multi)', () => {
		it('sends /zoom/userName/raiseHand with string arg when userName is provided', async () => {
			await (actions[ActionIdUserHandRaised.raiseHand] as any).callback(
				{ options: { userName: 'Alice' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/raiseHand', [{ type: 's', value: 'Alice' }])
		})

		it('sends /zoom/zoomID/raiseHand with zoomId when single caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			await (actions[ActionIdUserHandRaised.raiseHand] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/raiseHand', [{ type: 'i', value: 1001 }])
		})

		it('sends /zoom/users/zoomID/raiseHand with multiple callers', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001, 1002]
			await (actions[ActionIdUserHandRaised.raiseHand] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/raiseHand', [
				{ type: 'i', value: 1001 },
				{ type: 'i', value: 1002 },
			])
		})
	})

	describe('lowerHand (select.multi)', () => {
		it('sends /zoom/userName/lowerHand with string arg when userName is provided', async () => {
			await (actions[ActionIdUserHandRaised.lowerHand] as any).callback(
				{ options: { userName: 'Bob' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/lowerHand', [{ type: 's', value: 'Bob' }])
		})

		it('sends /zoom/zoomID/lowerHand with zoomId when single caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [2001]
			await (actions[ActionIdUserHandRaised.lowerHand] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/lowerHand', [{ type: 'i', value: 2001 }])
		})
	})

	describe('toggleHand (select.multi)', () => {
		it('sends /zoom/userName/toggleHand with string arg when userName is provided', async () => {
			await (actions[ActionIdUserHandRaised.toggleHand] as any).callback(
				{ options: { userName: 'Carol' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/toggleHand', [
				{ type: 's', value: 'Carol' },
			])
		})

		it('sends /zoom/zoomID/toggleHand with zoomId when single caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [3001]
			await (actions[ActionIdUserHandRaised.toggleHand] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/toggleHand', [{ type: 'i', value: 3001 }])
		})
	})

	it('does not send a command when no userName and no selected callers', async () => {
		await (actions[ActionIdUserHandRaised.raiseHand] as any).callback({ options: { userName: '' } } as any, {} as any)
		expect(instance.OSC.sendCommand).not.toHaveBeenCalled()
	})
})

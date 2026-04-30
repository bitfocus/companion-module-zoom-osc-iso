import { jest } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserPin, ActionIdUserPin } from '../../src/actions/action-user-pin.js'

describe('GetActionsUserPin', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsUserPin>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsUserPin(instance)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
		instance.ZoomClientDataObj.selectedCallers = []
	})

	describe('pin (select.single)', () => {
		it('sends /zoom/userName/pin with string arg when userName is provided', async () => {
			await (actions[ActionIdUserPin.pin] as any).callback({ options: { userName: 'Alice' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/pin', [{ type: 's', value: 'Alice' }])
		})

		it('sends /zoom/zoomID/pin with first zoomId when single caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			await (actions[ActionIdUserPin.pin] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/pin', [{ type: 'i', value: 1001 }])
		})

		it('sends /zoom/zoomID/pin using only first caller when multiple are selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001, 1002]
			await (actions[ActionIdUserPin.pin] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/pin', [{ type: 'i', value: 1001 }])
		})
	})

	describe('addPin (select.multi)', () => {
		it('sends /zoom/userName/addPin with string arg when userName is provided', async () => {
			await (actions[ActionIdUserPin.addPin] as any).callback({ options: { userName: 'Bob' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/addPin', [{ type: 's', value: 'Bob' }])
		})

		it('sends /zoom/zoomID/addPin with zoomId when single caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [2001]
			await (actions[ActionIdUserPin.addPin] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/addPin', [{ type: 'i', value: 2001 }])
		})

		it('sends /zoom/users/zoomID/addPin with multiple callers', async () => {
			instance.ZoomClientDataObj.selectedCallers = [2001, 2002]
			await (actions[ActionIdUserPin.addPin] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/addPin', [
				{ type: 'i', value: 2001 },
				{ type: 'i', value: 2002 },
			])
		})
	})

	describe('unpin (select.multi)', () => {
		it('sends /zoom/userName/unPin with string arg when userName is provided', async () => {
			await (actions[ActionIdUserPin.unpin] as any).callback({ options: { userName: 'Carol' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/unPin', [{ type: 's', value: 'Carol' }])
		})

		it('sends /zoom/zoomID/unPin with zoomId when single caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [3001]
			await (actions[ActionIdUserPin.unpin] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/unPin', [{ type: 'i', value: 3001 }])
		})
	})

	describe('pin2 (select.single)', () => {
		it('sends /zoom/userName/pin2 with string arg when userName is provided', async () => {
			await (actions[ActionIdUserPin.pin2] as any).callback({ options: { userName: 'Dave' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/pin2', [{ type: 's', value: 'Dave' }])
		})

		it('sends /zoom/zoomID/pin2 with first zoomId when caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [4001]
			await (actions[ActionIdUserPin.pin2] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/pin2', [{ type: 'i', value: 4001 }])
		})
	})

	describe('unPin2 (select.single)', () => {
		it('sends /zoom/userName/unPin2 with string arg when userName is provided', async () => {
			await (actions[ActionIdUserPin.unPin2] as any).callback({ options: { userName: 'Eve' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/unPin2', [{ type: 's', value: 'Eve' }])
		})

		it('sends /zoom/zoomID/unPin2 with first zoomId when caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [5001]
			await (actions[ActionIdUserPin.unPin2] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/unPin2', [{ type: 'i', value: 5001 }])
		})
	})

	describe('togglePin (select.multi)', () => {
		it('sends /zoom/userName/togglePin with string arg when userName is provided', async () => {
			await (actions[ActionIdUserPin.togglePin] as any).callback({ options: { userName: 'Frank' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/togglePin', [{ type: 's', value: 'Frank' }])
		})

		it('sends /zoom/zoomID/togglePin with zoomId when single caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [6001]
			await (actions[ActionIdUserPin.togglePin] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/togglePin', [{ type: 'i', value: 6001 }])
		})
	})

	describe('togglePin2 (select.single)', () => {
		it('sends /zoom/userName/togglePin2 with string arg when userName is provided', async () => {
			await (actions[ActionIdUserPin.togglePin2] as any).callback({ options: { userName: 'Grace' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/togglePin2', [
				{ type: 's', value: 'Grace' },
			])
		})

		it('sends /zoom/zoomID/togglePin2 with first zoomId when caller selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [7001]
			await (actions[ActionIdUserPin.togglePin2] as any).callback({ options: { userName: '' } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/togglePin2', [{ type: 'i', value: 7001 }])
		})
	})

	describe('clearPins (global)', () => {
		it('sends /zoom/me/clearPin with no args', () => {
			const callback = (actions[ActionIdUserPin.clearPins] as any).callback
			callback({ options: {} } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/clearPin', [])
		})
	})
})

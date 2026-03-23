import { describe, it, expect, beforeAll, afterEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserScreenshare, ActionIdUserScreenshare } from '../../src/actions/action-user-screenshare.js'

describe('GetActionsUserScreenshare', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsUserScreenshare>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsUserScreenshare(instance)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
		instance.ZoomClientDataObj.selectedCallers = []
	})

	// ── Global commands (no user routing) ──────────────────────────────────

	describe('stopSharing', () => {
		it('sends /zoom/me/stopShare with no args', () => {
			const callback = (actions[ActionIdUserScreenshare.stopSharing] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/stopShare', [])
		})
	})

	describe('startScreenShareWithPrimaryScreen', () => {
		it('sends /zoom/me/startScreenSharePrimary with no args', () => {
			const callback = (actions[ActionIdUserScreenshare.startScreenShareWithPrimaryScreen] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/startScreenSharePrimary', [])
		})
	})

	describe('enableComputerSoundWhenSharing', () => {
		it('sends /zoom/me/enableComputerSoundWhenSharing with no args', () => {
			const callback = (actions[ActionIdUserScreenshare.enableComputerSoundWhenSharing] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/enableComputerSoundWhenSharing', [])
		})
	})

	describe('disableComputerSoundWhenSharing', () => {
		it('sends /zoom/me/disableComputerSoundWhenSharing with no args', () => {
			const callback = (actions[ActionIdUserScreenshare.disableComputerSoundWhenSharing] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/disableComputerSoundWhenSharing', [])
		})
	})

	describe('startCameraShare', () => {
		it('sends /zoom/me/startCameraShare with no args', () => {
			const callback = (actions[ActionIdUserScreenshare.startCameraShare] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/startCameraShare', [])
		})
	})

	describe('cycleSharedCameraToNextAvailable', () => {
		it('sends /zoom/me/shareNextCamera with no args', () => {
			const callback = (actions[ActionIdUserScreenshare.cycleSharedCameraToNextAvailable] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/shareNextCamera', [])
		})
	})

	describe('enableOptimizeVideoForSharing', () => {
		it('sends /zoom/me/enableOptimizeVideo with no args', () => {
			const callback = (actions[ActionIdUserScreenshare.enableOptimizeVideoForSharing] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/enableOptimizeVideo', [])
		})
	})

	describe('disableOptimizeVideoForSharing', () => {
		it('sends /zoom/me/disableOptimizeVideo with no args', () => {
			const callback = (actions[ActionIdUserScreenshare.disableOptimizeVideoForSharing] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/disableOptimizeVideo', [])
		})
	})

	describe('startScreenShare', () => {
		it('sends /zoom/me/startScreenShare with id arg', () => {
			const callback = (actions[ActionIdUserScreenshare.startScreenShare] as any).callback
			callback({ options: { id: 2 } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/startScreenShare', [{ type: 'i', value: 2 }])
		})
	})

	describe('startShareWithWindow', () => {
		it('sends /zoom/me/startWindowShare with id arg', () => {
			const callback = (actions[ActionIdUserScreenshare.startShareWithWindow] as any).callback
			callback({ options: { id: 3 } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/startWindowShare', [{ type: 'i', value: 3 }])
		})
	})

	describe('startAudioShare', () => {
		it('sends /zoom/me/startAudioShare with id arg', () => {
			const callback = (actions[ActionIdUserScreenshare.startAudioShare] as any).callback
			callback({ options: { id: 1 } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/startAudioShare', [{ type: 'i', value: 1 }])
		})
	})

	// ── User-routed commands (select.single) ───────────────────────────────

	describe('SetWindowPosition', () => {
		it('sends /zoom/userName/setWindowPosition with name and coordinate args when userName provided', async () => {
			await (actions[ActionIdUserScreenshare.SetWindowPosition] as any).callback(
				{ options: { userName: 'Alice', intX: 100, intY: 200 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/setWindowPosition', [
				{ type: 's', value: 'Alice' },
				{ type: 'i', value: 100 },
				{ type: 'i', value: 200 },
			])
		})

		it('sends /zoom/zoomID/setWindowPosition with int id and coordinate args for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			await (actions[ActionIdUserScreenshare.SetWindowPosition] as any).callback(
				{ options: { userName: '', intX: 50, intY: 75 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/setWindowPosition', [
				{ type: 'i', value: 1001 },
				{ type: 'i', value: 50 },
				{ type: 'i', value: 75 },
			])
		})
	})

	describe('SetWindowSize', () => {
		it('sends /zoom/userName/setWindowSize with name and size args when userName provided', async () => {
			await (actions[ActionIdUserScreenshare.SetWindowSize] as any).callback(
				{ options: { userName: 'Bob', intX: 1280, intY: 720 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/setWindowSize', [
				{ type: 's', value: 'Bob' },
				{ type: 'i', value: 1280 },
				{ type: 'i', value: 720 },
			])
		})

		it('sends /zoom/zoomID/setWindowSize with int id and size args for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [2002]
			await (actions[ActionIdUserScreenshare.SetWindowSize] as any).callback(
				{ options: { userName: '', intX: 640, intY: 480 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/setWindowSize', [
				{ type: 'i', value: 2002 },
				{ type: 'i', value: 640 },
				{ type: 'i', value: 480 },
			])
		})
	})
})

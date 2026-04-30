import { jest } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserSettings, ActionIdUserSettings } from '../../src/actions/action-user-settings.js'

describe('GetActionsUserSettings', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsUserSettings>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsUserSettings(instance)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
		instance.ZoomClientDataObj.selectedCallers = []
	})

	// ── Global commands (no user routing) ──────────────────────────────────

	describe('hideSelfView', () => {
		it('sends /zoom/me/hideSelfView with no args', () => {
			const callback = (actions[ActionIdUserSettings.hideSelfView] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/hideSelfView', [])
		})
	})

	describe('showSelfView', () => {
		it('sends /zoom/me/showSelfView with no args', () => {
			const callback = (actions[ActionIdUserSettings.showSelfView] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/showSelfView', [])
		})
	})

	describe('showNonVideoParticipants', () => {
		it('sends /zoom/me/showNonVideoParticipants with no args', () => {
			const callback = (actions[ActionIdUserSettings.showNonVideoParticipants] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/showNonVideoParticipants', [])
		})
	})

	describe('hideNonVideoParticipants', () => {
		it('sends /zoom/me/hideNonVideoParticipants with no args', () => {
			const callback = (actions[ActionIdUserSettings.hideNonVideoParticipants] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/hideNonVideoParticipants', [])
		})
	})

	describe('showUserNamesOnVideo', () => {
		it('sends /zoom/me/showUserNames with no args', () => {
			const callback = (actions[ActionIdUserSettings.showUserNamesOnVideo] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/showUserNames', [])
		})
	})

	describe('hideUserNamesOnVideo', () => {
		it('sends /zoom/me/hideUserNames with no args', () => {
			const callback = (actions[ActionIdUserSettings.hideUserNamesOnVideo] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/hideUserNames', [])
		})
	})

	describe('enableHDVideo', () => {
		it('sends /zoom/me/enableHDVideo with no args', () => {
			const callback = (actions[ActionIdUserSettings.enableHDVideo] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/enableHDVideo', [])
		})
	})

	describe('disableHDVideo', () => {
		it('sends /zoom/me/disableHDVideo with no args', () => {
			const callback = (actions[ActionIdUserSettings.disableHDVideo] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/disableHDVideo', [])
		})
	})

	describe('setMicLevel', () => {
		it('sends /zoom/setMicLevel with level arg', () => {
			const callback = (actions[ActionIdUserSettings.setMicLevel] as any).callback
			callback({ options: { level: 80 } } as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/setMicLevel', [{ type: 'i', value: 80 }])
		})
	})

	// ── User-routed commands (select.single) ───────────────────────────────

	describe('enableOriginalSound', () => {
		it('sends /zoom/userName/enableOriginalSound with string arg when userName is provided', async () => {
			await (actions[ActionIdUserSettings.enableOriginalSound] as any).callback(
				{ options: { userName: 'Alice' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/enableOriginalSound', [
				{ type: 's', value: 'Alice' },
			])
		})

		it('sends /zoom/zoomID/enableOriginalSound for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			await (actions[ActionIdUserSettings.enableOriginalSound] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/enableOriginalSound', [
				{ type: 'i', value: 1001 },
			])
		})
	})

	describe('disableOriginalSound', () => {
		it('sends /zoom/userName/disableOriginalSound with string arg when userName is provided', async () => {
			await (actions[ActionIdUserSettings.disableOriginalSound] as any).callback(
				{ options: { userName: 'Bob' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/disableOriginalSound', [
				{ type: 's', value: 'Bob' },
			])
		})

		it('sends /zoom/zoomID/disableOriginalSound for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [2002]
			await (actions[ActionIdUserSettings.disableOriginalSound] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/disableOriginalSound', [
				{ type: 'i', value: 2002 },
			])
		})
	})

	describe('enableMirrorVideo', () => {
		it('sends /zoom/userName/enableMirrorVideo with string arg when userName is provided', async () => {
			await (actions[ActionIdUserSettings.enableMirrorVideo] as any).callback(
				{ options: { userName: 'Carol' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/enableMirrorVideo', [
				{ type: 's', value: 'Carol' },
			])
		})

		it('sends /zoom/zoomID/enableMirrorVideo for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [3003]
			await (actions[ActionIdUserSettings.enableMirrorVideo] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/enableMirrorVideo', [
				{ type: 'i', value: 3003 },
			])
		})
	})

	describe('disableMirrorVideo', () => {
		it('sends /zoom/userName/disableMirrorVideo with string arg when userName is provided', async () => {
			await (actions[ActionIdUserSettings.disableMirrorVideo] as any).callback(
				{ options: { userName: 'Dave' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/disableMirrorVideo', [
				{ type: 's', value: 'Dave' },
			])
		})

		it('sends /zoom/zoomID/disableMirrorVideo for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [4004]
			await (actions[ActionIdUserSettings.disableMirrorVideo] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/disableMirrorVideo', [
				{ type: 'i', value: 4004 },
			])
		})
	})

	describe('setVirtualBackground', () => {
		it('sends /zoom/userName/setBackground with name and id args when userName is provided', async () => {
			await (actions[ActionIdUserSettings.setVirtualBackground] as any).callback(
				{ options: { userName: 'Eve', id: 3 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/setBackground', [
				{ type: 's', value: 'Eve' },
				{ type: 'i', value: 3 },
			])
		})

		it('sends /zoom/zoomID/setBackground with int id and background id for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [5005]
			await (actions[ActionIdUserSettings.setVirtualBackground] as any).callback(
				{ options: { userName: '', id: 2 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/setBackground', [
				{ type: 'i', value: 5005 },
				{ type: 'i', value: 2 },
			])
		})
	})

	describe('setCameraDevice', () => {
		it('sends /zoom/userName/setCameraDevice with name and id args when userName is provided', async () => {
			await (actions[ActionIdUserSettings.setCameraDevice] as any).callback(
				{ options: { userName: 'Frank', id: 1 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/setCameraDevice', [
				{ type: 's', value: 'Frank' },
				{ type: 'i', value: 1 },
			])
		})

		it('sends /zoom/zoomID/setCameraDevice for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [6006]
			await (actions[ActionIdUserSettings.setCameraDevice] as any).callback(
				{ options: { userName: '', id: 1 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/setCameraDevice', [
				{ type: 'i', value: 6006 },
				{ type: 'i', value: 1 },
			])
		})
	})

	describe('setSpeakerVolume', () => {
		it('sends /zoom/userName/setSpeakerVolume with name and level args when userName is provided', async () => {
			await (actions[ActionIdUserSettings.setSpeakerVolume] as any).callback(
				{ options: { userName: 'Grace', level: 75 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/setSpeakerVolume', [
				{ type: 's', value: 'Grace' },
				{ type: 'i', value: 75 },
			])
		})

		it('sends /zoom/zoomID/setSpeakerVolume with int id and level for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [7007]
			await (actions[ActionIdUserSettings.setSpeakerVolume] as any).callback(
				{ options: { userName: '', level: 50 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/setSpeakerVolume', [
				{ type: 'i', value: 7007 },
				{ type: 'i', value: 50 },
			])
		})
	})

	describe('setMicDevice', () => {
		it('sends /zoom/userName/setMicDevice with name and id args when userName is provided', async () => {
			await (actions[ActionIdUserSettings.setMicDevice] as any).callback(
				{ options: { userName: 'Hank', id: 2 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/setMicDevice', [
				{ type: 's', value: 'Hank' },
				{ type: 'i', value: 2 },
			])
		})

		it('sends /zoom/zoomID/setMicDevice for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [8008]
			await (actions[ActionIdUserSettings.setMicDevice] as any).callback(
				{ options: { userName: '', id: 2 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/setMicDevice', [
				{ type: 'i', value: 8008 },
				{ type: 'i', value: 2 },
			])
		})
	})

	describe('setSpeakerDevice', () => {
		it('sends /zoom/userName/setSpeakerDevice with name and id args when userName is provided', async () => {
			await (actions[ActionIdUserSettings.setSpeakerDevice] as any).callback(
				{ options: { userName: 'Ivy', id: 1 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/setSpeakerDevice', [
				{ type: 's', value: 'Ivy' },
				{ type: 'i', value: 1 },
			])
		})

		it('sends /zoom/zoomID/setSpeakerDevice for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [9009]
			await (actions[ActionIdUserSettings.setSpeakerDevice] as any).callback(
				{ options: { userName: '', id: 1 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/setSpeakerDevice', [
				{ type: 'i', value: 9009 },
				{ type: 'i', value: 1 },
			])
		})
	})

	describe('setVideoFilter', () => {
		it('sends /zoom/userName/setVideoFilter with name and id args when userName is provided', async () => {
			await (actions[ActionIdUserSettings.setVideoFilter] as any).callback(
				{ options: { userName: 'Jack', id: 4 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/setVideoFilter', [
				{ type: 's', value: 'Jack' },
				{ type: 'i', value: 4 },
			])
		})

		it('sends /zoom/zoomID/setVideoFilter for single selected caller', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1010]
			await (actions[ActionIdUserSettings.setVideoFilter] as any).callback(
				{ options: { userName: '', id: 4 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/setVideoFilter', [
				{ type: 'i', value: 1010 },
				{ type: 'i', value: 4 },
			])
		})
	})
})

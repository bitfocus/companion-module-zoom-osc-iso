import { describe, it, expect } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserVideoMic, ActionIdUserVideoMic } from '../../src/actions/action-user-video-mic.js'

describe('GetActionsUserVideoMic', () => {
	describe('turnVideoOn', () => {
		it('sends /zoom/userName/videoOn with string arg when userName is provided', async () => {
			const instance = createMockInstance()
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.turnVideoOn] as any).callback(
				{ options: { userName: 'Alice' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/videoOn', [{ type: 's', value: 'Alice' }])
		})

		it('sends /zoom/zoomID/videoOn with zoomId when single caller selected', async () => {
			const instance = createMockInstance({ selectedCallers: [1001] })
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.turnVideoOn] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/videoOn', [{ type: 'i', value: 1001 }])
		})

		it('sends /zoom/users/zoomID/videoOn with multiple callers', async () => {
			const instance = createMockInstance({ selectedCallers: [1001, 1002] })
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.turnVideoOn] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/videoOn', [
				{ type: 'i', value: 1001 },
				{ type: 'i', value: 1002 },
			])
		})
	})

	describe('turnVideoOff', () => {
		it('sends /zoom/userName/videoOff with string arg when userName is provided', async () => {
			const instance = createMockInstance()
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.turnVideoOff] as any).callback(
				{ options: { userName: 'Bob' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/videoOff', [{ type: 's', value: 'Bob' }])
		})

		it('sends /zoom/zoomID/videoOff with zoomId when single caller selected', async () => {
			const instance = createMockInstance({ selectedCallers: [2001] })
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.turnVideoOff] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/videoOff', [{ type: 'i', value: 2001 }])
		})
	})

	describe('toggleVideoState', () => {
		it('sends /zoom/userName/toggleVideo with string arg when userName is provided', async () => {
			const instance = createMockInstance()
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.toggleVideoState] as any).callback(
				{ options: { userName: 'Carol' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/toggleVideo', [
				{ type: 's', value: 'Carol' },
			])
		})

		it('sends /zoom/zoomID/toggleVideo with zoomId when single caller selected', async () => {
			const instance = createMockInstance({ selectedCallers: [3001] })
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.toggleVideoState] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/toggleVideo', [{ type: 'i', value: 3001 }])
		})
	})

	describe('mute', () => {
		it('sends /zoom/userName/mute with string arg when userName is provided', async () => {
			const instance = createMockInstance()
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.mute] as any).callback(
				{ options: { userName: 'Dave' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/mute', [{ type: 's', value: 'Dave' }])
		})

		it('sends /zoom/zoomID/mute with zoomId when single caller selected', async () => {
			const instance = createMockInstance({ selectedCallers: [4001] })
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.mute] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/mute', [{ type: 'i', value: 4001 }])
		})
	})

	describe('unmute', () => {
		it('sends /zoom/userName/unMute with string arg when userName is provided', async () => {
			const instance = createMockInstance()
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.unmute] as any).callback(
				{ options: { userName: 'Eve' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/unMute', [{ type: 's', value: 'Eve' }])
		})

		it('sends /zoom/zoomID/unMute with zoomId when single caller selected', async () => {
			const instance = createMockInstance({ selectedCallers: [5001] })
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.unmute] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/unMute', [{ type: 'i', value: 5001 }])
		})
	})

	describe('toggleMuteState', () => {
		it('sends /zoom/userName/toggleMute with string arg when userName is provided', async () => {
			const instance = createMockInstance()
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.toggleMuteState] as any).callback(
				{ options: { userName: 'Frank' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/toggleMute', [
				{ type: 's', value: 'Frank' },
			])
		})

		it('sends /zoom/zoomID/toggleMute with zoomId when single caller selected', async () => {
			const instance = createMockInstance({ selectedCallers: [6001] })
			const actions = GetActionsUserVideoMic(instance)
			await (actions[ActionIdUserVideoMic.toggleMuteState] as any).callback(
				{ options: { userName: '' } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/toggleMute', [{ type: 'i', value: 6001 }])
		})
	})

	it('does not send a command when no userName and no selected callers', async () => {
		const instance = createMockInstance()
		const actions = GetActionsUserVideoMic(instance)
		await (actions[ActionIdUserVideoMic.mute] as any).callback({ options: { userName: '' } } as any, {} as any)
		expect(instance.OSC.sendCommand).not.toHaveBeenCalled()
	})
})

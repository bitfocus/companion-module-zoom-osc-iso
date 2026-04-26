import { describe, it, expect, beforeAll, afterEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import {
	GetActionsZoomISOOutputSettings,
	ActionIdZoomISOOutputSettings,
} from '../../src/actions/action-zoomiso-output-settings.js'
import type { InstanceBaseExt } from '../../src/utils.js'
import type { ZoomConfig } from '../../src/config.js'

describe('GetActionsZoomISOOutputSettings', () => {
	let instance: InstanceBaseExt<ZoomConfig>
	let actions: ReturnType<typeof GetActionsZoomISOOutputSettings>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsZoomISOOutputSettings(instance)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	it(`${ActionIdZoomISOOutputSettings.setOutputCount} sends /zoom/setOutputCount with count arg`, async () => {
		await (actions[ActionIdZoomISOOutputSettings.setOutputCount] as any).callback(
			{ options: { count: 4 } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/setOutputCount', [{ type: 'i', value: 4 }])
	})

	it(`${ActionIdZoomISOOutputSettings.enableOutput} sends /zoom/enableOutput with output arg`, async () => {
		await (actions[ActionIdZoomISOOutputSettings.enableOutput] as any).callback(
			{ options: { output: 2 } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/enableOutput', [{ type: 'i', value: 2 }])
	})

	it(`${ActionIdZoomISOOutputSettings.disableOutput} sends /zoom/disableOutput with output arg`, async () => {
		await (actions[ActionIdZoomISOOutputSettings.disableOutput] as any).callback(
			{ options: { output: 3 } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/disableOutput', [{ type: 'i', value: 3 }])
	})

	it(`${ActionIdZoomISOOutputSettings.setOutputMode} sends /zoom/setOutputMode with output and mode args`, async () => {
		await (actions[ActionIdZoomISOOutputSettings.setOutputMode] as any).callback(
			{ options: { output: 1, outputMode: 'Spotlight' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/setOutputMode', [
			{ type: 'i', value: 1 },
			{ type: 's', value: 'Spotlight' },
		])
	})

	it(`${ActionIdZoomISOOutputSettings.setOutputName} sends /zoom/setOutputName with output and name args`, async () => {
		await (actions[ActionIdZoomISOOutputSettings.setOutputName] as any).callback(
			{ options: { output: 2, name: 'Camera A' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/setOutputName', [
			{ type: 'i', value: 2 },
			{ type: 's', value: 'Camera A' },
		])
	})

	it(`${ActionIdZoomISOOutputSettings.setVideoLossMode} sends /zoom/setVideoLossMode with mode arg`, async () => {
		await (actions[ActionIdZoomISOOutputSettings.setVideoLossMode] as any).callback(
			{ options: { videoLossMode: 'Freeze' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/setVideoLossMode', [{ type: 's', value: 'Freeze' }])
	})

	it(`${ActionIdZoomISOOutputSettings.addOutput} sends /zoom/addOutput with no args`, async () => {
		await (actions[ActionIdZoomISOOutputSettings.addOutput] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/addOutput', [])
	})

	it(`${ActionIdZoomISOOutputSettings.deleteOutput} sends /zoom/deleteOutput with output arg`, async () => {
		await (actions[ActionIdZoomISOOutputSettings.deleteOutput] as any).callback(
			{ options: { output: 5 } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/deleteOutput', [{ type: 'i', value: 5 }])
	})

	it(`${ActionIdZoomISOOutputSettings.setAudioMode} sends /zoom/setAudioMode with channel number and mode args`, async () => {
		await (actions[ActionIdZoomISOOutputSettings.setAudioMode] as any).callback(
			{ options: { number: 3, audioChannelMode: 'Mix' } } as any,
			{} as any,
		)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/setAudioMode', [
			{ type: 'i', value: 3 },
			{ type: 's', value: 'Mix' },
		])
	})
})

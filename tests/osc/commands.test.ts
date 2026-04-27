import { describe, expect, it, jest } from '@jest/globals'
import { normalizeNodeOscMessage, sendZoomIsoPullingCommands } from '../../src/osc/commands.js'
import type { ZoomConfig } from '../../src/config.js'

function createConfig(overrides: Partial<ZoomConfig> = {}): ZoomConfig {
	return {
		label: 'test',
		host: '127.0.0.1',
		tx_port: 9090,
		rx_port: 1234,
		version: 0,
		selectionMethod: 1,
		numberOfGroups: 5,
		pulling: 1000,
		pollEngineState: true,
		pollAudioLevels: true,
		pollOutputRouting: true,
		pollAudioRouting: true,
		feedbackImagesWithIcons: 1,
		enableVariablesForEachUser: false,
		enableVariablesForParticipants: false,
		enableActionPresetAndFeedbackSync: false,
		enableSocialStream: false,
		socialStreamId: '',
		socialStreamQuestionPrefix: '',
		socialStreamChatTypeToSend: [],
		...overrides,
	}
}

describe('sendZoomIsoPullingCommands', () => {
	it('only sends requests for enabled polling flags', () => {
		const sendCommand = jest.fn()
		const config = createConfig({
			pollEngineState: true,
			pollAudioLevels: false,
			pollOutputRouting: true,
			pollAudioRouting: false,
		})

		sendZoomIsoPullingCommands(sendCommand, config)

		expect(sendCommand).toHaveBeenCalledTimes(2)
		expect(sendCommand).toHaveBeenNthCalledWith(1, '/zoom/getEngineState', [])
		expect(sendCommand).toHaveBeenNthCalledWith(2, '/zoom/getOutputRouting', [])
	})
})

describe('normalizeNodeOscMessage', () => {
	it('normalizes string, integer, float, and boolean arguments', () => {
		expect(normalizeNodeOscMessage(['/zoom/test', 'hello', 4, 1.5, true, false])).toEqual({
			address: '/zoom/test',
			args: [
				{ type: 's', value: 'hello' },
				{ type: 'i', value: 4 },
				{ type: 'f', value: 1.5 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 0 },
			],
		})
	})

	it('normalizes typed node-osc arguments into OSC meta arguments', () => {
		expect(
			normalizeNodeOscMessage([
				'/zoom/typed',
				{ type: 's', value: 12 },
				{ type: 'f', value: '2.25' },
				{ type: 'i', value: '7' },
				{ type: 'b', value: true },
			]),
		).toEqual({
			address: '/zoom/typed',
			args: [
				{ type: 's', value: '12' },
				{ type: 'f', value: 2.25 },
				{ type: 'i', value: 7 },
				{ type: 'i', value: 1 },
			],
		})
	})
})

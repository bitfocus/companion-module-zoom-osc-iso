import { describe, expect, it, vi } from 'vitest'
import { sendZoomIsoPullingCommands } from '../../src/osc/commands.js'
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
		enableOscForwarding: false,
		oscForwardHost: '127.0.0.1',
		oscForwardPort: 1235,
		...overrides,
	}
}

describe('sendZoomIsoPullingCommands', () => {
	it('only sends requests for enabled polling flags', () => {
		const sendCommand = vi.fn()
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

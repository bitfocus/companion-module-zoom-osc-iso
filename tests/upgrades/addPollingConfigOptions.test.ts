import { describe, expect, it } from '@jest/globals'
import { addPollingConfigOptions } from '../../src/upgrades/addPollingConfigOptions.js'
import type { ZoomConfig } from '../../src/config.js'

describe('addPollingConfigOptions', () => {
	it('adds polling flags while preserving the existing config', () => {
		const currentConfig = {
			label: 'Zoom',
			host: '127.0.0.1',
			tx_port: 9000,
			rx_port: 1234,
			version: 1,
			selectionMethod: 2,
			numberOfGroups: 4,
			pulling: 2500,
			feedbackImagesWithIcons: 0,
			enableSocialStream: true,
			enableVariablesForEachUser: true,
			enableVariablesForParticipants: true,
			enableActionPresetAndFeedbackSync: false,
			socialStreamId: 'abc',
			socialStreamQuestionPrefix: '?',
			socialStreamChatTypeToSend: [2],
		} as unknown as ZoomConfig

		const result = addPollingConfigOptions({ currentConfig }, {} as never)

		expect(result.updatedActions).toEqual([])
		expect(result.updatedFeedbacks).toEqual([])
		expect(result.updatedConfig).toMatchObject({
			...currentConfig,
			pollEngineState: true,
			pollAudioLevels: true,
			pollOutputRouting: true,
			pollAudioRouting: true,
		})
	})
})

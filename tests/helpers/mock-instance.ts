import { jest } from '@jest/globals'
import type { ZoomConfig } from '../../src/config.js'
import type { InstanceBaseExt } from '../../src/utils.js'

export interface MockInstanceOptions {
	selectedCallers?: number[]
	selectionMethod?: number
}

/**
 * Creates a minimal mock of InstanceBaseExt<ZoomConfig> for action tests.
 *
 * Key: `OSC.sendCommand` is a jest spy — it captures (path, args) without
 * opening a UDP socket. Tests assert against this spy to verify OSC command
 * formatting.
 */
export function createMockInstance(options: MockInstanceOptions = {}): InstanceBaseExt<ZoomConfig> {
	const { selectedCallers = [], selectionMethod = 1 } = options

	return {
		ZoomClientDataObj: {
			last_response: 0,
			subscribeMode: 0,
			selectedCallers: [...selectedCallers],
			PreviousSelectedCallers: [],
			selectedOutputs: [],
			selectedAudioOutputs: [],
			activeSpeaker: 'None',
			activeSpeakerZoomId: -1,
			isSpeaking: 'None',
			zoomOSCVersion: 'Not Connected',
			callStatus: 0,
			galleryCount: 0,
			galleryOrder: [],
			numberOfGroups: 5,
			engineState: -1,
			capturePermissionGranted: false,
			isPro: false,
		},
		config: {
			label: 'test',
			host: '127.0.0.1',
			tx_port: 9099,
			rx_port: 1234,
			version: 0,
			selectionMethod,
			numberOfGroups: 5,
			pulling: 0,
			feedbackImagesWithIcons: 1,
			enableSocialStream: false,
			enableVariablesForEachUser: false,
			enableVariablesForParticipants: false,
			enableActionPresetAndFeedbackSync: false,
			socialStreamId: '',
			socialStreamQuestionPrefix: '',
			socialStreamChatTypeToSend: [],
		},
		log: jest.fn(),
		OSC: { sendCommand: jest.fn() },
		parseVariablesInString: jest.fn(async (s: string) => s),
		ZoomVariableLink: [],
		ZoomGroupData: [],
		ZoomUserData: {},
		ZoomMeData: { zoomId: 0, userName: '' },
		ZoomOutputData: {},
		ZoomAudioLevelData: {},
		ZoomAudioRoutingData: {},
		ZoomUserOffline: {},
		InitVariables: jest.fn(),
		// Companion base stubs (unused in action tests)
		checkFeedbacks: jest.fn(),
		setVariableValues: jest.fn(),
		setVariableDefinitions: jest.fn(),
		setActionDefinitions: jest.fn(),
		setFeedbackDefinitions: jest.fn(),
		setPresetDefinitions: jest.fn(),
		updateStatus: jest.fn(),
		updateDefinitionsForActionsFeedbacksAndPresets: jest.fn(),
	} as unknown as InstanceBaseExt<ZoomConfig>
}

import { vi, type Mock } from 'vitest'
import type ModuleInstance from '../../src/index.js'

export interface MockInstanceOptions {
	selectedCallers?: number[]
	selectionMethod?: number
}

/**
 * Creates a minimal mock of the module instance (ModuleInstance) for action tests.
 *
 * Key: `OSC.sendCommand` is a vitest spy — it captures (path, args) without
 * opening a UDP socket. Tests assert against this spy to verify OSC command
 * formatting.
 */
/** The real instance type, with the OSC transport replaced by a spy (never null in tests) */
export type MockModuleInstance = ModuleInstance & { OSC: { sendCommand: Mock } }

export function createMockInstance(options: MockInstanceOptions = {}): MockModuleInstance {
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
			pollEngineState: true,
			pollAudioLevels: true,
			pollOutputRouting: true,
			pollAudioRouting: true,
			feedbackImagesWithIcons: 1,
			enableSocialStream: false,
			enableVariablesForEachUser: false,
			enableVariablesForParticipants: false,
			enableActionPresetAndFeedbackSync: false,
			socialStreamId: '',
			socialStreamQuestionPrefix: '',
			socialStreamChatTypeToSend: [],
		},
		log: vi.fn(),
		OSC: { sendCommand: vi.fn() },
		ZoomVariableLink: [],
		ZoomParticipantPage: { start: 0, size: 30 },
		ZoomGroupData: [],
		ZoomUserData: {},
		ZoomMeData: { zoomId: 0, userName: '' },
		ZoomOutputData: {},
		ZoomAudioLevelData: {},
		ZoomAudioRoutingData: {},
		ZoomUserOffline: {},
		// Companion base stubs (unused in action tests)
		checkFeedbacks: vi.fn(),
		checkAllFeedbacks: vi.fn(),
		setVariableValues: vi.fn(),
		setVariableDefinitions: vi.fn(),
		setActionDefinitions: vi.fn(),
		setFeedbackDefinitions: vi.fn(),
		setPresetDefinitions: vi.fn(),
		updateStatus: vi.fn(),
		saveConfig: vi.fn(),
		updateDefinitionsForActionsFeedbacksAndPresets: vi.fn(),
	} as unknown as MockModuleInstance
}

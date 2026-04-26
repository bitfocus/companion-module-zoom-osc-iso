import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { handleUserMessage } from '../../../src/osc/handlers/user.js'
import type { OSCHandlerContext, ZoomOSCResponse } from '../../../src/osc/types.js'
import { createMockInstance } from '../../helpers/mock-instance.js'
import { socialStreamApi } from '../../../src/socialstream.js'

jest.mock('got-cjs', () => ({
	default: { post: jest.fn().mockResolvedValue({ body: 'ok' } as never) },
}))

function createContext(): OSCHandlerContext {
	const instance = createMockInstance()
	instance.config.enableSocialStream = true
	instance.config.socialStreamId = 'session-id'
	instance.config.socialStreamChatTypeToSend = [2]
	instance.ZoomUserData[101] = { zoomId: 101, userName: 'Alice', users: [] } as any

	return {
		instance,
		createZoomUser: jest.fn(async () => undefined),
		setUpdateLoop: jest.fn(),
		setNeedToPingPong: jest.fn(),
		isSpotlightGroupTrackingInitialized: jest.fn(() => false),
		setSpotlightGroupTrackingInitialized: jest.fn(),
		destroyTimers: jest.fn(),
		createPingTimer: jest.fn(),
		createUpdatePresetsTimer: jest.fn(),
		createZoomIsoPullerTimer: jest.fn(),
		destroyZoomIsoPullerTimer: jest.fn(),
		hasZoomIsoPuller: jest.fn(() => false),
		configureConnectedPingWatchdog: jest.fn(),
		sendCommand: jest.fn(),
	}
}

describe('handleUserMessage chat handling', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
	})

	it('ignores short chat payloads without throwing or posting', async () => {
		const context = createContext()
		const postMessageSpy = jest.spyOn(socialStreamApi, 'postMessage').mockResolvedValue(undefined as never)
		const data: ZoomOSCResponse = {
			address: '/zoomosc/user/chat',
			args: [
				{ type: 'i', value: 0 },
				{ type: 's', value: 'Alice' },
				{ type: 'i', value: 0 },
				{ type: 'i', value: 101 },
				{ type: 's', value: 'Hello' },
				{ type: 's', value: 'unused' },
			],
		}

		await expect(handleUserMessage(context, data, 'user', 'chat')).resolves.toBeUndefined()
		expect(postMessageSpy).not.toHaveBeenCalled()
	})

	it('posts valid chat payloads when the chat type is enabled', async () => {
		const context = createContext()
		const postMessageSpy = jest.spyOn(socialStreamApi, 'postMessage').mockResolvedValue(undefined as never)
		const data: ZoomOSCResponse = {
			address: '/zoomosc/user/chat',
			args: [
				{ type: 'i', value: 0 },
				{ type: 's', value: 'Alice' },
				{ type: 'i', value: 0 },
				{ type: 'i', value: 101 },
				{ type: 's', value: 'Hello' },
				{ type: 's', value: 'unused' },
				{ type: 'i', value: 2 },
			],
		}

		await handleUserMessage(context, data, 'user', 'chat')
		expect(postMessageSpy).toHaveBeenCalledWith('Alice', 'Hello', context.instance)
	})
})

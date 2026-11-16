import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { handleUserMessage } from '../../../src/osc/handlers/user.js'
import type { OSCHandlerContext, ZoomOSCResponse } from '../../../src/osc/types.js'
import { createMockInstance } from '../../helpers/mock-instance.js'
import { socialStreamApi } from '../../../src/socialstream.js'

function createContext(): OSCHandlerContext {
	const instance = createMockInstance()
	instance.config.enableSocialStream = true
	instance.config.socialStreamId = 'session-id'
	instance.config.socialStreamChatTypeToSend = [2]
	instance.ZoomUserData[101] = { zoomId: 101, userName: 'Alice', users: [] } as any

	return {
		instance,
		createZoomUser: vi.fn(async () => undefined),
		setUpdateLoop: vi.fn(),
		setNeedToPingPong: vi.fn(),
		isSpotlightGroupTrackingInitialized: vi.fn(() => false),
		setSpotlightGroupTrackingInitialized: vi.fn(),
		destroyTimers: vi.fn(),
		createPingTimer: vi.fn(),
		createUpdatePresetsTimer: vi.fn(),
		createZoomIsoPullerTimer: vi.fn(),
		destroyZoomIsoPullerTimer: vi.fn(),
		hasZoomIsoPuller: vi.fn(() => false),
		isFirstPong: vi.fn(() => false),
		configureConnectedPingWatchdog: vi.fn(),
		sendCommand: vi.fn(),
	}
}

describe('handleUserMessage chat handling', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		// Safety net: no real HTTP calls if postMessage is ever reached unmocked
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response('ok')),
		)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('ignores short chat payloads without throwing or posting', async () => {
		const context = createContext()
		const postMessageSpy = vi.spyOn(socialStreamApi, 'postMessage').mockResolvedValue(undefined as never)
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
		const postMessageSpy = vi.spyOn(socialStreamApi, 'postMessage').mockResolvedValue(undefined as never)
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

import { describe, expect, it, jest } from '@jest/globals'
import { handleGalleryMessage } from '../../src/osc/handlers/gallery.js'
import { convertInt64Args } from '../../src/osc/int64.js'
import type { OSCHandlerContext, ZoomOSCResponse } from '../../src/osc/types.js'
import type { ZoomConfig } from '../../src/config.js'
import type { InstanceBaseExt } from '../../src/utils.js'
import { createMockInstance } from '../helpers/mock-instance.js'

// tests/setup.ts mocks osc so no socket opens; encoding and decoding need the real package
const realOsc = jest.requireActual<any>('osc')

/**
 * Encodes a message the way ZoomOSC sends it and decodes it the way the module's UDP port does
 * (osc.js with metadata: true).
 */
function throughOsc(address: string, type: 'h' | 'i', ids: number[]): ZoomOSCResponse {
	const args = ids.map((id) =>
		type === 'h'
			? { type: 'h', value: { high: Math.floor(id / 2 ** 32), low: id % 2 ** 32 | 0 } }
			: { type, value: id },
	)
	const bytes = realOsc.writePacket({ address, args }, { metadata: true })
	return realOsc.readPacket(bytes, { metadata: true }) as ZoomOSCResponse
}

function createContext(instance: InstanceBaseExt<ZoomConfig>): OSCHandlerContext {
	return {
		instance,
		createZoomUser: jest.fn(async () => undefined),
		setUpdateLoop: jest.fn(),
		setNeedToPingPong: jest.fn(),
		isSpotlightGroupTrackingInitialized: jest.fn(() => true),
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

const ALICE = 16778240
const BOB = 16779264

function createMeeting(): InstanceBaseExt<ZoomConfig> {
	const instance = createMockInstance()
	for (const [zoomId, userName] of [
		[ALICE, 'Alice'],
		[BOB, 'Bob'],
	] as const) {
		instance.ZoomUserData[zoomId] = { zoomId, userName, spotlighted: false } as any
		instance.ZoomVariableLink.push({ zoomId, userName })
	}
	instance.ZoomGroupData.push({ groupName: 'Hosts', users: [] }, { groupName: 'Spotlights', users: [] })
	return instance
}

describe('convertInt64Args', () => {
	it('turns the 64-bit Zoom IDs osc reads (type h) into plain numbers', () => {
		const message = convertInt64Args(throughOsc('/zoomosc/galleryOrder', 'h', [ALICE, BOB]))

		expect(message.args).toEqual([
			{ type: 'h', value: ALICE },
			{ type: 'h', value: BOB },
		])
	})

	it('keeps IDs above 32 bits exact, including when the lower half has its top bit set', () => {
		const big = 2 ** 32 + 2 ** 31 + 5
		const message = convertInt64Args(throughOsc('/zoomosc/spotOrder', 'h', [big]))

		expect(message.args[0].value).toBe(big)
	})

	it('reads a plain { high, low } object, as osc gives when the long package is missing', () => {
		const message = convertInt64Args({
			address: '/zoomosc/galleryOrder',
			args: [{ type: 'h', value: { high: 0, low: ALICE, unsigned: false } }],
		})

		expect(message.args[0].value).toBe(ALICE)
	})

	it('leaves 32-bit IDs (type i, ZoomOSC 4 and ZoomISO 3.0.6) untouched', () => {
		const original = throughOsc('/zoomosc/galleryOrder', 'i', [ALICE, BOB])
		const message = convertInt64Args(original)

		expect(message).toBe(original)
		expect(message.args).toEqual([
			{ type: 'i', value: ALICE },
			{ type: 'i', value: BOB },
		])
	})

	it('leaves a message without arguments untouched', () => {
		const original = { address: '/zoomosc/listCleared', args: [] }

		expect(convertInt64Args(original)).toBe(original)
	})
})

describe.each([
	['64-bit IDs (ZoomOSC 5.0.1, ZoomISO 3.0.7)', 'h'],
	['32-bit IDs (ZoomOSC 4, ZoomISO 3.0.6)', 'i'],
] as const)('gallery and spotlight with %s', (_label, type) => {
	it('fills in the gallery order and gallery position variables', () => {
		const instance = createMeeting()
		const data = convertInt64Args(throughOsc('/zoomosc/galleryOrder', type, [BOB, ALICE]))

		handleGalleryMessage(createContext(instance), data, 'galleryOrder')

		expect(instance.ZoomClientDataObj.galleryOrder).toEqual([BOB, ALICE])
		expect(instance.setVariableValues).toHaveBeenCalledWith(
			expect.objectContaining({ GalleryPosition01: 'Bob', GalleryPosition02: 'Alice' }),
		)
	})

	it('fills in the Spotlights group', () => {
		const instance = createMeeting()
		const data = convertInt64Args(throughOsc('/zoomosc/spotOrder', type, [ALICE]))

		handleGalleryMessage(createContext(instance), data, 'spotOrder')

		expect(instance.ZoomGroupData[1].users).toEqual([{ userName: 'Alice', zoomID: ALICE }])
		expect(instance.ZoomUserData[ALICE].spotlighted).toBe(true)
	})
})

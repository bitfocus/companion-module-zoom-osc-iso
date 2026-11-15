import { describe, expect, it, vi } from 'vitest'
import { InstanceStatus } from '@companion-module/base'
import { handleSessionMessage } from '../../../src/osc/handlers/session.js'
import { MeetingStatus, type OSCHandlerContext, type ZoomOSCResponse } from '../../../src/osc/types.js'
import { createMockInstance } from '../../helpers/mock-instance.js'

function createContext(): OSCHandlerContext {
	return {
		instance: createMockInstance(),
		createZoomUser: vi.fn(async () => undefined),
		setUpdateLoop: vi.fn(),
		refreshAllOnNextLoop: vi.fn(),
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

describe('handleSessionMessage', () => {
	it('restores ping-pong monitoring before recreating timers when meeting status is in-call', () => {
		const context = createContext()
		const data: ZoomOSCResponse = {
			address: '/zoomosc/meetingStatus',
			args: [{ type: 'i', value: MeetingStatus.InMeeting }],
		}

		handleSessionMessage(context, data, 'meetingStatus')

		expect(context.setNeedToPingPong).toHaveBeenCalledWith(true)
		expect(context.createPingTimer).toHaveBeenCalled()
		expect(context.createUpdatePresetsTimer).toHaveBeenCalled()
		expect(context.createZoomIsoPullerTimer).toHaveBeenCalled()
	})

	it.each([
		['v2 numeric isPro', 1, true],
		['v3 boolean isPro', true, true],
		['lite/essentials value', false, false],
	])('treats %s correctly in pong payload', (_label, rawIsPro, expectedIsPro) => {
		const context = createContext()
		const data: ZoomOSCResponse = {
			address: '/zoomosc/pong',
			args: [
				{ type: 's', value: 'unused' },
				{ type: 's', value: 'ZISO 3.0.0' },
				{ type: 'i', value: 2 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 4 },
				{ type: 'i', value: 10 },
				{ type: typeof rawIsPro === 'boolean' ? 'b' : 'i', value: rawIsPro },
			],
		}

		handleSessionMessage(context, data, 'pong')

		expect(context.instance.updateStatus).toHaveBeenCalledWith(InstanceStatus.Ok)
		expect(context.instance.ZoomClientDataObj.isPro).toBe(expectedIsPro)
		expect(context.instance.ZoomClientDataObj.zoomOSCVersion).toBe('ZISO 3.0.0')
	})

	it.each([
		['In Meeting', MeetingStatus.InMeeting],
		['Audio Ready', MeetingStatus.AudioReady],
	])('starts checking the connection when ZoomOSC/ISO reports %s', (_label, status) => {
		const context = createContext()
		handleSessionMessage(
			context,
			{ address: '/zoomosc/meetingStatusChanged', args: [{ type: 'i', value: status }] },
			'meetingStatusChanged',
		)

		expect(context.setNeedToPingPong).toHaveBeenCalledWith(true)
		expect(context.createPingTimer).toHaveBeenCalled()
		expect(context.createUpdatePresetsTimer).toHaveBeenCalled()
		expect(context.createZoomIsoPullerTimer).toHaveBeenCalled()
	})

	it('waits for the meeting while connecting', () => {
		const context = createContext()
		handleSessionMessage(
			context,
			{ address: '/zoomosc/meetingStatusChanged', args: [{ type: 'i', value: MeetingStatus.Connecting }] },
			'meetingStatusChanged',
		)

		expect(context.createPingTimer).not.toHaveBeenCalled()
		expect(context.createZoomIsoPullerTimer).not.toHaveBeenCalled()
	})

	describe('pong', () => {
		const pong = (callStatus: number): ZoomOSCResponse => ({
			address: '/zoomosc/pong',
			args: [
				{ type: 's', value: 'unused' },
				{ type: 's', value: 'ZOSC_5.0.1_MAC' },
				{ type: 'i', value: 2 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: callStatus },
				{ type: 'i', value: 0 },
				{ type: 'i', value: 45 },
				{ type: 'i', value: 1 },
			],
		})

		it('asks for everyone in the meeting on the first pong when ZoomOSC/ISO is already in one', () => {
			const context = createContext()
			vi.mocked(context.isFirstPong).mockReturnValue(true)
			handleSessionMessage(context, pong(1), 'pong')
			expect(context.sendCommand).toHaveBeenCalledWith('/zoom/list', [])
		})

		it('does not ask on the first pong outside a meeting', () => {
			const context = createContext()
			vi.mocked(context.isFirstPong).mockReturnValue(true)
			handleSessionMessage(context, pong(0), 'pong')
			expect(context.sendCommand).not.toHaveBeenCalledWith('/zoom/list', [])
		})

		it('does not ask again on later pongs', () => {
			const context = createContext()
			handleSessionMessage(context, pong(1), 'pong')
			expect(context.sendCommand).not.toHaveBeenCalledWith('/zoom/list', [])
		})
	})

	it('empties Hosts and Spotlights when ZoomOSC/ISO clears its list, and keeps the custom groups', () => {
		const context = createContext()
		context.instance.ZoomUserData = { 101: { zoomId: 101, userName: 'Alice', users: [] } as never }
		context.instance.ZoomGroupData = [
			{ groupName: 'Hosts', users: [{ zoomID: -1, userName: 'USER OFFLINE' }] },
			{ groupName: 'Spotlights', users: [{ zoomID: 101, userName: 'Alice' }] },
			{ groupName: 'Speakers', users: [{ zoomID: 101, userName: 'Alice' }] },
		]

		handleSessionMessage(context, { address: '/zoomosc/listCleared', args: [] }, 'listCleared')

		expect(context.instance.ZoomUserData).toEqual({})
		expect(context.instance.ZoomGroupData[0].users).toEqual([])
		expect(context.instance.ZoomGroupData[1].users).toEqual([])
		expect(context.instance.ZoomGroupData[2].users).toEqual([{ zoomID: 101, userName: 'Alice' }])
	})
})

import { describe, expect, it, vi } from 'vitest'
import ZoomInstance from '../src/index.js'

describe('ZoomInstance destroy', () => {
	it('stops OSC before clearing data, and keeps the groups', async () => {
		const groupsSeenByOsc: unknown[] = []
		const self: any = {
			id: 'test',
			log: vi.fn(),
			ZoomUserData: { 101: { zoomId: 101 } },
			ZoomVariableLink: [{ zoomId: 101, userName: 'Alice' }],
			ZoomParticipantPage: { start: 10, size: 10 },
			ZoomGroupData: [
				{ groupName: 'Hosts', users: [{ zoomID: 101, userName: 'Alice' }] },
				{ groupName: 'Spotlights', users: [] },
			],
			OSC: { destroy: vi.fn(async () => groupsSeenByOsc.push(structuredClone(self.ZoomGroupData))) },
		}

		await ZoomInstance.prototype.destroy.call(self)

		expect(self.OSC.destroy).toHaveBeenCalled()
		// OSC was stopped while the data was still intact
		expect(groupsSeenByOsc[0]).toEqual([
			{ groupName: 'Hosts', users: [{ zoomID: 101, userName: 'Alice' }] },
			{ groupName: 'Spotlights', users: [] },
		])
		expect(self.ZoomGroupData).toEqual([
			{ groupName: 'Hosts', users: [] },
			{ groupName: 'Spotlights', users: [] },
		])
		expect(self.ZoomUserData).toEqual({})
		expect(self.ZoomVariableLink).toEqual([])
	})
})

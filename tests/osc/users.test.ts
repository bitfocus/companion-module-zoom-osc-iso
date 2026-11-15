import { describe, expect, it } from 'vitest'
import { createZoomUser } from '../../src/osc/users.js'
import type { ZoomOSCResponse } from '../../src/osc/types.js'
import { createMockInstance } from '../helpers/mock-instance.js'

describe('createZoomUser', () => {
	it('creates a matching variable-link entry for a valid compact payload', async () => {
		const instance = createMockInstance()
		const data: ZoomOSCResponse = {
			address: '/zoomosc/user/list',
			args: [
				{ type: 'i', value: 1 },
				{ type: 's', value: 'Alice' },
				{ type: 'i', value: 2 },
				{ type: 'i', value: 101 },
			],
		}

		await createZoomUser(instance, data)

		expect(instance.ZoomUserData[101]).toMatchObject({
			zoomId: 101,
			userName: 'Alice',
			// a new participant is not spotlighted until ZoomOSC says so, so "Spotlight Off" applies straight away
			spotlighted: false,
		})
		expect(instance.ZoomVariableLink).toEqual([{ zoomId: 101, userName: 'Alice' }])
	})

	it('warns and skips creating a user when the full payload is missing handRaised', async () => {
		const instance = createMockInstance()
		const data: ZoomOSCResponse = {
			address: '/zoomosc/user/list',
			args: [
				{ type: 'i', value: 1 },
				{ type: 's', value: 'Alice' },
				{ type: 'i', value: 2 },
				{ type: 'i', value: 101 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 3 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 0 },
			],
		}

		await createZoomUser(instance, data)

		expect(instance.log).toHaveBeenCalledWith('warn', 'create ZoomUser wrong arguments in OSC feedback')
		expect(instance.ZoomUserData[101]).toBeUndefined()
		expect(instance.ZoomVariableLink).toEqual([{ zoomId: 101, userName: 'Alice' }])
	})
})

describe('createZoomUser with an invalid Zoom ID', () => {
	/** A /zoomosc/me/list entry exactly as ZoomOSC 5.0.1 sent it when the meeting ended (2026-11-14) */
	const offlineListEntry = (role: number): ZoomOSCResponse => ({
		address: '/zoomosc/me/list',
		args: [
			{ type: 's', value: '90E59E53-FCD1-9A9F-B588-4E8C8BDE7F47' },
			{ type: 's', value: 'USER OFFLINE' },
			{ type: 'i', value: -1 },
			{ type: 'i', value: -1 },
			{ type: 'i', value: 0 },
			{ type: 'i', value: 0 },
			{ type: 'i', value: role },
			{ type: 'i', value: 1 },
			{ type: 'i', value: 1 },
			{ type: 'i', value: 0 },
			{ type: 'i', value: 0 },
		],
	})

	it('does not add a participant listed with Zoom ID -1, even as host', async () => {
		const instance = createMockInstance()
		instance.ZoomGroupData = [
			{ groupName: 'Hosts', users: [] },
			{ groupName: 'Spotlights', users: [] },
		]

		await createZoomUser(instance, offlineListEntry(1))
		await createZoomUser(instance, offlineListEntry(3))

		expect(instance.ZoomUserData).toEqual({})
		expect(instance.ZoomVariableLink).toEqual([])
		expect(instance.ZoomGroupData[0].users).toEqual([])
	})

	it('does not add a participant whose Zoom ID is not a number', async () => {
		const instance = createMockInstance()
		const entry = offlineListEntry(3)
		entry.args[3] = { type: 's', value: 'not an id' }

		await createZoomUser(instance, entry)

		expect(instance.ZoomUserData).toEqual({})
		expect(instance.ZoomVariableLink).toEqual([])
	})
})

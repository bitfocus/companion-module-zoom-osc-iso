import { describe, expect, it } from '@jest/globals'
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
		expect(instance.ZoomVariableLink).toEqual([])
	})
})

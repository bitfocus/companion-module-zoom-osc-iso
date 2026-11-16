import { describe, it, expect } from 'vitest'
import { createMockInstance } from '../helpers/mock-instance.js'
import { updateCallStatusVariables } from '../../src/variables/variable-values.js'
import type { VariableValues } from '../../src/variables/variable-definitions.js'

function callStatusVariables(callStatus: number): VariableValues {
	const instance = createMockInstance()
	instance.ZoomClientDataObj.callStatus = callStatus
	const variables: VariableValues = {}
	updateCallStatusVariables(instance, variables)
	return variables
}

describe('call status variables', () => {
	it('shows offline for meeting status idle (0) and ended (7), and a pong reporting no call (0)', () => {
		for (const status of [0, 7]) {
			expect(callStatusVariables(status), String(status)).toEqual({ callStatusNumber: status, callStatus: 'offline' })
		}
	})

	it('shows In meeting for every other status: in meeting (3), audio ready (8) and a pong reporting a call (1)', () => {
		for (const status of [1, 3, 8]) {
			expect(callStatusVariables(status), String(status)).toEqual({
				callStatusNumber: status,
				callStatus: 'In meeting',
			})
		}
	})
})

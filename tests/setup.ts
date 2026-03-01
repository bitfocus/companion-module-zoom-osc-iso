/**
 * Global test setup — runs after Jest framework is installed.
 *
 * Safety-net Layer 2: prevents the `osc` UDP library from opening real sockets
 * if osc.ts is accidentally imported. Primary protection is the mock instance
 * (instance.OSC = { sendCommand: jest.fn() }) in mock-instance.ts.
 */
import { jest } from '@jest/globals'
jest.mock('osc', () => ({
	UDPPort: jest.fn().mockImplementation(() => ({
		send: jest.fn(),
		on: jest.fn(),
		open: jest.fn(),
		close: jest.fn(),
	})),
}))

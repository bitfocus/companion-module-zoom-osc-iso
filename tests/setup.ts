/**
 * Global test setup — runs after Jest framework is installed.
 *
 * Safety-net Layer 2: prevents the OSC transport library from opening real sockets
 * if osc.ts is accidentally imported. Primary protection is the mock instance
 * (instance.OSC = { sendCommand: jest.fn() }) in mock-instance.ts.
 */
import { jest } from '@jest/globals'

jest.mock('node-osc', () => ({
	Client: jest.fn().mockImplementation(() => ({
		send: jest.fn(),
		close: jest.fn(),
	})),
	Server: jest.fn().mockImplementation(() => ({
		on: jest.fn(),
		close: jest.fn(),
	})),
}))

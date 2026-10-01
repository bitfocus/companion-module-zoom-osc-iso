import { vi } from 'vitest'
/**
 * Global test setup — runs before each test file (vitest setupFiles).
 *
 * Safety-net Layer 2: prevents the OSC transport library from opening real sockets
 * if osc.ts is accidentally imported. Primary protection is the mock instance
 * (instance.OSC = { sendCommand: vi.fn() }) in mock-instance.ts.
 */
vi.mock('node-osc', () => ({
	Client: vi.fn().mockImplementation(() => ({
		send: vi.fn(),
		close: vi.fn(),
	})),
	Server: vi.fn().mockImplementation(() => ({
		on: vi.fn(),
		close: vi.fn(),
	})),
}))

import { vi } from 'vitest'
/**
 * Global test setup — runs before each test file (vitest setupFiles).
 *
 * Safety-net Layer 2: prevents the OSC transport from opening real sockets if osc.ts is imported.
 * Primary protection is the mock instance (instance.OSC = { sendCommand: vi.fn() }) in mock-instance.ts.
 * node-osc keeps its real encode/decode (pure functions) so tests can build and decode packets.
 */
vi.mock('node-osc', async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	Client: vi.fn().mockImplementation(() => ({
		send: vi.fn(),
		close: vi.fn(),
	})),
	Server: vi.fn().mockImplementation(() => ({
		on: vi.fn(),
		close: vi.fn(),
	})),
}))

/** The receiving and forwarding sockets: tests emit 'message' on them and inspect send/bind/close */
vi.mock('node:dgram', async () => {
	const { EventEmitter } = await import('node:events')
	class FakeSocket extends EventEmitter {
		bind = vi.fn()
		send = vi.fn()
		close = vi.fn((callback?: () => void) => callback?.())
	}
	return { createSocket: vi.fn(() => new FakeSocket()) }
})

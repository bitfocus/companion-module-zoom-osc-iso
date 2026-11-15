import { vi } from 'vitest'
/**
 * Global test setup — runs before each test file (vitest setupFiles).
 *
 * Safety-net Layer 2: prevents the OSC transport library from opening real sockets
 * if osc.ts is accidentally imported. Primary protection is the mock instance
 * (instance.OSC = { sendCommand: vi.fn() }) in mock-instance.ts.
 *
 * The fake UDPPort behaves like osc's: tests emit 'ready', 'message' ({ address, args: [{ type, value }] }),
 * 'raw' (a packet's bytes, as forwarding gets them) and 'error' on it, and close() emits 'close'. Instances are listed
 * on UDPPort.instances.
 */
vi.mock('osc', async () => {
	const { EventEmitter } = await import('node:events')
	class UDPPort extends EventEmitter {
		static instances: UDPPort[] = []
		open = vi.fn()
		send = vi.fn()
		close = vi.fn(() => {
			setImmediate(() => this.emit('close'))
		})
		constructor(public options: Record<string, unknown>) {
			super()
			UDPPort.instances.push(this)
		}
	}
	return { default: { UDPPort } }
})

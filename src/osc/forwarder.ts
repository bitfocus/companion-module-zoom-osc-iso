import { createSocket, type Socket } from 'node:dgram'
import { networkInterfaces } from 'node:os'

export const DEFAULT_FORWARD_HOST = '127.0.0.1'
/** One above the module's default receiving port (1234) */
export const DEFAULT_FORWARD_PORT = 1235
/** A target that is down would otherwise log once per message */
const ERROR_LOG_INTERVAL_MS = 60_000

export type ForwardTarget = { host: string; port: number }
type Log = (level: 'info' | 'warn', message: string) => void

/** Loopback, the any-address, or one of this computer's own interface addresses */
function isThisComputer(host: string): boolean {
	if (host === '0.0.0.0' || host === 'localhost' || host.startsWith('127.')) return true
	return Object.values(networkInterfaces()).some((addresses) => addresses?.some((a) => a.address === host))
}

/**
 * Why the forward target can't be used, or null when it can.
 * Refuses a target that would send ZoomOSC/ZoomISO's messages back into this module or into ZoomOSC/ZoomISO itself.
 */
export function checkForwardTarget(
	target: ForwardTarget,
	rxPort: number,
	zoomHost: string,
	zoomTxPort: number,
): string | null {
	const where = `${target.host}:${target.port}`
	if (!target.host) return 'no IP address is set to forward to'
	if (!Number.isInteger(target.port) || target.port < 1 || target.port > 65535) {
		return `${target.port} is not a valid port`
	}
	if (target.port === rxPort && isThisComputer(target.host)) {
		return `${where} is this module's own receiving port, so the messages would loop`
	}
	const sameAsZoom = target.host === zoomHost || (isThisComputer(target.host) && isThisComputer(zoomHost))
	if (target.port === zoomTxPort && sameAsZoom) {
		return `${where} is ZoomOSC/ZoomISO's receiving port, so the messages would go back into ZoomOSC/ZoomISO`
	}
	return null
}

/**
 * Sends a copy of each OSC packet received from ZoomOSC/ZoomISO to one other application, byte for byte.
 * Nothing is decoded, filtered or queued here, so a busy meeting costs one UDP send per packet.
 */
export class OscForwarder {
	private readonly socket: Socket
	private readonly target: ForwardTarget
	private readonly log: Log
	private lastErrorLoggedAt = 0
	private closed = false

	constructor(target: ForwardTarget, log: Log) {
		this.target = target
		this.log = log
		// its own socket, so the other application never sees this module's receiving port as the sender
		this.socket = createSocket('udp4')
		this.socket.on('error', this.reportError)
	}

	/** Sends the packet exactly as it arrived */
	public forward(packet: Buffer): void {
		if (this.closed) return
		this.socket.send(packet, this.target.port, this.target.host, this.onSent)
	}

	public async close(): Promise<void> {
		if (this.closed) return
		this.closed = true
		await new Promise<void>((resolve) => {
			try {
				this.socket.close(() => resolve())
			} catch {
				// already closed
				resolve()
			}
		})
	}

	private readonly onSent = (error: Error | null): void => {
		if (error) this.reportError(error)
	}

	private readonly reportError = (error: Error): void => {
		const now = Date.now()
		if (now - this.lastErrorLoggedAt < ERROR_LOG_INTERVAL_MS) return
		this.lastErrorLoggedAt = now
		this.log('warn', `OSC forwarding to ${this.target.host}:${this.target.port} failed: ${error.message}`)
	}
}

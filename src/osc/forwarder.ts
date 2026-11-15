import { createSocket, type Socket } from 'node:dgram'
import { isIPv4 } from 'node:net'
import { networkInterfaces } from 'node:os'
import type { ZoomConfig } from '../config.js'

export const DEFAULT_FORWARD_HOST = '127.0.0.1'
/** One above the module's default receiving port (1234) */
export const DEFAULT_FORWARD_PORT = 1235

export type ForwardTarget = { host: string; port: number }
type Log = (level: 'info' | 'warn' | 'error', message: string) => void

/** The settings only OSC forwarding uses: when nothing else changed, there's no need to reconnect to ZoomOSC/ISO */
const FORWARDING_CONFIG_KEYS: readonly string[] = ['enableOscForwarding', 'oscForwardHost', 'oscForwardPort']

/** The saved forward target. Connections that never ran the upgrade script have none saved, so they get the defaults. */
export function forwardTargetFromConfig(config: Pick<ZoomConfig, 'oscForwardHost' | 'oscForwardPort'>): ForwardTarget {
	return {
		host: config.oscForwardHost || DEFAULT_FORWARD_HOST,
		port: Number(config.oscForwardPort) || DEFAULT_FORWARD_PORT,
	}
}

/** Whether the OSC forwarding settings changed and nothing else did */
export function onlyForwardingSettingsChanged(previous: ZoomConfig, next: ZoomConfig): boolean {
	let forwardingChanged = false
	for (const key of new Set([...Object.keys(previous), ...Object.keys(next)])) {
		const before = JSON.stringify(previous[key as keyof ZoomConfig])
		const after = JSON.stringify(next[key as keyof ZoomConfig])
		if (before === after) continue
		if (!FORWARDING_CONFIG_KEYS.includes(key)) return false
		forwardingChanged = true
	}
	return forwardingChanged
}

/** Why the target isn't an IP address and port at all, or null when it is */
export function invalidTargetReason(target: ForwardTarget): string | null {
	if (!isIPv4(target.host)) return `"${target.host}" is not an IP address`
	if (!Number.isInteger(target.port) || target.port < 1 || target.port > 65535) {
		return `"${target.port}" is not a port (1 to 65535)`
	}
	return null
}

/**
 * Why the forward target can't be used, or null when it can.
 * Refuses a target that would send ZoomOSC/ISO's messages back into this module, or into ZoomOSC/ISO itself.
 */
export function checkForwardTarget(
	target: ForwardTarget,
	rxPort: number,
	zoomHost: string,
	zoomTxPort: number,
): string | null {
	const invalid = invalidTargetReason(target)
	if (invalid) return invalid

	// read once per check, when forwarding starts or changes: never for each packet
	const interfaceAddresses = new Set(
		Object.values(networkInterfaces()).flatMap((addresses) => (addresses ?? []).map((a) => a.address)),
	)
	const isThisComputer = (host: string) =>
		host === '0.0.0.0' || host === 'localhost' || host.startsWith('127.') || interfaceAddresses.has(host)

	const where = `${target.host}:${target.port}`
	if (target.port === rxPort && isThisComputer(target.host)) {
		return `${where} is this module's own receiving port, so the messages would loop`
	}
	const sameAsZoom = target.host === zoomHost || (isThisComputer(target.host) && isThisComputer(zoomHost))
	if (target.port === zoomTxPort && sameAsZoom) {
		return `${where} is ZoomOSC/ISO's receiving port, so the messages would go back into ZoomOSC/ISO`
	}
	return null
}

/**
 * Sends a copy of each OSC packet received from ZoomOSC/ISO to one other application, byte for byte.
 * Nothing is decoded, filtered or queued here, so a busy meeting costs one UDP send per packet.
 */
export class OscForwarder {
	public readonly target: ForwardTarget
	private readonly socket: Socket
	private readonly log: Log
	private closed = false

	constructor(target: ForwardTarget, log: Log) {
		this.target = target
		this.log = log
		// its own socket, so the other application never sees this module's receiving port as the sender
		this.socket = createSocket('udp4')
		this.socket.on('error', this.reportError)
	}

	/** Sends the packet exactly as it arrived */
	public forward(packet: Uint8Array): void {
		if (this.closed) return
		try {
			this.socket.send(packet, this.target.port, this.target.host, this.onSent)
		} catch (error) {
			// osc emits the packet outside its own try/catch: a throw here would stop the module
			this.reportError(error instanceof Error ? error : new Error(String(error)))
		}
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

	/** Every failure is logged, as it happens */
	private readonly reportError = (error: Error): void => {
		this.log('error', `OSC forwarding to ${this.target.host}:${this.target.port} failed: ${error.message}`)
	}
}

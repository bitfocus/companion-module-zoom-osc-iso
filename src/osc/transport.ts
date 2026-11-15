import type { OSCSomeArguments } from '@companion-module/base'
import osc from 'osc'
import type { ZoomOSCArgument, ZoomOSCResponse } from './types.js'

/**
 * The OSC transport: the one place that uses the `osc` package (osc.js, CommonJS). The rest of the module only sees
 * this ESM wrapper and the types in src/types/osc.d.ts.
 *
 * osc.js is what the module used up to 4.11. Unlike node-osc it reads 64-bit integers (ZoomOSC 5 and ZoomISO 3.0.7
 * send Zoom IDs that way), fires a 'message' event for every message inside a bundle, and keeps each argument's type
 * tag, so 1.0 stays a decimal.
 */
export type OscPort = osc.UDPPort

/** If the port never opened (say, it was already in use), osc never reports 'close': don't wait for ever */
const CLOSE_TIMEOUT = 1000

/**
 * One UDP port that receives from ZoomOSC/ISO and sends commands to it, set up as in 4.11: listening on every
 * address, with each argument's type tag kept.
 */
export function createOscPort(listenPort: number, zoomHost: string, zoomPort: number): OscPort {
	return new osc.UDPPort({
		localAddress: '0.0.0.0',
		localPort: listenPort,
		remoteAddress: zoomHost,
		remotePort: zoomPort,
		metadata: true,
	})
}

/** Closes the port and waits until its socket has closed */
export async function closeOscPort(port: OscPort): Promise<void> {
	await new Promise<void>((resolve) => {
		const timeout = setTimeout(resolve, CLOSE_TIMEOUT)
		port.once('close', () => {
			clearTimeout(timeout)
			resolve()
		})
		try {
			port.close()
		} catch {
			// already closed
			clearTimeout(timeout)
			resolve()
		}
	})
}

/**
 * A received message in the shape the handlers use: { address, args: [{ type, value }] }.
 * - A 64-bit integer (type tag h) becomes a plain number. ZoomOSC 5.0.1 and ZoomISO 3.0.7 send the Zoom IDs in
 *   gallery order and spot order that way, where ZoomOSC 4 and ZoomISO 3.0.6 send 32-bit integers (type tag i).
 *   Going by each argument's type tag, rather than by the app's version, handles old and new alike.
 * - True/false (type tags T and F) become the integers 1 and 0, as the handlers have expected since 4.12.
 * - Everything else keeps its type tag and value, so a decimal stays a decimal.
 */
export function toZoomOSCResponse(message: osc.Message): ZoomOSCResponse {
	return { address: message.address, args: message.args.map(toZoomOSCArgument) }
}

function toZoomOSCArgument(arg: osc.TypedArgument): ZoomOSCArgument {
	if (arg.type === 'h') return { type: 'h', value: int64ToNumber(arg.value) }
	if (arg.type === 'T' || arg.type === 'F') return { type: 'i', value: arg.value ? 1 : 0 }
	return { type: arg.type, value: arg.value }
}

/**
 * osc reads a 64-bit integer as { high, low } (a Long from the long package, or a plain object without it): the
 * upper and lower 32 bits. Zoom IDs are far below 2^53, so the plain number is exact.
 */
function int64ToNumber(value: unknown): number {
	if (typeof value === 'number') return value
	if (typeof value === 'bigint') return Number(value)
	if (typeof value === 'object' && value !== null && 'high' in value && 'low' in value) {
		const { high, low } = value as { high: number; low: number }
		// high is signed, low is read as signed but holds the lower 32 bits unsigned
		return high * 2 ** 32 + (low >>> 0)
	}
	return Number(value)
}

/**
 * A command in the form osc sends. Typed arguments are written exactly as given; a bare value gets the type node-osc
 * gave it (text a string, a whole number an integer, any other number a decimal, bytes a blob).
 */
export function toOutgoingMessage(path: string, args?: OSCSomeArguments): osc.OutgoingMessage {
	const list = args === undefined ? [] : Array.isArray(args) ? args : [args]
	return {
		address: path,
		args: list.map((arg) => {
			if (typeof arg === 'object' && !(arg instanceof Uint8Array)) return arg
			if (typeof arg === 'string') return { type: 's', value: arg }
			if (typeof arg === 'number') return { type: Number.isInteger(arg) ? 'i' : 'f', value: arg }
			return { type: 'b', value: arg }
		}),
	}
}

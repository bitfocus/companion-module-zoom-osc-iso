import type { OSCSomeArguments, OSCArgument, OSCMetaArgument } from '@companion-module/base'
import { decode } from 'node-osc'
import type { ZoomConfig } from '../config.js'
import { SubscribeMode } from '../utils.js'
import type { NodeOscArgument, NodeOscMessage, ZoomOSCResponse } from './types.js'

type SendCommand = (path: string, args?: OSCSomeArguments) => void
type OSCClientSender = {
	send(address: string, ...args: Array<OSCArgument | OSCMetaArgument>): unknown
}

type OscArgumentArray = Array<OSCArgument | OSCMetaArgument>

function toArgumentArray(args?: OSCSomeArguments): OscArgumentArray {
	if (args === undefined) {
		return []
	}

	return Array.isArray(args) ? args : [args]
}

/** Returns what the client's send returns: node-osc gives a Promise that rejects when the message can't be sent */
export function sendOscCommand(client: OSCClientSender, path: string, args?: OSCSomeArguments): unknown {
	return client.send(path, ...toArgumentArray(args))
}

export function sendZoomSubscriptions(sendCommand: SendCommand): void {
	sendCommand('/zoom/subscribe', [{ type: 'i', value: SubscribeMode.All }])
	sendCommand('/zoom/galTrackMode', [{ type: 'i', value: 1 }])
	sendCommand('/zoom/getSpotOrder', [])
}

export function sendZoomIsoPullingCommands(sendCommand: SendCommand, config: ZoomConfig): void {
	if (config.pollEngineState) sendCommand('/zoom/getEngineState', [])
	if (config.pollAudioLevels) sendCommand('/zoom/getAudioLevels', [])
	if (config.pollOutputRouting) sendCommand('/zoom/getOutputRouting', [])
	if (config.pollAudioRouting) sendCommand('/zoom/getAudioRouting', [])
}

/**
 * Decodes one received OSC packet into the [address, ...values] form node-osc's Server emitted.
 * Returns null for a bundle or a packet that can't be decoded: the module never handled either.
 */
export function decodeOscPacket(packet: Buffer): NodeOscMessage | null {
	try {
		const decoded = decode(packet) as { oscType?: string; address: string; args?: { value: NodeOscArgument }[] }
		if (decoded.oscType !== 'message') return null
		return [decoded.address, ...(decoded.args ?? []).map((arg) => arg.value)]
	} catch {
		return null
	}
}

export function normalizeNodeOscMessage(message: NodeOscMessage): ZoomOSCResponse {
	const [address, ...args] = message

	return {
		address,
		args: args.map(toMetaArgument),
	}
}

function toMetaArgument(arg: NodeOscArgument): OSCMetaArgument {
	if (typeof arg === 'object' && arg !== null && 'type' in arg && 'value' in arg) {
		if (arg.type === 's') {
			return { type: 's', value: String(arg.value) }
		}

		return {
			type: arg.type === 'f' ? 'f' : 'i',
			value: typeof arg.value === 'number' ? arg.value : Number(arg.value),
		}
	}

	if (typeof arg === 'string') {
		return { type: 's', value: arg }
	}

	if (typeof arg === 'boolean') {
		return { type: 'i', value: arg ? 1 : 0 }
	}

	return { type: Number.isInteger(arg) ? 'i' : 'f', value: arg }
}

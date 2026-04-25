import type { OSCSomeArguments } from '@companion-module/base'
import type { ZoomConfig } from '../config.js'
import type { OSCArgument, OSCMetaArgument } from '@companion-module/base'
import { SubscribeMode } from '../utils.js'

type SendCommand = (path: string, args?: OSCSomeArguments) => void
type OSCClientSender = {
	send(address: string, ...args: Array<OSCArgument | OSCMetaArgument>): void
}

type NodeOscArgument = string | number | boolean | { type: string; value: string | number | boolean }
type NodeOscMessage = [string, ...NodeOscArgument[]]
type OscArgumentArray = Array<OSCArgument | OSCMetaArgument>

function toArgumentArray(args?: OSCSomeArguments): OscArgumentArray {
	if (args === undefined) {
		return []
	}

	return Array.isArray(args) ? args : [args]
}

export function sendOscCommand(client: OSCClientSender, path: string, args?: OSCSomeArguments): void {
	client.send(path, ...toArgumentArray(args))
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

export function normalizeNodeOscMessage(message: NodeOscMessage): { address: string; args: OSCMetaArgument[] } {
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

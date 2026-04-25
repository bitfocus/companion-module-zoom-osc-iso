import type { OSCSomeArguments } from '@companion-module/base'
import { SubscribeMode } from '../utils.js'

type SendCommand = (path: string, args?: OSCSomeArguments) => void
type OSCPortSender = {
	send(message: { address: string; args: OSCSomeArguments }, oscHost: string, oscTXPort: number): void
}

export function sendOscCommand(
	udpPort: OSCPortSender,
	oscHost: string,
	oscTXPort: number,
	path: string,
	args?: OSCSomeArguments,
): void {
	udpPort.send(
		{
			address: path,
			args: args ?? [],
		},
		oscHost,
		oscTXPort,
	)
}

export function sendZoomSubscriptions(sendCommand: SendCommand): void {
	sendCommand('/zoom/subscribe', [{ type: 'i', value: SubscribeMode.All }])
	sendCommand('/zoom/galTrackMode', [{ type: 'i', value: 1 }])
	sendCommand('/zoom/getSpotOrder', [])
}

export function sendZoomIsoPullingCommands(sendCommand: SendCommand): void {
	sendCommand('/zoom/getEngineState', [])
	sendCommand('/zoom/getAudioLevels', [])
	sendCommand('/zoom/getOutputRouting', [])
	sendCommand('/zoom/getAudioRouting', [])
}

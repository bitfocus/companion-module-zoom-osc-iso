import type { OSCSomeArguments } from '@companion-module/base'
import type { ZoomConfig } from '../config.js'
import { SubscribeMode } from '../utils.js'

type SendCommand = (path: string, args?: OSCSomeArguments) => void

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

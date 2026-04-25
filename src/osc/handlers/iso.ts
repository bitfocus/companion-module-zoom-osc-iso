import { CompanionVariableValues } from '@companion-module/base'
import {
	updateZoomIsoAudioLevelVariables,
	updateZoomIsoAudioRoutingVariables,
	updateZoomIsoEngineVariables,
	updateZoomIsoOutputVariables,
} from '../../variables/variable-values.js'
import { FeedbackId } from '../../feedback.js'
import { OSCHandlerContext, ZoomOSCResponse } from '../types.js'

export function handleIsoMessage(context: OSCHandlerContext, data: ZoomOSCResponse, zoomPart2: string): void {
	switch (zoomPart2) {
		case 'engineState':
			context.instance.ZoomClientDataObj.engineState = data.args[0].value
			setVariables(context.instance, (variables) => updateZoomIsoEngineVariables(context.instance, variables))
			context.instance.checkFeedbacks(FeedbackId.engineState)
			return
		case 'audioLevels':
			context.instance.ZoomAudioLevelData[parseInt(data.args[0].value)] = {
				channel: parseInt(data.args[0].value),
				level: parseInt(data.args[1].value),
			}
			context.instance.InitVariables()
			setVariables(context.instance, (variables) => updateZoomIsoAudioLevelVariables(context.instance, variables))
			return
		case 'audioRouting':
			context.instance.ZoomAudioRoutingData[parseInt(data.args[2].value)] = {
				audio_device: data.args[0].value,
				num_channels: parseInt(data.args[1].value),
				channel: parseInt(data.args[2].value),
				mode: data.args[3].value,
				gain_reduction: parseInt(data.args[4].value),
				selection: data.args[5].value,
			}
			context.instance.InitVariables()
			setVariables(context.instance, (variables) => updateZoomIsoAudioRoutingVariables(context.instance, variables))
			return
		case 'outputRouting': {
			const outputNumber = parseInt(data.args[1].value)
			context.instance.ZoomOutputData[outputNumber] = {
				numberOfOutputs: data.args[0].value,
				outputNumber: data.args[1].value,
				enabled: data.args[2].value,
				outputName: data.args[3].value,
				mode: data.args[4].value,
				selection: data.args[5].value,
				resolution: data.args[6].value,
				embeddedAudioInfo: data.args[7].value,
				status: data.args[8].value,
			}
			context.instance.InitVariables()
			setVariables(context.instance, (variables) => updateZoomIsoOutputVariables(context.instance, variables))
			context.instance.checkFeedbacks(FeedbackId.output)
			return
		}
		default:
			return
	}
}

function setVariables(
	instance: OSCHandlerContext['instance'],
	updater: (variables: CompanionVariableValues) => void,
): void {
	const variables: CompanionVariableValues = {}
	updater(variables)
	instance.setVariableValues(variables)
}

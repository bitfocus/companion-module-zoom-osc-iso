import { InstanceStatus } from '@companion-module/base'
import { PreviousSelectedCallersRestore, PreviousSelectedCallersSave } from '../../actions/action-utils.js'
import { ZoomVersion } from '../../utils.js'
import {
	updateAllUserBasedVariables,
	updateCallStatusVariables,
	updateIsProVariable,
	updateZoomOscVersion,
} from '../../variables/variable-values.js'
import { FeedbackId } from '../../feedback.js'
import { sendZoomSubscriptions } from '../commands.js'
import { OSCHandlerContext, ZoomOSCResponse } from '../types.js'
import { setVariables } from '../variables.js'

export function handleSessionMessage(context: OSCHandlerContext, data: ZoomOSCResponse, zoomPart2: string): void {
	switch (zoomPart2) {
		case 'pong':
			handlePong(context, data)
			return
		case 'meetingStatusChanged':
		case 'meetingStatus':
			handleMeetingStatus(context, data)
			return
		case 'listCleared':
			handleListCleared(context)
			return
		default:
			return
	}
}

function handlePong(context: OSCHandlerContext, data: ZoomOSCResponse): void {
	// context.instance.log('debug', 'receiving pong')
	// {str zoomOSCversion}
	// {int subscribeMode}
	// {int galTrackMode}
	// {int callStatus 0 or 1}
	// {int number of targets}
	// {int number of users in call}
	// {int isPro (1=true, 0-false)}
	const versionInfo = data.args[1].value as string
	const isProValue = data.args[7].value === 1 || data.args[7].value === true
	context.instance.updateStatus(InstanceStatus.Ok)

	// context.instance.log('debug', `${versionInfo} ${isProValue ? 'Pro' : 'Lite or Essentials'}`)
	context.instance.ZoomClientDataObj.isPro = isProValue
	context.instance.ZoomClientDataObj.zoomOSCVersion = versionInfo
	context.instance.ZoomClientDataObj.subscribeMode = data.args[2].value
	context.instance.ZoomClientDataObj.callStatus = data.args[4].value
	setVariables(context.instance, (variables) => {
		updateCallStatusVariables(context.instance, variables)
		updateZoomOscVersion(context.instance, variables)
		updateIsProVariable(context.instance, variables)
	})
	context.instance.checkFeedbacks(FeedbackId.isPro)

	switch (versionInfo.substring(0, 4)) {
		case 'ZISO':
			if (!context.hasZoomIsoPuller() && data.args[4].value === 1) {
				context.createZoomIsoPullerTimer()
			}

			if (context.instance.config.version !== (ZoomVersion.ZoomISO as number)) {
				context.instance.config.version = ZoomVersion.ZoomISO
				context.instance.saveConfig(context.instance.config)
			}
			break
		case 'ZOSC':
			if (context.hasZoomIsoPuller()) {
				context.destroyZoomIsoPullerTimer()
			}
			if (context.instance.config.version !== (ZoomVersion.ZoomOSC as number)) {
				context.instance.config.version = ZoomVersion.ZoomOSC
				context.instance.saveConfig(context.instance.config)
			}
			break
		default:
			context.instance.log('info', `Wrong version status:${context.instance.ZoomClientDataObj.zoomOSCVersion}`)
			break
	}

	context.configureConnectedPingWatchdog(data.args[4].value)
	sendZoomSubscriptions((path, args) => context.sendCommand(path, args))
	context.setUpdateLoop(true)
}

function handleMeetingStatus(context: OSCHandlerContext, data: ZoomOSCResponse): void {
	context.instance.log('info', `meetingStatus receiving: ${JSON.stringify(data.args[0].value)}`)
	context.instance.ZoomClientDataObj.callStatus = data.args[0].value

	// Meeting status ended
	// 0 = Meeting Status Idle
	// 7 = Meeting Status Ended
	if (data.args[0].value === 0 || data.args[0].value === 7) {
		context.destroyTimers()
		context.instance.ZoomUserData = {}
		context.instance.ZoomClientDataObj = {
			last_response: context.instance.ZoomClientDataObj.last_response,
			selectedCallers: [],
			PreviousSelectedCallers: [],
			selectedOutputs: [],
			selectedAudioOutputs: [],
			subscribeMode: context.instance.ZoomClientDataObj.subscribeMode,
			activeSpeaker: 'None',
			activeSpeakerZoomId: -1,
			isSpeaking: 'None',
			zoomOSCVersion: context.instance.ZoomClientDataObj.zoomOSCVersion,
			callStatus: context.instance.ZoomClientDataObj.callStatus,
			galleryCount: 0,
			galleryOrder: [],
			numberOfGroups: context.instance.ZoomClientDataObj.numberOfGroups,
			engineState: context.instance.ZoomClientDataObj.engineState,
			capturePermissionGranted: context.instance.ZoomClientDataObj.capturePermissionGranted,
			isPro: context.instance.ZoomClientDataObj.isPro,
		}
		context.instance.ZoomVariableLink.length = 0

		context.instance.ZoomGroupData = Array.from(
			{ length: context.instance.ZoomClientDataObj.numberOfGroups + 2 },
			(_, index) => ({
				groupName: index === 0 ? 'Hosts' : index === 1 ? 'Spotlights' : `Group ${index}`,
				users: [],
			}),
		)

		context.instance.ZoomUserData = {}
		setVariables(context.instance, (variables) => {
			updateCallStatusVariables(context.instance, variables)
			updateAllUserBasedVariables(context.instance, variables)
		})
		context.instance.checkFeedbacks()
		return
	}

	// 3 = In Meeting
	if (context.instance.ZoomClientDataObj.callStatus === 3) {
		context.setNeedToPingPong(true)
		context.createPingTimer()
		context.createUpdatePresetsTimer()
		context.createZoomIsoPullerTimer()
	}

	setVariables(context.instance, (variables) => updateCallStatusVariables(context.instance, variables))
}

function handleListCleared(context: OSCHandlerContext): void {
	context.instance.log('debug', 'listCleared')
	PreviousSelectedCallersSave(context.instance)
	context.instance.ZoomClientDataObj.selectedCallers.length = 0
	context.instance.ZoomVariableLink.length = 0
	context.instance.ZoomUserData = {}

	setVariables(context.instance, (variables) => updateAllUserBasedVariables(context.instance, variables))
	PreviousSelectedCallersRestore(context.instance)
}

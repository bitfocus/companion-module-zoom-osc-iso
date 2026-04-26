import { CompanionVariableValues } from '@companion-module/base'
import { socialStreamApi } from '../../socialstream.js'
import { arrayRemove, userExist, ZoomGroupDataInterface } from '../../utils.js'
import {
	updateActiveSpeakerVariable,
	updateAllGroupVariables,
	updateAllUserBasedVariables,
	updateGalleryVariables,
	updateHandRaisedCountVariable,
	updateHostGroupVariables,
	updateIsSpeakingVariable,
	updateSelectedCallersVariables,
	updateSpotlightGroupVariables,
	updateVideoOnCountVariable,
	updateZoomParticipantVariables,
	updateZoomUserVariables,
} from '../../variables/variable-values.js'
import { checkGroupFeedbacks, checkUserRelatedFeedbacks } from '../feedbacks.js'
import { OSCHandlerContext, UserRole, ZoomOSCResponse } from '../types.js'

async function ensureZoomUser(context: OSCHandlerContext, data: ZoomOSCResponse, zoomId: number): Promise<void> {
	if (userExist(zoomId, context.instance.ZoomUserData)) {
		return
	}

	if (!context.instance.ZoomUserOffline[zoomId]) {
		await context.createZoomUser(data)
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

function handleSpotlightState(
	context: OSCHandlerContext,
	data: ZoomOSCResponse,
	zoomId: number,
	enabled: boolean,
): void {
	if (!userExist(zoomId, context.instance.ZoomUserData)) {
		return
	}

	context.instance.ZoomUserData[zoomId].spotlighted = enabled
	const index = context.instance.ZoomGroupData[1].users.findIndex((id) => id !== null && id.zoomID === zoomId)

	if (enabled && index === -1) {
		context.instance.ZoomGroupData[1].users.push({
			zoomID: zoomId,
			userName: data.args[1].value,
		})
		setVariables(context.instance, (variables) => updateSpotlightGroupVariables(context.instance, variables))
	} else if (!enabled && index > -1) {
		context.instance.ZoomGroupData[1].users.splice(index, 1)
		setVariables(context.instance, (variables) => updateSpotlightGroupVariables(context.instance, variables))
	}

	checkUserRelatedFeedbacks(context.instance)
}

function handleActiveSpeaker(context: OSCHandlerContext, data: ZoomOSCResponse): void {
	if (context.instance.ZoomClientDataObj.activeSpeaker === data.args[1].value) {
		return
	}

	context.instance.ZoomClientDataObj.activeSpeaker = data.args[1].value
	context.instance.ZoomClientDataObj.activeSpeakerZoomId = data.args[3].value
	setVariables(context.instance, (variables) => updateActiveSpeakerVariable(context.instance, variables))
	checkUserRelatedFeedbacks(context.instance)
}

function handleVideoState(context: OSCHandlerContext, zoomId: number, enabled: boolean): void {
	if (!userExist(zoomId, context.instance.ZoomUserData)) {
		return
	}

	context.instance.ZoomUserData[zoomId].videoOn = enabled
	setVariables(context.instance, (variables) => updateVideoOnCountVariable(context.instance, variables))
	checkUserRelatedFeedbacks(context.instance)
}

function handleMuteState(context: OSCHandlerContext, zoomId: number, enabled: boolean): void {
	if (!userExist(zoomId, context.instance.ZoomUserData)) {
		return
	}

	context.instance.ZoomUserData[zoomId].mute = enabled
	checkUserRelatedFeedbacks(context.instance)
}

function handleHandRaisedState(context: OSCHandlerContext, zoomId: number, enabled: boolean): void {
	if (!userExist(zoomId, context.instance.ZoomUserData)) {
		return
	}

	context.instance.ZoomUserData[zoomId].handRaised = enabled
	setVariables(context.instance, (variables) => updateHandRaisedCountVariable(context.instance, variables))
	checkUserRelatedFeedbacks(context.instance)
}

function handleOffline(context: OSCHandlerContext, zoomId: number): void {
	if (!userExist(zoomId, context.instance.ZoomUserData)) {
		return
	}

	context.instance.ZoomUserOffline[zoomId] = context.instance.ZoomUserData[zoomId]

	context.instance.ZoomGroupData.forEach((group: ZoomGroupDataInterface) => {
		const groupIndex = group.users.findIndex((id) => id !== null && id.zoomID === zoomId)
		if (groupIndex > -1) {
			group.users.splice(groupIndex, 1)
		}
	})

	context.instance.ZoomClientDataObj.selectedCallers = arrayRemove(
		context.instance.ZoomClientDataObj.selectedCallers,
		zoomId,
	)

	delete context.instance.ZoomUserData[zoomId]
	const index = context.instance.ZoomVariableLink.findIndex((id: { zoomId: number }) => id.zoomId === zoomId)
	if (index > -1) {
		context.instance.log('debug', `Removed ${JSON.stringify(context.instance.ZoomVariableLink.splice(index, 1))}`)
	}

	setVariables(context.instance, (variables) => updateAllUserBasedVariables(context.instance, variables))
	checkUserRelatedFeedbacks(context.instance)
	context.setUpdateLoop(true)
}

function handleUserNameChanged(context: OSCHandlerContext, data: ZoomOSCResponse, zoomId: number): void {
	if (!userExist(zoomId, context.instance.ZoomUserData)) {
		return
	}

	context.instance.ZoomUserData[zoomId].userName = data.args[1].value
	const findIndex = context.instance.ZoomVariableLink.findIndex((id: { zoomId: number }) => id.zoomId === zoomId)
	context.instance.ZoomVariableLink[findIndex].userName = data.args[1].value
	context.instance.ZoomGroupData.forEach((group: ZoomGroupDataInterface) => {
		group.users.forEach((user) => {
			if (user.zoomID === zoomId) {
				user.userName = data.args[1].value
			}
		})
	})

	setVariables(context.instance, (variables) => {
		updateAllGroupVariables(context.instance, variables)
		updateZoomParticipantVariables(context.instance, variables)
		updateSelectedCallersVariables(context.instance, variables)
		updateGalleryVariables(context.instance, variables)
		updateZoomUserVariables(context.instance, variables)
	})
}

async function handleChat(context: OSCHandlerContext, data: ZoomOSCResponse): Promise<void> {
	if (
		context.instance.config.enableSocialStream &&
		context.instance.config.socialStreamId.length > 0 &&
		data.args.length >= 7 &&
		context.instance.config.socialStreamChatTypeToSend.includes(data.args[6].value)
	) {
		await socialStreamApi.postMessage(data.args[1].value, data.args[4].value, context.instance)
	}
}

async function handleAskedQuestion(context: OSCHandlerContext, data: ZoomOSCResponse): Promise<void> {
	if (
		context.instance.config.enableSocialStream &&
		context.instance.config.socialStreamId.length > 0 &&
		data.args.length >= 5
	) {
		await socialStreamApi.postMessage(
			data.args[1].value,
			`${context.instance.config.socialStreamQuestionPrefix}${data.args[4].value}`,
			context.instance,
		)
	}
}

function handleRoleChanged(context: OSCHandlerContext, data: ZoomOSCResponse, zoomId: number): void {
	if (userExist(zoomId, context.instance.ZoomUserData)) {
		context.instance.ZoomUserData[zoomId].userRole = data.args[4].value
	} else {
		return
	}

	if (data.args[4].value === UserRole.Participant) {
		const index = context.instance.ZoomGroupData[0].users.findIndex((id) => id !== null && id.zoomID === zoomId)
		if (index > -1) {
			context.instance.ZoomGroupData[0].users.splice(index, 1)
			setVariables(context.instance, (variables) => updateHostGroupVariables(context.instance, variables))
			checkGroupFeedbacks(context.instance)
			context.setUpdateLoop(true)
		}
	} else if (data.args[4].value === UserRole.Host || data.args[4].value === UserRole.CoHost) {
		const index = context.instance.ZoomGroupData[0].users.findIndex((id) => id !== null && id.zoomID === zoomId)
		if (index === -1) {
			context.instance.ZoomGroupData[0].users.push({
				zoomID: zoomId,
				userName: data.args[1].value,
			})
			context.instance.log('debug', `added host: ${data.args[1].value}`)
			setVariables(context.instance, (variables) => updateHostGroupVariables(context.instance, variables))
			checkGroupFeedbacks(context.instance)
			context.setUpdateLoop(true)
		}
	}
}

function handleIsSpeaking(context: OSCHandlerContext, data: ZoomOSCResponse): void {
	context.instance.ZoomClientDataObj.isSpeaking = data.args[1].value
	setVariables(context.instance, (variables) => updateIsSpeakingVariable(context.instance, variables))
}

function handleShareStatus(context: OSCHandlerContext, data: ZoomOSCResponse): void {
	const shareType = data.args[4].value
	const variables: CompanionVariableValues = {
		videoShareStatus: shareType === 'videoShareStarted' ? 'On' : 'Off',
	}
	context.instance.setVariableValues(variables)
}

export async function handleUserMessage(
	context: OSCHandlerContext,
	data: ZoomOSCResponse,
	zoomPart2: string,
	zoomPart3: string | undefined,
): Promise<void> {
	const zoomId = parseInt(data.args[3].value)

	if (zoomPart2 === 'me') {
		context.instance.ZoomMeData = {
			zoomId,
			userName: data.args[1].value,
		}
	}

	await ensureZoomUser(context, data, zoomId)

	switch (zoomPart3) {
		case 'spotlightOn':
			handleSpotlightState(context, data, zoomId, true)
			break
		case 'spotlightOff':
			handleSpotlightState(context, data, zoomId, false)
			break
		case 'list':
		case 'online':
			await context.createZoomUser(data)
			context.setUpdateLoop(true)
			break
		case 'activeSpeaker':
			handleActiveSpeaker(context, data)
			break
		case 'videoOn':
			handleVideoState(context, zoomId, true)
			break
		case 'videoOff':
			handleVideoState(context, zoomId, false)
			break
		case 'mute':
			handleMuteState(context, zoomId, true)
			break
		case 'unMute':
			handleMuteState(context, zoomId, false)
			break
		case 'handRaised':
			handleHandRaisedState(context, zoomId, true)
			break
		case 'handLowered':
			handleHandRaisedState(context, zoomId, false)
			break
		case 'offline':
			handleOffline(context, zoomId)
			break
		case 'userNameChanged':
			handleUserNameChanged(context, data, zoomId)
			break
		case 'chat':
			await handleChat(context, data)
			break
		case 'askedQuestion':
			await handleAskedQuestion(context, data)
			break
		case 'audioStatus':
		case 'stoppedSpeaking':
			break
		case 'roleChanged':
			handleRoleChanged(context, data, zoomId)
			break
		case 'isSpeaking':
			handleIsSpeaking(context, data)
			break
		case 'shareStatus':
			handleShareStatus(context, data)
			break
		default:
			break
	}
}

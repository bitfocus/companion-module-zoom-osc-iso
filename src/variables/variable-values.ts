import { CompanionVariableValues } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, padding, userExist } from '../utils.js'

enum engineState {
	disabled = 'disabled',
	standby = 'standby',
	enabled = 'enabled',
}

export function updateHandRaisedCountVariable(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	variables['handRaisedCount'] = Object.values(instance.ZoomUserData).filter((user) => user.handRaised).length
}

export function updateVideoOnCountVariable(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	variables['videoOnCount'] = Object.values(instance.ZoomUserData).filter((user) => user.videoOn).length
}

export function updateActiveSpeakerVariable(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	variables['activeSpeaker'] = instance.ZoomClientDataObj.activeSpeaker
	variables['activeSpeakerZoomId'] = instance.ZoomClientDataObj.activeSpeakerZoomId
}

export function updateIsSpeakingVariable(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	variables['isSpeaking'] = instance.ZoomClientDataObj.isSpeaking
}

export function updateHostGroupVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	updateGroupVariables(instance, variables, 0)
}

export function updateSpotlightGroupInitalizedVariable(variables: CompanionVariableValues): void {
	variables['spotlightGroupTrackingInitalized'] = true
}

export function updateSpotlightGroupVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	updateGroupVariables(instance, variables, 1)
}

export function updateZoomIsoEngineVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	if (instance.ZoomClientDataObj.engineState === -1) {
		variables['engineState'] = 'no engine found'
		variables['engineStateNumber'] = -1
	} else if (instance.ZoomClientDataObj.engineState === 0) {
		variables['engineState'] = engineState.disabled
		variables['engineStateNumber'] = 0
	} else if (instance.ZoomClientDataObj.engineState === 1) {
		variables['engineState'] = engineState.standby
		variables['engineStateNumber'] = 1
	} else if (instance.ZoomClientDataObj.engineState === 2) {
		variables['engineState'] = engineState.enabled
		variables['engineStateNumber'] = 2
	}
}

export function updateZoomIsoOutputVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	for (const key in instance.ZoomOutputData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomOutputData, key)) {
			const output = instance.ZoomOutputData[key]
			variables[`Output${output.outputNumber}name`] = output.outputName
			variables[`Output${output.outputNumber}resolution`] = output.resolution
			variables[`Output${output.outputNumber}mode`] = output.mode
			variables[`Output${output.outputNumber}status`] = output.status
			variables[`Output${output.outputNumber}selection`] = output.selection
			try {
				if (output.mode === 'Participant') {
					const zoomID = output.selection as number
					variables[`Output${output.outputNumber}zoomId`] = zoomID
					variables[`Output${output.outputNumber}Name`] = userExist(zoomID, instance.ZoomUserData)
						? instance.ZoomUserData[zoomID].userName
						: '-'
				} else if (output.mode === 'Gallery Position') {
					const zoomID = instance.ZoomClientDataObj.galleryOrder[output.selection as number]
					variables[`Output${output.outputNumber}zoomId`] = zoomID
					variables[`Output${output.outputNumber}Name`] = userExist(zoomID, instance.ZoomUserData)
						? instance.ZoomUserData[zoomID].userName
						: '-'
				} else if (output.mode === 'Spotlight') {
					const user = instance.ZoomGroupData[1].users[output.selection as number]
					if (user) {
						variables[`Output${output.outputNumber}zoomId`] = user.zoomID
						variables[`Output${output.outputNumber}Name`] = userExist(user.zoomID, instance.ZoomUserData)
							? user.userName
							: '-'
					} else {
						variables[`Output${output.outputNumber}zoomId`] = -1
						variables[`Output${output.outputNumber}Name`] = '-'
					}
				} else if (output.mode === 'Active Speaker') {
					variables[`Output${output.outputNumber}zoomId`] = instance.ZoomClientDataObj.activeSpeakerZoomId
					variables[`Output${output.outputNumber}Name`] = instance.ZoomClientDataObj.activeSpeaker
				} else {
					variables[`Output${output.outputNumber}zoomId`] = -1
					variables[`Output${output.outputNumber}Name`] = '-'
				}

				// instance.log(
				// 	'debug',
				// 	`Output ${key} Mode: ${output.mode} ZoomID: ${variables[`Output${output.outputNumber}zoomId`]} Name: ${variables[`Output${output.outputNumber}Name`]}`,
				// )
			} catch (error) {
				instance.log('error', `Error in updateZoomIsoOutputVariables: ${error}`)
				variables[`Output${output.outputNumber}zoomId`] = -1
				variables[`Output${output.outputNumber}Name`] = '-'
			}
		}
	}
}

export function updateZoomIsoAudioRoutingVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	for (const key in instance.ZoomAudioRoutingData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomAudioRoutingData, key)) {
			const output = instance.ZoomAudioRoutingData[key]
			variables[`OutputAudio${output.channel}name`] = output.audio_device
			variables[`OutputAudio${output.channel}mode`] = output.mode
		}
	}
}

export function updateZoomIsoAudioLevelVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	for (const key in instance.ZoomAudioLevelData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomAudioLevelData, key)) {
			const channel = instance.ZoomAudioLevelData[key]
			variables[`Channel${key}`] = channel.level
		}
	}
}

export function updateSelectedCallersVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	if (instance.ZoomClientDataObj.selectedCallers.length === 0) {
		variables['selectedCallers'] = 'nothing selected'
		variables['selectedNumberOfCallers'] = '0'
	} else {
		const selectedCallers: string[] = []
		instance.ZoomClientDataObj.selectedCallers.forEach((zoomID: number) => {
			// not sure why this if statement is here
			if (zoomID < instance.ZoomClientDataObj.numberOfGroups + 2) {
				if (userExist(zoomID, instance.ZoomUserData)) {
					instance.ZoomUserData[zoomID].users.forEach((user: string | number) => {
						selectedCallers.push(instance.ZoomUserData[user as number].userName)
					})
				}
			} else {
				if (userExist(zoomID, instance.ZoomUserData)) {
					selectedCallers.push(instance.ZoomUserData[zoomID].userName)
				}
			}
		})
		variables['selectedCallers'] = selectedCallers.toString()
		variables['selectedNumberOfCallers'] = selectedCallers.length
	}
}

export function updateGroupVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
	index: number,
): void {
	let allUsers = ''
	const group: { users: any[]; groupName: string | number | undefined } = instance.ZoomGroupData[index]
	variables[`CallersInGroup${index}`] = group.users?.length
	variables[`Group${index}`] = group.groupName

	for (let userIndex = 0; userIndex < (group.users?.length ?? 0); userIndex++) {
		const user = group.users[userIndex]
		allUsers += userExist(Number(user.zoomID), instance.ZoomUserData)
			? instance.ZoomUserData[user.zoomID as number].userName + ', '
			: ''
	}

	for (let position = 1; position <= 1000; position++) {
		variables[`Group${index}Position${position}`] =
			group.users && group.users[position - 1] ? group.users[position - 1].userName : '-'
	}

	variables[`InsideGroup${index}`] = allUsers
}

export function updateGalleryCountVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	variables['galleryCount'] = instance.ZoomClientDataObj.galleryCount
}

export function updateGalleryVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	for (let index = 1; index < 50; index++) {
		const zoomID = instance.ZoomClientDataObj.galleryOrder[index - 1]
		variables[`GalleryPosition${padding(index, 2)}`] = userExist(Number(zoomID), instance.ZoomUserData)
			? instance.ZoomUserData[zoomID].userName
			: '-'
	}

	updateGalleryCountVariables(instance, variables)
}

export function updateAllGroupVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	// This covers all groups including host (group 0) and spotlight (group 1)
	for (let index = 0; index < instance.ZoomGroupData.length; index++) {
		updateGroupVariables(instance, variables, index)
	}
}

export function updateZoomParticipantVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	if (instance.config.enableVariablesForParticipants) {
		// Use the participant selection
		for (let index = 1; index <= 1000; index++) {
			variables[`Participant${padding(index, 3)}`] = instance.ZoomVariableLink[index - 1]
				? instance.ZoomVariableLink[index - 1].userName
				: '-'
		}
	}
}

export function updateZoomUserVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	if (instance.config.enableVariablesForEachUser) {
		// "normal" users
		for (const key in instance.ZoomUserData) {
			if (userExist(Number(key), instance.ZoomUserData)) {
				const user = instance.ZoomUserData[key]
				variables[user.zoomId.toString()] = user.userName
			}
		}
	}
}

export function updateAllUserBasedVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	updateAllGroupVariables(instance, variables)
	updateZoomParticipantVariables(instance, variables)
	updateSelectedCallersVariables(instance, variables)
	updateGalleryVariables(instance, variables)
	updateZoomUserVariables(instance, variables)
	updateNumberOfUsers(instance, variables)
	updateVideoOnCountVariable(instance, variables)
	updateHandRaisedCountVariable(instance, variables)
}

export function updateCallStatusVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	variables: CompanionVariableValues,
): void {
	variables['callStatusNumber'] = instance.ZoomClientDataObj.callStatus
	variables['callStatus'] =
		instance.ZoomClientDataObj.callStatus === 0 || instance.ZoomClientDataObj.callStatus === 7
			? 'offline'
			: 'In meeting'
}

export function updateZoomOscVersion(instance: InstanceBaseExt<ZoomConfig>, variables: CompanionVariableValues): void {
	variables['zoomVersion'] = instance.ZoomClientDataObj.zoomOSCVersion
}

export function updateNumberOfUsers(instance: InstanceBaseExt<ZoomConfig>, variables: CompanionVariableValues): void {
	variables['numberOfUsers'] = Object.keys(instance.ZoomUserData).length
}

export function updateVariableValues(instance: InstanceBaseExt<ZoomConfig>): void {
	// instance.log('debug', `updateVariableValues ${new Date()}`)
	const variables: CompanionVariableValues = {
		numberOfGroups: instance.ZoomClientDataObj.numberOfGroups,
		videoShareStatus: 'Off',
		spotlightGroupTrackingInitalized: false,
	}

	updateZoomOscVersion(instance, variables)
	updateNumberOfUsers(instance, variables)
	updateCallStatusVariables(instance, variables)
	updateIsSpeakingVariable(instance, variables)
	updateZoomIsoEngineVariables(instance, variables)
	updateZoomIsoAudioLevelVariables(instance, variables)
	updateZoomIsoAudioRoutingVariables(instance, variables)
	updateZoomIsoOutputVariables(instance, variables)
	updateActiveSpeakerVariable(instance, variables)
	updateHandRaisedCountVariable(instance, variables)
	updateVideoOnCountVariable(instance, variables)
	updateSelectedCallersVariables(instance, variables)
	updateGalleryCountVariables(instance, variables)
	updateGalleryVariables(instance, variables)
	updateAllGroupVariables(instance, variables)
	updateZoomUserVariables(instance, variables)

	updateZoomParticipantVariables(instance, variables)

	instance.setVariableValues(variables)
}

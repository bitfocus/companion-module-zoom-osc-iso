import { CompanionVariableValues } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, padding, userExist } from '../utils.js'

enum engineState {
	disabled = 'disabled',
	standby = 'standby',
	enabled = 'enabled',
}

export function getHandRaisedCount(instance: InstanceBaseExt<ZoomConfig>): number {
	return Object.values(instance.ZoomUserData).filter((user) => user.handRaised).length
}

export function getVideoOnCount(instance: InstanceBaseExt<ZoomConfig>): number {
	return Object.values(instance.ZoomUserData).filter((user) => user.videoOn).length
}

export function getActiveSpeaker(instance: InstanceBaseExt<ZoomConfig>): string {
	return instance.ZoomClientDataObj.activeSpeaker
}

export function getSpotlightVariables(instance: InstanceBaseExt<ZoomConfig>): CompanionVariableValues {
	const variables: CompanionVariableValues = {}
	const index = 1
	let allUsers = ''
	const group = instance.ZoomGroupData[index]
	variables[`CallersInGroup${index}`] = group.users?.length
	variables[`Group${index}`] = group.groupName
	group.users?.forEach((user: { zoomID: string | number }) => {
		allUsers += userExist(Number(user.zoomID), instance.ZoomUserData)
			? instance.ZoomUserData[user.zoomID as number].userName + ' '
			: ''
	})
	for (let position = 1; position < 50; position++) {
		variables[`Group${index}Position${position}`] = group.users[position - 1] ? group.users[position - 1].userName : '-'
	}
	variables[`InsideGroup${index}`] = allUsers
	allUsers = '' // reset values
	return variables
}

export function updateVariableValues(instance: InstanceBaseExt<ZoomConfig>): void {
	const variables: CompanionVariableValues = {}

	// Zoom ISO
	if (instance.ZoomClientDataObj.engineState === -1) {
		variables['engineState'] = 'no engine found'
	} else if (instance.ZoomClientDataObj.engineState === 0) {
		variables['engineState'] = engineState.disabled
	} else if (instance.ZoomClientDataObj.engineState === 1) {
		variables['engineState'] = engineState.standby
	} else if (instance.ZoomClientDataObj.engineState === 2) {
		variables['engineState'] = engineState.enabled
	}

	for (const key in instance.ZoomOutputData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomOutputData, key)) {
			const output = instance.ZoomOutputData[key]
			variables[`Output${output.outputNumber}name`] = output.outputName
			variables[`Output${output.outputNumber}resolution`] = output.resolution
			variables[`Output${output.outputNumber}mode`] = output.mode
			variables[`Output${output.outputNumber}status`] = output.status
		}
	}
	for (const key in instance.ZoomAudioRoutingData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomAudioRoutingData, key)) {
			const output = instance.ZoomAudioRoutingData[key]
			variables[`Output${output.channel}name`] = output.audio_device
			variables[`Output${output.channel}mode`] = output.mode
		}
	}
	for (const key in instance.ZoomAudioLevelData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomAudioLevelData, key)) {
			const channel = instance.ZoomAudioLevelData[key]
			variables[`Channel${key}`] = channel.level
		}
	}

	// END Zoom ISO

	if (instance.ZoomClientDataObj.selectedCallers.length === 0) {
		variables['selectedCallers'] = 'nothing selected'
		variables['selectedNumberOfCallers'] = '0'
	} else {
		const selectedCallers: string[] = []
		instance.ZoomClientDataObj.selectedCallers.forEach((zoomID: number) => {
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
	variables['zoomVersion'] = instance.ZoomClientDataObj.zoomOSCVersion
	variables['callStatus'] = instance.ZoomClientDataObj.callStatus == 1 ? 'In meeting' : 'offline'
	variables['numberOfGroups'] = instance.ZoomClientDataObj.numberOfGroups
	variables['numberOfUsers'] = Object.keys(instance.ZoomUserData).length
	variables['isSpeaking'] = instance.ZoomClientDataObj.isSpeaking
	variables['activeSpeaker'] = getActiveSpeaker(instance)

	let allUsers = ''
	instance.ZoomGroupData.forEach((group: { users: any[]; groupName: string | number | undefined }, index: number) => {
		variables[`CallersInGroup${index}`] = group.users?.length
		variables[`Group${index}`] = group.groupName
		group.users?.forEach((user: { zoomID: string | number }) => {
			allUsers += userExist(Number(user.zoomID), instance.ZoomUserData)
				? instance.ZoomUserData[user.zoomID as number].userName + ' '
				: ''
		})
		for (let position = 1; position < 50; position++) {
			variables[`Group${index}Position${position}`] = group.users[position - 1]
				? group.users[position - 1].userName
				: '-'
		}
		variables[`InsideGroup${index}`] = allUsers
		allUsers = '' // reset values
	})
	// "normal" users
	for (const key in instance.ZoomUserData) {
		if (userExist(Number(key), instance.ZoomUserData)) {
			const user = instance.ZoomUserData[key]
			variables[user.zoomId.toString()] = user.userName
		}
	}
	// Use the participant selection
	for (let index = 1; index < 1000; index++) {
		variables[`Participant${padding(index, 3)}`] = instance.ZoomVariableLink[index - 1]
			? instance.ZoomVariableLink[index - 1].userName
			: '-'
	}
	variables['galleryCount'] = instance.ZoomClientDataObj.galleryCount

	for (let index = 1; index < 50; index++) {
		const zoomID = instance.ZoomClientDataObj.galleryOrder[index - 1]
		variables[`GalleryPosition${padding(index, 2)}`] = userExist(Number(zoomID), instance.ZoomUserData)
			? instance.ZoomUserData[zoomID].userName
			: '-'
	}

	variables['videoOnCount'] = getVideoOnCount(instance)
	variables['handRaisedCount'] = getHandRaisedCount(instance)
	instance.setVariableValues(variables)
}

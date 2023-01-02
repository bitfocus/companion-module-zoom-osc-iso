import { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'
import { ZoomConfig } from './config'
import { InstanceBaseExt } from './utils'

enum engineState {
	disabled = 'disabled',
	standby = 'standby',
	enabled = 'enabled',
}

export function updateVariables(instance: InstanceBaseExt<ZoomConfig>): void {
	const variables: CompanionVariableValues = {}

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
	if (instance.ZoomClientDataObj.selectedCallers.length === 0) {
		variables['selectedCallers'] = 'nothing selected'
		variables['selectedNumberOfCallers'] = '0'
	} else {
		let selectedCallers: string[] = []
		instance.ZoomClientDataObj.selectedCallers.forEach((zoomID: number) => {
			if (zoomID < instance.ZoomClientDataObj.numberOfGroups + 1) {
				if (instance.ZoomUserData[zoomID]) {
					instance.ZoomUserData[zoomID].users.forEach((user: string | number) => {
						selectedCallers.push(instance.ZoomUserData[user].userName)
					})
				}
			} else {
				if (instance.ZoomUserData[zoomID]) {
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
	variables['activeSpeaker'] = instance.ZoomClientDataObj.activeSpeaker
	if (instance.ZoomClientDataObj.engineState === -1) {
		variables['engineState'] = 'no engine found'
	} else if (instance.ZoomClientDataObj.engineState === 0) {
		variables['engineState'] = engineState.disabled
	} else if (instance.ZoomClientDataObj.engineState === 1) {
		variables['engineState'] = engineState.standby
	} else if (instance.ZoomClientDataObj.engineState === 2) {
		variables['engineState'] = engineState.enabled
	}

	let allUsers = ''
	instance.ZoomGroupData.forEach((group: { users: any[]; groupName: string | number | undefined }, index: number) => {
		variables[`CallersInGroup${index + 1}`] = group.users?.length
		variables[`Group${index + 1}`] = group.groupName
		group.users?.forEach((user: { zoomID: string | number }) => {
			allUsers += instance.ZoomUserData[user.zoomID].userName + ' '
		})
		for (let position = 1; position < 50; position++) {
			variables[`Group${index + 1}Position${position}`] = group.users[position - 1]
				? group.users[position - 1].userName
				: '-'
		}
		variables[`InsideGroup${index + 1}`] = allUsers
		allUsers = '' // reset values
	})
	// "normal" users
	for (const key in instance.ZoomUserData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
			const user = instance.ZoomUserData[key]
			variables[user.zoomId.toString()] = user.userName
		}
	}
	// Use the participant selection
	for (let index = 1; index < 1000; index++) {
		variables[`Participant${index}`] = instance.ZoomVariableLink[index - 1]
			? instance.ZoomVariableLink[index - 1].userName
			: '-'
	}
	variables['galleryCount'] = instance.ZoomClientDataObj.galleryCount

	for (let index = 1; index < 50; index++) {
		const zoomID = instance.ZoomClientDataObj.galleryOrder[index - 1]
		variables[`Gallery position ${index}`] = instance.ZoomUserData[zoomID]
			? instance.ZoomUserData[zoomID].userName
			: '-'
	}

	instance.setVariableValues(variables)
}

export function InitVariables(instance: InstanceBaseExt<ZoomConfig>): void {
	const globalSettings: Set<CompanionVariableDefinition> = new Set([
		// Status
		{ name: 'Zoom version', variableId: 'zoomVersion' },
		{ name: 'Call Status', variableId: 'callStatus' },
		{ name: 'Engine Status', variableId: 'engineState' },
		{ name: 'Selected callers/groups', variableId: 'selectedCallers' },
		{ name: 'Selected number of callers/groups', variableId: 'selectedNumberOfCallers' },
		{ name: 'Number of selectable groups', variableId: 'numberOfGroups' },
		{ name: 'Number of users in call', variableId: 'numberOfUsers' },
		{ name: 'Is speaking', variableId: 'isSpeaking' },
		{ name: 'Active speaking', variableId: 'activeSpeaker' },
	])
	// Groups
	let groupPositionVariables = []
	let userVariables = []
	let outputVariables = []
	let audioLevelVariables = []
	for (let index = 0; index < instance.ZoomGroupData.length; index++) {
		for (let position = 1; position < 50; position++) {
			groupPositionVariables.push({
				name: `Group${index + 1} Position ${position}`,
				variableId: `Group${index + 1}Position${position}`,
			})
		}
		userVariables.push({
			name: `Inside group`,
			variableId: `InsideGroup${index + 1}`,
		})
		userVariables.push({ name: `name`, variableId: `Group${index + 1}` })
		userVariables.push({
			name: `Callers In Group ${index + 1}`,
			variableId: `CallersInGroup${index + 1}`,
		})
	}
	for (const key in instance.ZoomUserData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
			const user = instance.ZoomUserData[key]
			if (user.zoomId > instance.ZoomClientDataObj.numberOfGroups)
				userVariables.push({ name: `name`, variableId: user.zoomId.toString() })
		}
	}
	for (const key in instance.ZoomOutputData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomOutputData, key)) {
			const output = instance.ZoomOutputData[key]
			outputVariables.push({
				name: `Output ${output.outputNumber} name`,
				variableId: `Output${output.outputNumber}name`,
			})
			outputVariables.push({
				name: `Output ${output.outputNumber} resolution`,
				variableId: `Output${output.outputNumber}resolution`,
			})
			outputVariables.push({
				name: `Output ${output.outputNumber} mode`,
				variableId: `Output${output.outputNumber}mode`,
			})
			outputVariables.push({
				name: `Output ${output.outputNumber} status`,
				variableId: `Output${output.outputNumber}status`,
			})
		}
	}

	for (const key in instance.ZoomAudioRoutingData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomAudioRoutingData, key)) {
			const audioOutput = instance.ZoomAudioRoutingData[key]
			outputVariables.push({
				name: `Output ${audioOutput.channel} name`,
				variableId: `Output${audioOutput.channel}name`,
			})
			outputVariables.push({
				name: `Output ${audioOutput.channel} mode`,
				variableId: `Output${audioOutput.channel}mode`,
			})
		}
	}

	for (const key in instance.ZoomAudioLevelData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomAudioLevelData, key)) {
			// const channel = instance.ZoomAudioLevelData[key]
			audioLevelVariables.push({
				name: `Channel ${key} audiolevel`,
				variableId: `Channel${key}`,
			})
		}
	}
	let galleryVariables = []
	for (let index = 1; index < 50; index++) {
		galleryVariables.push({
			name: `Gallery position ${index}`,
			variableId: `Gallery position ${index}`,
		})
	}
	let selectUsersVariables = []
	for (let index = 1; index < 1000; index++) {
		selectUsersVariables.push({
			name: `Participant ${index}`,
			variableId: `Participant${index}`,
		})
	}
	const galleryVariablesDef: Set<CompanionVariableDefinition> = new Set(galleryVariables)
	const userVariablesDef: Set<CompanionVariableDefinition> = new Set(userVariables)
	const outputVariablesDef: Set<CompanionVariableDefinition> = new Set(outputVariables)
	const audioLevelVariablesDef: Set<CompanionVariableDefinition> = new Set(audioLevelVariables)
	const groupPositionVariablesDef: Set<CompanionVariableDefinition> = new Set(groupPositionVariables)
	const gallery: Set<CompanionVariableDefinition> = new Set([{ name: 'gallery count', variableId: 'galleryCount' }])

	let filteredVariables = [
		...outputVariablesDef,
		...audioLevelVariablesDef,
		...globalSettings,
		...userVariablesDef,
		...gallery,
		...galleryVariablesDef,
		...selectUsersVariables,
		...groupPositionVariablesDef,
	]

	instance.setVariableDefinitions(filteredVariables)
}

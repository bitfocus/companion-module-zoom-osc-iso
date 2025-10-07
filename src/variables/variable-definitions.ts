import { CompanionVariableDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, padding, userExist } from '../utils.js'

export function initVariableDefinitions(instance: InstanceBaseExt<ZoomConfig>): void {
	// instance.log('debug', `initVariableDefinitions ${new Date()}`)
	const globalSettings: Set<CompanionVariableDefinition> = new Set([
		// Status
		{ name: 'Zoom version', variableId: 'zoomVersion' },
		{ name: 'Call Status', variableId: 'callStatus' },
		{
			name: 'Call Status Number (only accurate when joining or leaving meeting.  See module help for details)',
			variableId: 'callStatusNumber',
		},
		{ name: 'Engine Status', variableId: 'engineState' },
		{ name: 'Selected callers/groups', variableId: 'selectedCallers' },
		{ name: 'Selected number of callers/groups', variableId: 'selectedNumberOfCallers' },
		{ name: 'Number of selectable groups', variableId: 'numberOfGroups' },
		{ name: 'Number of users in call', variableId: 'numberOfUsers' },
		{ name: 'Is speaking', variableId: 'isSpeaking' },
		{ name: 'Active speaking', variableId: 'activeSpeaker' },
		{ name: 'Video On Count', variableId: 'videoOnCount' },
		{ name: 'Hands Raised Count', variableId: 'handRaisedCount' },
		{ name: 'Share Screen On/Off', variableId: 'videoShareStatus' },
		{ name: 'Spotlight Group Tracking Initalized', variableId: 'spotlightGroupTrackingInitalized' },
	])
	// Groups
	const groupPositionVariables = []
	const userVariables = []
	const outputVariables = []
	const audioLevelVariables = []
	groupPositionVariables.push({
		name: `Group${0} Position ${1}`,
		variableId: `Group${0}Position${1}`,
	})
	groupPositionVariables.push({
		name: `Group${1} Position ${1}`,
		variableId: `Group${1}Position${1}`,
	})
	userVariables.push({ name: `name`, variableId: `Group0` })
	userVariables.push({
		name: 'Callers In Host Group',
		variableId: 'CallersInGroup0',
	})

	userVariables.push({ name: `name`, variableId: `Group1` })
	userVariables.push({
		name: 'Callers In Spotlight Group',
		variableId: 'CallersInGroup1',
	})
	for (let index = 2; index < instance.ZoomGroupData.length; index++) {
		for (let position = 1; position < 2; position++) {
			groupPositionVariables.push({
				name: `Group${index} Position ${position}`,
				variableId: `Group${index}Position${position}`,
			})
		}
		userVariables.push({
			name: `Inside group`,
			variableId: `InsideGroup${index}`,
		})
		userVariables.push({ name: `name`, variableId: `Group${index}` })
		userVariables.push({
			name: `Callers In Group ${index}`,
			variableId: `CallersInGroup${index}`,
		})
	}

	if (instance.config.enableVariablesForEachUser) {
		Object.entries(instance.ZoomUserData).forEach(([key, user]) => {
			const zoomId = Number(key)

			if (userExist(zoomId, instance.ZoomUserData)) {
				//&& user.zoomId > instance.ZoomClientDataObj.numberOfGroups) {
				userVariables.push({ name: `name`, variableId: user.zoomId.toString() })
			}
		})
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
				name: `Output Audio Channel ${audioOutput.channel} name`,
				variableId: `OutputAudio${audioOutput.channel}name`,
			})
			outputVariables.push({
				name: `Output Audio Channel ${audioOutput.channel} mode`,
				variableId: `OutputAudio${audioOutput.channel}mode`,
			})
		}
	}

	for (const key in instance.ZoomAudioLevelData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomAudioLevelData, key)) {
			audioLevelVariables.push({
				name: `Channel ${key} audiolevel`,
				variableId: `Channel${key}`,
			})
		}
	}
	const galleryVariables = []

	galleryVariables.push({
		name: `Gallery Position ${1}`,
		variableId: `GalleryPosition${padding(1, 2)}`,
	})
	const selectUsersVariables = []

	if (instance.config.enableVariablesForParticipants) {
		selectUsersVariables.push({
			name: `Participant ${1}`,
			variableId: `Participant${padding(1, 3)}`,
		})
	}

	selectUsersVariables.push({
		name: `Waiting Room Participant ${1}`,
		variableId: `WaitingRoomParticipant${padding(1, 3)}`,
	})

	const galleryVariablesDef: Set<CompanionVariableDefinition> = new Set(galleryVariables)
	const userVariablesDef: Set<CompanionVariableDefinition> = new Set(userVariables)
	const outputVariablesDef: Set<CompanionVariableDefinition> = new Set(outputVariables)
	const audioLevelVariablesDef: Set<CompanionVariableDefinition> = new Set(audioLevelVariables)
	const groupPositionVariablesDef: Set<CompanionVariableDefinition> = new Set(groupPositionVariables)
	const gallery: Set<CompanionVariableDefinition> = new Set([{ name: 'gallery count', variableId: 'galleryCount' }])

	const filteredVariables = [
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

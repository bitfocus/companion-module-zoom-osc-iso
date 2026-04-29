import type { CompanionVariableDefinitions, CompanionVariableValues } from '@companion-module/base'
import type { ZoomConfig } from '../config.js'
import { type InstanceBaseExt, padding, userExist } from '../utils.js'

export type VariablesSchema = CompanionVariableValues

export function initVariableDefinitions(instance: InstanceBaseExt<ZoomConfig>): void {
	// instance.log('debug', `initVariableDefinitions ${new Date()}`)
	const definitions: CompanionVariableDefinitions<VariablesSchema> = {}
	const defineVariable = (variableId: string, name: string): void => {
		definitions[variableId] = { name }
	}

	// Status
	defineVariable('zoomVersion', 'Zoom version')
	defineVariable('callStatus', 'Call Status')
	defineVariable(
		'callStatusNumber',
		'Call Status Number (only accurate when joining or leaving meeting.  See module help for details)',
	)
	defineVariable('engineState', 'Engine Status')
	defineVariable('selectedCallers', 'Selected callers/groups')
	defineVariable('selectedNumberOfCallers', 'Selected number of callers/groups')
	defineVariable('numberOfGroups', 'Number of selectable groups')
	defineVariable('numberOfUsers', 'Number of users in call')
	defineVariable('isSpeaking', 'Is speaking')
	defineVariable('activeSpeaker', 'Active speaking')
	defineVariable('videoOnCount', 'Video On Count')
	defineVariable('handRaisedCount', 'Hands Raised Count')
	defineVariable('videoShareStatus', 'Share Screen On/Off')
	defineVariable('spotlightGroupTrackingInitalized', 'Spotlight Group Tracking Initalized')
	defineVariable('isPro', 'Is Pro License')
	defineVariable('galleryCount', 'gallery count')

	// Groups
	defineVariable(`Group${0}Position${1}`, `Group${0} Position ${1}`)
	defineVariable(`Group${1}Position${1}`, `Group${1} Position ${1}`)
	defineVariable(`Group0`, 'name')
	defineVariable('CallersInGroup0', 'Callers In Host Group')
	defineVariable(`Group1`, 'name')
	defineVariable('CallersInGroup1', 'Callers In Spotlight Group')
	for (let index = 2; index < instance.ZoomGroupData.length; index++) {
		for (let position = 1; position < 2; position++) {
			defineVariable(`Group${index}Position${position}`, `Group${index} Position ${position}`)
		}
		defineVariable(`InsideGroup${index}`, `Inside group`)
		defineVariable(`Group${index}`, 'name')
		defineVariable(`CallersInGroup${index}`, `Callers In Group ${index}`)
	}

	if (instance.config.enableVariablesForEachUser) {
		Object.entries(instance.ZoomUserData).forEach(([key, user]) => {
			const zoomId = Number(key)

			if (userExist(zoomId, instance.ZoomUserData)) {
				defineVariable(user.zoomId.toString(), 'name')
			}
		})
	}

	for (const key in instance.ZoomOutputData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomOutputData, key)) {
			const output = instance.ZoomOutputData[key]
			defineVariable(`Output${output.outputNumber}name`, `Output ${output.outputNumber} name`)
			defineVariable(`Output${output.outputNumber}resolution`, `Output ${output.outputNumber} resolution`)
			defineVariable(`Output${output.outputNumber}mode`, `Output ${output.outputNumber} mode`)
			defineVariable(`Output${output.outputNumber}status`, `Output ${output.outputNumber} status`)
		}
	}

	for (const key in instance.ZoomAudioRoutingData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomAudioRoutingData, key)) {
			const audioOutput = instance.ZoomAudioRoutingData[key]
			defineVariable(`OutputAudio${audioOutput.channel}name`, `Output Audio Channel ${audioOutput.channel} name`)
			defineVariable(`OutputAudio${audioOutput.channel}mode`, `Output Audio Channel ${audioOutput.channel} mode`)
		}
	}

	for (const key in instance.ZoomAudioLevelData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomAudioLevelData, key)) {
			defineVariable(`Channel${key}`, `Channel ${key} audiolevel`)
		}
	}
	defineVariable(`GalleryPosition${padding(1, 2)}`, `Gallery Position ${1}`)

	if (instance.config.enableVariablesForParticipants) {
		defineVariable(`Participant${padding(1, 3)}`, `Participant ${1}`)
	}

	instance.setVariableDefinitions(definitions)
}

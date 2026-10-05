import type ModuleInstance from '../index.js'
import type { CompanionVariableDefinitions } from '@companion-module/base'
import { padding, userExist } from '../utils.js'
import { participantIcons } from '../participant-icons.js'

/** One value type for every variable, because most writes go through computed (template-literal) ids */
export type VariableValue = string | number | boolean | undefined

/**
 * Every variable id this module defines or writes.
 * Static ids are optional so definitions and value bags can be built incrementally.
 * Some families are written for more ids than are defined (e.g. Group positions 2..1000); that is
 * existing behaviour and relies on instanceOptions.disableVariableValidation.
 */
export type VariablesSchema = {
	zoomVersion?: VariableValue
	callStatus?: VariableValue
	callStatusNumber?: VariableValue
	engineState?: VariableValue
	engineStateNumber?: VariableValue
	selectedCallers?: VariableValue
	selectedNumberOfCallers?: VariableValue
	numberOfGroups?: VariableValue
	numberOfUsers?: VariableValue
	isSpeaking?: VariableValue
	activeSpeaker?: VariableValue
	activeSpeakerZoomId?: VariableValue
	videoOnCount?: VariableValue
	handRaisedCount?: VariableValue
	videoShareStatus?: VariableValue
	spotlightGroupTrackingInitalized?: VariableValue
	isPro?: VariableValue
	galleryCount?: VariableValue
	// participant status icons (data URIs) used by the layered participant presets
	icon_mic_on?: VariableValue
	icon_mic_off?: VariableValue
	icon_camera_on?: VariableValue
	icon_camera_off?: VariableValue
	icon_hand_raised?: VariableValue
	icon_hand_lowered?: VariableValue
	// groups
	[group: `Group${number}`]: VariableValue
	[groupPosition: `Group${number}Position${number}`]: VariableValue
	[callersInGroup: `CallersInGroup${number}`]: VariableValue
	[insideGroup: `InsideGroup${number}`]: VariableValue
	// one variable per participant, keyed by zoom id
	[zoomId: `${number}`]: VariableValue
	// ZoomISO outputs and audio
	[outputName: `Output${number}name`]: VariableValue
	[outputResolution: `Output${number}resolution`]: VariableValue
	[outputMode: `Output${number}mode`]: VariableValue
	[outputStatus: `Output${number}status`]: VariableValue
	[outputSelection: `Output${number}selection`]: VariableValue
	[outputZoomId: `Output${number}zoomId`]: VariableValue
	[outputUserName: `Output${number}Name`]: VariableValue
	[outputAudioName: `OutputAudio${number}name`]: VariableValue
	[outputAudioMode: `OutputAudio${number}mode`]: VariableValue
	[channelLevel: `Channel${string}`]: VariableValue
	// gallery and participant positions (zero-padded)
	[galleryPosition: `GalleryPosition${string}`]: VariableValue
	[participant: `Participant${string}`]: VariableValue
}

/** A bag of variable values to pass to setVariableValues */
export type VariableValues = Partial<VariablesSchema>

export function initVariableDefinitions(instance: ModuleInstance): void {
	// instance.log('debug', `initVariableDefinitions ${new Date()}`)
	// The groups below are added in the same order as the v1 definitions list.
	const outputVariables: CompanionVariableDefinitions<VariablesSchema> = {}
	const audioLevelVariables: CompanionVariableDefinitions<VariablesSchema> = {}
	const globalSettings: CompanionVariableDefinitions<VariablesSchema> = {
		// Status
		zoomVersion: { name: 'Zoom version' },
		callStatus: { name: 'Call Status' },
		callStatusNumber: {
			name: 'Call Status Number (only accurate when joining or leaving meeting.  See module help for details)',
		},
		engineState: { name: 'Engine Status' },
		selectedCallers: { name: 'Selected callers/groups' },
		selectedNumberOfCallers: { name: 'Selected number of callers/groups' },
		numberOfGroups: { name: 'Number of selectable groups' },
		numberOfUsers: { name: 'Number of users in call' },
		isSpeaking: { name: 'Is speaking' },
		activeSpeaker: { name: 'Active speaking' },
		videoOnCount: { name: 'Video On Count' },
		handRaisedCount: { name: 'Hands Raised Count' },
		videoShareStatus: { name: 'Share Screen On/Off' },
		spotlightGroupTrackingInitalized: { name: 'Spotlight Group Tracking Initalized' },
		isPro: { name: 'Is Pro License' },
	}
	// Groups
	const groupPositionVariables: CompanionVariableDefinitions<VariablesSchema> = {}
	const userVariables: CompanionVariableDefinitions<VariablesSchema> = {}
	groupPositionVariables[`Group${0}Position${1}`] = { name: `Group${0} Position ${1}` }
	groupPositionVariables[`Group${1}Position${1}`] = { name: `Group${1} Position ${1}` }
	userVariables[`Group0`] = { name: `name` }
	userVariables['CallersInGroup0'] = { name: 'Callers In Host Group' }

	userVariables[`Group1`] = { name: `name` }
	userVariables['CallersInGroup1'] = { name: 'Callers In Spotlight Group' }
	for (let index = 2; index < instance.ZoomGroupData.length; index++) {
		for (let position = 1; position < 2; position++) {
			groupPositionVariables[`Group${index}Position${position}`] = { name: `Group${index} Position ${position}` }
		}
		userVariables[`InsideGroup${index}`] = { name: `Inside group` }
		userVariables[`Group${index}`] = { name: `name` }
		userVariables[`CallersInGroup${index}`] = { name: `Callers In Group ${index}` }
	}

	if (instance.config.enableVariablesForEachUser) {
		Object.entries(instance.ZoomUserData).forEach(([key, user]) => {
			const zoomId = Number(key)

			if (userExist(zoomId, instance.ZoomUserData)) {
				//&& user.zoomId > instance.ZoomClientDataObj.numberOfGroups) {
				userVariables[`${user.zoomId}`] = { name: `name` }
			}
		})
	}

	for (const key in instance.ZoomOutputData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomOutputData, key)) {
			const output = instance.ZoomOutputData[key]
			outputVariables[`Output${output.outputNumber}name`] = { name: `Output ${output.outputNumber} name` }
			outputVariables[`Output${output.outputNumber}resolution`] = { name: `Output ${output.outputNumber} resolution` }
			outputVariables[`Output${output.outputNumber}mode`] = { name: `Output ${output.outputNumber} mode` }
			outputVariables[`Output${output.outputNumber}status`] = { name: `Output ${output.outputNumber} status` }
		}
	}

	for (const key in instance.ZoomAudioRoutingData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomAudioRoutingData, key)) {
			const audioOutput = instance.ZoomAudioRoutingData[key]
			outputVariables[`OutputAudio${audioOutput.channel}name`] = {
				name: `Output Audio Channel ${audioOutput.channel} name`,
			}
			outputVariables[`OutputAudio${audioOutput.channel}mode`] = {
				name: `Output Audio Channel ${audioOutput.channel} mode`,
			}
		}
	}

	for (const key in instance.ZoomAudioLevelData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomAudioLevelData, key)) {
			audioLevelVariables[`Channel${key}`] = { name: `Channel ${key} audiolevel` }
		}
	}
	const galleryVariables: CompanionVariableDefinitions<VariablesSchema> = {}
	galleryVariables[`GalleryPosition${padding(1, 2)}`] = { name: `Gallery Position ${1}` }

	const selectUsersVariables: CompanionVariableDefinitions<VariablesSchema> = {}
	if (instance.config.enableVariablesForParticipants) {
		selectUsersVariables[`Participant${padding(1, 3)}`] = { name: `Participant ${1}` }
	}

	const gallery: CompanionVariableDefinitions<VariablesSchema> = { galleryCount: { name: 'gallery count' } }

	const iconVariables: CompanionVariableDefinitions<VariablesSchema> = Object.fromEntries(
		Object.values(participantIcons).map((icon) => [
			icon.variable,
			{
				name: `Default icon: ${icon.label} (override by adding a "${icon.libraryImage}" image to the image library)`,
			},
		]),
	)

	const definitions: CompanionVariableDefinitions<VariablesSchema> = {
		...outputVariables,
		...audioLevelVariables,
		...globalSettings,
		...userVariables,
		...gallery,
		...galleryVariables,
		...selectUsersVariables,
		...groupPositionVariables,
		...iconVariables,
	}

	instance.setVariableDefinitions(definitions)
}

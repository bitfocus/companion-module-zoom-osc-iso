import type ModuleInstance from './index.js'
import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type { selectionMethod } from './actions/action-utils.js'
import { feedbackResultsMultiState } from './feedback-state-machine.js'
import { userExist, colorRed, getUserFromName } from './utils.js'

export enum FeedbackId {
	selectionMethod = 'selection_Method',
	groupBased = 'group_Based',
	groupBasedAdvanced = 'group_Based_Advanced',
	indexBased = 'index_Based',
	indexBasedAdvanced = 'index_Based_Advanced',
	galleryBased = 'gallery_Based',
	galleryBasedAdvanced = 'gallery_Based_Advanced',
	userNameBased = 'user_Name_Based',
	userNameBasedAdvanced = 'user_Name_Based_Advanced',
	output = 'output',
	audioOutput = 'audio_Output',
	engineState = 'engine_State',
	capturePermissionGranted = 'capture_permission_granted',
	isPro = 'is_pro',
}
enum engineState {
	disabled = 0,
	standby = 1,
	enabled = 2,
}

export enum feedbackType {
	selected = 0,
	micLive = 1,
	handRaised = 2,
	camera = 3,
	activeSpeaker = 4,
	micOff = 5,
	handLowered = 6,
	cameraOff = 7,
	spotlightOn = 8,
	spotlightOff = 9,
	online,
	offline,
}

/** Every feedback id maps to its kind and typed options */
export type FeedbacksSchema = {
	[FeedbackId.selectionMethod]: { type: 'boolean'; options: { selectionMethod: selectionMethod } }
	[FeedbackId.groupBased]: { type: 'boolean'; options: { group: string; position: number; type: feedbackType } }
	[FeedbackId.groupBasedAdvanced]: { type: 'advanced'; options: { group: string; position: number } }
	[FeedbackId.indexBased]: { type: 'boolean'; options: { position: number; type: feedbackType } }
	[FeedbackId.indexBasedAdvanced]: { type: 'advanced'; options: { position: number } }
	[FeedbackId.userNameBased]: { type: 'boolean'; options: { name: string; type: feedbackType } }
	[FeedbackId.userNameBasedAdvanced]: { type: 'advanced'; options: { name: string } }
	[FeedbackId.galleryBased]: { type: 'boolean'; options: { position: number; type: feedbackType } }
	[FeedbackId.galleryBasedAdvanced]: { type: 'advanced'; options: { position: number } }
	[FeedbackId.engineState]: { type: 'boolean'; options: { state: number } }
	[FeedbackId.capturePermissionGranted]: { type: 'boolean'; options: { state: number } }
	[FeedbackId.isPro]: { type: 'boolean'; options: { isPro: number } }
	[FeedbackId.output]: { type: 'boolean'; options: { output: number } }
	[FeedbackId.audioOutput]: { type: 'boolean'; options: { output: number } }
}

/** Union of every feedback id, for code that collects ids to re-check at runtime */
export type AnyFeedbackId = FeedbackId

export function GetFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions<FeedbacksSchema> {
	const CHOICES_GROUPS = instance.ZoomGroupData.length === 0 ? [{ id: '0', label: 'no position' }] : []
	for (let index = 0; index < instance.ZoomGroupData.length; index++) {
		CHOICES_GROUPS.push({ id: index.toString(), label: instance.ZoomGroupData[index].groupName })
	}

	function feedbackResults(type: feedbackType | undefined, zoomID: number): boolean {
		if (type === undefined) {
			return false
		}

		switch (type) {
			case feedbackType.spotlightOn:
				if (userExist(zoomID, instance.ZoomUserData)) {
					return instance.ZoomUserData[zoomID].spotlighted === true
				}

				return false
			case feedbackType.spotlightOff:
				if (userExist(zoomID, instance.ZoomUserData)) {
					// not yet reported as spotlighted counts as off
					return instance.ZoomUserData[zoomID].spotlighted !== true
				}

				return false
			case feedbackType.micLive:
				if (userExist(zoomID, instance.ZoomUserData)) {
					return instance.ZoomUserData[zoomID].mute === false
				}

				return false
			case feedbackType.camera:
				if (userExist(zoomID, instance.ZoomUserData)) {
					return instance.ZoomUserData[zoomID].videoOn === true
				}

				return false
			case feedbackType.handRaised:
				if (userExist(zoomID, instance.ZoomUserData)) {
					return instance.ZoomUserData[zoomID].handRaised === true
				}

				return false
			case feedbackType.micOff:
				if (userExist(zoomID, instance.ZoomUserData)) {
					return instance.ZoomUserData[zoomID].mute === true
				}

				return false
			case feedbackType.cameraOff:
				if (userExist(zoomID, instance.ZoomUserData)) {
					return instance.ZoomUserData[zoomID].videoOn === false
				}

				return false
			case feedbackType.handLowered:
				if (userExist(zoomID, instance.ZoomUserData)) {
					return instance.ZoomUserData[zoomID].handRaised === false
				}

				return false
			case feedbackType.activeSpeaker:
				if (userExist(zoomID, instance.ZoomUserData)) {
					return (
						instance.ZoomClientDataObj.activeSpeaker === instance.ZoomUserData[zoomID].userName &&
						instance.ZoomUserData[zoomID].mute === false
					)
				}

				return false
			case feedbackType.selected:
				return instance.ZoomClientDataObj.selectedCallers.find((element: number) => element === zoomID) ? true : false
			case feedbackType.online: {
				if (userExist(zoomID, instance.ZoomUserData)) {
					return true
				}
				return false
			}
			case feedbackType.offline: {
				if (userExist(zoomID, instance.ZoomUserData)) {
					return false
				}
				return true
			}
			default:
				return false
		}
	}

	const feedbacks: CompanionFeedbackDefinitions<FeedbacksSchema> = {
		[FeedbackId.selectionMethod]: {
			type: 'boolean',
			name: 'selection method',
			description: 'Use of single or multi select',
			defaultStyle: {
				text: 'Single selection',
			},
			options: [
				{
					type: 'dropdown',
					label: 'Selection Method',
					id: 'selectionMethod',
					default: 1,
					choices: [
						{ id: 1, label: 'Single selection' },
						{ id: 0, label: 'Multi selection' },
					],
				},
			],
			callback: (feedback) => {
				if (instance.config.selectionMethod === undefined) instance.config.selectionMethod = 1
				if (instance.config.selectionMethod === feedback.options.selectionMethod) {
					return true
				} else {
					return false
				}
			},
		},
		[FeedbackId.groupBased]: {
			type: 'boolean',
			name: 'Group based feedback',
			description: 'Position 1 - 999',
			defaultStyle: {
				bgcolor: colorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group',
					default: '1',
					choices: CHOICES_GROUPS,
				},
				{
					type: 'number',
					label: 'Position',
					id: 'position',
					default: 1,
					min: 1,
					max: 999,
				},
				{
					type: 'dropdown',
					label: 'Type of feedback',
					id: 'type',
					default: feedbackType.selected,
					choices: [
						{ id: feedbackType.selected, label: 'Selected' },
						{ id: feedbackType.micLive, label: 'Mic Live' },
						{ id: feedbackType.handRaised, label: 'Hand Raised' },
						{ id: feedbackType.camera, label: 'Camera on' },
						{ id: feedbackType.micOff, label: 'Mic Off' },
						{ id: feedbackType.handLowered, label: 'Hand Lowered' },
						{ id: feedbackType.cameraOff, label: 'Camera Off' },
						{ id: feedbackType.activeSpeaker, label: 'Active Speaker' },
						{ id: feedbackType.spotlightOn, label: 'Spotlight On' },
						{ id: feedbackType.spotlightOff, label: 'Spotlight Off' },
					],
				},
			],
			callback: (feedback) => {
				if (instance.ZoomGroupData[Number(feedback.options.group)].users[feedback.options.position - 1]) {
					const zoomID =
						instance.ZoomGroupData[Number(feedback.options.group)].users[feedback.options.position - 1].zoomID
					return feedbackResults(feedback.options.type, zoomID)
				}
				return false
			},
		},
		[FeedbackId.groupBasedAdvanced]: {
			type: 'advanced',
			name: 'Group based feedback showing multi-state (Mic, Camera, Hand Raised, and Active Speaker)',
			description: 'Position 1 - 999',
			affectedProperties: ['png64'],
			options: [
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group',
					default: '1',
					choices: CHOICES_GROUPS,
				},
				{
					type: 'number',
					label: 'Position',
					id: 'position',
					default: 1,
					min: 1,
					max: 999,
				},
			],
			callback: (feedback) => {
				if (instance.ZoomGroupData[Number(feedback.options.group)].users[feedback.options.position - 1]) {
					const zoomID =
						instance.ZoomGroupData[Number(feedback.options.group)].users[feedback.options.position - 1].zoomID

					return feedbackResultsMultiState(instance, zoomID, feedback.image === undefined ? 72 : feedback.image.height)
				}

				return {}
			},
		},
		[FeedbackId.indexBased]: {
			type: 'boolean',
			name: 'Participant position based feedback',
			description: 'Feedback based on index of the participant',
			defaultStyle: {
				bgcolor: colorRed,
			},
			options: [
				{
					type: 'number',
					label: 'Participant Position',
					id: 'position',
					default: 1,
					min: 1,
					max: 999,
				},
				{
					type: 'dropdown',
					label: 'Type of feedback',
					id: 'type',
					default: feedbackType.selected,
					choices: [
						{ id: feedbackType.selected, label: 'Selected' },
						{ id: feedbackType.micLive, label: 'Mic Live' },
						{ id: feedbackType.handRaised, label: 'Hand Raised' },
						{ id: feedbackType.camera, label: 'Camera on' },
						{ id: feedbackType.micOff, label: 'Mic Off' },
						{ id: feedbackType.handLowered, label: 'Hand Lowered' },
						{ id: feedbackType.cameraOff, label: 'Camera Off' },
						{ id: feedbackType.activeSpeaker, label: 'Active Speaker' },
						{ id: feedbackType.spotlightOn, label: 'Spotlight On' },
						{ id: feedbackType.spotlightOff, label: 'Spotlight Off' },
					],
				},
			],
			callback: (feedback) => {
				if (
					instance.config.enableVariablesForParticipants &&
					instance.ZoomVariableLink[feedback.options.position - 1]
				) {
					const zoomID = instance.ZoomVariableLink[feedback.options.position - 1].zoomId

					return feedbackResults(feedback.options.type, zoomID)
				}
				return false
			},
		},
		[FeedbackId.indexBasedAdvanced]: {
			type: 'advanced',
			name: 'Participant position based feedback showing multi-state (Mic, Camera, Hand Raised, and Active Speaker)',
			description: 'Feedback based on index of the participant',
			affectedProperties: ['png64'],
			options: [
				{
					type: 'number',
					label: 'Participant Position',
					id: 'position',
					default: 1,
					min: 1,
					max: 999,
				},
			],
			callback: (feedback) => {
				if (
					instance.config.enableVariablesForParticipants &&
					instance.ZoomVariableLink[feedback.options.position - 1]
				) {
					const zoomID = instance.ZoomVariableLink[feedback.options.position - 1].zoomId

					return feedbackResultsMultiState(instance, zoomID, feedback.image === undefined ? 72 : feedback.image.height)
				}
				return {}
			},
		},
		[FeedbackId.userNameBased]: {
			type: 'boolean',
			name: 'Username based feedback',
			description: 'type in username',
			defaultStyle: {
				bgcolor: colorRed,
			},
			options: [
				{
					type: 'textinput',
					label: 'Name',
					id: 'name',
					default: '',
					useVariables: true,
					tooltip: 'Type in the username of the participant you want to get feedback for. Use "me" for yourself.',
				},
				{
					type: 'dropdown',
					label: 'Type of feedback',
					id: 'type',
					default: feedbackType.selected,
					choices: [
						{ id: feedbackType.selected, label: 'Selected' },
						{ id: feedbackType.micLive, label: 'Mic Live' },
						{ id: feedbackType.handRaised, label: 'Hand Raised' },
						{ id: feedbackType.camera, label: 'Camera on' },
						{ id: feedbackType.micOff, label: 'Mic Off' },
						{ id: feedbackType.handLowered, label: 'Hand Lowered' },
						{ id: feedbackType.cameraOff, label: 'Camera Off' },
						{ id: feedbackType.activeSpeaker, label: 'Active Speaker' },
						{ id: feedbackType.spotlightOn, label: 'Spotlight On' },
						{ id: feedbackType.spotlightOff, label: 'Spotlight Off' },
						{ id: feedbackType.online, label: 'Online' },
						{ id: feedbackType.offline, label: 'Offline' },
					],
				},
			],
			callback: (feedback) => {
				const name = feedback.options.name
				if (name === '') {
					return false
				}

				if (name === 'me' && instance.ZoomMeData.zoomId !== 0) {
					return feedbackResults(feedback.options.type, instance.ZoomMeData.zoomId)
				}

				const user = getUserFromName(name, instance.ZoomVariableLink)
				if (user !== undefined) {
					return feedbackResults(feedback.options.type, user.zoomId)
				} else if (feedback.options.type === feedbackType.offline) {
					return true
				} else {
					return false
				}
			},
		},
		[FeedbackId.userNameBasedAdvanced]: {
			type: 'advanced',
			name: 'Username based feedback showing multi-state (Mic, Camera, Hand Raised, and Active Speaker)',
			description: 'type in username',
			affectedProperties: ['png64'],
			options: [
				{
					type: 'textinput',
					label: 'Name',
					id: 'name',
					default: '',
					useVariables: true,
					tooltip: 'Type in the username of the participant you want to get feedback for. Use "me" for yourself.',
				},
			],
			callback: (feedback) => {
				const name = feedback.options.name
				let zoomID: number
				if (name === 'me') {
					zoomID = instance.ZoomMeData.zoomId
					if (zoomID !== 0) {
						return feedbackResultsMultiState(
							instance,
							zoomID,
							feedback.image === undefined ? 72 : feedback.image.height,
						)
					}

					return {}
				}

				for (const iterator of instance.ZoomVariableLink) {
					if (iterator.userName === name) {
						zoomID = iterator.zoomId

						return feedbackResultsMultiState(
							instance,
							zoomID,
							feedback.image === undefined ? 72 : feedback.image.height,
						)
					}
				}

				return {}
			},
		},
		[FeedbackId.galleryBased]: {
			type: 'boolean',
			name: 'Gallery based feedback',
			description: 'Position 1 - 49',
			defaultStyle: {
				bgcolor: colorRed,
			},
			options: [
				{
					type: 'number',
					label: 'Gallery position',
					id: 'position',
					default: 1,
					min: 1,
					max: 49,
				},
				{
					type: 'dropdown',
					label: 'Type of feedback',
					id: 'type',
					default: feedbackType.selected,
					choices: [
						{ id: feedbackType.selected, label: 'Selected' },
						{ id: feedbackType.micLive, label: 'Mic Live' },
						{ id: feedbackType.handRaised, label: 'Hand Raised' },
						{ id: feedbackType.camera, label: 'Camera on' },
						{ id: feedbackType.micOff, label: 'Mic Off' },
						{ id: feedbackType.handLowered, label: 'Hand Lowered' },
						{ id: feedbackType.cameraOff, label: 'Camera Off' },
						{ id: feedbackType.activeSpeaker, label: 'Active Speaker' },
						{ id: feedbackType.spotlightOn, label: 'Spotlight On' },
						{ id: feedbackType.spotlightOff, label: 'Spotlight Off' },
					],
				},
			],
			callback: (feedback) => {
				if (instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]]) {
					const zoomID =
						instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]].zoomId

					return feedbackResults(feedback.options.type, zoomID)
				}
				return false
			},
		},
		[FeedbackId.galleryBasedAdvanced]: {
			type: 'advanced',
			name: 'Gallery based feedback showing multi-state (Mic, Camera, Hand Raised, and Active Speaker)',
			description: 'Position 1 - 49',
			affectedProperties: ['png64'],
			options: [
				{
					type: 'number',
					label: 'Gallery position',
					id: 'position',
					default: 1,
					min: 1,
					max: 49,
				},
			],
			callback: (feedback) => {
				if (instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]]) {
					const zoomID =
						instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]].zoomId

					return feedbackResultsMultiState(instance, zoomID, feedback.image === undefined ? 72 : feedback.image.height)
				}

				return {}
			},
		},
		[FeedbackId.engineState]: {
			type: 'boolean',
			name: 'Status of the engine feedback',
			description: 'Show feedback of the engine',
			defaultStyle: {
				bgcolor: colorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Engine state',
					id: 'state',
					default: engineState.enabled,
					choices: [
						{ id: engineState.disabled, label: 'Disabled' },
						{ id: engineState.enabled, label: 'Enabled' },
						{ id: engineState.standby, label: 'Standby' },
					],
				},
			],
			callback: (feedback) => {
				if (instance.ZoomClientDataObj.engineState === feedback.options.state) {
					return true
				} else {
					return false
				}
			},
		},
		[FeedbackId.capturePermissionGranted]: {
			type: 'boolean',
			name: 'Status of Capture Permission Granted',
			description: 'Show feedback of the Capture Permission Granted',
			defaultStyle: {
				bgcolor: colorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Granted Capture Permission',
					id: 'state',
					default: engineState.enabled,
					choices: [
						{ id: engineState.disabled, label: 'Disabled' },
						{ id: engineState.enabled, label: 'Enabled' },
						{ id: engineState.standby, label: 'Standby' },
					],
				},
			],
			callback: (feedback) => {
				// capturePermissionGranted is a boolean and the option an engineState number, so this never matched in
				// v1 either; the comparison is kept unchanged so the migration does not alter behaviour.
				const granted = instance.ZoomClientDataObj.capturePermissionGranted as boolean | number
				if (granted === feedback.options.state) {
					return true
				} else {
					return false
				}
			},
		},
		[FeedbackId.isPro]: {
			type: 'boolean',
			name: 'Is Pro License',
			description: 'Show feedback based on Pro or Lite/Essentials license',
			defaultStyle: {
				bgcolor: colorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Is Pro License',
					id: 'isPro',
					default: 1,
					choices: [
						{ id: 1, label: 'Pro' },
						{ id: 0, label: 'Lite or Essentials' },
					],
				},
			],
			callback: (feedback) => {
				const expectedIsPro = feedback.options.isPro === 1
				if (instance.ZoomClientDataObj.isPro === expectedIsPro) {
					return true
				} else {
					return false
				}
			},
		},
		[FeedbackId.output]: {
			type: 'boolean',
			name: 'Selected output feedback',
			description: 'Selected output',
			defaultStyle: {
				bgcolor: colorRed,
			},
			options: [
				{
					type: 'number',
					label: 'Output',
					id: 'output',
					default: 1,
					min: 1,
					max: 99,
				},
			],
			callback: (feedback) => {
				if (instance.ZoomClientDataObj.selectedOutputs.includes(feedback.options.output)) {
					return true
				} else {
					return false
				}
			},
		},
		[FeedbackId.audioOutput]: {
			type: 'boolean',
			name: 'Selected audio output feedback',
			description: 'Selected audio output',
			defaultStyle: {
				bgcolor: colorRed,
			},
			options: [
				{
					type: 'number',
					label: 'Output',
					id: 'output',
					default: 1,
					min: 1,
					max: 99,
				},
			],
			callback: (feedback) => {
				if (instance.ZoomClientDataObj.selectedAudioOutputs.includes(feedback.options.output)) {
					return true
				} else {
					return false
				}
			},
		},
	}

	return feedbacks
}

/**
 * Registers every feedback with Companion
 * @param instance Give the instance so we can extract data
 */
export function UpdateFeedbacks(instance: ModuleInstance): void {
	instance.setFeedbackDefinitions(GetFeedbacks(instance))
}

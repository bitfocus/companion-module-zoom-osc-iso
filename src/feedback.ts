import {
	CompanionFeedbackDefinitions,
	combineRgb,
	CompanionFeedbackDefinition,
	InputValue,
} from '@companion-module/base'
import { ZoomConfig } from './config'
import { feedbackResultsAdvanced } from './feedback-state-machine'
import { InstanceBaseExt, userExist } from './utils'

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
}

export function GetFeedbacks(instance: InstanceBaseExt<ZoomConfig>): CompanionFeedbackDefinitions {
	const CHOICES_GROUPS = instance.ZoomGroupData.length === 0 ? [{ id: '0', label: 'no position' }] : []
	for (let index = 0; index < instance.ZoomGroupData.length; index++) {
		CHOICES_GROUPS.push({ id: index.toString(), label: instance.ZoomGroupData[index].groupName })
	}

	function feedbackResults(type: InputValue | undefined, zoomID: number) {
		if (type === undefined) {
			return false
		}

		switch (type) {
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

			default:
				return false
		}
	}

	const feedbacks: { [id in FeedbackId]: CompanionFeedbackDefinition | undefined } = {
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
				bgcolor: combineRgb(255, 0, 0),
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
					],
				},
			],
			callback: (feedback) => {
				if (instance.ZoomGroupData[feedback.options.group as number].users[(feedback.options.position as number) - 1]) {
					const zoomID =
						instance.ZoomGroupData[feedback.options.group as number].users[(feedback.options.position as number) - 1]
							.zoomID
					return feedbackResults(feedback.options.type, zoomID)
				}
				return false
			},
		},
		[FeedbackId.groupBasedAdvanced]: {
			type: 'advanced',
			name: 'Group based feedback (advanced)',
			description: 'Position 1 - 999',
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
				if (instance.ZoomGroupData[feedback.options.group as number].users[(feedback.options.position as number) - 1]) {
					const zoomID =
						instance.ZoomGroupData[feedback.options.group as number].users[(feedback.options.position as number) - 1]
							.zoomID

					return feedbackResultsAdvanced(instance, zoomID)
				}

				return {}
			},
		},
		[FeedbackId.indexBased]: {
			type: 'boolean',
			name: 'Participant position based feedback',
			description: 'Feedback based on index of the participant',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
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
					],
				},
			],
			callback: (feedback) => {
				if (instance.ZoomVariableLink[(feedback.options.position as number) - 1]) {
					const zoomID = instance.ZoomVariableLink[(feedback.options.position as number) - 1].zoomId

					return feedbackResults(feedback.options.type, zoomID)
				}
				return false
			},
		},
		[FeedbackId.indexBasedAdvanced]: {
			type: 'advanced',
			name: 'Participant position based feedback (advanced)',
			description: 'Feedback based on index of the participant',
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
				if (instance.ZoomVariableLink[(feedback.options.position as number) - 1]) {
					const zoomID = instance.ZoomVariableLink[(feedback.options.position as number) - 1].zoomId

					return feedbackResultsAdvanced(instance, zoomID)
				}

				return {}
			},
		},
		[FeedbackId.userNameBased]: {
			type: 'boolean',
			name: 'Username based feedback',
			description: 'type in username',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [
				{
					type: 'textinput',
					label: 'Name',
					id: 'name',
					default: '',
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
					],
				},
			],
			callback: async (feedback, context) => {
				const name = await context.parseVariablesInString(feedback.options.name as string)
				let zoomID = 0
				for (const iterator of instance.ZoomVariableLink) {
					if (iterator.userName === name) {
						zoomID = iterator.zoomId

						return feedbackResults(feedback.options.type, zoomID)
					}
				}
				return false
			},
		},
		[FeedbackId.userNameBasedAdvanced]: {
			type: 'advanced',
			name: 'Username based feedback (advanced)',
			description: 'type in username',
			options: [
				{
					type: 'textinput',
					label: 'Name',
					id: 'name',
					default: '',
				},
			],
			callback: async (feedback, context) => {
				const name = await context.parseVariablesInString(feedback.options.name as string)
				let zoomID = 0
				for (const iterator of instance.ZoomVariableLink) {
					if (iterator.userName === name) {
						zoomID = iterator.zoomId

						return feedbackResultsAdvanced(instance, zoomID)
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
				bgcolor: combineRgb(255, 0, 0),
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
					],
				},
			],
			callback: (feedback) => {
				if (instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[(feedback.options.position as number) - 1]]) {
					const zoomID =
						instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[(feedback.options.position as number) - 1]]
							.zoomId

					return feedbackResults(feedback.options.type, zoomID)
				}
				return false
			},
		},
		[FeedbackId.galleryBasedAdvanced]: {
			type: 'advanced',
			name: 'Gallery based feedback (advanced)',
			description: 'Position 1 - 49',
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
				if (instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[(feedback.options.position as number) - 1]]) {
					const zoomID =
						instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[(feedback.options.position as number) - 1]]
							.zoomId

					return feedbackResultsAdvanced(instance, zoomID)
				}

				return {}
			},
		},
		[FeedbackId.engineState]: {
			type: 'boolean',
			name: 'Status of the engine feedback',
			description: 'Show feedback of the engine',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
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
		[FeedbackId.output]: {
			type: 'boolean',
			name: 'Selected output feedback',
			description: 'Selected output',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
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
				if (instance.ZoomClientDataObj.selectedOutputs.includes(feedback.options.output as number)) {
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
				bgcolor: combineRgb(255, 0, 0),
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
				if (instance.ZoomClientDataObj.selectedAudioOutputs.includes(feedback.options.output as number)) {
					return true
				} else {
					return false
				}
			},
		},
	}

	return feedbacks
}

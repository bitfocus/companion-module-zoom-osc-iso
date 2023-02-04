import { CompanionFeedbackDefinitions, combineRgb, CompanionFeedbackDefinition } from '@companion-module/base'
import { ZoomConfig } from './config'
import { InstanceBaseExt } from './utils'

export enum FeedbackId {
	selectionMethod = 'selection_Method',
	groupBased = 'group_Based',
	indexBased = 'index_Based',
	galleryBased = 'gallery_Based',
	userNameBased = 'user_Name_Based',
	output = 'output',
	audioOutput = 'audio_Output',
	engineState = 'engine_State',
}
enum engineState {
	disabled = 0,
	standby = 1,
	enabled = 2,
}

export function GetFeedbacks(instance: InstanceBaseExt<ZoomConfig>): CompanionFeedbackDefinitions {
	// Create the choices
	const CHOICES_POSITION = []
	for (let index = 1; index < 1000; index++) {
		CHOICES_POSITION.push({ id: index.toString(), label: `Position ${index}` })
	}
	const CHOICES_GALLERY = []
	for (let index = 1; index < 50; index++) {
		CHOICES_GALLERY.push({ id: index.toString(), label: `Gallery position ${index}` })
	}
	const CHOICES_GROUPS = instance.ZoomGroupData.length === 0 ? [{ id: '0', label: 'no position' }] : []
	for (let index = 0; index < instance.ZoomGroupData.length; index++) {
		CHOICES_GROUPS.push({ id: index.toString(), label: `Group ${index + 1}` })
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
					type: 'dropdown',
					label: 'Position',
					id: 'position',
					default: '1',
					choices: CHOICES_POSITION,
				},
				{
					type: 'dropdown',
					label: 'Type of feedback',
					id: 'type',
					default: 'selected',
					choices: [
						{ id: 'selected', label: 'Selected' },
						{ id: 'micLive', label: 'Mic Live' },
						{ id: 'handRaised', label: 'Hand Raised' },
						{ id: 'camera', label: 'Camera Live' },
					],
				},
			],
			callback: (feedback) => {
				if (instance.ZoomGroupData[feedback.options.group as number].users[(feedback.options.position as number) - 1]) {
					const zoomID =
						instance.ZoomGroupData[feedback.options.group as number].users[(feedback.options.position as number) - 1]
							.zoomID
					switch (feedback.options.type) {
						case 'micLive':
							return instance.ZoomUserData[zoomID].mute === false ? true : false
						case 'camera':
							return instance.ZoomUserData[zoomID].videoOn === false ? true : false
						case 'handRaised':
							return instance.ZoomUserData[zoomID].handRaised === true ? true : false
						case 'activeSpeaker':
							return instance.ZoomClientDataObj.activeSpeaker === instance.ZoomUserData[zoomID].userName &&
								instance.ZoomUserData[zoomID].mute === false
								? true
								: false
						case 'selected':
							return instance.ZoomClientDataObj.selectedCallers.find((element: number) => element === zoomID)
								? true
								: false
					}
				}
				return false
			},
		},
		[FeedbackId.indexBased]: {
			type: 'boolean',
			name: 'Participant index based feedback',
			description: 'Feedback based on index of the participant',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Index',
					id: 'position',
					default: '1',
					choices: CHOICES_POSITION,
				},
				{
					type: 'dropdown',
					label: 'Type of feedback',
					id: 'type',
					default: 'selected',
					choices: [
						{ id: 'selected', label: 'Selected' },
						{ id: 'micLive', label: 'Mic Live' },
						{ id: 'handRaised', label: 'Hand Raised' },
						{ id: 'camera', label: 'Camera off' },
						{ id: 'activeSpeaker', label: 'Active speaker' },
					],
				},
			],
			callback: (feedback) => {
				if (instance.ZoomVariableLink[(feedback.options.position as number) - 1]) {
					const zoomID = instance.ZoomVariableLink[(feedback.options.position as number) - 1].zoomId
					switch (feedback.options.type) {
						case 'micLive':
							return instance.ZoomUserData[zoomID].mute === false ? true : false
						case 'camera':
							return instance.ZoomUserData[zoomID].videoOn === false ? true : false
						case 'handRaised':
							return instance.ZoomUserData[zoomID].handRaised === true ? true : false
						case 'activeSpeaker':
							return instance.ZoomClientDataObj.activeSpeaker === instance.ZoomUserData[zoomID].userName &&
								instance.ZoomUserData[zoomID].mute === false
								? true
								: false
						case 'selected':
							return instance.ZoomClientDataObj.selectedCallers.find((element: number) => element === zoomID)
								? true
								: false
					}
				}
				return false
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
					default: 'selected',
					choices: [
						{ id: 'selected', label: 'Selected' },
						{ id: 'micLive', label: 'Mic Live' },
						{ id: 'handRaised', label: 'Hand Raised' },
						{ id: 'camera', label: 'Camera off' },
						{ id: 'activeSpeaker', label: 'Active speaker' },
					],
				},
			],
			callback: async (feedback, context) => {
				const name = await context.parseVariablesInString(feedback.options.name as string)
				let zoomID = 0
				for (const iterator of instance.ZoomVariableLink) {
					if (iterator.userName === name) {
						zoomID = iterator.zoomId

						switch (feedback.options.type) {
							case 'micLive':
								return instance.ZoomUserData[zoomID].mute === false ? true : false
							case 'camera':
								return instance.ZoomUserData[zoomID].videoOn === false ? true : false
							case 'handRaised':
								return instance.ZoomUserData[zoomID].handRaised === true ? true : false
							case 'activeSpeaker':
								return instance.ZoomClientDataObj.activeSpeaker === name && instance.ZoomUserData[zoomID].mute === false
									? true
									: false
							case 'selected':
								return instance.ZoomClientDataObj.selectedCallers.find((element: number) => element === zoomID)
									? true
									: false
							default:
								return false
						}
					}
				}
				return false
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
					type: 'dropdown',
					label: 'Gallery position',
					id: 'position',
					default: '1',
					choices: CHOICES_GALLERY,
				},
				{
					type: 'dropdown',
					label: 'Type of feedback',
					id: 'type',
					default: 'selected',
					choices: [
						{ id: 'selected', label: 'Selected' },
						{ id: 'micLive', label: 'Mic Live' },
						{ id: 'handRaised', label: 'Hand Raised' },
						{ id: 'camera', label: 'Camera off' },
						{ id: 'activeSpeaker', label: 'Active Speaker' },
					],
				},
			],
			callback: (feedback) => {
				if (instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[(feedback.options.position as number) - 1]]) {
					const zoomID =
						instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[(feedback.options.position as number) - 1]]
							.zoomId
					switch (feedback.options.type as string) {
						case 'micLive':
							return instance.ZoomUserData[zoomID].mute === false ? true : false
						case 'camera':
							return instance.ZoomUserData[zoomID].videoOn === false ? true : false
						case 'handRaised':
							return instance.ZoomUserData[zoomID].handRaised === true ? true : false
						case 'activeSpeaker':
							return instance.ZoomClientDataObj.activeSpeaker === instance.ZoomUserData[zoomID].userName &&
								instance.ZoomUserData[zoomID].mute === false
								? true
								: false
						case 'selected':
							return instance.ZoomClientDataObj.selectedCallers.find((element: number) => element === zoomID)
								? true
								: false
						default:
							return false
					}
				}
				return false
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

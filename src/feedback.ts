import {
	CompanionFeedbackDefinitions,
	combineRgb,
	CompanionFeedbackDefinition,
	CompanionAdvancedFeedbackResult,
} from '@companion-module/base'
import { ZoomConfig } from './config'
import { InstanceBaseExt, userExist } from './utils'
const { images } = require('./images') // eslint-disable-line

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

type State = [boolean, boolean, boolean, boolean, boolean]
interface StateMachine {
	states: State[]
	imagesWithIcons: Record<string, string>
	imagesWithoutIcons: Record<string, string>
	currentState: State
}

const stateMachine: StateMachine = {
	states: [
		[false, false, false, false, false],
		[false, false, false, false, true],
		[false, false, false, true, false],
		[false, false, false, true, true],
		[false, false, true, false, false],
		[false, false, true, false, true],
		[false, false, true, true, false],
		[false, false, true, true, true],
		[false, true, false, false, false],
		[false, true, false, false, true],
		[false, true, false, true, false],
		[false, true, false, true, true],
		[false, true, true, false, false],
		[false, true, true, false, true],
		[false, true, true, true, false],
		[false, true, true, true, true],
		[true, false, false, false, false],
		[true, false, false, false, true],
		[true, false, false, true, false],
		[true, false, false, true, true],
		[true, false, true, false, false],
		[true, false, true, false, true],
		[true, false, true, true, false],
		[true, false, true, true, true],
		[true, true, false, false, false],
		[true, true, false, false, true],
		[true, true, false, true, false],
		[true, true, false, true, true],
		[true, true, true, false, false],
		[true, true, true, false, true],
		[true, true, true, true, false],
		[true, true, true, true, true],
	],
	imagesWithIcons: {
		'false,false,false,false,false': images.LG1,
		'false,false,false,false,true': images.LG2,
		'false,false,false,true,false': images.LG3,
		'false,false,false,true,true': images.LG4,
		'false,false,true,false,false': images.LG5,
		'false,false,true,false,true': images.LG6,
		'false,false,true,true,false': images.LG7,
		'false,false,true,true,true': images.LG8,
		'false,true,false,false,false': images.LG9,
		'false,true,false,false,true': images.LG10,
		'false,true,false,true,false': images.LG11,
		'false,true,false,true,true': images.LG12,
		'false,true,true,false,false': images.LG13,
		'false,true,true,false,true': images.LG14,
		'false,true,true,true,false': images.LG15,
		'false,true,true,true,true': images.LG16,
		'true,false,false,false,false': images.LG17,
		'true,false,false,false,true': images.LG18,
		'true,false,false,true,false': images.LG19,
		'true,false,false,true,true': images.LG20,
		'true,false,true,false,false': images.LG21,
		'true,false,true,false,true': images.LG22,
		'true,false,true,true,false': images.LG23,
		'true,false,true,true,true': images.LG24,
		'true,true,false,false,false': images.LG25,
		'true,true,false,false,true': images.LG26,
		'true,true,false,true,false': images.LG27,
		'true,true,false,true,true': images.LG28,
		'true,true,true,false,false': images.LG29,
		'true,true,true,false,true': images.LG30,
		'true,true,true,true,false': images.LG31,
		'true,true,true,true,true': images.LG32,
	},
	imagesWithoutIcons: {
		'false,false,false,false,false': images.NOICONLG1,
		'false,false,false,false,true': images.NOICONLG2,
		'false,false,false,true,false': images.NOICONLG3,
		'false,false,false,true,true': images.NOICONLG4,
		'false,false,true,false,false': images.NOICONLG5,
		'false,false,true,false,true': images.NOICONLG6,
		'false,false,true,true,false': images.NOICONLG7,
		'false,false,true,true,true': images.NOICONLG8,
		'false,true,false,false,false': images.NOICONLG9,
		'false,true,false,false,true': images.NOICONLG10,
		'false,true,false,true,false': images.NOICONLG11,
		'false,true,false,true,true': images.NOICONLG12,
		'false,true,true,false,false': images.NOICONLG13,
		'false,true,true,false,true': images.NOICONLG14,
		'false,true,true,true,false': images.NOICONLG15,
		'false,true,true,true,true': images.NOICONLG16,
		'true,false,false,false,false': images.NOICONLG17,
		'true,false,false,false,true': images.NOICONLG18,
		'true,false,false,true,false': images.NOICONLG19,
		'true,false,false,true,true': images.NOICONLG20,
		'true,false,true,false,false': images.NOICONLG21,
		'true,false,true,false,true': images.NOICONLG22,
		'true,false,true,true,false': images.NOICONLG23,
		'true,false,true,true,true': images.NOICONLG24,
		'true,true,false,false,false': images.NOICONLG25,
		'true,true,false,false,true': images.NOICONLG26,
		'true,true,false,true,false': images.NOICONLG27,
		'true,true,false,true,true': images.NOICONLG28,
		'true,true,true,false,false': images.NOICONLG29,
		'true,true,true,false,true': images.NOICONLG30,
		'true,true,true,true,false': images.NOICONLG31,
		'true,true,true,true,true': images.NOICONLG32,
	},
	currentState: [false, false, false, false, false],
}

function getImageForState(state: State, feedbackWithIcons: number): string {
	const stateString = state.toString()
	if (feedbackWithIcons === 1) {
		return stateMachine.imagesWithIcons[stateString]
	}

	return stateMachine.imagesWithoutIcons[stateString]
}

export function GetFeedbacks(instance: InstanceBaseExt<ZoomConfig>): CompanionFeedbackDefinitions {
	const CHOICES_GROUPS = instance.ZoomGroupData.length === 0 ? [{ id: '0', label: 'no position' }] : []
	for (let index = 0; index < instance.ZoomGroupData.length; index++) {
		CHOICES_GROUPS.push({ id: index.toString(), label: instance.ZoomGroupData[index].groupName })
	}

	function feedbackResultsAdvanced(zoomID: number): CompanionAdvancedFeedbackResult {
		// instance.log('debug', `feedback feedbackResultsAdvanced: zoomID: ${zoomID}`)
		if (userExist(zoomID, instance.ZoomUserData)) {
			const stateArray: State = [
				instance.ZoomUserData[zoomID].mute || false,
				instance.ZoomUserData[zoomID].videoOn || false,
				instance.ZoomUserData[zoomID].handRaised || false,
				instance.ZoomClientDataObj.activeSpeaker === instance.ZoomUserData[zoomID].userName || false,
				instance.ZoomClientDataObj.selectedCallers.find((element: number) => element === zoomID) !== undefined || false,
			]

			// instance.log(
			// 	'debug',
			// 	`feedback feedbackResultsAdvanced: userData - ${JSON.stringify(
			// 		instance.ZoomUserData[zoomID]
			// 	)}, activeSpeaker - ${JSON.stringify(instance.ZoomClientDataObj.activeSpeaker)}, (state - ${JSON.stringify(
			// 		stateArray
			// 	)})`
			// )

			const stateIndex = stateMachine.states.findIndex((state) => state.toString() === stateArray.toString())
			// instance.log('debug', `feedback feedbackResultsAdvanced: stateIndex: ${stateIndex}`)
			stateMachine.currentState = stateMachine.states[stateIndex]
			const image = getImageForState(stateMachine.currentState, instance.config.feedbackImagesWithIcons)

			// if (instance.ZoomClientDataObj.selectedCallers.find((element: number) => element === zoomID)) {
			// 	return {
			// 		png64: image,
			// 		color: combineRgb(0, 0, 0),
			// 		bgcolor: combineRgb(255, 255, 0),
			// 	}
			// }

			return {
				png64: image,
			}
		} else {
			return {}
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
			type: 'advanced',
			name: 'Group based feedback',
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

					return feedbackResultsAdvanced(zoomID)
				}

				return {}
			},
		},
		[FeedbackId.indexBased]: {
			type: 'advanced',
			name: 'Participant position based feedback',
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

					return feedbackResultsAdvanced(zoomID)
				}

				return {}
			},
		},
		[FeedbackId.userNameBased]: {
			type: 'advanced',
			name: 'Username based feedback',
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

						return feedbackResultsAdvanced(zoomID)
					}
				}

				return {}
			},
		},
		[FeedbackId.galleryBased]: {
			type: 'advanced',
			name: 'Gallery based feedback',
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

					return feedbackResultsAdvanced(zoomID)
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

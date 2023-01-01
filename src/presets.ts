import { combineRgb, CompanionButtonPresetDefinition, CompanionPresetDefinitions } from '@companion-module/base'

import { ActionId } from './actions'
import { FeedbackId } from './feedback'
import { ZoomConfig } from './config'
const { Actions, ISOActions } = require('./osccommands')
const { images } = require('./images')
import {
	ZoomGroupDataInterface,
} from './utils'

export type PresetCategory = 'Select Users' | 'User presets' | 'Global Presets' | 'Special Presets'

interface CompanionPresetExt extends CompanionButtonPresetDefinition {
	feedbacks: Array<
		{
			feedbackId: FeedbackId
		} & CompanionButtonPresetDefinition['feedbacks'][0]
	>
	steps: Array<{
		down: Array<
			{
				actionId: ActionId
			} & CompanionButtonPresetDefinition['steps'][0]['down'][0]
		>
		up: Array<
			{
				actionId: ActionId
			} & CompanionButtonPresetDefinition['steps'][0]['up'][0]
		>
	}>
}
interface CompanionPresetDefinitionsExt {
	[id: string]: CompanionPresetExt | undefined
}
export function getSelectUsersPresets(ZoomGroupData: ZoomGroupDataInterface[]): CompanionPresetDefinitions {
	const presets: CompanionPresetDefinitionsExt = {}

	//clear selection
	presets[`Clear Participants`] = {
		type: 'button',
		category: 'Select Participants',
		name: `Clear Participants`,
		style: {
			text: `Clear Participants ($(zoomosc:selectedNumberOfCallers))`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(125, 125, 125),
		},
		steps: [
			{
				down: [{ actionId: ActionId.clearParticipants, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	// Selection method
	presets[`Selection Method`] = {
		type: 'button',
		category: 'Select Participants',
		name: `Selection Method`,
		style: {
			text: `Toggle Selection Method`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(125, 125, 125),
		},
		steps: [{ down: [{ actionId: ActionId.selectionMethod, options: { selectionMethod: 2 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: FeedbackId.selectionMethod,
				options: {
					selectionMethod: 1,
				},
				style: {
					text: 'Single selection',
				},
			},
			{
				feedbackId: FeedbackId.selectionMethod,
				options: {
					selectionMethod: 0,
				},
				style: {
					text: 'Multiple selection',
				},
			},
		],
	}
	// Single selection
	presets[`Single selection`] = {
		type: 'button',
		category: 'Select Participants',
		name: `Single selection`,
		style: {
			text: `Single selection`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(125, 125, 125),
		},
		steps: [{ down: [{ actionId: ActionId.selectionMethod, options: { selectionMethod: 1 } }], up: [] }],
		feedbacks: [],
	}
	// Select by name
	presets[`Select by name`] = {
		type: 'button',
		category: 'Select Participants',
		name: `Select by name`,
		style: {
			text: `Select by name`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 191, 128),
		},
		steps: [{ down: [{ actionId: ActionId.selectUserByName, options: { option: 'toggle' } }], up: [] }],
		feedbacks: [
			{
				feedbackId: FeedbackId.userNameBased,
				options: {
					name: '',
					type: 'micLive',
				},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
			},
			{
				feedbackId: FeedbackId.userNameBased,
				options: {
					name: '',
					type: 'handRaised',
					handRaised: 1,
				},
				style: {
					png64: images.handRaised,
				},
			},
			{
				feedbackId: FeedbackId.userNameBased,
				options: {
					name: '',
					type: 'activeSpeaker',
				},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 255),
				},
			},
			{
				feedbackId: FeedbackId.userNameBased,
				options: {
					name: '',
					type: 'selected',
				},
				style: {
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(255, 255, 0),
				},
			},
		],
	}
	// Multiple selection
	presets[`Multiple selection`] = {
		type: 'button',
		category: 'Select Participants',
		name: `Multiple selection`,
		style: {
			text: `Multiple selection`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(125, 125, 125),
		},
		steps: [{ down: [{ actionId: ActionId.selectionMethod, options: { selectionMethod: 0 } }], up: [] }],
		feedbacks: [],
	}
	// ISO
	presets[`Take Outputs`] = {
		type: 'button',
		category: 'ISO Presets',
		name: `Take Outputs`,
		style: {
			text: `Take Outputs`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.takeSelectedOutputs, options: {} }], up: [] }],
		feedbacks: [],
	}
	// Next participants
	presets[`Next participants`] = {
		type: 'button',
		category: 'Select Participants',
		name: `Next participants`,
		style: {
			text: `Next participants`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(125, 125, 125),
		},
		steps: [{ down: [{ actionId: ActionId.nextParticipants, options: { shift: 30 } }], up: [] }],
		feedbacks: [],
	}
	// Previous participants
	presets[`Previous participants`] = {
		type: 'button',
		category: 'Select Participants',
		name: `Previous participants`,
		style: {
			text: `Previous participants`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(125, 125, 125),
		},
		steps: [{ down: [{ actionId: ActionId.previousParticipants, options: { shift: 30 } }], up: [] }],
		feedbacks: [],
	}

	// Add to group presets
	for (let index = 0; index < ZoomGroupData.length; index++) {
		presets[`Make group: ${ZoomGroupData[index].groupName}`] ={
			type: 'button',
			category: 'Group presets',
			name: `Make group: ${ZoomGroupData[index].groupName}`,
			style: {
				text: `Make group:\\n$(zoomosc:Group${index + 1})`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(125, 125, 125),
			},
			steps: [{ down: [{ actionId: ActionId.addToGroup, options: { group: index, groupOption: 'set' } }], up: [] }],
			feedbacks: [],
		}
		presets[`Add to group: ${ZoomGroupData[index].groupName}`] = {
			type: 'button',
			category: 'Group presets',
			name: `Add to group: ${ZoomGroupData[index].groupName}`,
			style: {
				text: `Add to group:\\n$(zoomosc:Group${index + 1})`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(125, 125, 125),
			},
			steps: [{ down: [{ actionId: ActionId.addToGroup, options: { group: index, groupOption: 'add' } }], up: [] }],
			feedbacks: [],
		}
		presets[`Clear group: ${ZoomGroupData[index].groupName}`] = {
			type: 'button',
			category: 'Group presets',
			name: `Clear group: ${ZoomGroupData[index].groupName}`,
			style: {
				text: `Clear group:\\n$(zoomosc:Group${index + 1})`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(125, 125, 125),
			},
			steps: [{ down: [{ actionId: ActionId.clearGroup, options: { group: index } }], up: [] }],
			feedbacks: [],
		}
		presets['Select'+ZoomGroupData[index].groupName] = {
			type: 'button',
			category: 'Group presets',
			name: ZoomGroupData[index].groupName,
			style: {
				text: `Select\\n$(zoomosc:Group${index + 1}) ($(zoomosc:CallersInGroup${index + 1}))`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(125, 125, 125),
			},
			steps: [{ down: [{ actionId: ActionId.selectGroup, options: { group: index } }], up: [] }],
			feedbacks: [],
		}
		presets['rename'+ZoomGroupData[index].groupName] = {
			type: 'button',
			category: 'Group presets',
			name: ZoomGroupData[index].groupName,
			style: {
				text: `Rename\\n$(zoomosc:Group${index + 1})`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(125, 125, 125),
			},
			steps: [
				{
					down: [{ actionId: ActionId.renameGroup, options: { group: index, name: ZoomGroupData[index].groupName } }],
					up: [],
				},
			],
			feedbacks: [],
		}
		// for (let position = 1; position < 50; position++) {
		// 	presets.push({
		// 		type: 'button',
		// 		category: `Group ${index + 1}`,
		// 		name: 'Group selection',
		// 		style: {
		// 			text: `$(zoomosc:Group${index + 1})-${position}\\n$(zoomosc:Group${index + 1}Position${position})`,
		// 			size: 'auto',
		// 			color: combineRgb(255, 255, 255),
		// 			bgcolor: combineRgb(125, 125, 125),
		// 		},
		// 		steps: [
		// 			{
		// 				down: [
		// 					{
		// 						actionId: ActionId.selectUserFromGroupPosition,
		// 						options: { group: index, position: position, option: 'toggle' },
		// 					},
		// 				],
		// 				up: [],
		// 			},
		// 		],
		// 		feedbacks: [
		// 			{
		// 				feedbackId: 'groupBased',
		// 				options: {
		// 					group: index,
		// 					position: position,
		// 					type: 'selected',
		// 				},
		// 				style: {
		// 					color: combineRgb(0, 0, 0),
		// 					bgcolor: combineRgb(255, 255, 0),
		// 				},
		// 			},
		// 			{
		// 				feedbackId: 'groupBased',
		// 				options: {
		// 					group: index,
		// 					position: position,
		// 					type: 'micLive',
		// 				},
		// 				style: {
		// 					bgcolor: combineRgb(255, 0, 0),
		// 				},
		// 			},
		// 			{
		// 				feedbackId: 'groupBased',
		// 				options: {
		// 					group: index,
		// 					position: position,
		// 					type: 'handRaised',
		// 				},
		// 				style: {
		// 					png64: images.handRaised,
		// 				},
		// 			},
		// 		],
		// 	})
		// }
	}
	// // Create presets for selection of unknown users
	// for (let index = 1; index < 1000; index++) {
	// 	presets.push({
	// 		type: 'button',
	// 		category: 'Select Participants',
	// 		name: `Caller${index}`,
	// 		style: {
	// 			text: `${index}. $(zoomosc:Participant${index})`,
	// 			size: '14',
	// 			color: combineRgb(0, 0, 0),
	// 			bgcolor: combineRgb(192, 255, 192),
	// 		},
	// 		steps: [
	// 			{
	// 				down: [
	// 					{
	// 						actionId: 'SelectFromIndexPosition',
	// 						options: {
	// 							position: index,
	// 							option: 'toggle',
	// 						},
	// 					},
	// 				],
	// 				up: [],
	// 			},
	// 		],
	// 		feedbacks: [
	// 			{
	// 				feedbackId: 'indexBased',
	// 				options: {
	// 					position: index,
	// 					type: 'micLive',
	// 				},
	// 				style: {
	// 					color: combineRgb(255, 255, 255),
	// 					bgcolor: combineRgb(255, 0, 0),
	// 				},
	// 			},
	// 			{
	// 				feedbackId: 'indexBased',
	// 				options: {
	// 					position: index,
	// 					type: 'handRaised',
	// 					handRaised: 1,
	// 				},
	// 				style: {
	// 					png64: images.handRaised,
	// 				},
	// 			},
	// 			{
	// 				feedbackId: 'indexBased',
	// 				options: {
	// 					position: index,
	// 					type: 'activeSpeaker',
	// 				},
	// 				style: {
	// 					color: combineRgb(255, 255, 255),
	// 					bgcolor: combineRgb(0, 0, 255),
	// 				},
	// 			},
	// 			{
	// 				feedbackId: 'indexBased',
	// 				options: {
	// 					position: index,
	// 					type: 'selected',
	// 				},
	// 				style: {
	// 					color: combineRgb(0, 0, 0),
	// 					bgcolor: combineRgb(255, 255, 0),
	// 				},
	// 			},
	// 		],
	// 	})
	// }
	// // Create presets for gallery
	// for (let index = 1; index < 50; index++) {
	// 	presets.push({
	// 		type: 'button',
	// 		category: 'Select from Gallery',
	// 		name: `$(zoomosc:Gallery position ${index})`,
	// 		style: {
	// 			text: `Gal Pos ${index}\\n$(zoomosc:Gallery position ${index})`,
	// 			size: 'auto',
	// 			color: combineRgb(0, 0, 0),
	// 			bgcolor: combineRgb(255, 255, 192),
	// 		},
	// 		steps: [
	// 			{ down: [{ actionId: 'SelectFromGalleryPosition', options: { position: index, option: 'toggle' } }], up: [] },
	// 		],
	// 		feedbacks: [
	// 			{
	// 				feedbackId: 'galleryBased',
	// 				options: {
	// 					position: index,
	// 					type: 'micLive',
	// 				},
	// 				style: {
	// 					color: combineRgb(255, 255, 255),
	// 					bgcolor: combineRgb(255, 0, 0),
	// 				},
	// 			},
	// 			{
	// 				feedbackId: 'galleryBased',
	// 				options: {
	// 					position: index,
	// 					type: 'activeSpeaker',
	// 				},
	// 				style: {
	// 					color: combineRgb(255, 255, 255),
	// 					bgcolor: combineRgb(0, 0, 255),
	// 				},
	// 			},
	// 			{
	// 				feedbackId: 'galleryBased',
	// 				options: {
	// 					position: index,
	// 					type: 'handRaised',
	// 					handRaised: 1,
	// 				},
	// 				style: {
	// 					png64: images.handRaised,
	// 				},
	// 			},
	// 			{
	// 				feedbackId: 'galleryBased',
	// 				options: {
	// 					position: index,
	// 					type: 'selected',
	// 				},
	// 				style: {
	// 					color: combineRgb(0, 0, 0),
	// 					bgcolor: combineRgb(255, 255, 0),
	// 				},
	// 			},
	// 		],
	// 	})
	// }
	// // User selection
	// for (const key in ZoomUserData) {
	// 	if (Object.prototype.hasOwnProperty.call(ZoomUserData, key)) {
	// 		const user = ZoomUserData[key]
	// 		presets.push({
	// 			type: 'button',
	// 			category: 'Rename participants',
	// 			name: user.userName,
	// 			style: {
	// 				text: `Rename\\n$(zoomosc:${user.zoomId})`,
	// 				size: 'auto',
	// 				color: combineRgb(0, 0, 0),
	// 				bgcolor: combineRgb(111, 222, 222),
	// 			},
	// 			steps: [{ down: [{ actionId: 'rename', options: { user: user.zoomId, name: user.userName } }], up: [] }],
	// 			feedbacks: [],
	// 		})
	// 	}
	// }

	return presets
}
export function getPresets(config: ZoomConfig): CompanionPresetDefinitions {
	let presets: CompanionPresetDefinitionsExt= {}
	let actionsObj
	if (config.version === 1) {
		actionsObj = { ...Actions, ...ISOActions }
	} else {
		actionsObj = Actions
	}
	for (const key of Object.keys(actionsObj)) {
		const element = actionsObj[key]
		if (element.args) {
			switch (element.type) {
				case 'User':
					presets[element.shortDescription] = {
						type: 'button',
						category: 'User Presets',
						name: element.shortDescription,
						style: {
							text: element.description,
							size: '18',
							color: combineRgb(0, 0, 0),
							bgcolor: combineRgb(192, 192, 255),
						},
						steps: [
							{
								down: [
									{ actionId: element.shortDescription, options: { user: '', args: '', command: element.command } },
								],
								up: [],
							},
						],
						feedbacks: [],
					}
					break
				case 'ISO':
					presets[element.shortDescription] = {
						type: 'button',
						category: 'ISO Presets',
						name: element.shortDescription,
						style: {
							text: element.description,
							size: '14',
							color: combineRgb(0, 0, 0),
							bgcolor: combineRgb(86, 221, 221),
						},
						steps: [
							{
								down: [
									{
										actionId: element.shortDescription,
										options: { user: '', args: '', command: element.command },
									},
								],
								up: [],
							},
						],
						feedbacks: [],
					}
					break
				case 'Global':
					presets[element.shortDescription] = {
						type: 'button',
						category: 'Global Presets',
						name: element.shortDescription,
						style: {
							text: element.description,
							size: '18',
							color: combineRgb(0, 0, 0),
							bgcolor: combineRgb(255, 64, 64),
						},
						steps: [
							{
								down: [
									{ actionId: element.shortDescription, options: { user: '', args: '', command: element.command } },
								],
								up: [],
							},
						],
						feedbacks: [],
					}
					break
				case 'Special':
					presets[element.shortDescription] = {
						type: 'button',
						category: 'Special Presets',
						name: element.shortDescription,
						style: {
							text: element.description,
							size: '14',
							color: combineRgb(0, 0, 0),
							bgcolor: combineRgb(255, 64, 255),
						},
						steps: [{ down: [{ actionId: element.shortDescription, options: { command: element.command } }], up: [] }],
						feedbacks: [],
					}
					break
				default:
					// instance.showLog('console', 'Wrong type at building presets')
					break
			}
		} 
	}
	// extra presets
	for (let index = 1; index < 8; index++) {
		presets[`Output ${index}`] = {
			type: 'button',
			category: 'ISO Presets',
			name: `Output ${index}`,
			style: {
				text: `Output ${index}`,
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(86, 221, 221),
			},
			steps: [
				{
					down: [
						{
							actionId: ActionId.selectOutput,
							options: { user: '', args: '', command: '/outputISO', output: index },
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: FeedbackId.output,
					options: {
						output: index,
					},
					style: {
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			],
		}
	}
	for (let index = 1; index < 8; index++) {
		presets[`Audio\nOutput ${index}`] = {
			type: 'button',
			category: 'ISO Presets',
			name: `Audio\nOutput ${index}`,
			style: {
				text: `Audio\nOutput ${index}`,
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(86, 221, 221),
			},
			steps: [
				{
					down: [
						{
							actionId: ActionId.selectAudioOutput,
							options: { user: '', args: '', command: '/audioISO', output: index },
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: FeedbackId.audioOutput,
					options: {
						output: index,
					},
					style: {
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			],
		}
	}

	return presets
}

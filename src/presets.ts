import { combineRgb, CompanionButtonPresetDefinition, CompanionPresetDefinitions } from '@companion-module/base'

import { ActionId } from './actions'
import { FeedbackId } from './feedback'
const { images } = require('./images')
import { ZoomGroupDataInterface, ZoomUserDataInterface } from './utils'

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
export function getPresets(
	ZoomGroupData: ZoomGroupDataInterface[],
	ZoomUserData: ZoomUserDataInterface
): CompanionPresetDefinitions {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Select from Participants
	 */
	for (let index = 1; index < 1000; index++) {
		presets[`Caller_${index}`] = {
			type: 'button',
			category: 'Select from Participants',
			name: `Caller${index}`,
			style: {
				text: `${index}. $(zoomosc:Participant${index})`,
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(192, 255, 192),
			},
			steps: [
				{
					down: [
						{
							actionId: ActionId.selectFromIndexPosition,
							options: {
								position: index,
								option: 'toggle',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: FeedbackId.indexBased,
					options: {
						position: index,
						type: 'micLive',
					},
					style: {
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
				{
					feedbackId: FeedbackId.indexBased,
					options: {
						position: index,
						type: 'handRaised',
						handRaised: 1,
					},
					style: {
						png64: images.handRaised,
					},
				},
				{
					feedbackId: FeedbackId.indexBased,
					options: {
						position: index,
						type: 'activeSpeaker',
					},
					style: {
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(0, 0, 255),
					},
				},
				{
					feedbackId: FeedbackId.indexBased,
					options: {
						position: index,
						type: 'selected',
					},
					style: {
						color: combineRgb(0, 0, 0),
						bgcolor: combineRgb(255, 255, 0),
					},
				},
			],
		}
	}

	/**
	 * Select from Gallery
	 */
	for (let index = 1; index < 50; index++) {
		presets[`Gallery_position_${index})`] = {
			type: 'button',
			category: 'Select from Gallery',
			name: `$(zoomosc:Gallery position ${index})`,
			style: {
				text: `Gal Pos ${index}\\n$(zoomosc:Gallery position ${index})`,
				size: 'auto',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 192),
			},
			steps: [
				{
					down: [{ actionId: ActionId.selectFromGalleryPosition, options: { position: index, option: 'toggle' } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: FeedbackId.galleryBased,
					options: {
						position: index,
						type: 'micLive',
					},
					style: {
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
				{
					feedbackId: FeedbackId.galleryBased,
					options: {
						position: index,
						type: 'activeSpeaker',
					},
					style: {
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(0, 0, 255),
					},
				},
				{
					feedbackId: FeedbackId.galleryBased,
					options: {
						position: index,
						type: 'handRaised',
						handRaised: 1,
					},
					style: {
						png64: images.handRaised,
					},
				},
				{
					feedbackId: FeedbackId.galleryBased,
					options: {
						position: index,
						type: 'selected',
					},
					style: {
						color: combineRgb(0, 0, 0),
						bgcolor: combineRgb(255, 255, 0),
					},
				},
			],
		}
	}

	/**
	 * Manage Selections & Groups
	 */
	//clear selection
	presets[`Clear_Participants`] = {
		type: 'button',
		category: 'Manage Selections & Groups',
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
	presets[`Toggle_Selection_Method`] = {
		type: 'button',
		category: 'Manage Selections & Groups',
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
	presets[`Single_selection`] = {
		type: 'button',
		category: 'Manage Selections & Groups',
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
	presets[`Select_by_name`] = {
		type: 'button',
		category: 'Manage Selections & Groups',
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
	presets[`Multiple_selection`] = {
		type: 'button',
		category: 'Manage Selections & Groups',
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
	// Next participants
	presets[`Next_participants`] = {
		type: 'button',
		category: 'Manage Selections & Groups',
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
	presets[`Previous _participants`] = {
		type: 'button',
		category: 'Manage Selections & Groups',
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
		presets[`Make_group_${ZoomGroupData[index].groupName}`] = {
			type: 'button',
			category: 'Manage Selections & Groups',
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
		presets[`Add_to_group_${ZoomGroupData[index].groupName}`] = {
			type: 'button',
			category: 'Manage Selections & Groups',
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
		presets[`Clear_group_${ZoomGroupData[index].groupName}`] = {
			type: 'button',
			category: 'Manage Selections & Groups',
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
		presets[`Select_${ZoomGroupData[index].groupName}`] = {
			type: 'button',
			category: 'Manage Selections & Groups',
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
		presets[`Rename_${ZoomGroupData[index].groupName}`] = {
			type: 'button',
			category: 'Manage Selections & Groups',
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
		// 	presets[`Group${index + 1}_Position${position}`] = {
		// 		type: 'button',
		// 		category: `Manage Selections & Groups`,
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
		// 				feedbackId: FeedbackId.groupBased,
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
		// 				feedbackId: FeedbackId.groupBased,
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
		// 				feedbackId: FeedbackId.groupBased,
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
		// 	}
		// }
	}
	/**
	 * Pin/Spotlight & View Actions
	 */
	presets['Pin'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Pin',
		style: {
			text: 'Pin',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.pin, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['add_Pin'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'add_Pin',
		style: {
			text: 'Add Pin',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.addPin, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['un_Pin'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'un_Pin',
		style: {
			text: 'Un Pin',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.unpin, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Toggle_Pin'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Toggle_Pin',
		style: {
			text: 'Toggle Pin',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.togglePin, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Pin_Screen_2'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Pin_Screen_2',
		style: {
			text: 'Pin Screen 2',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.pinScreen2, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['UnPin_Screen_2'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'UnPin_Screen_2',
		style: {
			text: 'Un Pin Screen 2',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.unPinScreen2, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Toggle_Screen_2'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Toggle_Screen_2',
		style: {
			text: 'Toggle Pin Screen 2',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.togglePinScreen2, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Clear_Pins'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Clear_Pins',
		style: {
			text: 'Clear Pins',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.clearPins, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Spotlight'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Spotlight',
		style: {
			text: 'Spotlight',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.spotLight, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Add_Spotlight'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Add_Spotlight',
		style: {
			text: 'Add to Spotlight',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.addSpotlight, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Un_Spotlight'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Un_Spotlight',
		style: {
			text: 'Un Spotlight',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.unSpotLight, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Toggle_Spotlight'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Toggle_Spotlight',
		style: {
			text: 'Toggle Spotlight',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.toggleSpotlight, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Clear_Spotlight'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Clear_Spotlight',
		style: {
			text: 'Clear Spotlight',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.clearSpotlight, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Set_Gallery_View'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Set_Gallery_View',
		style: {
			text: 'Set Gallery View',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.setGalleryView, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Set_Speaker_View'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Set_Speaker_View',
		style: {
			text: 'Set Speaker View',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.setSpeakerView, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Next_Gallery_Page'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Next_Gallery_Page',
		style: {
			text: 'Next Gallery Page',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.gotoNextGalleryPage, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Previous_Gallery_Page'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Previous_Gallery_Page',
		style: {
			text: 'Previous Gallery Page',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.gotoPreviousGalleryPage, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Show_Non_Video_Participants'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Show_Non_Video_Participants',
		style: {
			text: 'Show Non Video Participants',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.showNonVideoParticipants, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Hide_Non_Video_Participants'] = {
		type: 'button',
		category: 'Pin/Spotlight & View Actions',
		name: 'Hide_Non_Video_Participants',
		style: {
			text: 'Hide Non Video Participants',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.hideNonVideoParticipants, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	/**
	 * Video/Audio Actions
	 */
	presets['Video_On'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Video_On',
		style: {
			text: 'Turn Video On',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.turnVideoOn, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Video_Off'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Video_Off',
		style: {
			text: 'Turn Video Off',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.turnVideoOff, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Toggle_Video'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Toggle_Video',
		style: {
			text: 'Toggle Video State',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.toggleVideoState, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Mute'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Mute',
		style: {
			text: 'Mute',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.mute, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Unmute'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Mute_All',
		style: {
			text: 'Unmute',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.unmute, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Mute_All'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Mute_All',
		style: {
			text: 'Mute all',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.muteAll, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Unmute_All'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Unmute_All',
		style: {
			text: 'Unmute all',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.unmuteAll, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Toggle_mute'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Toggle_mute',
		style: {
			text: 'Toggle mute',
			size: '18',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [{ actionId: ActionId.toggleMuteState, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	/**
	 * ZoomISO Output Actions
	 */

	presets[`Apply_Output`] = {
		type: 'button',
		category: 'ZoomISO Output Actions',
		name: `Apply_Output`,
		style: {
			text: `Apply Output`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.applyOutput, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Apply_Channel`] = {
		type: 'button',
		category: 'ZoomISO Output Actions',
		name: `Apply_Channel`,
		style: {
			text: `Apply Channel`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.applyChannel, options: {} }], up: [] }],
		feedbacks: [],
	}
	for (let index = 1; index < 8; index++) {
		presets[`Select_Output_${index}`] = {
			type: 'button',
			category: 'ZoomISO Output Actions',
			name: `Select Output ${index}`,
			style: {
				text: `Select Output ${index}`,
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(86, 221, 221),
			},
			steps: [
				{
					down: [
						{
							actionId: ActionId.selectOutput,
							options: { output: index },
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
		presets[`Select_Audio_Channel ${index}`] = {
			type: 'button',
			category: 'ZoomISO Output Actions',
			name: `Audio\nChannel ${index}`,
			style: {
				text: `Audio\nChannel ${index}`,
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(86, 221, 221),
			},
			steps: [
				{
					down: [
						{
							actionId: ActionId.selectAudioChannel,
							options: { output: index },
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
	presets[`Select_Channel`] = {
		type: 'button',
		category: 'ZoomISO Output Actions',
		name: `Select_Channel`,
		style: {
			text: `Select Channel`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.selectAudioChannel, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Apply_Outputs`] = {
		type: 'button',
		category: 'ZoomISO Output Actions',
		name: `Apply_Outputs`,
		style: {
			text: `Apply Outputs`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.applyOutputs, options: {} }], up: [] }],
		feedbacks: [],
	}

	/**
	 * Reaction & Name Actions
	 */
	presets[`Raise_Hand`] = {
		type: 'button',
		category: 'Reaction & Name Actions',
		name: `Raise_Hand`,
		style: {
			text: `Raise Hand`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.raiseHand, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Lower_Hand`] = {
		type: 'button',
		category: 'Reaction & Name Actions',
		name: `Lower_Hand`,
		style: {
			text: `Lower Hand`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.lowerHand, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Toggle_Hand`] = {
		type: 'button',
		category: 'Reaction & Name Actions',
		name: `Toggle_Hand`,
		style: {
			text: `Toggle Hand`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.toggleHand, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Lower_All_Hands`] = {
		type: 'button',
		category: 'Reaction & Name Actions',
		name: `Lower_All_Hands`,
		style: {
			text: `Lower All Hands`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.lowerAllHands, options: {} }], up: [] }],
		feedbacks: [],
	}
	// User selection
	for (const key in ZoomUserData) {
		if (Object.prototype.hasOwnProperty.call(ZoomUserData, key)) {
			const user = ZoomUserData[key]
			presets[`Rename_Participant_${user.zoomId}`] = {
				type: 'button',
				category: 'Reaction & Name Actions',
				name: user.userName,
				style: {
					text: `Rename\\n$(zoomosc:${user.zoomId})`,
					size: 'auto',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(111, 222, 222),
				},
				steps: [{ down: [{ actionId: ActionId.rename, options: { user: user.zoomId, name: user.userName } }], up: [] }],
				feedbacks: [],
			}
		}
	}
	/**
	 * Role & Management Actions
	 */
	presets[`Make_Host`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Make_Host`,
		style: {
			text: `Make Host`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.makeHost, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Make_CoHost`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Make_CoHost`,
		style: {
			text: `Make Co Host`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.makeCoHost, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Revoke_CoHost`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Revoke_CoHost`,
		style: {
			text: `Revoke CoHost`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.revokeCoHost, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Reclaim_Host`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Reclaim_Host`,
		style: {
			text: `Reclaim Host`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.reclaimHost, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Make_Panelist`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Make_Panelist`,
		style: {
			text: `Make Panelist`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.makePanelist, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Make_Attendee`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Make_Attendee`,
		style: {
			text: `Make Attendee`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.makeAttendee, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Eject_Participant`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Eject_Participant`,
		style: {
			text: `Eject Participant`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.ejectParticipant, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Eject_All`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Eject_All`,
		style: {
			text: `Eject All`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.ejectAll, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Admit_Participant`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Admit_Participant`,
		style: {
			text: `Admit Participant`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.admitSomeoneFromWaitingRoom, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Admit_All_Participant`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Admit_All_Participant`,
		style: {
			text: `Admit All`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.admitEveryoneFromWaitingRoom, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Send_to_Waiting_Room`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Send_to_Waiting_Room`,
		style: {
			text: `Send to Waiting Room`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.sendSomeoneToWaitingRoom, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Enable_Waiting_Room`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Enable_Waiting_Room`,
		style: {
			text: `Enable Waiting Room`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.enableWaitingRoom, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Disable_Waiting_Room`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Disable_Waiting_Room`,
		style: {
			text: `Disable Waiting Room`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.disableWaitingRoom, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Allow_To_Speak`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Allow_To_speak`,
		style: {
			text: `Allow to Speak`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.allowWebinarAttendeeToSpeak, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Disallow_To_Speak`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Disallow_To_speak`,
		style: {
			text: `Disallow to Speak`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.disallowToSpeak, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Enable_Users_Unmute`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Enable_Users_Unmute`,
		style: {
			text: `Enable Users Unmute`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.enableUsersToUnmute, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Disable_Users_Unmute`] = {
		type: 'button',
		category: 'Role & Management Actions',
		name: `Disable_Users_Unmute`,
		style: {
			text: `Disable Users Unmute`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.disableUsersToUnmute, options: {} }], up: [] }],
		feedbacks: [],
	}

	/**
	 * Join/Leave/End Actions
	 */
	 presets[`Join_Meeting`] = {
		type: 'button',
		category: 'Join/Leave/End Actions',
		name: `Join_Meeting`,
		style: {
			text: `Join Meeting`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.joinMeeting, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Leave_Meeting`] = {
		type: 'button',
		category: 'Join/Leave/End Actions',
		name: `Leave_Meeting`,
		style: {
			text: `Leave Meeting`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.leaveMeeting, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`End_Meeting`] = {
		type: 'button',
		category: 'Join/Leave/End Actions',
		name: `End_Meeting`,
		style: {
			text: `End Meeting`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.endMeeting, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`ZAK_Join_Meeting`] = {
		type: 'button',
		category: 'Join/Leave/End Actions',
		name: `ZAK_Join_Meeting`,
		style: {
			text: `ZAK Join Meeting`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.ZAKJoinMeeting, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`ZAK_Start_Meeting`] = {
		type: 'button',
		category: 'Join/Leave/End Actions',
		name: `ZAK_Start_Meeting`,
		style: {
			text: `ZAK Start Meeting`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.ZAKStartMeeting, options: {} }], up: [] }],
		feedbacks: [],
	}

	/**
	 * Devices & Settings Actions
	 */
	 presets[`Set_Camera`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Set_Camera`,
		style: {
			text: `Set Camera`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.setCameraDevice, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Set_Mic`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Set_Mic`,
		style: {
			text: `Set Mic`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.setMicDevice, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Set_Camera`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Set_Camera`,
		style: {
			text: `Set Camera`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.setCameraDevice, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Set_Mic_Level`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Set_Mic_Level`,
		style: {
			text: `Set Mic Level`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.setMicLevel, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Set_Speaker_Level`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Set_Speaker_Level`,
		style: {
			text: `Set Speaker Level`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.setSpeakerVolume, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Enable_Original_Sound`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Enable_Original_Sound`,
		style: {
			text: `Enable Original Sound`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.enableOriginalSound, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Disable_Original_Sound`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Disable_Original_Sound`,
		style: {
			text: `Disable Original Sound`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.disableOriginalSound, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Enable_Mirror`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Enable_Mirror`,
		style: {
			text: `Enable Mirror`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.enableMirrorVideo, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Disable_Mirror`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Disable_Mirror`,
		style: {
			text: `Disable Mirror`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.disableMirrorVideo, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Enable_HD`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Enable_HD`,
		style: {
			text: `Enable HD`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.enableHDVideo, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Disable_HD`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Disable_HD`,
		style: {
			text: `Disable HD`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.disableHDVideo, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Set_Window_XY`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Set_Window_XY`,
		style: {
			text: `Set Window XY`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.SetWindowPosition, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Set_Window_Size`] = {
		type: 'button',
		category: 'Devices & Settings Actions',
		name: `Set_Window_Size`,
		style: {
			text: `Set Window Size`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.SetWindowSize, options: {} }], up: [] }],
		feedbacks: [],
	}

	/**
	 * Chat Actions
	 */
	 presets[`Send_Chat_Everyone`] = {
		type: 'button',
		category: 'Chat Actions',
		name: `Send_Chat_Everyone`,
		style: {
			text: `Send Chat Everyone`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.sendAChatToEveryone, options: {} }], up: [] }],
		feedbacks: [],
	}
	 presets[`Send_Chat_DM`] = {
		type: 'button',
		category: 'Chat Actions',
		name: `Send_Chat_DM`,
		style: {
			text: `Send Chat DM`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(86, 221, 221),
		},
		steps: [{ down: [{ actionId: ActionId.sendAChatViaDM, options: {} }], up: [] }],
		feedbacks: [],
	}
	return presets



// Sharing Actions
// 	-->Screen Share
// 	-->Screen Share Primary
// 	-->Share Window
// 	-->Share Camera
// 	-->Share Audio
// 	-->Cycle Shared Camera
// 	-->Enable Optimize for Video
// 	-->Disable Optimize for Video

// Breakout Actions
// 	-->Create Breakout Room
// 	-->Configure Breakouts
// 	-->Delete Breakout Room
// 	-->Open Breakouts
// 	-->Close Breakouts
// 	-->Delete All Breakouts
// 	-->Return Self to Main Room
// 	-->Broadcast Message to Breakouts

// Recording Actions
// 	-->Start Local Recording
// 	-->Pause Local Recording
// 	-->Resume Local Recording
// 	-->Stop Local Recording
// 	-->Start Cloud Recording
// 	-->Pause Cloud Recording
// 	-->Resume Cloud Recording
// 	-->Stop Cloud Recording
// 	-->Allow to Local Record
// 	-->Disallow to Local Record

// Data and Custom Actions
// 	-->Ping
// 	-->Request List of Breakout Rooms
// 	-->Request Participants List
// 	-->Request Gallery Order
// 	-->Request Gallery Count
// 	-->Custom Command
// 	-->Custom with Args

// Group (x)...
// 	-->(Group x Participants List)
}

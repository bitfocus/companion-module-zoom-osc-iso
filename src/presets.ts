import { combineRgb, CompanionButtonPresetDefinition, CompanionPresetDefinitions } from '@companion-module/base'
import { ActionId } from './actions'
import { FeedbackId } from './feedback'
const { images } = require('./images') // eslint-disable-line
import {
	padding,
	userExist,
	ZoomAudioRoutingDataInterface,
	ZoomGroupDataInterface,
	ZoomUserDataInterface,
} from './utils'

enum feedbackType {
	selected = 0,
	micLive = 1,
	handRaised = 2,
	camera = 3,
	activeSpeaker = 4,
}

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

interface FeedbackTypeOptions {
	color?: number
	bgcolor?: number
	png64?: string
}
const participantFeedbackStyles: { [key: string]: FeedbackTypeOptions } = {
	micLive: {
		color: combineRgb(0, 0, 0),
		bgcolor: combineRgb(255, 0, 0),
	},
	activeSpeaker: {
		color: combineRgb(255, 255, 255),
		bgcolor: combineRgb(0, 0, 255),
	},
	handRaised: {
		png64: images.handRaised,
	},
	selected: {
		color: combineRgb(0, 0, 0),
		bgcolor: combineRgb(255, 255, 0),
	},
}

export function GetPresetList(
	ZoomGroupData: ZoomGroupDataInterface[],
	ZoomUserData: ZoomUserDataInterface,
	ZoomAudioRoutingData: ZoomAudioRoutingDataInterface
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
				text: `${index}. $(zoomosc:Participant${padding(index, 3)})`,
				size: 'auto',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(230, 230, 230),
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
						type: feedbackType.micLive,
					},
					style: participantFeedbackStyles.micLive,
				},
				{
					feedbackId: FeedbackId.indexBased,
					options: {
						position: index,
						type: feedbackType.handRaised,
						handRaised: 1,
					},
					style: participantFeedbackStyles.handRaised,
				},
				{
					feedbackId: FeedbackId.indexBased,
					options: {
						position: index,
						type: feedbackType.activeSpeaker,
					},
					style: participantFeedbackStyles.activeSpeaker,
				},
				{
					feedbackId: FeedbackId.indexBased,
					options: {
						position: index,
						type: feedbackType.selected,
					},
					style: participantFeedbackStyles.selected,
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
				text: `Gal Pos ${index}\\n$(zoomosc:GalleryPosition${padding(index, 2)})`,
				size: 'auto',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(230, 230, 230),
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
						type: feedbackType.micLive,
					},
					style: participantFeedbackStyles.micLive,
				},
				{
					feedbackId: FeedbackId.galleryBased,
					options: {
						position: index,
						type: feedbackType.handRaised,
					},
					style: participantFeedbackStyles.handRaised,
				},
				{
					feedbackId: FeedbackId.galleryBased,
					options: {
						position: index,
						type: feedbackType.activeSpeaker,
					},
					style: participantFeedbackStyles.activeSpeaker,
				},

				{
					feedbackId: FeedbackId.galleryBased,
					options: {
						position: index,
						type: feedbackType.selected,
					},
					style: participantFeedbackStyles.selected,
				},
			],
		}
	}

	/**
	 * Manage Selections & Groups
	 */
	presets[`Restore_Previous_Selection`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Restore Previous Selection`,
		style: {
			text: `Restore Previous Selection`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [
			{
				down: [{ actionId: ActionId.restorePreviousSelection, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	//clear selection
	presets[`Clear_Participants`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Clear Selections`,
		style: {
			text: `Clear Selections ($(zoomosc:selectedNumberOfCallers))`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
		category: 'Manage Selections of Participants',
		name: `Selection Method`,
		style: {
			text: `Toggle Selection Method`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
		category: 'Manage Selections of Participants',
		name: `Single selection`,
		style: {
			text: `Single selection`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.selectionMethod, options: { selectionMethod: 1 } }], up: [] }],
		feedbacks: [],
	}
	// Select by name
	presets[`Select_by_name`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Select by name`,
		style: {
			text: `Select by name`,
			size: 'auto',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.selectUserByName, options: { option: 'toggle' } }], up: [] }],
		feedbacks: [
			{
				feedbackId: FeedbackId.userNameBased,
				options: {
					name: '',
					type: feedbackType.micLive,
				},
				style: participantFeedbackStyles.micLive,
			},
			{
				feedbackId: FeedbackId.userNameBased,
				options: {
					name: '',
					type: feedbackType.handRaised,
				},
				style: participantFeedbackStyles.handRaised,
			},
			{
				feedbackId: FeedbackId.userNameBased,
				options: {
					name: '',
					type: feedbackType.activeSpeaker,
				},
				style: participantFeedbackStyles.activeSpeaker,
			},
			{
				feedbackId: FeedbackId.userNameBased,
				options: {
					name: '',
					type: feedbackType.selected,
				},
				style: participantFeedbackStyles.selected,
			},
		],
	}
	// Multiple selection
	presets[`Multiple_selection`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Multiple selection`,
		style: {
			text: `Multiple selection`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.selectionMethod, options: { selectionMethod: 0 } }], up: [] }],
		feedbacks: [],
	}
	// Next participants
	presets[`Next_participants`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Next participants`,
		style: {
			text: `Next participants`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.nextParticipants, options: { shift: 30 } }], up: [] }],
		feedbacks: [],
	}
	// Previous participants
	presets[`Previous _participants`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Previous participants`,
		style: {
			text: `Previous participants`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.previousParticipants, options: { shift: 30 } }], up: [] }],
		feedbacks: [],
	}
	// Group presets
	for (let index = 0; index < ZoomGroupData.length; index++) {
		if (index !== 0) {
			presets[`Replace_group_${ZoomGroupData[index].groupName}`] = {
				type: 'button',
				category: 'Manage Selections of Groups',
				name: `Replace ${ZoomGroupData[index].groupName} participants`,
				style: {
					text: `Replace\\n$(zoomosc:Group${index})\\nparticip.`,
					size: '14',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(230, 230, 230),
				},
				steps: [
					{ down: [{ actionId: ActionId.addToGroup, options: { group: index, groupOption: 'replace' } }], up: [] },
				],
				feedbacks: [],
			}
			presets[`Add_to_group_${ZoomGroupData[index].groupName}`] = {
				type: 'button',
				category: 'Manage Selections of Groups',
				name: `Add to group: ${ZoomGroupData[index].groupName}`,
				style: {
					text: `Add to group:\\n$(zoomosc:Group${index})`,
					size: '14',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(230, 230, 230),
				},
				steps: [{ down: [{ actionId: ActionId.addToGroup, options: { group: index, groupOption: 'add' } }], up: [] }],
				feedbacks: [],
			}
			presets[`Clear_group_${ZoomGroupData[index].groupName}`] = {
				type: 'button',
				category: 'Manage Selections of Groups',
				name: `Clear group: ${ZoomGroupData[index].groupName}`,
				style: {
					text: `Clear group:\\n$(zoomosc:Group${index})`,
					size: '14',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(230, 230, 230),
				},
				steps: [{ down: [{ actionId: ActionId.clearGroup, options: { group: index } }], up: [] }],
				feedbacks: [],
			}
			presets[`Remove_from_group_${ZoomGroupData[index].groupName}`] = {
				type: 'button',
				category: 'Manage Selections of Groups',
				name: `Remove_from group: ${ZoomGroupData[index].groupName}`,
				style: {
					text: `Remove from\\n$(zoomosc:Group${index})`,
					size: '14',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(230, 230, 230),
				},
				steps: [{ down: [{ actionId: ActionId.removeFromGroup, options: { group: index } }], up: [] }],
				feedbacks: [],
			}
		}
		presets[`Rename_${ZoomGroupData[index].groupName}`] = {
			type: 'button',
			category: 'Manage Selections of Groups',
			name: ZoomGroupData[index].groupName,
			style: {
				text: `Rename\\nGroup\\n$(zoomosc:Group${index})`,
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(230, 230, 230),
			},
			steps: [
				{
					down: [{ actionId: ActionId.renameGroup, options: { group: index, name: ZoomGroupData[index].groupName } }],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets[`Select_${ZoomGroupData[index].groupName}`] = {
			type: 'button',
			category: `Manage Selections of Groups`,
			name: ZoomGroupData[index].groupName,
			style: {
				text: `Select\\n$(zoomosc:Group${index}) ($(zoomosc:CallersInGroup${index}))`,
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(230, 230, 230),
			},
			steps: [{ down: [{ actionId: ActionId.selectGroup, options: { group: index } }], up: [] }],
			feedbacks: [],
		}

		for (let position = 1; position < 50; position++) {
			presets[`Group${index}_Position${position}`] = {
				type: 'button',
				category: `Select ${ZoomGroupData[index].groupName} participants`,
				name: 'Group selection',
				style: {
					text: `$(zoomosc:Group${index})-${position}\\n$(zoomosc:Group${index}Position${position})`,
					size: 'auto',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(230, 230, 230),
				},
				steps: [
					{
						down: [
							{
								actionId: ActionId.selectUserFromGroupPosition,
								options: { group: index, position: position, option: 'toggle' },
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackId.groupBased,
						options: {
							group: index,
							position: position,
							type: feedbackType.micLive,
						},
						style: participantFeedbackStyles.micLive,
					},
					{
						feedbackId: FeedbackId.groupBased,
						options: {
							group: index,
							position: position,
							type: feedbackType.handRaised,
						},
						style: participantFeedbackStyles.handRaised,
					},
					{
						feedbackId: FeedbackId.groupBased,
						options: {
							group: index,
							position: position,
							type: feedbackType.activeSpeaker,
						},
						style: participantFeedbackStyles.activeSpeaker,
					},

					{
						feedbackId: FeedbackId.groupBased,
						options: {
							group: index,
							position: position,
							type: feedbackType.selected,
						},
						style: participantFeedbackStyles.selected,
					},
				],
			}
		}
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			text: 'Single Spotlight',
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [
			{
				down: [{ actionId: ActionId.unmuteAll, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['mute_all_except'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'mute_all_except',
		style: {
			text: 'Mute All Except',
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [
			{
				down: [{ actionId: ActionId.muteAllExcept, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['mute_all_except_hosts'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Mute all except Hosts',
		style: {
			text: 'Mute All Except Hosts',
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [
			{
				down: [{ actionId: ActionId.muteAllExceptHost, options: {} }],
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
	 * ZoomISO Selections
	 */
	presets[`Apply_Output`] = {
		type: 'button',
		category: 'ZoomISO Selections',
		name: `Apply_Output`,
		style: {
			text: `Apply Output`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.applyOutput, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Apply_Outputs`] = {
		type: 'button',
		category: 'ZoomISO Selections',
		name: `Apply_Outputs`,
		style: {
			text: `Apply Outputs`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.applyOutputs, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Apply_Channel`] = {
		type: 'button',
		category: 'ZoomISO Selections',
		name: `Apply_Channel`,
		style: {
			text: `Apply Channel`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.applyChannel, options: {} }], up: [] }],
		feedbacks: [],
	}
	for (
		let index = 1;
		index < (Object.keys(ZoomAudioRoutingData).length === 0 ? 9 : Object.keys(ZoomAudioRoutingData).length + 1);
		index++
	) {
		presets[`Select_Output_${index}`] = {
			type: 'button',
			category: 'ZoomISO Selections',
			name: `Select Output ${index}`,
			style: {
				text: `Select Output ${index}`,
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(141, 218, 77),
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
						color: combineRgb(0, 0, 0),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			],
		}
	}
	for (let index = 1; index < 9; index++) {
		presets[`Select_Audio_Channel ${index}`] = {
			type: 'button',
			category: 'ZoomISO Selections',
			name: `Audio\nChannel ${index}`,
			style: {
				text: `Audio\nChannel ${index}`,
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(141, 218, 77),
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
						color: combineRgb(0, 0, 0),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			],
		}
	}
	presets[`Select_Channel`] = {
		type: 'button',
		category: 'ZoomISO Selections',
		name: `Select_Channel`,
		style: {
			text: `Select Channel`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.selectAudioChannel, options: { output: 1 } }], up: [] }],
		feedbacks: [],
	}

	/**
	 * ZoomISO Actions
	 */
	presets[`set_user_to_output`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_user_to_output`,
		style: {
			text: `Set User to Output`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.outputISO, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`add_Output`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `add_Output`,
		style: {
			text: `Add Output`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.addOutput, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`delete_Output`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `delete_Output`,
		style: {
			text: `Delete Output`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.deleteOutput, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`disable_Output`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `disable_Output`,
		style: {
			text: `Disable Output`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.disableOutput, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`enable_Output`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `enable_Output`,
		style: {
			text: `Enable Output`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.enableOutput, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_output_count`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_count`,
		style: {
			text: `set Output Count`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.setOutputCount, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_output_embedded_audio`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_embedded_audio`,
		style: {
			text: `Set Output Embedded Audio`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.setOutputEmbeddedAudio, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_output_name`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_name`,
		style: {
			text: `Set Output Name`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.setOutputName, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_output_selection`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_selection`,
		style: {
			text: `Set Output Selection`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.setOutputSelection, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_output_mode`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_mode`,
		style: {
			text: `Set Output Mode`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.setOutputMode, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_output_type`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_type`,
		style: {
			text: `Set Output Type`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.setOutputType, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`standby_iso_engine`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `standby_iso_engine`,
		style: {
			text: `Standby ISO Engine`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.standbyISOEngine, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`start_iso_engine`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `start_iso_engine`,
		style: {
			text: `Start ISO Engine`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.startISOEngine, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`stop_iso_engine`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `stop_iso_engine`,
		style: {
			text: `Stop ISO Engine`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.stopISOEngine, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_video_loss_mode`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_video_loss_mode`,
		style: {
			text: `Set Video Loss Mode`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.setVideoLossMode, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_user_to_audio_channel`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_user_to_audio_channel`,
		style: {
			text: `Set User to Audio Channel`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.audioISO, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_audio_gain_reduction`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_audio_gain_reduction`,
		style: {
			text: `Set Audio Gain Reduction`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.setAudioGainReduction, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_audio_selection`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_audio_selection`,
		style: {
			text: `Set Audio Selection`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.setAudioSelection, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_output_embedded_audio`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_embedded_audio`,
		style: {
			text: `Set Output Embedded Audio`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.setOutputEmbeddedAudio, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`set_audio_mode`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_audio_mode`,
		style: {
			text: `Set Audio Mode`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(141, 218, 77),
		},
		steps: [{ down: [{ actionId: ActionId.setAudioMode, options: {} }], up: [] }],
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.lowerAllHands, options: {} }], up: [] }],
		feedbacks: [],
	}
	// User selection
	for (const key in ZoomUserData) {
		if (userExist(Number(key), ZoomUserData)) {
			const user = ZoomUserData[key]
			presets[`Rename_Participant_${user.zoomId}`] = {
				type: 'button',
				category: 'Reaction & Name Actions',
				name: user.userName,
				style: {
					text: `Rename\\n$(zoomosc:${user.zoomId})`,
					size: '14',
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
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
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.sendAChatViaDM, options: {} }], up: [] }],
		feedbacks: [],
	}

	/**
	 * Sharing Actions
	 */
	presets[`Screen_Share`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Screen_Share`,
		style: {
			text: `Screen Share`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.startScreenShare, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Stop_Share`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Stop_Share`,
		style: {
			text: `Stop Share`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.stopSharing, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Screen_Share_Primary`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Screen_Share_Primary`,
		style: {
			text: `Screen Share Primary`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.startScreenShareWithPrimaryScreen, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Share_Window`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Share_Window`,
		style: {
			text: `Share Window`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.startShareWithWindow, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Share_Camera`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Share_Camera`,
		style: {
			text: `Share Camera`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.startCameraShare, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Share_Audio`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Share_Audio`,
		style: {
			text: `Share Audio`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.startAudioShare, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Cycle_Shared_Camera`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Cycle_Shared_Camera`,
		style: {
			text: `Cycle Shared Camera`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.cycleSharedCameraToNextAvailable, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Enable Optimize for Video`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Enable Optimize for Video`,
		style: {
			text: `Enable Optimize for Video`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.enableOptimizeVideoForSharing, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Disable_Optimize_for_Video`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Disable_Optimize_for_Video`,
		style: {
			text: `Disable Optimize for Video`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.disableOptimizeVideoForSharing, options: {} }], up: [] }],
		feedbacks: [],
	}

	/**
	 * Breakout Actions
	 */
	presets[`Send_Participant_To_BreakoutRoom`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Send_Participant_To_BreakoutRoom`,
		style: {
			text: `Send To BreakoutRoom`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.sendParticipantToBreakoutRoom, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Create_Breakout_Room`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Create_Breakout_Room`,
		style: {
			text: `Create Breakout Room`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.createBreakoutRoom, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Configure_Breakouts`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Configure_Breakouts`,
		style: {
			text: `Configure Breakouts`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.configureBreakoutRooms, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Delete_Breakout_Room`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Delete_Breakout_Room`,
		style: {
			text: `Delete Breakout Room`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.deleteBreakoutRoom, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Open_Breakouts`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Open_Breakouts`,
		style: {
			text: `Open Breakouts`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.openBreakoutRooms, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Close_Breakouts`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Close_Breakouts`,
		style: {
			text: `Close Breakouts`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.closeBreakoutRooms, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Delete_All_Breakouts`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Delete_All_Breakouts`,
		style: {
			text: `Delete All Breakouts`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.deleteAllBreakoutRooms, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Return_Self_to_Main_Room`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Return_Self_to_Main_Room`,
		style: {
			text: `Return Self to Main Room`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.returnSelfToMainMeeting, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Broadcast_Message_to_Breakouts`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Broadcast_Message_to_Breakouts`,
		style: {
			text: `Broadcast Message to Breakouts`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.broadcastMessageToBreakoutRooms, options: {} }], up: [] }],
		feedbacks: [],
	}

	/**
	 * Recording Actions
	 */
	presets[`Start_Local_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Start_Local_Recording`,
		style: {
			text: `Start Local Recording`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.startLocalRecording, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Pause_Local_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Pause_Local_Recording`,
		style: {
			text: `Pause Local Recording`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.pauseLocalRecording, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Resume_Local_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Resume_Local_Recording`,
		style: {
			text: `Resume Local Recording`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.resumeLocalRecording, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Stop_Local_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Stop_Local_Recording`,
		style: {
			text: `Stop Local Recording`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.stopLocalRecording, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Start_Cloud_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Start_Cloud_Recording`,
		style: {
			text: `Start Cloud Recording`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.startCloudRecording, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Pause_Cloud_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Pause_Cloud_Recording`,
		style: {
			text: `Pause Cloud Recording`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.pauseCloudRecording, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Resume_Cloud_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Resume_Cloud_Recording`,
		style: {
			text: `Resume Cloud Recording`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.resumeCloudRecording, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Stop_Cloud_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Stop_Cloud_Recording`,
		style: {
			text: `Stop Cloud Recording`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.stopCloudRecording, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Allow_to_Local_Record`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Allow_to_Local_Record`,
		style: {
			text: `Allow to Local Record`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.allowToRecord, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Disallow_to_Local_Record`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Disallow_to_Local_Record`,
		style: {
			text: `Disallow to Local Record`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.disallowToRecord, options: {} }], up: [] }],
		feedbacks: [],
	}
	/**
	 * Data and Custom Actions
	 */
	presets[`Ping`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Ping`,
		style: {
			text: `Ping`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.pingZoomOSC, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Request_List_Participants`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Request_List_Participants`,
		style: {
			text: `Request List of Participants`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.listUsers, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Request_List_of_Breakout_Rooms`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Request_List_of_Breakout_Rooms`,
		style: {
			text: `Request List of Breakout Rooms`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.requestListOfBreakoutRooms, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Request_Gallery_Order`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Request_Gallery_Order`,
		style: {
			text: `Request Gallery Order`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.requestOrderOfGalleryView, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Request_Gallery_Count`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Request_Gallery_Count`,
		style: {
			text: `Request Gallery Count`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.requestGalleryCount, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Custom_Command`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Custom_Command`,
		style: {
			text: `Custom Command`,
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.customCommand, options: {} }], up: [] }],
		feedbacks: [],
	}
	presets[`Custom_Command_with_Arguments`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Custom_Command_with_Arguments`,
		style: {
			text: `Custom Command with Arguments`,
			size: '7',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(230, 230, 230),
		},
		steps: [{ down: [{ actionId: ActionId.customCommandWithArguments, options: {} }], up: [] }],
		feedbacks: [],
	}

	return presets

	// Group (x)...
	// 	-->(Group x Participants List)
}

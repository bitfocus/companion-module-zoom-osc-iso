import { CompanionPreset } from '../../../instance_skel_types'
import ZoomInstance from './index'
import { GlobalActionCallbacks } from './actions'
import { FeedbackCallbacks } from './feedback'
const { Actions, ActionsWithArguments } = require('./osccommands')
const { images } = require('./images')

export type PresetCategory = 'Select Users' | 'User presets' | 'Global Presets' | 'Special Presets'

interface ZoomGlobalPresetAdditions {
	category: string
	actions: GlobalActionCallbacks[]
	release_actions?: GlobalActionCallbacks[]
	feedbacks: FeedbackCallbacks[]
}

export type ZoomGlobalPreset = Exclude<CompanionPreset, 'category' | 'actions' | 'release_actions' | 'feedbacks'> &
	ZoomGlobalPresetAdditions

export function getSelectUsersPresets(instance: ZoomInstance): CompanionPreset[] {
	let presets: CompanionPreset[] = []

	//clear selection
	presets.push({
		category: 'Select Participants',
		label: `Clear Participants`,
		bank: {
			style: 'text',
			text: `Clear Participants ($(zoomosc:selectedNumberOfCallers))`,
			size: 'auto',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(125, 125, 125),
		},
		actions: [{ action: 'clearParticipants', options: {} }],
		feedbacks: [],
	})
	// Selection method
	presets.push({
		category: 'Select Participants',
		label: `Selection Method`,
		bank: {
			style: 'text',
			text: `Toggle Selection Method`,
			size: 'auto',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(125, 125, 125),
		},
		actions: [{ action: 'selectionMethod', options: { selectionMethod: 2 } }],
		feedbacks: [
			{
				type: 'selectionMethod',
				options: {
					selectionMethod: 1,
				},
				style: {
					text: 'Single selection',
				},
			},
			{
				type: 'selectionMethod',
				options: {
					selectionMethod: 0,
				},
				style: {
					text: 'Multiple selection',
				},
			},
		],
	})
	// Single selection
	presets.push({
		category: 'Select Participants',
		label: `Single selection`,
		bank: {
			style: 'text',
			text: `Single selection`,
			size: 'auto',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(125, 125, 125),
		},
		actions: [{ action: 'selectionMethod', options: { selectionMethod: 1 } }],
		feedbacks: [],
	})
	// Select by name
	presets.push({
		category: 'Select Participants',
		label: `Select by name`,
		bank: {
			style: 'text',
			text: `Select by name`,
			size: 'auto',
			color: instance.rgb(0, 0, 0),
			bgcolor: instance.rgb(255, 191, 128),
		},
		actions: [{ action: 'SelectUserByName', options: { option: 'toggle' } }],
		feedbacks: [
			{
				type: 'userNameBased',
				options: {
					name: '',
					type: 'micLive',
				},
				style: {
					color: instance.rgb(255, 255, 255),
					bgcolor: instance.rgb(255, 0, 0),
				},
			},
			{
				type: 'userNameBased',
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
				type: 'userNameBased',
				options: {
					name: '',
					type: 'activeSpeaker',
				},
				style: {
					color: instance.rgb(255, 255, 255),
					bgcolor: instance.rgb(0, 0, 255),
				},
			},
			{
				type: 'userNameBased',
				options: {
					name: '',
					type: 'selected',
				},
				style: {
					color: instance.rgb(0, 0, 0),
					bgcolor: instance.rgb(255, 255, 0),
				},
			},
		],
	})
	// Multiple selection
	presets.push({
		category: 'Select Participants',
		label: `Multiple selection`,
		bank: {
			style: 'text',
			text: `Multiple selection`,
			size: 'auto',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(125, 125, 125),
		},
		actions: [{ action: 'selectionMethod', options: { selectionMethod: 0 } }],
		feedbacks: [],
	})
	// ISO
	presets.push({
		category: 'ISO Presets',
		label: `Take Outputs`,
		bank: {
			style: 'text',
			text: `Take Outputs`,
			size: 'auto',
			color: instance.rgb(0, 0, 0),
			bgcolor: instance.rgb(86, 221, 221),
		},
		actions: [{ action: 'takeSelectedOutputs', options: {} }],
		feedbacks: [],
	})
	// Next participants
	presets.push({
		category: 'Select Participants',
		label: `Next participants`,
		bank: {
			style: 'text',
			text: `Next participants`,
			size: 'auto',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(125, 125, 125),
		},
		actions: [{ action: 'nextParticipants', options: { shift: 30 } }],
		feedbacks: [],
	})
	// Previous participants
	presets.push({
		category: 'Select Participants',
		label: `Previous participants`,
		bank: {
			style: 'text',
			text: `Previous participants`,
			size: 'auto',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(125, 125, 125),
		},
		actions: [{ action: 'previousParticipants', options: { shift: 30 } }],
		feedbacks: [],
	})

	// Add to group presets
	for (let index = 0; index < instance.ZoomGroupData.length; index++) {
		presets.push({
			category: 'Group presets',
			label: `Make group: ${instance.ZoomGroupData[index].groupName}`,
			bank: {
				style: 'text',
				text: `Make group:\\n$(zoomosc:Group${index + 1})`,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(125, 125, 125),
			},
			actions: [{ action: 'addToGroup', options: { group: index, groupOption: 'set' } }],
			feedbacks: [],
		})
		presets.push({
			category: 'Group presets',
			label: `Add to group: ${instance.ZoomGroupData[index].groupName}`,
			bank: {
				style: 'text',
				text: `Add to group:\\n$(zoomosc:Group${index + 1})`,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(125, 125, 125),
			},
			actions: [{ action: 'addToGroup', options: { group: index, groupOption: 'add' } }],
			feedbacks: [],
		})
		presets.push({
			category: 'Group presets',
			label: `Clear group: ${instance.ZoomGroupData[index].groupName}`,
			bank: {
				style: 'text',
				text: `Clear group:\\n$(zoomosc:Group${index + 1})`,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(125, 125, 125),
			},
			actions: [{ action: 'clearGroup', options: { group: index } }],
			feedbacks: [],
		})
		presets.push({
			category: 'Group presets',
			label: instance.ZoomGroupData[index].groupName,
			bank: {
				style: 'text',
				text: `Select\\n$(zoomosc:Group${index + 1}) ($(zoomosc:CallersInGroup${index + 1}))`,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(125, 125, 125),
			},
			actions: [{ action: 'SelectGroup', options: { group: index } }],
			feedbacks: [],
		})
		presets.push({
			category: 'Group presets',
			label: instance.ZoomGroupData[index].groupName,
			bank: {
				style: 'text',
				text: `Rename\\n$(zoomosc:Group${index + 1})`,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(125, 125, 125),
			},
			actions: [{ action: 'renameGroup', options: { group: index, name: instance.ZoomGroupData[index].groupName } }],
			feedbacks: [],
		})
		for (let position = 1; position < 50; position++) {
			presets.push({
				category: `Group ${index + 1}`,
				label: 'Group selection',
				bank: {
					style: 'text',
					text: `$(zoomosc:Group${index + 1})-${position}\\n$(zoomosc:Group${index + 1}Position${position})`,
					size: 'auto',
					color: instance.rgb(255, 255, 255),
					bgcolor: instance.rgb(125, 125, 125),
				},
				actions: [
					{ action: 'selectUserFromGroupPosition', options: { group: index, position: position, option: 'toggle' } },
				],
				feedbacks: [
					{
						type: 'groupBased',
						options: {
							group: index,
							position: position,
							type: 'selected',
						},
						style: {
							color: instance.rgb(0, 0, 0),
							bgcolor: instance.rgb(255, 255, 0),
						},
					},
					{
						type: 'groupBased',
						options: {
							group: index,
							position: position,
							type: 'micLive',
						},
						style: {
							bgcolor: instance.rgb(255, 0, 0),
						},
					},
					{
						type: 'groupBased',
						options: {
							group: index,
							position: position,
							type: 'handRaised',
						},
						style: {
							png64: images.handRaised,
						},
					},
				],
			})
		}
	}
	// Create presets for selection of unknown users
	for (let index = 1; index < 1000; index++) {
		presets.push({
			category: 'Select Participants',
			label: `Caller${index}`,
			bank: {
				style: 'text',
				text: `${index}. $(zoomosc:Participant${index})`,
				size: '14',
				color: instance.rgb(0, 0, 0),
				bgcolor: instance.rgb(192, 255, 192),
			},
			actions: [
				{
					action: 'SelectFromIndexPosition',
					options: {
						position: index,
						option: 'toggle',
					},
				},
			],
			feedbacks: [
				{
					type: 'indexBased',
					options: {
						position: index,
						type: 'micLive',
					},
					style: {
						color: instance.rgb(255, 255, 255),
						bgcolor: instance.rgb(255, 0, 0),
					},
				},
				{
					type: 'indexBased',
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
					type: 'indexBased',
					options: {
						position: index,
						type: 'activeSpeaker',
					},
					style: {
						color: instance.rgb(255, 255, 255),
						bgcolor: instance.rgb(0, 0, 255),
					},
				},
				{
					type: 'indexBased',
					options: {
						position: index,
						type: 'selected',
					},
					style: {
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(255, 255, 0),
					},
				},
			],
		})
	}
	// Create presets for gallery
	for (let index = 1; index < 50; index++) {
		presets.push({
			category: 'Select from Gallery',
			label: `$(zoomosc:Gallery position ${index})`,
			bank: {
				style: 'text',
				text: `Gal Pos ${index}\\n$(zoomosc:Gallery position ${index})`,
				size: 'auto',
				color: instance.rgb(0, 0, 0),
				bgcolor: instance.rgb(255, 255, 192),
			},
			actions: [{ action: 'SelectFromGalleryPosition', options: { position: index, option: 'toggle' } }],
			feedbacks: [
				{
					type: 'galleryBased',
					options: {
						position: index,
						type: 'micLive',
					},
					style: {
						color: instance.rgb(255, 255, 255),
						bgcolor: instance.rgb(255, 0, 0),
					},
				},
				{
					type: 'galleryBased',
					options: {
						position: index,
						type: 'activeSpeaker',
					},
					style: {
						color: instance.rgb(255, 255, 255),
						bgcolor: instance.rgb(0, 0, 255),
					},
				},
				{
					type: 'galleryBased',
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
					type: 'galleryBased',
					options: {
						position: index,
						type: 'selected',
					},
					style: {
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(255, 255, 0),
					},
				},
			],
		})
	}
	// User selection
	for (const key in instance.ZoomUserData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
			const user = instance.ZoomUserData[key]
			presets.push({
				category: 'Rename participants',
				label: user.userName,
				bank: {
					style: 'text',
					text: `Rename\\n$(zoomosc:${user.zoomId})`,
					size: 'auto',
					color: instance.rgb(0, 0, 0),
					bgcolor: instance.rgb(111, 222, 222),
				},
				actions: [{ action: 'rename', options: { user: user.zoomId, name: user.userName } }],
				feedbacks: [],
			})
		}
	}

	return presets
}
export function getPresets(instance: ZoomInstance): ZoomGlobalPreset[] {
	let presets: ZoomGlobalPreset[] = []
	for (const key of Object.keys(Actions)) {
		const element = Actions[key]
		switch (element.type) {
			case 'User':
				presets.push({
					category: 'User Presets',
					label: element.shortDescription,
					bank: {
						style: 'text',
						text: element.description,
						size: '18',
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(192, 192, 255),
					},
					actions: [
						{
							action: 'UserActions',
							options: { user: '', args: '', actionID: element.shortDescription, command: element.command },
						},
					],
					feedbacks: [],
				})
				break
			case 'ISO':
				presets.push({
					category: 'ISO Presets',
					label: element.shortDescription,
					bank: {
						style: 'text',
						text: element.description,
						size: '14',
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(86, 221, 221),
					},
					actions: [
						{
							action: 'ISOActions',
							options: { user: '', args: '', actionID: element.shortDescription, command: element.command },
						},
					],
					feedbacks: [],
				})
				break
			case 'Global':
				presets.push({
					category: 'Global Presets',
					label: element.shortDescription,
					bank: {
						style: 'text',
						text: element.description,
						size: '18',
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(255, 64, 64),
					},
					actions: [
						{ action: 'GlobalActions', options: { actionID: element.shortDescription, command: element.command } },
					],
					feedbacks: [],
				})
				break
			case 'Special':
				presets.push({
					category: 'Special Presets',
					label: element.shortDescription,
					bank: {
						style: 'text',
						text: element.description,
						size: '18',
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(255, 64, 255),
					},
					actions: [
						{ action: 'SpecialActions', options: { actionID: element.shortDescription, command: element.command } },
					],
					feedbacks: [],
				})
				break
			default:
				instance.showLog('console', 'Wrong type at building presets')
				break
		}
	}
	return presets
}

export function getPresetsWithArguments(instance: ZoomInstance): ZoomGlobalPreset[] {
	let presets: ZoomGlobalPreset[] = []
	for (const key of Object.keys(ActionsWithArguments)) {
		const element = ActionsWithArguments[key]
		switch (element.type) {
			case 'User':
				presets.push({
					category: 'User Presets',
					label: element.shortDescription,
					bank: {
						style: 'text',
						text: element.description,
						size: '18',
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(192, 192, 255),
					},
					actions: [{ action: element.shortDescription, options: { user: '', args: '', command: element.command } }],
					feedbacks: [],
				})
				break
			case 'ISO':
				presets.push({
					category: 'ISO Presets',
					label: element.shortDescription,
					bank: {
						style: 'text',
						text: element.description,
						size: '14',
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(86, 221, 221),
					},
					actions: [
						{
							action: element.shortDescription,
							options: { user: '', args: '', command: element.command },
						},
					],
					feedbacks: [],
				})
				break
			case 'Global':
				presets.push({
					category: 'Global Presets',
					label: element.shortDescription,
					bank: {
						style: 'text',
						text: element.description,
						size: '18',
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(255, 64, 64),
					},
					actions: [{ action: element.shortDescription, options: { user: '', args: '', command: element.command } }],
					feedbacks: [],
				})
				break
			case 'Special':
				presets.push({
					category: 'Special Presets',
					label: element.shortDescription,
					bank: {
						style: 'text',
						text: element.description,
						size: '18',
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(255, 64, 255),
					},
					actions: [{ action: element.shortDescription, options: { command: element.command } }],
					feedbacks: [],
				})
				break
			default:
				instance.showLog('console', 'Wrong type at building presets')
				break
		}
	}
	// extra presets
	for (let index = 1; index < 8; index++) {
		presets.push({
			category: 'ISO Presets',
			label: `Output ${index}`,
			bank: {
				style: 'text',
				text: `Output ${index}`,
				size: '14',
				color: instance.rgb(0, 0, 0),
				bgcolor: instance.rgb(86, 221, 221),
			},
			actions: [
				{
					action: 'selectOutput',
					options: { user: '', args: '', command: '/outputISO', output: index },
				},
			],
			feedbacks: [
				{
					type: 'output',
					options: {
						output: index,
					},
					style: {
						color: instance.rgb(255, 255, 255),
						bgcolor: instance.rgb(255, 0, 0),
					},
				},
			],
		})
	}
	for (let index = 1; index < 8; index++) {
		presets.push({
			category: 'ISO Presets',
			label: `Audio\nOutput ${index}`,
			bank: {
				style: 'text',
				text: `Audio\nOutput ${index}`,
				size: '14',
				color: instance.rgb(0, 0, 0),
				bgcolor: instance.rgb(86, 221, 221),
			},
			actions: [
				{
					action: 'selectAudioOutput',
					options: { user: '', args: '', command: '/audioISO', output: index },
				},
			],
			feedbacks: [
				{
					type: 'audioOutput',
					options: {
						output: index,
					},
					style: {
						color: instance.rgb(255, 255, 255),
						bgcolor: instance.rgb(255, 0, 0),
					},
				},
			],
		})
	}

	return presets
}

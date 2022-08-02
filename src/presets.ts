import { CompanionPreset } from '../../../instance_skel_types'
import ZoomInstance from './index'
import { GlobalActionCallbacks } from './actions'
import { FeedbackCallbacks } from './feedback'
const { UserActions, actionsWithArgs, GlobalActions, SpecialActions } = require('./osccommands')
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
		label: `Clear selection`,
		bank: {
			style: 'text',
			text: `Clear selected ($(zoomosc:selectedNumberOfCallers))`,
			size: 'auto',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0),
		},
		actions: [{ action: 'clearSelection', options: {} }],
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
			bgcolor: instance.rgb(0, 0, 0),
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
	presets.push({
		category: 'Select Participants',
		label: `Single selection`,
		bank: {
			style: 'text',
			text: `Single selection`,
			size: 'auto',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0),
		},
		actions: [{ action: 'selectionMethod', options: { selectionMethod: 1 } }],
		feedbacks: [],
	})
	presets.push({
		category: 'Select Participants',
		label: `Multiple selection`,
		bank: {
			style: 'text',
			text: `Multiple selection`,
			size: 'auto',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0),
		},
		actions: [{ action: 'selectionMethod', options: { selectionMethod: 0 } }],
		feedbacks: [],
	})

	// Add to group presets
	for (let index = 0; index < instance.ZoomGroupData.length; index++) {
		presets.push({
			category: 'Group presets',
			label: `Set to group: ${instance.ZoomGroupData[index].groupName}`,
			bank: {
				style: 'text',
				text: `Set to group:\\n$(zoomosc:Group${index + 1})`,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(125, 125, 125),
			},
			actions: [{ action: 'addToGroup', options: { group: index } }],
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
			category: 'Rename',
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
				category: `Group ${index+1}`,
				label: 'Group selection',
				bank: {
					style: 'text',
					text: `Group ${index+1}-${position}\\n$(zoomosc:Group${index+1}Position${position})`,
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
				text: `Caller ${index}\\n$(zoomosc:Participant${index})`,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(0, 0, 0),
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
					type: 'selectedUser',
					options: {
						position: index,
						type: 'index',
					},
					style: {
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(255, 255, 0),
					},
				},
				{
					type: 'microphoneLive',
					options: {
						position: index,
						type: 'index',
					},
					style: {
						bgcolor: instance.rgb(255, 0, 0),
					},
				},
				{
					type: 'handRaised',
					options: {
						position: index,
						type: 'index',
						handRaised: 1,
					},
					style: {
						png64: images.handRaised,
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
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(0, 0, 0),
			},
			actions: [{ action: 'SelectFromGalleryPosition', options: { position: index, option: 'toggle' } }],
			feedbacks: [
				{
					type: 'selectedUser',
					options: {
						position: index,
						type: 'gallery',
					},
					style: {
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(255, 255, 0),
					},
				},
				{
					type: 'microphoneLive',
					options: {
						position: index,
						type: 'gallery',
					},
					style: {
						bgcolor: instance.rgb(255, 0, 0),
					},
				},
				{
					type: 'handRaised',
					options: {
						position: index,
						type: 'gallery',
						handRaised: 1,
					},
					style: {
						png64: images.handRaised,
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
				category: 'Rename',
				label: user.userName,
				bank: {
					style: 'text',
					text: `Rename\\n$(zoomosc:${user.zoomId})`,
					size: 'auto',
					color: instance.rgb(255, 255, 255),
					bgcolor: instance.rgb(125, 125, 125),
				},
				actions: [{ action: 'rename', options: { user: user.zoomId, name: user.userName } }],
				feedbacks: [],
			})
		}
	}

	return presets
}
export function getUserPresets(instance: ZoomInstance): ZoomGlobalPreset[] {
	let presets: ZoomGlobalPreset[] = []
	for (const key of Object.keys(UserActions)) {
		const element = UserActions[key]
		presets.push({
			category: 'User Presets',
			label: element.shortDescription,
			bank: {
				style: 'text',
				text: element.description,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'UserActions',
					options: { user: '', args: '', actionID: element.shortDescription, command: element.command },
				},
			],
			feedbacks: [],
		})
	}

	return presets
}
export function getPresetsWithArgs(instance: ZoomInstance): ZoomGlobalPreset[] {
	let presets: ZoomGlobalPreset[] = []
	for (const key of Object.keys(actionsWithArgs)) {
		const element = actionsWithArgs[key]
		presets.push({
			category: element.type === 'User' ? 'User Presets' : 'Global Presets',
			label: element.shortDescription,
			bank: {
				style: 'text',
				text: element.description,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(0, 0, 0),
			},
			actions: [{ action: element.shortDescription, options: { user: '', args: '', command: element.command } }],
			feedbacks: [],
		})
	}

	return presets
}
export function getSpecialPresets(instance: ZoomInstance): ZoomGlobalPreset[] {
	let presets: ZoomGlobalPreset[] = []
	for (const key of Object.keys(SpecialActions)) {
		const element = SpecialActions[key]
		presets.push({
			category: 'Special Presets',
			label: element.shortDescription,
			bank: {
				style: 'text',
				text: element.description,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(0, 0, 0),
			},
			actions: [{ action: element.shortDescription, options: { command: element.command } }],
			feedbacks: [],
		})
	}

	return presets
}
export function getGlobalPresets(instance: ZoomInstance): ZoomGlobalPreset[] {
	let presets: ZoomGlobalPreset[] = []
	for (const key of Object.keys(GlobalActions)) {
		const element = GlobalActions[key]
		presets.push({
			category: 'Global Presets',
			label: element.shortDescription,
			bank: {
				style: 'text',
				text: element.description,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(0, 0, 0),
			},
			actions: [{ action: 'GlobalActions', options: { actionID: element.shortDescription, command: element.command } }],
			feedbacks: [],
		})
	}

	return presets
}

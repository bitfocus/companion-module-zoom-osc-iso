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

	// Add to group presets
	for (let index = 1; index - 1 < instance.ZoomClientDataObj.numberOfGroups; index++) {
		presets.push({
			category: 'Group presets',
			label: `Add to group: ${instance.ZoomUserData[index].userName}`,
			bank: {
				style: 'text',
				text: `Add to group:\\n$(zoomosc:${index})`,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(125, 125, 125),
			},
			actions: [{ action: 'addToGroup', options: { group: index } }],
			feedbacks: [],
		})
		presets.push({
			category: 'Group presets',
			label: `Clear group: ${instance.ZoomUserData[index].userName}`,
			bank: {
				style: 'text',
				text: `Clear group:\\n$(zoomosc:${index})`,
				size: 'auto',
				color: instance.rgb(255, 255, 255),
				bgcolor: instance.rgb(125, 125, 125),
			},
			actions: [{ action: 'clearGroup', options: { group: index } }],
			feedbacks: [],
		})
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
					type: 'selectedUser',
					options: {
						position: index,
						type: 'indexPositionInGroup',
					},
					style: {
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(125, 125, 0),
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
					type: 'selectedUser',
					options: {
						position: index,
						type: 'galleryPositionInGroup',
					},
					style: {
						color: instance.rgb(0, 0, 0),
						bgcolor: instance.rgb(125, 125, 0),
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
	// normal selection
	// for (const key in instance.ZoomUserData) {
	// 	if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
	// 		const user = instance.ZoomUserData[key]

	// 		presets.push({
	// 			category: user.zoomId > instance.ZoomClientDataObj.numberOfGroups + 1 ? 'Select Callers' : 'Group presets',
	// 			label: user.userName,
	// 			bank: {
	// 				style: 'text',
	// 				text: user.zoomId < instance.ZoomClientDataObj.numberOfGroups + 1 ? `Select\\n$(zoomosc:${user.zoomId}) ($(zoomosc:CallersInGroup${user.zoomId}))`: `Select\\n$(zoomosc:${user.zoomId})`,
	// 				size: 'auto',
	// 				color: instance.rgb(255, 255, 255),
	// 				bgcolor:
	// 					user.zoomId < instance.ZoomClientDataObj.numberOfGroups + 1
	// 						? instance.rgb(125, 125, 125)
	// 						: instance.rgb(0, 0, 0),
	// 			},
	// 			actions: [{ action: 'SelectUser', options: { user: user.zoomId, option: 'toggle' } }],
	// 			feedbacks: [
	// 				{
	// 					type: 'selectedUser',
	// 					options: {
	// 						user: user.zoomId,
	// 						type: 'normal',
	// 					},
	// 					style: {
	// 						color: instance.rgb(0, 0, 0),
	// 						bgcolor: instance.rgb(255, 255, 0),
	// 					},
	// 				},
	// 				{
	// 					type: 'selectedUser',
	// 					options: {
	// 						user: user.zoomId,
	// 						type: 'userInGroup',
	// 					},
	// 					style: {
	// 						color: instance.rgb(0, 0, 0),
	// 						bgcolor: instance.rgb(125, 125, 0),
	// 					},
	// 				},
	// 				{
	// 					type: 'microphoneLive',
	// 					options: {
	// 						user: user.zoomId,
	// 						type: 'normal',
	// 					},
	// 					style: {
	// 						bgcolor: instance.rgb(255, 0, 0),
	// 					},
	// 				},
	// 				{
	// 					type: 'handRaised',
	// 					options: {
	// 						user: user.zoomId,
	// 						type: 'normal',
	// 						handRaised: 1,
	// 					},
	// 					style: {
	// 						png64: images.handRaised,
	// 					},
	// 				},
	// 			],
	// 		})
	// 		if (user.zoomId <= instance.ZoomClientDataObj.numberOfGroups) {
	// 			presets.push({
	// 				category: 'Rename',
	// 				label: user.userName,
	// 				bank: {
	// 					style: 'text',
	// 					text: `Rename\\n$(zoomosc:${user.zoomId})`,
	// 					size: 'auto',
	// 					color: instance.rgb(255, 255, 255),
	// 					bgcolor: instance.rgb(125, 125, 125),
	// 				},
	// 				actions: [{ action: 'renameGroup', options: { user: user.zoomId, name: user.userName } }],
	// 				feedbacks: [],
	// 			})
	// 		} else {
	// 			presets.push({
	// 				category: 'Rename',
	// 				label: user.userName,
	// 				bank: {
	// 					style: 'text',
	// 					text: `Rename\\n$(zoomosc:${user.zoomId})`,
	// 					size: 'auto',
	// 					color: instance.rgb(255, 255, 255),
	// 					bgcolor: instance.rgb(125, 125, 125),
	// 				},
	// 				actions: [{ action: 'Rename', options: { user: user.zoomId, name: user.userName } }],
	// 				feedbacks: [],
	// 			})
	// 		}
	// 	}
	// }

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

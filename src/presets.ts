import { CompanionPreset } from '../../../instance_skel_types'
import ZoomInstance from './index'
import { GlobalActionCallbacks } from './actions'
import { FeedbackCallbacks } from './feedback'
const { UserActions, actionsWithArgs, GlobalActions, SpecialActions } = require('./osccommands')

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
		category: 'Select Callers',
		label: `Clear selection`,
		bank: {
			style: 'text',
			text: `Clear selection`,
			size: 'auto',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0),
		},
		actions: [{ action: 'clearSelection', options: {} }],
		feedbacks: [],
	})
	
	// Add to group presets
	for (let index = 1; index-1 < instance.ZoomClientDataObj.numberOfGroups; index++) {
		presets.push({
			category: 'Add to Group',
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
	}

	for (const key in instance.ZoomUserData) {
		if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
			const user = instance.ZoomUserData[key]

			presets.push({
				category: 'Select Callers',
				label: user.userName,
				bank: {
					style: 'text',
					text: `Select\\n$(zoomosc:${user.zoomId})`,
					size: 'auto',
					color: instance.rgb(255, 255, 255),
					bgcolor: user.zoomId < (instance.ZoomClientDataObj.numberOfGroups+1) ? instance.rgb(125, 125, 125) : instance.rgb(0, 0, 0),
				},
				actions: [{ action: 'SelectUser', options: { user: user.zoomId, option: 'toggle' } }],
				feedbacks: [
					{
						type: 'selectedInAGroup',
						options: {
							user: user.zoomId,
							fg: instance.rgb(0, 0, 0),
							bg: instance.rgb(125, 125, 0),
						},
					},
					{
						type: 'selectedUser',
						options: {
							user: user.zoomId,
							fg: instance.rgb(0, 0, 0),
							bg: instance.rgb(255, 255, 0),
						},
					},
					{
						type: 'microphoneLive',
						options: {
							user: user.zoomId,
							bg: instance.rgb(255, 0, 0),
						},
					},
				],
			})
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
				actions: [{ action: 'renameGroup', options: { user: user.zoomId, name: user.userName } }],
				feedbacks: [],
			})
		}
	}

	return presets
}
export function getUserPresets(instance: ZoomInstance): ZoomGlobalPreset[] {
	let presets: ZoomGlobalPreset[] = []
	for (const key in UserActions) {
		if (Object.prototype.hasOwnProperty.call(UserActions, key)) {
			const element = UserActions[key]
			presets.push({
				category: 'User Presets Basics',
				label: element.shortDescription,
				bank: {
					style: 'text',
					text: element.description,
					size: 'auto',
					color: instance.rgb(255, 255, 255),
					bgcolor: instance.rgb(0, 0, 0),
				},
				actions: [{ action: 'UserActions', options: { user: '', args: '', actionID: element.shortDescription, command: element.command } }],
				feedbacks: [],
			})
		}
	}
	return presets
}
export function getPresetsWithArgs(instance: ZoomInstance): ZoomGlobalPreset[] {
	let presets: ZoomGlobalPreset[] = []
	for (const key in actionsWithArgs) {
		if (Object.prototype.hasOwnProperty.call(actionsWithArgs, key)) {
			const element = actionsWithArgs[key]
			presets.push({
				category: 'User/Global presets with arguments',
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
	}
	return presets
}
export function getSpecialPresets(instance: ZoomInstance): ZoomGlobalPreset[] {
	let presets: ZoomGlobalPreset[] = []

	for (const key in SpecialActions) {
		if (Object.prototype.hasOwnProperty.call(SpecialActions, key)) {
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
	}

	return presets
}
export function getGlobalPresets(instance: ZoomInstance): ZoomGlobalPreset[] {
	let presets: ZoomGlobalPreset[] = []

	for (const key in GlobalActions) {
		if (Object.prototype.hasOwnProperty.call(GlobalActions, key)) {
			const element = GlobalActions[key]
			presets.push({
				category: 'Global Presets Basics',
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
	}

	return presets
}

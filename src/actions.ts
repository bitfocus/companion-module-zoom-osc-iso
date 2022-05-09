import { CompanionActionEventInfo, CompanionActionEvent, SomeCompanionInputField } from '../../../instance_skel_types'
import ZoomInstance from './index'
const command = require('./osccommands').commands

export interface ZoomActions {
	// UserAction
	Pin: ZoomAction<UserActionCallback>
	AddPin: ZoomAction<UserActionCallback>
	Mute: ZoomAction<UserActionCallback>
	Unmute: ZoomAction<UserActionCallback>
	// Global Actions
	EnableUsersUnmute: ZoomAction<GlobalActionCallback>
	// Index signature
	[key: string]: ZoomAction<any>
}

// UserAction
interface UserActionCallback {
	action: string
	options: Readonly<{
		user: string
		command: string
	}>
}

interface GlobalActionCallback {
	action: string
	options: Readonly<{
		command: string
	}>
}

export type UserActionCallbacks = UserActionCallback

export type GlobalActionCallbacks = GlobalActionCallback

// Force options to have a default to prevent sending undefined values
type InputFieldWithDefault = Exclude<SomeCompanionInputField, 'default'> & { default: string | number | boolean | null }

// Actions specific to Zoom
export interface ZoomAction<T> {
	label: string
	description?: string
	options: InputFieldWithDefault[]
	callback: (
		action: Readonly<Omit<CompanionActionEvent, 'options' | 'id'> & T>,
		info: Readonly<CompanionActionEventInfo | null>
	) => void
	subscribe?: (action: Readonly<Omit<CompanionActionEvent, 'options' | 'id'> & T>) => void
	unsubscribe?: (action: Readonly<Omit<CompanionActionEvent, 'options' | 'id'> & T>) => void
}

export function getActions(instance: ZoomInstance): ZoomActions {
	/**
	 * @param action Action callback object
	 * @param _info Unused
	 * @description Sends functions/params from actions that don't require complex logic
	 */

	// Make list of users ready for Companion
	let CHOICES_USERS = [{ id: '', label: 'no users' }]
	if (instance.ZoomUserData.length !== 0) {
		CHOICES_USERS = instance.ZoomUserData.filter((n) => n).map((id) => ({
			id: id.zoomId.toString(),
			label: id.username,
		}))
	}

	const sendUserActionCommand = (
		action: Readonly<UserActionCallbacks>,
		_info?: CompanionActionEventInfo | null
	): void => {
		// Construct command
		let oscPath = `/zoom/zoomID${action.options.command}`
		let args = action.options.user
		if (instance.OSC) instance.OSC.sendCommand(oscPath, args)
	}
	const sendGlobalActionCommand = (
		action: Readonly<GlobalActionCallbacks>,
		_info?: CompanionActionEventInfo | null
	): void => {
		// Construct command
		let oscPath = action.options.command
		if (instance.OSC) instance.OSC.sendCommand(oscPath)
	}

	return {
		// User Actions

		Pin: {
			label: 'Pin User',
			options: [
				{
					type: 'dropdown',
					label: 'User',
					id: 'user',
					default: CHOICES_USERS.find(element=>element!==undefined) ? CHOICES_USERS.find(element=>element!==undefined)!.id : 'no user yet',
					choices: CHOICES_USERS,
				},
			],
			callback: (action) => {
				const Pin: any = {
					id: 'Pin',
					options: {
						user: action.options.user,
						command: command.Pin,
					},
				}
				sendUserActionCommand(Pin)
			},
		},
		AddPin: {
			label: 'Add Pin',
			options: [
				{
					type: 'dropdown',
					label: 'User',
					id: 'user',
					default: CHOICES_USERS.find(element=>element!==undefined) ? CHOICES_USERS.find(element=>element!==undefined)!.id : 'no user yet',
					choices: CHOICES_USERS,
				},
			],
			callback: (action) => {
				const AddPin: any = {
					id: 'AddPin',
					options: {
						user: action.options.user,
						command: command.AddPin,
					},
				}
				sendUserActionCommand(AddPin)
			},
		},
		Mute: {
			label: 'Mute user',
			options: [
				{
					type: 'dropdown',
					label: 'User',
					id: 'user',
					default: CHOICES_USERS.find(element=>element!==undefined) ? CHOICES_USERS.find(element=>element!==undefined)!.id : 'no user yet',
					choices: CHOICES_USERS,
				},
			],
			callback: (action) => {
				const Mute: any = {
					id: 'Mute',
					options: {
						user: { type: 'i', value: action.options.user},
						command: command.Mute,
					},
				}
				sendUserActionCommand(Mute)
			},
		},
		Unmute: {
			label: 'Unmute user',
			options: [
				{
					type: 'dropdown',
					label: 'User',
					id: 'user',
					default: CHOICES_USERS.find(element=>element!==undefined) ? CHOICES_USERS.find(element=>element!==undefined)!.id : 'no user yet',
					choices: CHOICES_USERS,
				},
			],
			callback: (action) => {
				const Unmute: any = {
					id: 'Unmute',
					options: {
						user:  { type: 'i', value: action.options.user},
						command: command.Unmute,
					},
				}
				sendUserActionCommand(Unmute)
			},
		},
		// Global actions
		EnableUsersUnmute: {
			label: 'Enable Users to Unmute',
			options: [],
			callback: () => {
				const EnableUsersToUnmute: any = {
					id: 'EnableUsersUnmute',
					options: {
						command: command.EnableUsersToUnmute,
					},
				}
				sendGlobalActionCommand(EnableUsersToUnmute)
			},
		},
	}
}

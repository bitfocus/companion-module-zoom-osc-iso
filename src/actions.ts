import {
	CompanionActionEventInfo,
	CompanionActionEvent,
	SomeCompanionInputField,
	CompanionActions,
} from '../../../instance_skel_types'
import ZoomInstance from './index'
import { options } from './utils'

const { UserActions, GlobalActions, SpecialActions } = require('./osccommands')

// export interface ZoomActions {
// 	// UserAction
// 	Pin: ZoomAction<UserActionCallback>
// 	AddPin: ZoomAction<UserActionCallback>
// 	Mute: ZoomAction<UserActionCallback>
// 	Unmute: ZoomAction<UserActionCallback>
// 	SelectUser: ZoomAction<UserActionCallback>
// 	SendAChatViaDM: ZoomAction<UserActionCallback>
// 	UserVideoOnOutputOutput: ZoomAction<UserActionCallback>
// 	UserVideoOffOutputOutput: ZoomAction<UserActionCallback>
// 	// Global Actions
// 	EnableUsersUnmute: ZoomAction<GlobalActionCallback>
// 	// Index signature
// 	[key: string]: ZoomAction<any>
// }

// UserAction
interface UserActionCallback {
	action: string
	options: Readonly<{
		args: string
		user: string
		command: string
		msg?: string
		breakoutRoom?: string
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
// type InputField = SomeCompanionInputField

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

export function getActions(instance: ZoomInstance): CompanionActions {
	let selectedCallers = instance.ZoomClientDataObj.selectedCallers
	// Make list of users ready for Companion
	let CHOICES_USERS = [{ id: '0', label: 'no users' }]
	let CHOICES_USERS_DEFAULT = '0'
	if (instance.ZoomUserData.length !== 0) {
		CHOICES_USERS = instance.ZoomUserData.filter((n) => n).map((id) => ({
			id: id.zoomId.toString(),
			label: id.userName,
		}))
		CHOICES_USERS_DEFAULT = CHOICES_USERS.find((element) => element !== undefined)
			? CHOICES_USERS.find((element) => element !== undefined)!.id
			: '0'
	}
	let CHOICES_GROUPS = CHOICES_USERS.slice(0, instance.ZoomClientDataObj.numberOfGroups)

	let userOption: InputFieldWithDefault = {
		type: 'dropdown',
		label: 'User',
		id: 'user',
		default: CHOICES_USERS_DEFAULT,
		choices: CHOICES_USERS,
	}

	let groupOption: InputFieldWithDefault = {
		type: 'dropdown',
		label: 'Group',
		id: 'group',
		default: 0,
		choices: CHOICES_GROUPS,
	}

	const sendUserActionCommand = (
		action: Readonly<UserActionCallbacks>,
		_info?: CompanionActionEventInfo | null
	): void => {
		// Construct command
		let oscPath = `/zoom/zoomID${action.options.command}`
		let args = action.options.args
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

	// Create all User Actions
	let returningUserActionsObj = UserActions
	for (const key in returningUserActionsObj) {
		if (Object.prototype.hasOwnProperty.call(returningUserActionsObj, key)) {
			const element = returningUserActionsObj[key]
			element.label = element.description
			if (element.args) {
				switch (element.args) {
					case 'msg':
						element.options = [options.message]
						element.callback = (action: { options: { msg: string } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: { type: 's', value: action.options.msg },
								},
							}
							sendUserActionCommand(sendToCommand)
						}
						break
					case 'name':
						element.options = [options.name]
						element.callback = (action: { options: { name: string } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: { type: 's', value: action.options.name },
								},
							}
							sendUserActionCommand(sendToCommand)
						}
						break
					case 'intX,intY':
						element.options = [options.intX, options.intY]
						element.callback = (action: { options: { intX: number; intY: number } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: [
										{ type: 'i', value: action.options.intX },
										{ type: 'i', value: action.options.intY },
									],
								},
							}
							sendUserActionCommand(sendToCommand)
						}
						break
					case 'level':
						element.options = [options.level]
						element.callback = (action: { options: { level: number } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: { type: 'i', value: action.options.level },
								},
							}
							sendUserActionCommand(sendToCommand)
						}
						break
					case 'id':
						element.options = [options.id]
						element.callback = (action: { options: { id: number } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: { type: 'i', value: action.options.id },
								},
							}
							sendUserActionCommand(sendToCommand)
						}
						break

					default:
						console.log('Missed an argument in osc commands (user)', element.args)
						break
				}
			} else {
				// No arguments so just a userOption
				element.options = [options.userSelectedInfo]
				element.callback = () => {
					if (selectedCallers[0] === 0) throw new Error('Select user first')
					const sendToCommand: any = {
						id: element.shortDescription,
						options: {
							args: { type: 'i', value: selectedCallers },
							command: element.command,
						},
					}
					sendUserActionCommand(sendToCommand)
				}
			}
		}
	}

	// Create all Global actions
	let returningGlobalActionsObj = GlobalActions
	for (const key in returningGlobalActionsObj) {
		if (Object.prototype.hasOwnProperty.call(returningGlobalActionsObj, key)) {
			const element = returningGlobalActionsObj[key]
			element.label = element.description
			if (element.args) {
				// There are arguments, lets check them
				switch (element.args) {
					case 'msg':
						element.options = [options.message]
						element.callback = (action: { options: { msg: string } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: { type: 's', value: action.options.msg },
								},
							}
							sendGlobalActionCommand(sendToCommand)
						}
						break
					case 'name':
						element.options = [options.name]
						element.callback = (action: { options: { name: string } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: { type: 's', value: action.options.name },
								},
							}
							sendGlobalActionCommand(sendToCommand)
						}
						break
					case 'intX,intY':
						element.options = [options.intX, options.intY]
						element.callback = (action: { options: { intX: number; intY: number } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: [
										{ type: 'i', value: action.options.intX },
										{ type: 'i', value: action.options.intY },
									],
								},
							}
							sendGlobalActionCommand(sendToCommand)
						}
						break
					case 'level':
						element.options = [options.level]
						element.callback = (action: { options: { level: number } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: { type: 'i', value: action.options.level },
								},
							}
							sendGlobalActionCommand(sendToCommand)
						}
						break
					case 'mode':
						element.options = [options.mode]
						element.callback = (action: { options: { mode: number } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: { type: 'i', value: action.options.mode },
								},
							}
							sendGlobalActionCommand(sendToCommand)
						}
						break
					case 'id':
						element.options = [options.id]
						element.callback = (action: { options: { id: number } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: { type: 'i', value: action.options.id },
								},
							}
							sendGlobalActionCommand(sendToCommand)
						}
						break
					case 'JoinMeeting':
						element.options = [options.meetingID, options.name, options.password]
						element.callback = (action: { options: { meetingID: string; name: string; password: string } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: [
										{ type: 's', value: action.options.meetingID },
										{ type: 's', value: action.options.name },
										{ type: 's', value: action.options.password },
									],
								},
							}
							sendGlobalActionCommand(sendToCommand)
						}
						break
					case 'zak':
						element.options = [options.zak, options.meetingID, options.name]
						element.callback = (action: { options: { zak: string; meetingID: string; name: string } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: [
										{ type: 's', value: action.options.zak },
										{ type: 's', value: action.options.meetingID },
										{ type: 's', value: action.options.name },
									],
								},
							}
							sendGlobalActionCommand(sendToCommand)
						}
						break

					default:
						console.log('Missed an argument in osc commands (global)', element.args)
						break
				}
			} else {
				// No arguments
				element.options = []
				element.callback = () => {
					const sendToCommand: any = {
						id: element.shortDescription,
						options: {
							command: element.command,
						},
					}
					sendGlobalActionCommand(sendToCommand)
				}
			}
		}
	}
	// Create all Special actions
	let returningSpecialActionsObj = SpecialActions
	for (const key in returningSpecialActionsObj) {
		if (Object.prototype.hasOwnProperty.call(returningSpecialActionsObj, key)) {
			const element = returningSpecialActionsObj[key]
			element.label = element.description
			if (element.args) {
				// There are arguments, lets check them
				switch (element.args) {
					case 'zak':
						element.options = [options.zak, options.meetingID, options.name]
						element.callback = (action: { options: { zak: string; meetingID: string; name: string } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: [
										{ type: 's', value: action.options.zak },
										{ type: 's', value: action.options.meetingID },
										{ type: 's', value: action.options.name },
									],
								},
							}
							sendGlobalActionCommand(sendToCommand)
						}
						break

					case 'subscribeLevel':
						element.options = [options.subscribeLevel]
						element.callback = (action: { options: { level: number } }) => {
							const sendToCommand: any = {
								id: element.shortDescription,
								options: {
									command: element.command,
									args: { type: 'i', value: action.options.level },
								},
							}
							sendGlobalActionCommand(sendToCommand)
						}
						break

					default:
						console.log('Missed an argument in osc commands (Specials)', element.args)
						break
				}
			} else {
				// No arguments
				element.options = []
				element.callback = () => {
					const sendToCommand: any = {
						id: element.shortDescription,
						options: {
							command: element.command,
						},
					}
					sendGlobalActionCommand(sendToCommand)
				}
			}
		}
	}

	let extraActions = {
		// User Actions
		SelectUser: {
			label: 'Preselect user',
			options: [userOption],
			callback: (action: { options: { user: number } }) => {
				instance.ZoomClientDataObj.selectedCallers[0] = action.options.user
				instance.variables?.updateVariables()
				instance.checkFeedbacks('selectedUser')
			},
		},
		// Group Actions
		renameGroup: {
			label: 'Rename caller/group',
			options: [userOption, options.name],
			callback: (action: { options: { user: number; name: string } }) => {
				instance.ZoomUserData[action.options.user].userName = action.options.name
				instance.variables?.updateVariables()
			},
		},
		addToGroup: {
			label: 'Add to group',
			options: [userOption, groupOption],
			callback: (action: { options: { user: number; group: number } }) => {
				instance.ZoomUserData[action.options.group].users?.push(action.options.user)
				instance.variables?.updateVariables()
			},
		},
		removeFromGroup: {
			label: 'Remove from group',
			options: [userOption, groupOption],
			callback: (action: { options: { user: number; group: number } }) => {
				if (instance.ZoomUserData[action.options.group].users !== undefined) {
					for (var i = 0; i < instance.ZoomUserData[action.options.group].users.length; i++) {
						if (instance.ZoomUserData[action.options.group].users[i] === action.options.user) {
							instance.ZoomUserData[action.options.group].users.splice(i, 1)
						}
					}
				}
				instance.variables?.updateVariables()
			},
		},
	}

	return { ...extraActions, ...returningUserActionsObj, ...returningGlobalActionsObj, ...returningSpecialActionsObj }
}

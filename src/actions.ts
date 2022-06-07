import {
	CompanionActionEventInfo,
	CompanionActionEvent,
	SomeCompanionInputField,
	CompanionActions,
} from '../../../instance_skel_types'
import ZoomInstance from './index'
import { options, arrayRemove, arrayAddRemove } from './utils'

const { UserActions, actionsWithArgs, GlobalActions, SpecialActions } = require('./osccommands')

/**
 * Define what is needed
 */
interface GlobalActionCallback {
	action: string
	options: Readonly<{
		command: string
		args?: string
		msg?: string
		breakoutRoom?: string
	}>
}

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

/**
 * Main function to create the actions
 * @param instance Give the instance so we can extract data
 * @returns CompanionActions
 */
export function getActions(instance: ZoomInstance): CompanionActions {
	// Make list of users ready for Companion
	let CHOICES_USERS = [{ id: '0', label: 'no users' }]
	let CHOICES_USERS_DEFAULT = '1'
	if (instance.ZoomUserData) {
		CHOICES_USERS.length = 0
		for (const key in instance.ZoomUserData) {
			if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
				const user = instance.ZoomUserData[key]
				CHOICES_USERS.push({ id: user.zoomId.toString(), label: user.userName })
			}
		}
		CHOICES_USERS_DEFAULT = CHOICES_USERS.length > 0 ? CHOICES_USERS[0].id : '1'
	}
	let CHOICES_GROUPS = CHOICES_USERS.slice(0, instance.ZoomClientDataObj.numberOfGroups)
	let CHOICES_GALLERY = [{ id: '0', label: 'empty gallery' }]
	if (instance.ZoomClientDataObj.galleryOrder.length > 1) {
		CHOICES_GALLERY.length = 0
		for (let index = 0; index < instance.ZoomClientDataObj.galleryOrder.length; index++) {
			CHOICES_GALLERY.push({ id: index.toString(), label: `Gallery position ${index}` })
		}
	}

	let userOption: InputFieldWithDefault = {
		type: 'dropdown',
		label: 'User',
		id: 'user',
		default: CHOICES_USERS_DEFAULT,
		choices: CHOICES_USERS,
	}

	let galleryOrderOption: InputFieldWithDefault = {
		type: 'dropdown',
		label: 'Position',
		id: 'position',
		default: '0',
		choices: CHOICES_GALLERY,
	}

	let groupOption: InputFieldWithDefault = {
		type: 'dropdown',
		label: 'Group',
		id: 'group',
		default: 0,
		choices: CHOICES_GROUPS,
	}

	/**
	 * Construct the command like I want and send it to the OSC
	 * @param action
	 * @param _info
	 */
	const sendActionCommand = (
		action: Readonly<GlobalActionCallbacks>,
		_info?: CompanionActionEventInfo | null
	): void => {
		// Construct command
		let oscPath = action.options.command
		let args = action.options.args
		if (instance.OSC) instance.OSC.sendCommand(oscPath, args)
	}

	// Create all actions with arguments
	let returningActionsWithArgsObj = actionsWithArgs
	for (const key in returningActionsWithArgsObj) {
		if (Object.prototype.hasOwnProperty.call(returningActionsWithArgsObj, key)) {
			const element = returningActionsWithArgsObj[key]
			element.label = element.description
			switch (element.type) {
				case 'User':
					switch (element.args) {
						case 'msg':
							element.options = [options.message]
							element.callback = (action: { options: { msg: string } }) => {
								let argsCallers = createUserArguments(instance.ZoomClientDataObj.selectedCallers)
								let oscPath = (argsCallers.length > 1 ? `/zoom/users/zoomID` : `/zoom/zoomID`) + element.command
								const sendToCommand: any = {
									id: element.shortDescription,
									options: {
										command: oscPath,
										args: [argsCallers, { type: 's', value: action.options.msg }],
									},
								}
								sendActionCommand(sendToCommand)
							}
							break
						case 'name':
							element.options = [options.name]
							element.callback = (action: { options: { name: string } }) => {
								let argsCallers = createUserArguments(instance.ZoomClientDataObj.selectedCallers)
								let oscPath = (argsCallers.length > 1 ? `/zoom/users/zoomID` : `/zoom/zoomID`) + element.command
								const sendToCommand: any = {
									id: element.shortDescription,
									options: {
										command: oscPath,
										args: [argsCallers, { type: 's', value: action.options.name }],
									},
								}
								sendActionCommand(sendToCommand)
							}
							break
						case 'intX,intY':
							element.options = [options.intX, options.intY]
							element.callback = (action: { options: { intX: number; intY: number } }) => {
								let argsCallers = createUserArguments(instance.ZoomClientDataObj.selectedCallers)
								let oscPath = (argsCallers.length > 1 ? `/zoom/users/zoomID` : `/zoom/zoomID`) + element.command
								const sendToCommand: any = {
									id: element.shortDescription,
									options: {
										command: oscPath,
										args: [
											argsCallers,
											{ type: 'i', value: action.options.intX },
											{ type: 'i', value: action.options.intY },
										],
									},
								}
								sendActionCommand(sendToCommand)
							}
							break
						case 'level':
							element.options = [options.level]
							element.callback = (action: { options: { level: number } }) => {
								let argsCallers = createUserArguments(instance.ZoomClientDataObj.selectedCallers)
								let oscPath = (argsCallers.length > 1 ? `/zoom/users/zoomID` : `/zoom/zoomID`) + element.command
								const sendToCommand: any = {
									id: element.shortDescription,
									options: {
										command: oscPath,
										args: [argsCallers, { type: 'i', value: action.options.level }],
									},
								}
								sendActionCommand(sendToCommand)
							}
							break
						case 'id':
							element.options = [options.id]
							element.callback = (action: { options: { id: number } }) => {
								let argsCallers = createUserArguments(instance.ZoomClientDataObj.selectedCallers)
								let oscPath = (argsCallers.length > 1 ? `/zoom/users/zoomID` : `/zoom/zoomID`) + element.command
								const sendToCommand: any = {
									id: element.shortDescription,
									options: {
										command: oscPath,
										args: [argsCallers, { type: 'i', value: action.options.id }],
									},
								}
								sendActionCommand(sendToCommand)
							}
							break

						default:
							console.log('Missed an argument in osc commands (user)', element.args)
							break
					}
					break
				case 'Global':
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
								sendActionCommand(sendToCommand)
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
								sendActionCommand(sendToCommand)
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
								sendActionCommand(sendToCommand)
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
								sendActionCommand(sendToCommand)
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
								sendActionCommand(sendToCommand)
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
								sendActionCommand(sendToCommand)
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
								sendActionCommand(sendToCommand)
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
								sendActionCommand(sendToCommand)
							}
							break

						default:
							console.log('Missed an argument in osc commands (global)', element.args)
							break
					}
					break
				default:
					console.log('Missed type in osc commands', element)
					break
			}
		}
	}
	// // Create all Global actions
	// let returningGlobalActionsObj = GlobalActions
	// for (const key in returningGlobalActionsObj) {
	// 	if (Object.prototype.hasOwnProperty.call(returningGlobalActionsObj, key)) {
	// 		const element = returningGlobalActionsObj[key]
	// 		element.label = element.description
	// 		// No arguments
	// 		element.options = []
	// 		element.callback = () => {
	// 			const sendToCommand: any = {
	// 				id: element.shortDescription,
	// 				options: {
	// 					command: element.command,
	// 				},
	// 			}
	// 			sendActionCommand(sendToCommand)
	// 		}
	// 	}
	// }
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
							sendActionCommand(sendToCommand)
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
							sendActionCommand(sendToCommand)
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
					sendActionCommand(sendToCommand)
				}
			}
		}
	}

	// CREATE ALL BASIC USER ACTIONS AS CHOICES
	let CHOICES_USER_ACTIONS: { id: string; label: string }[] = []
	for (const key in UserActions) {
		if (Object.prototype.hasOwnProperty.call(UserActions, key)) {
			const element = UserActions[key]
			CHOICES_USER_ACTIONS.push({ label: element.description, id: element.shortDescription })
		}
	}
	// CREATE ALL BASIC GLOBAL ACTIONS AS CHOICES
	let CHOICES_GLOBAL_ACTIONS: { id: string; label: string }[] = []
	for (const key in GlobalActions) {
		if (Object.prototype.hasOwnProperty.call(GlobalActions, key)) {
			const element = GlobalActions[key]
			CHOICES_GLOBAL_ACTIONS.push({ label: element.description, id: element.shortDescription })
		}
	}

	const createUserArguments = (callerArray: number[]) => {
		if (callerArray.length === 0) console.log('Select a caller first')
		let argsCallers: { type: string; value: string | number }[] = []
		// Do a + 1 because groups start at 1
		let numberOfGroups = instance.ZoomClientDataObj.numberOfGroups + 1
		// Loop through selected callers to see if there is a group selected and get the callers
		callerArray.forEach((caller) => {
			// Is a caller a group?
			if (caller < numberOfGroups) {
				instance.ZoomUserData[caller].users.forEach((callerInGroup) => {
					argsCallers.push({ type: 'i', value: callerInGroup })
				})
			} else {
				argsCallers.push({ type: 'i', value: caller })
			}
		})
		return argsCallers
	}

	let extraActions = {
		// Basic actions
		UserActions: {
			label: 'User actions: Basics',
			options: [
				{
					type: 'dropdown',
					label: 'User Action',
					id: 'actionID',
					default: 'Pin',
					choices: CHOICES_USER_ACTIONS,
				},
			],
			callback: (action: { options: { actionID: string } }) => {
				let argsCallers = createUserArguments(instance.ZoomClientDataObj.selectedCallers)
				let oscPath =
					(argsCallers.length > 1 ? `/zoom/users/zoomID` : `/zoom/zoomID`) +
					UserActions[action.options.actionID].command
				const sendToCommand: any = {
					id: UserActions[action.options.actionID].shortDescription,
					options: {
						command: oscPath,
						args: argsCallers,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		GlobalActions: {
			label: 'Global actions: Basics',
			options: [
				{
					type: 'dropdown',
					label: 'Global Action',
					id: 'actionID',
					default: 'MuteAll',
					choices: CHOICES_GLOBAL_ACTIONS,
				},
			],
			callback: (action: { options: { actionID: string } }) => {
				const sendToCommand: any = {
					id: GlobalActions[action.options.actionID].shortDescription,
					options: {
						command: GlobalActions[action.options.actionID].command,
						args: [],
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		// Select Actions
		SelectUser: {
			label: 'Preselect user/group',
			options: [
				userOption,
				{
					type: 'dropdown',
					label: 'Option',
					id: 'option',
					default: '',
					choices: [
						{ label: 'Toggle', id: 'toggle' },
						{ label: 'Select', id: 'select' },
						{ label: 'Remove', id: 'remove' },
					],
				},
			],
			callback: (action: { options: { user: number; option: string } }) => {
				if (action.options.option == 'toggle') {
					instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
						instance.ZoomClientDataObj.selectedCallers,
						action.options.user
					)
				} else if (action.options.option == 'select') {
					instance.ZoomClientDataObj.selectedCallers.push(action.options.user)
				} else if (action.options.option == 'remove') {
					instance.ZoomClientDataObj.selectedCallers = arrayRemove(
						instance.ZoomClientDataObj.selectedCallers,
						action.options.user
					)
				}
				instance.variables?.updateVariables()
				instance.checkFeedbacks('selectedUser')
				instance.checkFeedbacks('selectedUserGalPos')
			},
		},
		SelectFromGalleryPosition: {
			label: 'Preselect user/group',
			options: [
				galleryOrderOption,
				{
					type: 'dropdown',
					label: 'Option',
					id: 'option',
					default: '',
					choices: [
						{ label: 'Toggle', id: 'toggle' },
						{ label: 'Select', id: 'select' },
						{ label: 'Remove', id: 'remove' },
					],
				},
			],
			callback: (action: { options: { position: number; option: string } }) => {
				if (action.options.option == 'toggle') {
					instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
						instance.ZoomClientDataObj.selectedCallers,
						instance.ZoomClientDataObj.galleryOrder[action.options.position]
					)
				} else if (action.options.option == 'select') {
					instance.ZoomClientDataObj.selectedCallers.push(instance.ZoomClientDataObj.galleryOrder[action.options.position])
				} else if (action.options.option == 'remove') {
					instance.ZoomClientDataObj.selectedCallers = arrayRemove(
						instance.ZoomClientDataObj.selectedCallers,
						instance.ZoomClientDataObj.galleryOrder[action.options.position]
					)
				}
				instance.variables?.updateVariables()
				instance.checkFeedbacks('selectedUser')
				instance.checkFeedbacks('selectedUserGalPos')
			},
		},
		addToGroup: {
			label: 'Add selection to group',
			options: [groupOption],
			callback: (action: { options: { group: number } }) => {
				instance.ZoomUserData[action.options.group].users = [
					...instance.ZoomUserData[action.options.group].users,
					...instance.ZoomClientDataObj.selectedCallers,
				]
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.variables?.updateVariables()
				instance.checkFeedbacks('selectedUser')
				instance.checkFeedbacks('selectedUserGalPos')
				instance.checkFeedbacks('selectedInAGroup')
				instance.checkFeedbacks('selectedInAGroupGalPos')
			},
		},
		clearGroup: {
			label: 'Clear group selection',
			options: [groupOption],
			callback: (action: { options: { group: number } }) => {
				instance.ZoomUserData[action.options.group].users.length = 0
				instance.checkFeedbacks('selectedUser')
				instance.checkFeedbacks('selectedUserGalPos')
				instance.checkFeedbacks('selectedInAGroup')
				instance.checkFeedbacks('selectedInAGroupGalPos')
			},
		},
		renameGroup: {
			label: 'Rename caller/group',
			options: [userOption, options.name],
			callback: (action: { options: { user: number; name: string } }) => {
				instance.ZoomUserData[action.options.user].userName = action.options.name
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
		clearSelection: {
			label: 'Clear selection',
			options: [],
			callback: () => {
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.variables?.updateVariables()
				instance.checkFeedbacks('selectedUser')
				instance.checkFeedbacks('selectedUserGalPos')
			},
		},
	}

	return {
		...extraActions,
		...returningActionsWithArgsObj,
		// ...returningGlobalActionsObj,
		...returningSpecialActionsObj,
	}
}

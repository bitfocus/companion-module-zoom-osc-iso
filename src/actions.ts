import {
	CompanionActionEventInfo,
	CompanionActionEvent,
	SomeCompanionInputField,
	CompanionActions,
} from '../../../instance_skel_types'
import ZoomInstance from './index'
import { options, arrayRemove, arrayAddRemove } from './utils'

const { Actions, ActionsWithArguments } = require('./osccommands')

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
	let CHOICES_GROUPS: { id: string; label: string }[] = []
	let CHOICES_USERS_DEFAULT = '0'
	let CHOICES_GROUPS_DEFAULT = '0'
	if (instance.ZoomUserData) {
		CHOICES_USERS.length = 0
		for (const key in instance.ZoomUserData) {
			if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
				const user = instance.ZoomUserData[key]
				CHOICES_USERS.push({ id: user.zoomId.toString(), label: user.userName })
				CHOICES_USERS_DEFAULT = user.zoomId.toString()
			}
		}
	}
	instance.ZoomGroupData.forEach((group, index) => {
		CHOICES_GROUPS.push({ id: index.toString(), label: group.groupName })
	})
	let CHOICES_POSITION = []
	for (let index = 1; index < 50; index++) {
		CHOICES_POSITION.push({ id: index.toString(), label: `Position ${index}` })
	}
	let CHOICES_PARTICIPANT = []
	for (let index = 1; index < 1000; index++) {
		CHOICES_PARTICIPANT.push({ id: index.toString(), label: `Participant ${index}` })
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
		choices: CHOICES_POSITION,
	}

	let participantOption: InputFieldWithDefault = {
		type: 'dropdown',
		label: 'Position',
		id: 'position',
		default: '0',
		choices: CHOICES_PARTICIPANT,
	}

	let groupOption: InputFieldWithDefault = {
		type: 'dropdown',
		label: 'Group',
		id: 'group',
		default: CHOICES_GROUPS_DEFAULT,
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

	// Create all actions
	let actionsObj = Actions
	let actionsWithArgumentsObj = ActionsWithArguments
	let CHOICES_USER_ACTIONS: { id: string; label: string }[] = []
	let CHOICES_GLOBAL_ACTIONS: { id: string; label: string }[] = []
	let CHOICES_SPECIAL_ACTIONS: { id: string; label: string }[] = []

	for (const key in actionsObj) {
		if (Object.prototype.hasOwnProperty.call(actionsObj, key)) {
			const element = actionsObj[key]
			switch (element.type) {
				case 'User':
					CHOICES_USER_ACTIONS.push({ label: element.description, id: element.shortDescription })
					break
				case 'Global':
					CHOICES_GLOBAL_ACTIONS.push({ label: element.description, id: element.shortDescription })
					break
				case 'Special':
					CHOICES_SPECIAL_ACTIONS.push({ label: element.description, id: element.shortDescription })
					break
				default:
					console.log('wrong type', element.type)
					break
			}
		}
	}

	for (const key in actionsWithArgumentsObj) {
		if (Object.prototype.hasOwnProperty.call(actionsWithArgumentsObj, key)) {
			const element = actionsWithArgumentsObj[key]
			element.label = element.description
			switch (element.type) {
				case 'User':
					if (element.args) {
						switch (element.args) {
							case 'msg':
								element.options = [options.userName, options.message]
								element.callback = (action: { options: { msg: string; name: string } }) => {
									let command = createUserCommand(element.command, action.options.name)
									const sendToCommand: any = {
										id: element.shortDescription,
										options: {
											command: command.oscPath,
											args: [command.argsCallers, { type: 's', value: action.options.msg }],
										},
									}
									sendActionCommand(sendToCommand)
								}
								break
							case 'user,name':
								element.options = [userOption, options.name]
								element.callback = (action: { options: { user: number; name: string } }) => {
									let oscPath = `/zoom/zoomID${element.command}`
									const sendToCommand: any = {
										id: element.shortDescription,
										options: {
											command: oscPath,
											args: [
												{ type: 'i', value: action.options.user },
												{ type: 's', value: action.options.name },
											],
										},
									}
									sendActionCommand(sendToCommand)
								}
								break
							case 'intX,intY':
								element.options = [options.userName, options.intX, options.intY]
								element.callback = (action: { options: { intX: number; intY: number; name: string } }) => {
									let command = createUserCommand(element.command, action.options.name)
									command.argsCallers.push({ type: 'i', value: action.options.intX })
									command.argsCallers.push({ type: 'i', value: action.options.intY })
									const sendToCommand: any = {
										id: element.shortDescription,
										options: {
											command: command.oscPath,
											args: command.argsCallers,
										},
									}
									sendActionCommand(sendToCommand)
								}
								break
							case 'level':
								element.options = [options.userName, options.level]
								element.callback = (action: { options: { level: number; name: string } }) => {
									let command = createUserCommand(element.command, action.options.name)
									command.argsCallers.push({ type: 'i', value: action.options.level })
									const sendToCommand: any = {
										id: element.shortDescription,
										options: {
											command: command.oscPath,
											args: command.argsCallers,
										},
									}
									sendActionCommand(sendToCommand)
								}
								break
							case 'output':
								element.options = [options.userName, options.output]
								element.callback = (action: { options: { output: number; name: string } }) => {
									let command = createUserCommand(element.command, action.options.name)

									command.argsCallers.push({ type: 'i', value: action.options.output })
									const sendToCommand: any = {
										id: element.shortDescription,
										options: {
											command: command.oscPath,
											args: command.argsCallers,
										},
									}
									sendActionCommand(sendToCommand)
								}
								break
							case 'id':
								element.options = [options.userName, options.id]
								element.callback = (action: { options: { id: number; name: string } }) => {
									let command = createUserCommand(element.command, action.options.name)
									command.argsCallers.push({ type: 'i', value: action.options.id })
									const sendToCommand: any = {
										id: element.shortDescription,
										options: {
											command: command.oscPath,
											args: command.argsCallers,
										},
									}
									sendActionCommand(sendToCommand)
								}
								break

							default:
								console.log('Missed an argument in osc commands (user)', element.args)
								break
						}
					}
					break
				case 'Global':
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
								console.log('Missed an argument in osc commands (global)', element.args)
								break
						}
					}
					break
				case 'Special':
					if (element.args) {
						switch (element.args) {
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
								console.log('Missed an argument in osc commands (special)', element.args)
								break
						}
					}
					break
				default:
					console.log('Missed type in osc commands', element)
					break
			}
		}
	}

	/**
	 * createUserCommand function to create oscPath and arguments for user
	 * @param actionID string
	 * @param name string
	 * @returns object { argsCallers: { type: string; value: string | number }[]; oscPath: string }
	 */
	const createUserCommand = (actionID: string, name: string) => {
		let command: { argsCallers: { type: string; value: string | number }[]; oscPath: string } = {
			argsCallers: [],
			oscPath: '',
		}
		let selectedCallers: number[] | string = instance.ZoomClientDataObj.selectedCallers
		// Check if override has been filled
		if (name != '' && name != undefined) {
			console.log('Name filled', name)
			instance.getVariable(name, (value: string) => {
				name = value
			})
			if (name === 'Me' || name === 'me' || name === 'all' || name === 'All') {
				command.oscPath = `/zoom/${name.toLowerCase()}` + actionID
			} else {
				command.oscPath = `/zoom/userName` + actionID
				command.argsCallers.push({ type: 's', value: name })
			}
			// Use the pre-selection options
		} else {
			console.log('Use pre-selected', selectedCallers)
			if (Array.isArray(selectedCallers)) {
				// should be otherwise somethings wrong
				if (selectedCallers.length === 0) console.log('Select a caller first')
				selectedCallers.forEach((caller) => {
					command.argsCallers.push({ type: 'i', value: caller })
				})
			} else {
				console.log('Wrong selection')
			}
			// Different path when more than one users are selected
			command.oscPath = (command.argsCallers.length > 1 ? `/zoom/users/zoomID` : `/zoom/zoomID`) + actionID
		}
		return command
	}

	let extraActions = {
		// Basic actions
		UserActions: {
			label: 'User actions: Basics',
			options: [
				options.userName,
				{
					type: 'dropdown',
					label: 'User Action',
					id: 'actionID',
					default: 'Pin',
					choices: CHOICES_USER_ACTIONS,
				},
			],
			callback: (action: { options: { actionID: string; name: string } }) => {
				let command = createUserCommand(Actions[action.options.actionID].command, action.options.name)
				const sendToCommand: any = {
					id: Actions[action.options.actionID].shortDescription,
					options: {
						command: command.oscPath,
						args: command.argsCallers,
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
					id: Actions[action.options.actionID].shortDescription,
					options: {
						command: Actions[action.options.actionID].command,
						args: [],
					},
				}
				if(Actions[action.options.actionID].shortDescription === 'LowerAllHands') {
					console.log('action: Lower All Hands overide')
					for (const key in instance.ZoomUserData) {
						if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
							const element = instance.ZoomUserData[key]
							element.handRaised = false
						}
					}
					instance.checkFeedbacks('handRaised')
				}
				sendActionCommand(sendToCommand)
			},
		},
		SpecialActions: {
			label: 'Special actions',
			options: [
				{
					type: 'dropdown',
					label: 'Special Action',
					id: 'actionID',
					default: 'PingZoomOSC',
					choices: CHOICES_SPECIAL_ACTIONS,
				},
			],
			callback: (action: { options: { actionID: string } }) => {
				const sendToCommand: any = {
					id: Actions[action.options.actionID].shortDescription,
					options: {
						command: Actions[action.options.actionID].command,
						args: [],
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		// Select Actions
		selectionMethod: {
			label: 'Selection method',
			options: [
				{
					type: 'dropdown',
					label: 'Single/Multi',
					id: 'selectionMethod',
					default: 1,
					choices: [
						{ label: 'Single select', id: 1 },
						{ label: 'Multi select', id: 0 },
						{ label: 'Toggle', id: 2 },
					],
				},
			],
			callback: (action: { options: { selectionMethod: number } }) => {
				if (action.options.selectionMethod === 2) {
					instance.config.selectionMethod === 1
						? (instance.config.selectionMethod = 0)
						: (instance.config.selectionMethod = 1)
				} else {
					instance.config.selectionMethod = action.options.selectionMethod
				}
				instance.saveConfig()
				instance.checkFeedbacks('selectionMethod')
				instance.checkFeedbacks('groupBased')
			},
		},
		SelectUser: {
			label: 'Preselect user',
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
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							action.options.user
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						if (action.options.user < instance.ZoomClientDataObj.numberOfGroups + 1)
							instance.ZoomClientDataObj.selectedCallers.push(action.options.user)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							action.options.user
						)
						break
				}
				instance.variables?.updateVariables()
				instance.checkFeedbacks('selectedUser')
				instance.checkFeedbacks('groupBased')
			},
		},
		SelectGroup: {
			label: 'Preselect group',
			options: [groupOption],
			callback: (action: { options: { group: number } }) => {
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.ZoomGroupData[action.options.group].users?.forEach((user) => {
					instance.ZoomClientDataObj.selectedCallers.push(user.zoomID)
				})
				instance.variables?.updateVariables()
				instance.checkFeedbacks('selectedUser')
				instance.checkFeedbacks('groupBased')
			},
		},
		selectUserFromGroupPosition: {
			label: 'Preselect user',
			options: [
				groupOption,
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
			callback: (action: { options: { group: number; position: number; option: string } }) => {
				let position = action.options.position - 1
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomGroupData[action.options.group].users[position].zoomID
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers.push(
							instance.ZoomGroupData[action.options.group].users[position].zoomID
						)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomGroupData[action.options.group].users[position].zoomID
						)
						break
				}
				instance.variables?.updateVariables()
				instance.checkFeedbacks('selectedUser')
				instance.checkFeedbacks('groupBased')
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
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomClientDataObj.galleryOrder[action.options.position - 1]
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers.push(
							instance.ZoomClientDataObj.galleryOrder[action.options.position - 1]
						)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomClientDataObj.galleryOrder[action.options.position - 1]
						)
						break
				}
				instance.variables?.updateVariables()
				instance.checkFeedbacks('selectedUser')
				instance.checkFeedbacks('groupBased')
			},
		},
		SelectFromIndexPosition: {
			label: 'Preselect user/group',
			options: [
				participantOption,
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
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomVariableLink[action.options.position - 1].zoomId
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers.push(
							instance.ZoomVariableLink[action.options.position - 1].zoomId
						)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomVariableLink[action.options.position - 1].zoomId
						)
						break
				}
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased')
				instance.checkFeedbacks('selectedUser')
			},
		},
		clearSelection: {
			label: 'Clear selection',
			options: [],
			callback: () => {
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased')
				instance.checkFeedbacks('selectedUser')
			},
		},
		// Group Actions
		addToGroup: {
			label: 'Add selection to group',
			options: [
				groupOption,
				{
					type: 'dropdown',
					label: 'Add or set',
					id: 'groupOption',
					default: 'add',
					choices: [
						{ label: 'Add', id: 'add' },
						{ label: 'Set', id: 'set' },
					],
				},
			],
			callback: (action: { options: { group: number; groupOption: string } }) => {
				if (action.options.groupOption === 'set') {
					instance.ZoomGroupData[action.options.group].users.length = 0
				}
				instance.ZoomClientDataObj.selectedCallers.forEach((zoomID) => {
					instance.ZoomGroupData[action.options.group].users.push({
						zoomID: zoomID,
						userName: instance.ZoomUserData[zoomID].userName,
					})
				})
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased')
				instance.checkFeedbacks('selectedUser')
			},
		},
		clearGroup: {
			label: 'Clear group selection',
			options: [groupOption],
			callback: (action: { options: { group: number } }) => {
				instance.ZoomGroupData[action.options.group].users.length = 0
				instance.variables?.updateVariables()
				instance.updateVariables()
				instance.checkFeedbacks('groupBased')
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
		// Rename Actions
		rename: {
			label: 'Rename',
			options: [userOption, options.name],
			callback: (action: { options: { user: number; name: string } }) => {
				let oscPath = `/zoom/zoomID/rename`
				const sendToCommand: any = {
					id: 'rename',
					options: {
						command: oscPath,
						args: [
							{ type: 'i', value: action.options.user },
							{ type: 's', value: action.options.name },
						],
					},
				}
				sendActionCommand(sendToCommand)
				instance.ZoomUserData[action.options.user].userName = action.options.name
				let index = instance.ZoomVariableLink.findIndex((finduser) => finduser.zoomId === action.options.user)
				if (index !== -1) instance.ZoomVariableLink[index].userName = action.options.name
				instance.variables?.updateVariables()
			},
		},
		renameGroup: {
			label: 'Rename Group',
			options: [groupOption, options.name],
			callback: (action: { options: { group: number; name: string } }) => {
				instance.ZoomGroupData[action.options.group].groupName = action.options.name
				instance.variables?.updateVariables()
			},
		},
	}

	return {
		...extraActions,
		...actionsWithArgumentsObj,
	}
}

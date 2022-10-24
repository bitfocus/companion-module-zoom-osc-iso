import {
	CompanionActionEventInfo,
	CompanionActionEvent,
	SomeCompanionInputField,
	CompanionActions,
} from '../../../instance_skel_types'
import ZoomInstance from './index'
import { options, arrayRemove, arrayAddRemove } from './utils'

const { Actions } = require('./osccommands')

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

	let CHOICES_OUTPUTS = []
	// Change this to actual created output, get that with pulling
	for (let index = 1; index < 10; index++) {
		CHOICES_OUTPUTS.push({ id: index.toString(), label: `Output ${index}` })
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

	let outputOption: InputFieldWithDefault = {
		type: 'dropdown',
		label: 'Output',
		id: 'output',
		default: '1',
		choices: CHOICES_OUTPUTS,
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
	let CHOICES_USER_ACTIONS: { id: string; label: string }[] = []
	let CHOICES_GLOBAL_ACTIONS: { id: string; label: string }[] = []
	let CHOICES_SPECIAL_ACTIONS: { id: string; label: string }[] = []
	let CHOICES_ISO_ACTIONS: { id: string; label: string }[] = []

	for (const key in actionsObj) {
		if (Object.prototype.hasOwnProperty.call(actionsObj, key)) {
			const element = actionsObj[key]
			element.label = element.description
			element.options = []
			// The array should only contain commands with arguments
			if (element.args) {
				element.args.forEach((argument: string) => {
					switch (argument) {
						case 'name':
							element.options.push(options.name)
							break
						case 'userName':
							element.options.push(options.userName)
							break
						case 'output':
							element.options.push(options.output)
							break
						case 'path':
							element.options.push(options.path)
							break
						case 'mode':
							element.options.push(options.isoEmbeddedAudioMode)
							break
						case 'channel':
							element.options.push(options.channel)
							break
						case 'reduction_amount':
							element.options.push(options.reductionAmount)
							break
						case 'exact_name_of_selection':
							element.options.push(options.reductionAmount)
							break
						case 'loss_mode_name':
							element.options.push(options.lossModeName)
							break
						case 'id':
							element.options.push(options.id)
							break
						case 'level':
							element.options.push(options.level)
							break
						case 'intX':
							element.options.push(options.intX)
							break
						case 'intY':
							element.options.push(options.intY)
							break
						case 'msg':
							element.options.push(options.message)
							break
						case 'meetingID':
							element.options.push(options.meetingID)
							break
						case 'password':
							element.options.push(options.password)
							break
						case 'zak':
							element.options.push(options.zak)
							break
						case 'subscribeLevel':
							element.options.push(options.subscribeLevel)
							break
						case 'postCloseSeconds':
							element.options.push(options.postCloseSeconds)
							break
						case 'allowChooseBreakout':
							element.options.push(options.allowChooseBreakout)
							break
						case 'allowReturnAtWill':
							element.options.push(options.allowReturnAtWill)
							break
						case 'autoMoveParticipants':
							element.options.push(options.autoMoveParticipants)
							break
						case 'useTimer':
							element.options.push(options.useTimer)
							break
						case 'closeWithTimer':
							element.options.push(options.closeWithTimer)
							break
						case 'breakoutDurrationSeconds':
							element.options.push(options.breakoutDurrationSeconds)
							break
						case 'count':
							element.options.push(options.count)
							break

						default:
							instance.showLog('console', 'Missed to add an option in actions: ' + argument)
							break
					}
					//find options to create callback
					element.callback = (action: any) => {
						let args: { type: string; value: string | number }[] = []
						element.options.forEach((option: { id: string }) => {
							switch (option.id) {
								case 'name':
									args.push({ type: 's', value: action.options.name })
									break
								case 'lossModeName':
									args.push({ type: 's', value: action.options.lossModeName })
									break
								case 'userName':
									// Handled by createUserCommand
									break
								case 'output':
									args.push({ type: 'i', value: action.options.output })
									break
								case 'path':
									args.push({ type: 's', value: action.options.path })
									break
								case 'count':
									args.push({ type: 'i', value: action.options.count })
									break
								case 'mode':
									args.push({ type: 's', value: action.options.mode })
									break
								case 'channel':
									args.push({ type: 'i', value: action.options.channel })
									break
								case 'reduction_amount':
									args.push({ type: 's', value: action.options.reduction_amount })
									break
								case 'exact_name_of_selection':
									args.push({ type: 's', value: action.options.name })
									break
								case 'id':
									args.push({ type: 'i', value: action.options.id })
									break
								case 'level':
									args.push({ type: 'i', value: action.options.level })
									break
								case 'intX':
									args.push({ type: 'i', value: action.options.intX })
									break
								case 'intY':
									args.push({ type: 'i', value: action.options.intY })
									break
								case 'msg':
									args.push({ type: 's', value: action.options.msg })
									break
								case 'meetingID':
									args.push({ type: 's', value: action.options.meetingID })
									break
								case 'password':
									args.push({ type: 's', value: action.options.password })
									break
								case 'zak':
									args.push({ type: 's', value: action.options.zak })
									break
								case 'postCloseSeconds':
									args.push({ type: 'i', value: action.postCloseSeconds })
									break
								case 'allowChooseBreakout':
									args.push({ type: 'i', value: action.allowChooseBreakout })
									break
								case 'allowReturnAtWill':
									args.push({ type: 'i', value: action.allowReturnAtWill })
									break
								case 'autoMoveParticipants':
									args.push({ type: 'i', value: action.autoMoveParticipants })
									break
								case 'useTimer':
									args.push({ type: 'i', value: action.useTimer })
									break
								case 'closeWithTimer':
									args.push({ type: 'i', value: action.closeWithTimer })
									break
								case 'breakoutDurrationSeconds':
									args.push({ type: 'i', value: action.breakoutDurrationSeconds })
									break

								default:
									instance.showLog('console', 'Missed an argument to add in osc commands: ' + argument)
									break
							}
						})
						let command = createCommand(
							element.command,
							action.options.userName ? action.options.userName : undefined,
							element.singleUser
						)
						args.forEach((element) => {
							command.args.push(element)
						})

						const sendToCommand: any = {
							id: element.shortDescription,
							options: {
								command: command.oscPath,
								args: command.args,
							},
						}
						sendActionCommand(sendToCommand)
					}
				})
			} else {
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
					case 'ISO':
						CHOICES_ISO_ACTIONS.push({ label: element.description, id: element.shortDescription })
						break
					default:
						instance.showLog('console', 'wrong type ' + element.type)
						break
				}
			}
		}
	}

	/**
	 * createUserCommand function to create oscPath and arguments for user
	 * @param actionID string
	 * @param name string
	 * @returns object { argsCallers: { type: string; value: string | number }[]; oscPath: string }
	 */
	const createCommand = (actionID: string, name: string, singleUser: boolean | null) => {
		let command: {
			args: { type: string; value: string | number }[]
			argsNames: { type: string; value: string | number }[]
			oscPath: string
			oscPathName: string
		} = {
			args: [],
			argsNames: [],
			oscPath: '',
			oscPathName: '',
		}
		// If/When no user is involved set path and skip the rest
		if (singleUser === null) {
			command.oscPath = `/zoom${actionID}`
		} else {
			let selectedCallers: number[] | string = instance.ZoomClientDataObj.selectedCallers
			// Check if override has been filled
			if (name != '' && name != undefined) {
				instance.showLog('debug', 'Override:' + name)
				instance.getVariable(name, (value: string) => {
					if (value !== undefined) name = value
				})
				if (name === 'Me' || name === 'me' || name === 'all' || name === 'All') {
					command.oscPath = `/zoom/${name.toLowerCase()}` + actionID
				} else {
					command.oscPath = `/zoom/userName` + actionID
					command.args.push({ type: 's', value: name })
				}
				// Use the pre-selection options
			} else {
				if (Array.isArray(selectedCallers)) {
					// should be otherwise somethings wrong
					if (selectedCallers.length === 0) console.log('Select a caller first')
					// When command is for one user only send first caller
					if (singleUser) {
						command.args.push({ type: 'i', value: selectedCallers[0] })
						command.argsNames.push({ type: 's', value: instance.ZoomUserData[selectedCallers[0]].userName })
					} else {
						selectedCallers.forEach((caller) => {
							command.args.push({ type: 'i', value: caller })
							command.argsNames.push({ type: 's', value: instance.ZoomUserData[caller].userName })
						})
					}
				} else {
					instance.showLog('console', 'Wrong selection')
				}
				// Different path when more than one users are selected
				command.oscPath = (command.args.length > 1 ? `/zoom/users/zoomID` : `/zoom/zoomID`) + actionID
				command.oscPathName = (command.argsNames.length > 1 ? `/zoom/users/userName` : `/zoom/userName`) + actionID
			}
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
			callback: (action: { options: { actionID: string; userName: string } }) => {
				let command = createCommand(
					Actions[action.options.actionID].command,
					action.options.userName,
					Actions[action.options.actionID].singleUser
				)
				const sendToCommand: any = {
					id: Actions[action.options.actionID].shortDescription,
					options: {
						command: command.oscPath,
						args: command.args,
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
				let command = createCommand(Actions[action.options.actionID].command, '', null)
				const sendToCommand: any = {
					id: Actions[action.options.actionID].shortDescription,
					options: {
						command: command.oscPath,
						args: [],
					},
				}
				if (Actions[action.options.actionID].shortDescription === 'LowerAllHands') {
					instance.showLog('debug', 'action: Lower All Hands overide')
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
			label: 'Special actions: Basics',
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
				let command = createCommand(
					Actions[action.options.actionID].command,
					'',
					Actions[action.options.actionID].singleUser
				)
				const sendToCommand: any = {
					id: Actions[action.options.actionID].shortDescription,
					options: {
						command: command.oscPath,
						args: [],
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		ISOActions: {
			label: 'ISO actions: Basics',
			options: [
				{
					type: 'dropdown',
					label: 'ISO Action',
					id: 'actionID',
					default: 'startISOEngine',
					choices: CHOICES_ISO_ACTIONS,
				},
			],
			callback: (action: { options: { actionID: string } }) => {
				let command = createCommand(
					Actions[action.options.actionID].command,
					'',
					Actions[action.options.actionID].singleUser
				)
				const sendToCommand: any = {
					id: Actions[action.options.actionID].shortDescription,
					options: {
						command: command.oscPath,
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
		SelectUserByName: {
			label: 'Preselect user by name',
			options: [
				{
					type: 'textinput',
					label: 'name',
					id: 'name',
					default: '',
				},
				{
					type: 'dropdown',
					label: 'Option',
					id: 'option',
					default: 'toggle',
					choices: [
						{ label: 'Toggle', id: 'toggle' },
						{ label: 'Select', id: 'select' },
						{ label: 'Remove', id: 'remove' },
					],
				},
			],
			callback: async (action: { options: { name: string; option: string } }) => {
				for (const key in instance.ZoomUserData) {
					if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
						const user = instance.ZoomUserData[key]
						if (user.userName === action.options.name) {
							switch (action.options.option) {
								case 'toggle':
									if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
									//find user in list
									instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
										instance.ZoomClientDataObj.selectedCallers,
										user.zoomId
									)
									break
								case 'select':
									if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
									instance.ZoomClientDataObj.selectedCallers.push(user.zoomId)
									break
								case 'remove':
									instance.ZoomClientDataObj.selectedCallers = arrayRemove(
										instance.ZoomClientDataObj.selectedCallers,
										user.zoomId
									)
									break
							}
							instance.variables?.updateVariables()
							instance.checkFeedbacks('groupBased')
							instance.checkFeedbacks('indexBased')
							instance.checkFeedbacks('userNameBased')
							instance.checkFeedbacks('galleryBased')
						}
					}
				}
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
				instance.checkFeedbacks('groupBased')
				instance.checkFeedbacks('indexBased')
				instance.checkFeedbacks('userNameBased')
				instance.checkFeedbacks('galleryBased')
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
				instance.checkFeedbacks('groupBased')
				instance.checkFeedbacks('indexBased')
				instance.checkFeedbacks('userNameBased')
				instance.checkFeedbacks('galleryBased')
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
				instance.checkFeedbacks('groupBased')
				instance.checkFeedbacks('indexBased')
				instance.checkFeedbacks('userNameBased')
				instance.checkFeedbacks('galleryBased')
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
				instance.checkFeedbacks('indexBased')
				instance.checkFeedbacks('userNameBased')
				instance.checkFeedbacks('galleryBased')
			},
		},
		clearParticipants: {
			label: 'Clear Participants',
			options: [],
			callback: () => {
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased')
				instance.checkFeedbacks('indexBased')
				instance.checkFeedbacks('userNameBased')
				instance.checkFeedbacks('galleryBased')
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
					if (!instance.ZoomGroupData[action.options.group].users.find((o) => o.zoomID === zoomID)) {
						instance.ZoomGroupData[action.options.group].users.push({
							zoomID: zoomID,
							userName: instance.ZoomUserData[zoomID].userName,
						})
					}
				})
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased')
				instance.checkFeedbacks('indexBased')
				instance.checkFeedbacks('userNameBased')
				instance.checkFeedbacks('galleryBased')
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
		nextParticipants: {
			label: 'nextParticipants',
			options: [
				{
					type: 'number',
					label: 'Number of buttons',
					id: 'shift',
					default: 30,
					min: 1,
					max: 32,
				},
			],
			callback: (action: { options: { shift: number } }) => {
				// Grap the items you want to see
				let numberToShift = action.options.shift
				let itemsToShift: { zoomId: number; userName: string }[] = instance.ZoomVariableLink.slice(0, numberToShift)
				instance.ZoomVariableLink.splice(0, numberToShift)
				instance.ZoomVariableLink.push(...itemsToShift)

				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased')
				instance.checkFeedbacks('indexBased')
				instance.checkFeedbacks('userNameBased')
				instance.checkFeedbacks('galleryBased')
			},
		},
		previousParticipants: {
			label: 'previousParticipants',
			options: [
				{
					type: 'number',
					label: 'Number of buttons',
					id: 'shift',
					default: 30,
					min: 1,
					max: 32,
				},
			],
			callback: (action: { options: { shift: number } }) => {
				// Grap the items you want to see
				let numberToShift = action.options.shift
				// Be carefull for below/invallid index
				let itemsToShift: { zoomId: number; userName: string }[] = instance.ZoomVariableLink.slice(-numberToShift)

				instance.ZoomVariableLink.splice(instance.ZoomVariableLink.length - numberToShift, numberToShift)
				instance.ZoomVariableLink.splice(0, 0, ...itemsToShift)

				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased')
				instance.checkFeedbacks('indexBased')
				instance.checkFeedbacks('userNameBased')
				instance.checkFeedbacks('galleryBased')
			},
		},
		// ISO Actions
		selectOutput: {
			label: 'Select output',
			options: [outputOption],
			callback: (action: { options: { output: number } }) => {
				const index = instance.ZoomClientDataObj.selectedOutputs.indexOf(action.options.output)
				if (index > -1) {
					instance.ZoomClientDataObj.selectedOutputs.splice(index, 1)
				} else {
					instance.ZoomClientDataObj.selectedOutputs.push(action.options.output)
				}
				instance.checkFeedbacks('output')
			},
		},
		selectAudioOutput: {
			label: 'Select audio output',
			options: [outputOption],
			callback: (action: { options: { output: number } }) => {
				const index = instance.ZoomClientDataObj.selectedAudioOutputs.indexOf(action.options.output)
				if (index > -1) {
					instance.ZoomClientDataObj.selectedAudioOutputs.splice(index, 1)
				} else {
					instance.ZoomClientDataObj.selectedAudioOutputs.push(action.options.output)
				}
				instance.checkFeedbacks('audioOutput')
			},
		},
		takeSelectedOutputs: {
			label: 'Take selected outputs',
			options: [],
			callback: () => {
				let args: { type: string; value: string | number }[] = []
				for (let index = 0; index < instance.ZoomClientDataObj.selectedOutputs.length; index++) {
					// only fill up outputs when there are users
					if (instance.ZoomClientDataObj.selectedCallers[index]) {
						args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedCallers[index] })
						args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedOutputs[index] })
					}
				}

				const sendToCommand: any = {
					id: 'outputISO',
					options: {
						command: '/zoom/zoomID/outputISO',
						args: args,
					},
				}
				sendActionCommand(sendToCommand)
				// reset arrays
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.ZoomClientDataObj.selectedOutputs.length = 0
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased')
				instance.checkFeedbacks('indexBased')
				instance.checkFeedbacks('userNameBased')
				instance.checkFeedbacks('galleryBased')
				instance.checkFeedbacks('output')
			},
		},
	}

	return {
		...extraActions,
		...actionsObj,
	}
}

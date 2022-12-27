import {
	CompanionActionDefinition,
	CompanionActionDefinitions,
	CompanionActionEvent,
	SomeCompanionActionInputField,
} from '@companion-module/base'
import { ZoomConfig } from './config'
import { arrayAddRemove, arrayRemove, InstanceBaseExt, options } from './utils'

// const { Actions, ISOActions } = require('./osccommands')

export enum ActionId {
	setAudioGainReduction = 'set_AudioGain_Reduction',
	setOutputSelection = 'set_Output_Selection',
	setAudioSelection = 'set_Audio_Selection',
	setOutputEmbeddedAudio = 'set_Output_Embedded_Audio',
	setVideoLossMode = 'set_VideoLoss_Mode',
	setOutputName = 'set_Output_Name',
	deleteOutput = 'delete_Output',
	outputISO = 'output_ISO',
	audioISO = 'audio_ISO',
	startISOEngine = 'start_ISO_Engine',
	stopISOEngine = 'stop_ISO_Engine',
	standbyISOEngine = 'standby_ISO_Engine',
	addOutput = 'add_Output',
	setOutputCount = 'set_Output_Count',
	enableOutput = 'enable_Output',
	disableOutput = 'disable_Output',
	loadISOConfig = 'load_ISO_Config',
	saveISOConfig = 'save_ISO_Config',
	mergeISOConfig = 'merge_ISO_Config',
	getConfigPath = 'get_Config_Path',
	setOutputMode = 'set_Output_Mode',
	setOutputType = 'set_Output_Type',
	setAudioMode = 'set_Audio_Mode',
	acceptRecordingConsent = 'accept_Recording_Consent',
	selectionMethod = 'selection_Method',
	selectUser = 'select_User',
	selectUserByName = 'select_User_By_Name',
	selectGroup = 'select_Group',
	selectUserFromGroupPosition = 'select_User_From_Group_Position',
	selectFromGalleryPosition = 'select_From_Gallery_Position',
	selectFromIndexPosition = 'select_From_Index_Position',
	clearParticipants = 'clear_Participants',
	addToGroup = 'add_To_Group',
	clearGroup = 'clear_Group',
	removeFromGroup = 'remove_From_Group',
	rename = 'rename',
	renameGroup = 'rename_Group',
	nextParticipants = 'next_Participants',
	previousParticipants = 'previous_Participants',
	selectOutput = 'select_Output',
	selectAudioOutput = 'select_Audio_Output',
	takeSelectedOutputs = 'take_Selected_Outputs',
}

/**
 * Main function to create the actions
 * @param instance Give the instance so we can extract data
 * @returns CompanionActions
 */
export function getActions(instance: InstanceBaseExt<ZoomConfig>): CompanionActionDefinitions {
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
	instance.ZoomGroupData.forEach((group: { groupName: any }, index: { toString: () => any }) => {
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

	let userOption: any = {
		type: 'dropdown',
		label: 'User',
		id: 'user',
		default: CHOICES_USERS_DEFAULT,
		choices: CHOICES_USERS,
	}

	let galleryOrderOption: SomeCompanionActionInputField = {
		type: 'dropdown',
		label: 'Position',
		id: 'position',
		default: '0',
		choices: CHOICES_POSITION,
	}

	let participantOption: SomeCompanionActionInputField = {
		type: 'dropdown',
		label: 'Position',
		id: 'position',
		default: '0',
		choices: CHOICES_PARTICIPANT,
	}

	let groupOption: SomeCompanionActionInputField = {
		type: 'dropdown',
		label: 'Group',
		id: 'group',
		default: CHOICES_GROUPS_DEFAULT,
		choices: CHOICES_GROUPS,
	}

	let outputOption: SomeCompanionActionInputField = {
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
		action: { options: { command: any; args: any } },
		_info?: CompanionActionEvent | null
	): void => {
		// Construct command
		let oscPath = action.options.command
		let args = action.options.args
		if (instance.OSC) instance.OSC.sendCommand(oscPath, args)
	}

	const actions: { [id in ActionId]: CompanionActionDefinition | undefined } = {
		[ActionId.setAudioGainReduction]: {
			name: 'set Audio Gain Reduction',
			options: [options.channel, options.reductionAmount],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/setAudioGainReduction')
				command.args.push({ type: 'i', value: action.options.channel })
				command.args.push({ type: 'i', value: action.options.reductionAmount })

				const sendToCommand = {
					id: ActionId.setAudioGainReduction,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputSelection]: {
			name: 'set Output Selection',
			options: [options.output, options.reductionAmount],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/setOutputSelection')
				command.args.push({ type: 'i', value: action.options.output })
				command.args.push({ type: 'i', value: action.options.reductionAmount })

				const sendToCommand = {
					id: ActionId.setOutputSelection,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setAudioSelection]: {
			name: 'set Audio Selection',
			options: [options.output, options.reductionAmount],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/setAudioSelection')
				command.args.push({ type: 'i', value: action.options.channel })
				command.args.push({ type: 'i', value: action.options.reductionAmount })

				const sendToCommand = {
					id: ActionId.setAudioSelection,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputEmbeddedAudio]: {
			name: 'set Output Embedded Audio',
			options: [options.output, options.mode],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/setOutputEmbeddedAudio')
				command.args.push({ type: 'i', value: action.options.output })
				command.args.push({ type: 'i', value: action.options.mode })

				const sendToCommand = {
					id: ActionId.setOutputEmbeddedAudio,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setVideoLossMode]: {
			name: 'set Video Loss Mode',
			options: [options.videoLossMode],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/setVideoLossMode')
				command.args.push({ type: 's', value: action.options.videoLossMode })

				const sendToCommand = {
					id: ActionId.setVideoLossMode,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputName]: {
			name: 'set Output Name',
			options: [options.output, options.name],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/setOutputName')
				command.args.push({ type: 'i', value: action.options.output })
				command.args.push({ type: 's', value: action.options.name })

				const sendToCommand = {
					id: ActionId.setOutputName,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.deleteOutput]: {
			name: 'delete Output',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/deleteOutput')
				command.args.push({ type: 'i', value: action.options.output })

				const sendToCommand = {
					id: ActionId.deleteOutput,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.outputISO]: {
			name: 'output ISO',
			options: [options.userName, options.output],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/outputISO', '', false)
				command.args.push({ type: 's', value: action.options.userName })
				command.args.push({ type: 'i', value: action.options.output })

				const sendToCommand = {
					id: ActionId.outputISO,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.audioISO]: {
			name: 'audio ISO',
			options: [options.userName, options.output],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/audioISO', '', true)
				command.args.push({ type: 's', value: action.options.userName })
				command.args.push({ type: 'i', value: action.options.output })

				const sendToCommand = {
					id: ActionId.audioISO,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.startISOEngine]: {
			name: 'Start ISO Engine',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				let command = createCommand('/startISOEngine')

				const sendToCommand = {
					id: ActionId.startISOEngine,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.stopISOEngine]: {
			name: 'Stop ISO Engine',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				let command = createCommand('/stopISOEngine')

				const sendToCommand = {
					id: ActionId.stopISOEngine,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.standbyISOEngine]: {
			name: 'Standby ISO Engine',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				let command = createCommand('/standbyISOEngine')

				const sendToCommand = {
					id: ActionId.standbyISOEngine,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.addOutput]: {
			name: 'addOutput',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				let command = createCommand('/addOutput')

				const sendToCommand = {
					id: ActionId.addOutput,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputCount]: {
			name: 'set Output Count',
			options: [options.count],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/setOutputCount')
				command.args.push({ type: 'i', value: action.options.count })
				const sendToCommand = {
					id: ActionId.setOutputCount,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.enableOutput]: {
			name: 'enableOutput',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/enableOutput')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionId.setOutputCount,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.disableOutput]: {
			name: 'disableOutput',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/disableOutput')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionId.disableOutput,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.loadISOConfig]: {
			name: 'Load Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/loadConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionId.disableOutput,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.saveISOConfig]: {
			name: 'Save Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/saveConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionId.saveISOConfig,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.mergeISOConfig]: {
			name: 'Merge Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/mergeConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionId.mergeISOConfig,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.getConfigPath]: {
			name: 'getConfig path',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				let command = createCommand('/getConfigPath')
				const sendToCommand = {
					id: ActionId.getConfigPath,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputMode]: {
			name: 'setOutputMode',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/setOutputMode')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionId.setOutputMode,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputType]: {
			name: 'setOutputType',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/setOutputType')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionId.setOutputType,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setAudioMode]: {
			name: 'setAudioMode',
			options: [options.channel],
			callback: (action): void => {
				// type: 'ISO'
				let command = createCommand('/setAudioMode')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionId.setAudioMode,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.acceptRecordingConsent]: {
			name: 'Accept Recording Consent',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				let command = createCommand('/acceptRecordingConsent')
				const sendToCommand = {
					id: ActionId.acceptRecordingConsent,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},

		// Select Actions
		[ActionId.selectionMethod]: {
			name: 'Selection method',
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
			callback: (action) => {
				if (action.options.selectionMethod === 2) {
					instance.config.selectionMethod === 1
						? (instance.config.selectionMethod = 0)
						: (instance.config.selectionMethod = 1)
				} else {
					instance.config.selectionMethod = action.options.selectionMethod as number
				}
				instance.saveConfig(instance.config)
				instance.checkFeedbacks('selectionMethod', 'groupBased')
			},
		},
		[ActionId.selectUser]: {
			name: 'Preselect user',
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
			callback: (action) => {
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							action.options.user as number
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						if ((action.options.user as number) < instance.ZoomClientDataObj.numberOfGroups + 1)
							instance.ZoomClientDataObj.selectedCallers.push(action.options.user)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							action.options.user as number
						)
						break
				}
				instance.variables?.updateVariables()
				instance.checkFeedbacks('selectedUser', 'groupBased')
			},
		},
		[ActionId.selectUserByName]: {
			name: 'Preselect user by name',
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
			callback: async (action) => {
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
							instance.checkFeedbacks('groupBased', 'indexBased', 'userNameBased', 'galleryBased')
						}
					}
				}
			},
		},
		[ActionId.selectGroup]: {
			name: 'Preselect group',
			options: [groupOption],
			callback: (action) => {
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.ZoomGroupData[action.options.group as number].users?.forEach((user: { zoomID: any }) => {
					instance.ZoomClientDataObj.selectedCallers.push(user.zoomID)
				})
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased', 'indexBased', 'userNameBased', 'galleryBased')
			},
		},
		[ActionId.selectUserFromGroupPosition]: {
			name: 'Preselect user',
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
			callback: (action) => {
				let position = (action.options.position as number) - 1
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomGroupData[action.options.group as number].users[position].zoomID
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers.push(
							instance.ZoomGroupData[action.options.group as number].users[position].zoomID
						)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomGroupData[action.options.group as number].users[position].zoomID
						)
						break
				}
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased', 'indexBased', 'userNameBased', 'galleryBased')
			},
		},
		[ActionId.selectFromGalleryPosition]: {
			name: 'Preselect user/group',
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
			callback: (action) => {
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomClientDataObj.galleryOrder[(action.options.position as number) - 1]
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers.push(
							instance.ZoomClientDataObj.galleryOrder[(action.options.position as number) - 1]
						)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomClientDataObj.galleryOrder[(action.options.position as number) - 1]
						)
						break
				}
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased', 'indexBased', 'userNameBased', 'galleryBased')
			},
		},
		[ActionId.selectFromIndexPosition]: {
			name: 'Preselect user/group',
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
			callback: (action) => {
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomVariableLink[(action.options.position as number) - 1].zoomId
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers.push(
							instance.ZoomVariableLink[(action.options.position as number) - 1].zoomId
						)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomVariableLink[(action.options.position as number) - 1].zoomId
						)
						break
				}
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased', 'indexBased', 'userNameBased', 'galleryBased')
			},
		},
		[ActionId.clearParticipants]: {
			name: 'Clear Participants',
			options: [],
			callback: () => {
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased', 'indexBased', 'userNameBased', 'galleryBased')
			},
		},
		// Group Actions
		[ActionId.addToGroup]: {
			name: 'Add selection to group',
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
			callback: (action) => {
				if (action.options.groupOption === 'set') {
					instance.ZoomGroupData[action.options.group as number].users.length = 0
				}
				instance.ZoomClientDataObj.selectedCallers.forEach((zoomID: string | number) => {
					if (
						!instance.ZoomGroupData[action.options.group as number].users.find(
							(o: { zoomID: string | number }) => o.zoomID === zoomID
						)
					) {
						instance.ZoomGroupData[action.options.group as number].users.push({
							zoomID: zoomID,
							userName: instance.ZoomUserData[zoomID].userName,
						})
					}
				})
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased', 'indexBased', 'userNameBased', 'galleryBased')
			},
		},
		[ActionId.clearGroup]: {
			name: 'Clear group selection',
			options: [groupOption],
			callback: (action) => {
				instance.ZoomGroupData[action.options.group as number].users.length = 0
				instance.variables?.updateVariables()
				instance.updateVariables()
				instance.checkFeedbacks('groupBased')
			},
		},
		[ActionId.removeFromGroup]: {
			name: 'Remove from group',
			options: [userOption, groupOption],
			callback: (action) => {
				if (instance.ZoomUserData[action.options.group as number].users !== undefined) {
					for (var i = 0; i < instance.ZoomUserData[action.options.group as number].users.length; i++) {
						if (instance.ZoomUserData[action.options.group as number].users[i] === action.options.user) {
							instance.ZoomUserData[action.options.group as number].users.splice(i, 1)
						}
					}
				}
				instance.variables?.updateVariables()
			},
		},
		// Rename Actions
		[ActionId.rename]: {
			name: 'Rename',
			options: [userOption, options.name],
			callback: (action) => {
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
				instance.ZoomUserData[action.options.user as number].userName = action.options.name
				let index = instance.ZoomVariableLink.findIndex(
					(finduser: { zoomId: number }) => finduser.zoomId === action.options.user
				)
				if (index !== -1) instance.ZoomVariableLink[index].userName = action.options.name
				instance.variables?.updateVariables()
			},
		},
		[ActionId.renameGroup]: {
			name: 'Rename Group',
			options: [groupOption, options.name],
			callback: (action) => {
				instance.ZoomGroupData[action.options.group as number].groupName = action.options.name
				instance.variables?.updateVariables()
			},
		},
		[ActionId.nextParticipants]: {
			name: 'nextParticipants',
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
			callback: (action) => {
				// Grap the items you want to see
				let numberToShift = action.options.shift
				let itemsToShift: { zoomId: number; userName: string }[] = instance.ZoomVariableLink.slice(0, numberToShift)
				instance.ZoomVariableLink.splice(0, numberToShift)
				instance.ZoomVariableLink.push(...itemsToShift)

				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased', 'indexBased', 'userNameBased', 'galleryBased')
			},
		},
		[ActionId.previousParticipants]: {
			name: 'previousParticipants',
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
			callback: (action) => {
				// Grap the items you want to see
				let numberToShift = action.options.shift as number
				// Be carefull for below/invallid index
				let itemsToShift: { zoomId: number; userName: string }[] = instance.ZoomVariableLink.slice(-numberToShift)

				instance.ZoomVariableLink.splice(instance.ZoomVariableLink.length - numberToShift, numberToShift)
				instance.ZoomVariableLink.splice(0, 0, ...itemsToShift)

				instance.variables?.updateVariables()
				instance.checkFeedbacks('groupBased', 'indexBased', 'userNameBased', 'galleryBased')
			},
		},
		// ISO Actions
		[ActionId.selectOutput]: {
			name: 'Select output',
			options: [outputOption],
			callback: (action) => {
				const index = instance.ZoomClientDataObj.selectedOutputs.indexOf(action.options.output)
				if (index > -1) {
					instance.ZoomClientDataObj.selectedOutputs.splice(index, 1)
				} else {
					instance.ZoomClientDataObj.selectedOutputs.push(action.options.output)
				}
				instance.checkFeedbacks('output')
			},
		},
		[ActionId.selectAudioOutput]: {
			name: 'Select audio output',
			options: [outputOption],
			callback: (action) => {
				const index = instance.ZoomClientDataObj.selectedAudioOutputs.indexOf(action.options.output)
				if (index > -1) {
					instance.ZoomClientDataObj.selectedAudioOutputs.splice(index, 1)
				} else {
					instance.ZoomClientDataObj.selectedAudioOutputs.push(action.options.output)
				}
				instance.checkFeedbacks('audioOutput')
			},
		},
		[ActionId.takeSelectedOutputs]: {
			name: 'Take selected outputs',
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
				instance.checkFeedbacks('groupBased', 'indexBased', 'userNameBased', 'galleryBased', 'output')
			},
		},
	}

	// // Create all actions
	// let actionsObj
	// if (config.version === 1) {
	// 	actionsObj = { ...Actions, ...ISOActions }
	// } else {
	// 	actionsObj = Actions
	// }
	// let CHOICES_USER_ACTIONS: { id: string; label: string }[] = []
	// let CHOICES_GLOBAL_ACTIONS: { id: string; label: string }[] = []
	// let CHOICES_SPECIAL_ACTIONS: { id: string; label: string }[] = []
	// let CHOICES_ISO_ACTIONS: { id: string; label: string }[] = []

	// for (const key in actionsObj) {
	// 	if (Object.prototype.hasOwnProperty.call(actionsObj, key)) {
	// 		const element = actionsObj[key]
	// 		element.label = element.description
	// 		element.options = []
	// 		// The array should only contain commands with arguments
	// 		if (element.args) {
	// 			element.args.forEach((argument: string) => {
	// 				switch (argument) {
	// 					case 'name':
	// 						element.options.push(options.name)
	// 						break
	// 					case 'userName':
	// 						element.options.push(options.userName)
	// 						break
	// 					case 'output':
	// 						element.options.push(options.output)
	// 						break
	// 					case 'path':
	// 						element.options.push(options.path)
	// 						break
	// 					case 'customArgs':
	// 						element.options.push(options.customArgs)
	// 						break
	// 					case 'mode':
	// 						element.options.push(options.isoEmbeddedAudioMode)
	// 						break
	// 					case 'channel':
	// 						element.options.push(options.channel)
	// 						break
	// 					case 'reduction_amount':
	// 						element.options.push(options.reductionAmount)
	// 						break
	// 					case 'exact_name_of_selection':
	// 						element.options.push(options.reductionAmount)
	// 						break
	// 					case 'videoLossMode':
	// 						element.options.push(options.videoLossMode)
	// 						break
	// 					case 'id':
	// 						element.options.push(options.id)
	// 						break
	// 					case 'level':
	// 						element.options.push(options.level)
	// 						break
	// 					case 'intX':
	// 						element.options.push(options.intX)
	// 						break
	// 					case 'intY':
	// 						element.options.push(options.intY)
	// 						break
	// 					case 'msg':
	// 						element.options.push(options.message)
	// 						break
	// 					case 'meetingID':
	// 						element.options.push(options.meetingID)
	// 						break
	// 					case 'password':
	// 						element.options.push(options.password)
	// 						break
	// 					case 'zak':
	// 						element.options.push(options.zak)
	// 						break
	// 					case 'subscribeLevel':
	// 						element.options.push(options.subscribeLevel)
	// 						break
	// 					case 'postCloseSeconds':
	// 						element.options.push(options.postCloseSeconds)
	// 						break
	// 					case 'allowChooseBreakout':
	// 						element.options.push(options.allowChooseBreakout)
	// 						break
	// 					case 'allowReturnAtWill':
	// 						element.options.push(options.allowReturnAtWill)
	// 						break
	// 					case 'autoMoveParticipants':
	// 						element.options.push(options.autoMoveParticipants)
	// 						break
	// 					case 'useTimer':
	// 						element.options.push(options.useTimer)
	// 						break
	// 					case 'closeWithTimer':
	// 						element.options.push(options.closeWithTimer)
	// 						break
	// 					case 'breakoutDurrationSeconds':
	// 						element.options.push(options.breakoutDurrationSeconds)
	// 						break
	// 					case 'count':
	// 						element.options.push(options.count)
	// 						break

	// 					default:
	// 						showLog('console', 'Missed to add an option in actions: ' + argument)
	// 						break
	// 				}
	// 				//find options to create callback
	// 				element.callback = (action: any) => {
	// 					let args: { type: string; value: string | number }[] = []
	// 					element.options.forEach((option: { id: string }) => {
	// 						switch (option.id) {
	// 							case 'name':
	// 								args.push({ type: 's', value: action.options.name })
	// 								break
	// 							case 'videoLossMode':
	// 								args.push({ type: 's', value: action.options.videoLossMode })
	// 								break
	// 							case 'userName':
	// 								// Handled by createUserCommand
	// 								break
	// 							case 'output':
	// 								args.push({ type: 'i', value: action.options.output })
	// 								break
	// 							case 'path':
	// 								args.push({ type: 's', value: action.options.path })
	// 								break
	// 							case 'customArgs':
	// 								args.push(JSON.parse(action.options.customArgs))
	// 								break
	// 							case 'count':
	// 								args.push({ type: 'i', value: action.options.count })
	// 								break
	// 							case 'embeddedAudioMode':
	// 								args.push({ type: 'i', value: action.options.embeddedAudioMode })
	// 								break
	// 							case 'channel':
	// 								args.push({ type: 'i', value: action.options.channel })
	// 								break
	// 							case 'reduction_amount':
	// 								args.push({ type: 's', value: action.options.reduction_amount })
	// 								break
	// 							case 'exact_name_of_selection':
	// 								args.push({ type: 's', value: action.options.name })
	// 								break
	// 							case 'id':
	// 								args.push({ type: 'i', value: action.options.id })
	// 								break
	// 							case 'level':
	// 								args.push({ type: 'i', value: action.options.level })
	// 								break
	// 							case 'intX':
	// 								args.push({ type: 'i', value: action.options.intX })
	// 								break
	// 							case 'intY':
	// 								args.push({ type: 'i', value: action.options.intY })
	// 								break
	// 							case 'msg':
	// 								args.push({ type: 's', value: action.options.msg })
	// 								break
	// 							case 'meetingID':
	// 								args.push({ type: 's', value: action.options.meetingID })
	// 								break
	// 							case 'password':
	// 								args.push({ type: 's', value: action.options.password })
	// 								break
	// 							case 'zak':
	// 								args.push({ type: 's', value: action.options.zak })
	// 								break
	// 							case 'postCloseSeconds':
	// 								args.push({ type: 'i', value: action.postCloseSeconds })
	// 								break
	// 							case 'allowChooseBreakout':
	// 								args.push({ type: 'i', value: action.allowChooseBreakout })
	// 								break
	// 							case 'allowReturnAtWill':
	// 								args.push({ type: 'i', value: action.allowReturnAtWill })
	// 								break
	// 							case 'autoMoveParticipants':
	// 								args.push({ type: 'i', value: action.autoMoveParticipants })
	// 								break
	// 							case 'useTimer':
	// 								args.push({ type: 'i', value: action.useTimer })
	// 								break
	// 							case 'closeWithTimer':
	// 								args.push({ type: 'i', value: action.closeWithTimer })
	// 								break
	// 							case 'breakoutDurrationSeconds':
	// 								args.push({ type: 'i', value: action.breakoutDurrationSeconds })
	// 								break

	// 							default:
	// 								showLog('console', 'Missed an argument to add in osc commands: ' + argument)
	// 								break
	// 						}
	// 					})
	// 					let command: {
	// 						args: any
	// 						oscPath: any
	// 						argsNames?: { type: string; value: string | number }[]
	// 						oscPathName?: string
	// 					}
	// 					if (element.command === '/customCommand') {
	// 						command = { oscPath: action.options.path, args: [] }
	// 					} else if (element.command === '/customCommandWithArguments') {
	// 						command = { oscPath: element.command, args: action.options.customArgs }
	// 					} else {
	// 						command = createCommand(
	// 							element.command,
	// 							action.options.userName ? action.options.userName : undefined,
	// 							element.singleUser
	// 						)
	// 						args.forEach((element) => {
	// 							command.args.push(element)
	// 						})
	// 					}

	// 					const sendToCommand: any = {
	// 						id: element.shortDescription,
	// 						options: {
	// 							command: command.oscPath,
	// 							args: command.args,
	// 						},
	// 					}
	// 					sendActionCommand(sendToCommand)
	// 				}
	// 			})
	// 		} else {
	// 			switch (element.type) {
	// 				case 'User':
	// 					CHOICES_USER_ACTIONS.push({ label: element.description, id: element.shortDescription })
	// 					break
	// 				case 'Global':
	// 					CHOICES_GLOBAL_ACTIONS.push({ label: element.description, id: element.shortDescription })
	// 					break
	// 				case 'Special':
	// 					CHOICES_SPECIAL_ACTIONS.push({ label: element.description, id: element.shortDescription })
	// 					break
	// 				case 'ISO':
	// 					CHOICES_ISO_ACTIONS.push({ label: element.description, id: element.shortDescription })
	// 					break
	// 				default:
	// 					showLog('console', 'wrong type ' + element.type)
	// 					break
	// 			}
	// 		}
	// 	}
	// }

	/**
	 * createUserCommand function to create oscPath and arguments for user
	 * @param actionID string
	 * @param name string
	 * @returns object { argsCallers: { type: string; value: string | number }[]; oscPath: string }
	 */
	const createCommand = (OSCAction: string, name?: string, singleUser?: boolean | null) => {
		let command: {
			args: { type: string; value: any }[]
			argsNames: { type: string; value: any }[]
			oscPath: string
			oscPathName: string
		} = {
			args: [],
			argsNames: [],
			oscPath: '',
			oscPathName: '',
		}
		// If/When no user is involved set path and skip the rest
		if (singleUser === null || singleUser === undefined) {
			command.oscPath = `/zoom${OSCAction}`
		} else {
			let selectedCallers: number[] | string = instance.ZoomClientDataObj.selectedCallers
			// Check if override has been filled
			if (name != '' && name != undefined) {
				instance.showLog('debug', 'Override:' + name)
				let value = instance.getVariableValue(name)
				instance.showLog('console', 'Value of getVariable:' + value)
				if (value !== undefined || '') name = value?.toString()

				if (name === 'Me' || name === 'me' || name === 'all' || name === 'All') {
					command.oscPath = `/zoom/${name.toLowerCase()}` + OSCAction
				} else {
					command.oscPath = `/zoom/userName` + OSCAction
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
				command.oscPath = (command.args.length > 1 ? `/zoom/users/zoomID` : `/zoom/zoomID`) + OSCAction
				command.oscPathName = (command.argsNames.length > 1 ? `/zoom/users/userName` : `/zoom/userName`) + OSCAction
			}
		}
		return command
	}

	return actions
}

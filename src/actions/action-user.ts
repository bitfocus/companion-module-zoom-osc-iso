import { CompanionActionDefinition, SomeCompanionActionInputField } from '@companion-module/base'
import { ZoomConfig } from '../config'
import { InstanceBaseExt, arrayAdd, arrayRemove, options, userExist } from '../utils'
import { FeedbackId } from '../feedback'
import {
	selectionMethod,
	userOption,
	PreviousSelectedCallersSave,
	toggleSelectedUser,
	PreviousSelectedCallersRestore,
} from './action-utils'

export enum ActionIdUsers {
	selectionMethod = 'selection_Method',
	selectUser = 'select_User',
	selectUserByName = 'select_User_By_Name',
	selectFromIndexPosition = 'select_From_Index_Position',
	clearParticipants = 'clear_Participants',
	nextParticipants = 'next_Participants',
	previousParticipants = 'previous_Participants',
	resetParticipants = 'reset_Participants',
	restorePreviousSelection = 'restorePreviousSelection',
}

export function GetActionsUsers(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdUsers]: CompanionActionDefinition | undefined
} {
	const CHOICES_PARTICIPANT: {
		id: string
		label: string
	}[] = []

	for (let index = 1; index < 1000; index++) {
		CHOICES_PARTICIPANT.push({ id: index.toString(), label: `Participant ${index}` })
	}

	const participantOption: SomeCompanionActionInputField = {
		type: 'dropdown',
		label: 'Position',
		id: 'position',
		default: '0',
		choices: CHOICES_PARTICIPANT,
	}

	const actions: { [id in ActionIdUsers]: CompanionActionDefinition | undefined } = {
		// Select Actions
		[ActionIdUsers.selectionMethod]: {
			name: 'Selection method',
			options: [
				{
					type: 'dropdown',
					label: 'Single/Multi',
					id: 'selectionMethod',
					default: 1,
					choices: [
						{ label: 'Single select', id: selectionMethod.SingleSelection },
						{ label: 'Multi select', id: selectionMethod.MultiSelection },
						{ label: 'Toggle', id: selectionMethod.ToggleSelection },
					],
				},
			],
			callback: (action) => {
				if (action.options.selectionMethod === selectionMethod.ToggleSelection) {
					instance.config.selectionMethod === selectionMethod.SingleSelection
						? (instance.config.selectionMethod = selectionMethod.MultiSelection)
						: (instance.config.selectionMethod = selectionMethod.SingleSelection)
				} else {
					instance.config.selectionMethod = action.options.selectionMethod as number
				}
				instance.saveConfig(instance.config)
				instance.checkFeedbacks(FeedbackId.selectionMethod, FeedbackId.groupBased, FeedbackId.groupBasedAdvanced)
			},
		},
		[ActionIdUsers.selectUser]: {
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
				PreviousSelectedCallersSave(instance)
				switch (action.options.option) {
					case 'toggle':
						instance.ZoomClientDataObj.PreviousSelectedCallers = instance.ZoomClientDataObj.selectedCallers
						toggleSelectedUser(instance, action.options.user as number)
						break
					case 'select':
						if (instance.config.selectionMethod === selectionMethod.SingleSelection) {
							instance.ZoomClientDataObj.selectedCallers.length = 0
						}
						instance.ZoomClientDataObj.selectedCallers = arrayAdd(
							instance.ZoomClientDataObj.selectedCallers,
							action.options.user as number
						)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							action.options.user as number
						)
						break
				}
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced
				)
			},
		},
		[ActionIdUsers.selectUserByName]: {
			name: 'Preselect user by name',
			options: [
				options.name,
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
			callback: async (action): Promise<void> => {
				const selectedName = await instance.parseVariablesInString(action.options.name as string)
				for (const key in instance.ZoomUserData) {
					if (userExist(Number(key), instance.ZoomUserData)) {
						const user = instance.ZoomUserData[key]
						if (user.userName === selectedName) {
							PreviousSelectedCallersSave(instance)
							switch (action.options.option) {
								case 'toggle':
									instance.ZoomClientDataObj.PreviousSelectedCallers = instance.ZoomClientDataObj.selectedCallers
									toggleSelectedUser(instance, user.zoomId)
									break
								case 'select':
									if (instance.config.selectionMethod === selectionMethod.SingleSelection)
										instance.ZoomClientDataObj.selectedCallers.length = 0
									instance.ZoomClientDataObj.selectedCallers = arrayAdd(
										instance.ZoomClientDataObj.selectedCallers,
										user.zoomId
									)
									break
								case 'remove':
									instance.ZoomClientDataObj.selectedCallers = arrayRemove(
										instance.ZoomClientDataObj.selectedCallers,
										user.zoomId
									)
									break
							}
							instance.UpdateVariablesValues()
							instance.checkFeedbacks(
								FeedbackId.userNameBased,
								FeedbackId.userNameBasedAdvanced,
								FeedbackId.indexBased,
								FeedbackId.indexBasedAdvanced,
								FeedbackId.galleryBased,
								FeedbackId.galleryBasedAdvanced,
								FeedbackId.groupBased,
								FeedbackId.groupBasedAdvanced
							)

							break
						}
					}
				}
			},
		},
		[ActionIdUsers.selectFromIndexPosition]: {
			name: 'Preselect user by Participant Position',
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
				PreviousSelectedCallersSave(instance)
				switch (action.options.option) {
					case 'toggle':
						instance.ZoomClientDataObj.PreviousSelectedCallers = instance.ZoomClientDataObj.selectedCallers
						toggleSelectedUser(instance, instance.ZoomVariableLink[(action.options.position as number) - 1].zoomId)
						break
					case 'select':
						if (instance.config.selectionMethod === selectionMethod.SingleSelection)
							instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAdd(
							instance.ZoomClientDataObj.selectedCallers,
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
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced
				)
			},
		},
		[ActionIdUsers.clearParticipants]: {
			name: 'Clear Selections',
			options: [],
			callback: () => {
				PreviousSelectedCallersSave(instance)
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced
				)
			},
		},
		[ActionIdUsers.restorePreviousSelection]: {
			name: 'Restore Previous Selections',
			options: [],
			callback: () => {
				PreviousSelectedCallersRestore(instance)
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced
				)
			},
		},
		[ActionIdUsers.nextParticipants]: {
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
				const numberToShift = action.options.shift as number
				const itemsToShift: { zoomId: number; userName: string }[] = instance.ZoomVariableLink.slice(0, numberToShift)
				instance.ZoomVariableLink.splice(0, numberToShift)
				instance.ZoomVariableLink.push(...itemsToShift)

				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced
				)
			},
		},
		[ActionIdUsers.previousParticipants]: {
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
				const numberToShift = action.options.shift as number
				// Be carefull for below/invallid index
				const itemsToShift: { zoomId: number; userName: string }[] = instance.ZoomVariableLink.slice(-numberToShift)

				instance.ZoomVariableLink.splice(instance.ZoomVariableLink.length - numberToShift, numberToShift)
				instance.ZoomVariableLink.splice(0, 0, ...itemsToShift)

				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced
				)
			},
		},
		[ActionIdUsers.resetParticipants]: {
			name: 'resetParticipants',
			description: 'This will reset the order based on the original meeting',
			options: [],
			callback: () => {
				instance.ZoomVariableLink.length = 0
				for (const key in instance.ZoomUserData) {
					if (userExist(Number(key), instance.ZoomUserData)) {
						const user = instance.ZoomUserData[key]
						instance.ZoomVariableLink.push({ zoomId: user.zoomId, userName: user.userName })
					}
				}

				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced
				)
			},
		},
	}

	return actions
}

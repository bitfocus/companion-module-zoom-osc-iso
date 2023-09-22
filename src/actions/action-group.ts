import { CompanionActionDefinition, SomeCompanionActionInputField } from '@companion-module/base'
import { ZoomConfig } from '../config'
import { InstanceBaseExt, arrayAdd, arrayRemove, options, userExist } from '../utils'
import { FeedbackId } from '../feedback'
import { PreviousSelectedCallersSave, positionOrderOption, selectionMethod, toggleSelectedUser } from './action-utils'
import * as fs from 'fs'
import * as os from 'os'

export enum ActionIdGroups {
	addToGroup = 'add_To_Group',
	clearGroup = 'clear_Group',
	removeFromGroup = 'remove_From_Group',
	renameGroup = 'rename_Group',
	selectGroup = 'select_Group',
	selectUserFromGroupPosition = 'select_User_From_Group_Position',
	loadGroupFromFile = 'loadGroupFromFile',
	saveGroupToFile = 'saveGroupToFile',
}

export function GetActionsGroups(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGroups]: CompanionActionDefinition | undefined
} {
	const CHOICES_GROUPS: { id: string; label: string }[] = []
	const CHOICES_GROUPS_NO_HOST: { id: string; label: string }[] = []
	const CHOICES_GROUPS_DEFAULT = '1'

	instance.ZoomGroupData.forEach((group: { groupName: any }, index: { toString: () => any }) => {
		CHOICES_GROUPS.push({ id: index.toString(), label: group.groupName })
		if (index != 0 && index !== 1) CHOICES_GROUPS_NO_HOST.push({ id: index.toString(), label: group.groupName })
	})

	const groupOption: SomeCompanionActionInputField = {
		type: 'dropdown',
		label: 'Group',
		id: 'group',
		default: CHOICES_GROUPS_DEFAULT,
		choices: CHOICES_GROUPS,
	}

	const groupOptionNoHost: SomeCompanionActionInputField = {
		type: 'dropdown',
		label: 'Group',
		id: 'group',
		default: CHOICES_GROUPS_DEFAULT,
		choices: CHOICES_GROUPS_NO_HOST,
	}

	const actions: { [id in ActionIdGroups]: CompanionActionDefinition | undefined } = {
		[ActionIdGroups.saveGroupToFile]: {
			name: 'Save Group to File',
			options: [
				groupOption,
				{
					type: 'textinput',
					label: 'File to Save (Path and File Name)',
					id: 'filepath',
					useVariables: true,
					default: '',
				},
			],
			callback: async (action): Promise<void> => {
				const filepath = await instance.parseVariablesInString((action.options.filepath as string).trim())
				const group = action.options.group as number
				const users = instance.ZoomGroupData[group].users
				let data = ''
				for (const user of users) {
					if (data !== '') {
						data += os.EOL
					}
					data += user.userName
				}
				fs.writeFileSync(filepath, data)
			},
		},
		[ActionIdGroups.loadGroupFromFile]: {
			name: 'Load Group From File',
			options: [
				groupOptionNoHost,
				{
					type: 'textinput',
					label: 'File to Load (Path and File Name)',
					id: 'filepath',
					useVariables: true,
					default: '',
				},
			],
			callback: async (action): Promise<void> => {
				const filepath = await instance.parseVariablesInString((action.options.filepath as string).trim())
				const group = action.options.group as number
				try {
					fs.readFile(filepath, 'utf8', (err, data) => {
						if (err) {
							instance.log('error', `error reading file: ${JSON.stringify(err)}`)
						} else {
							const selectedNames = data.split(os.EOL)
							// instance.log('debug', `load group from file: selectedNames - ${JSON.stringify(selectedNames)}`)

							let addedUsers = false
							for (const selectedName of selectedNames) {
								for (const key in instance.ZoomUserData) {
									if (userExist(Number(key), instance.ZoomUserData)) {
										const user = instance.ZoomUserData[key]
										if (user.userName === selectedName) {
											if (
												!instance.ZoomGroupData[group].users.find(
													(o: { zoomID: string | number }) => o !== null && o.zoomID === user.zoomId
												)
											) {
												instance.ZoomGroupData[group].users.push({
													zoomID: user.zoomId,
													userName: user.userName,
												})

												addedUsers = true
												// instance.log('debug', `added user: ${user.userName} to group ${group}`)
											}
										}
									}
								}
							}

							if (addedUsers) {
								instance.UpdateVariablesValues()
								instance.checkFeedbacks(FeedbackId.groupBased, FeedbackId.groupBasedAdvanced)
							}
						}
					})
				} catch (error) {
					instance.log('error', 'Error Reading File: ' + error)
				}
			},
		},
		// Group Actions
		[ActionIdGroups.addToGroup]: {
			name: 'Add selection to group',
			options: [
				groupOptionNoHost,
				{
					type: 'dropdown',
					label: 'Add or set',
					id: 'groupOption',
					default: 'add',
					choices: [
						{ label: 'Add', id: 'add' },
						{ label: 'Replace', id: 'replace' },
					],
				},
			],
			callback: (action) => {
				if (action.options.groupOption === 'replace') {
					instance.ZoomGroupData[action.options.group as number].users.length = 0
				}

				instance.ZoomClientDataObj.selectedCallers.forEach((zoomID: string | number) => {
					if (userExist(Number(zoomID), instance.ZoomUserData)) {
						if (
							!instance.ZoomGroupData[action.options.group as number].users.find(
								(o: { zoomID: string | number }) => o.zoomID === zoomID
							)
						) {
							instance.ZoomGroupData[action.options.group as number].users.push({
								zoomID: zoomID as number,
								userName: instance.ZoomUserData[zoomID as number].userName,
							})
						}
					}
				})

				PreviousSelectedCallersSave(instance)
				// instance.ZoomClientDataObj.selectedCallers.length = 0
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
		[ActionIdGroups.clearGroup]: {
			name: 'Clear group selection',
			options: [groupOptionNoHost],
			callback: (action) => {
				instance.ZoomGroupData[action.options.group as number].users.length = 0
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(FeedbackId.groupBased, FeedbackId.groupBasedAdvanced)
			},
		},
		[ActionIdGroups.removeFromGroup]: {
			name: 'Remove from group',
			options: [options.userName, groupOptionNoHost],
			callback: async (action) => {
				const group = action.options.group as number
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				if (instance.ZoomGroupData[group] !== undefined) {
					// When someone overides the selection by entering a name
					if (userName !== undefined && userName !== '') {
						if (userName.toLowerCase() === 'me' || userName.toLowerCase() === 'all')
							instance.log('warn', 'dont use the me/all etc on the remove from group')
						// Get variable if needed
						for (const key in instance.ZoomUserData) {
							if (userExist(Number(key), instance.ZoomUserData)) {
								const user = instance.ZoomUserData[key]
								if (user.userName === userName) {
									if (instance.ZoomGroupData[group] !== undefined) {
										for (let i = 0; i < instance.ZoomGroupData[group].users.length; i++) {
											if (instance.ZoomGroupData[group].users[i].zoomID === user.zoomId) {
												instance.ZoomGroupData[group].users.splice(i, 1)
												break
											}
										}
									}

									break
								}
							}
						}
					} else {
						// Use pre selection
						instance.ZoomClientDataObj.selectedCallers.forEach((ZoomID) => {
							for (let i = 0; i < instance.ZoomGroupData[group].users.length; i++) {
								if (instance.ZoomGroupData[group].users[i].zoomID === ZoomID) {
									instance.ZoomGroupData[group].users.splice(i, 1)
									// instance.log('debug', 'found and removed from group')
									break
								}
							}
						})
					}

					PreviousSelectedCallersSave(instance)
					// instance.ZoomClientDataObj.selectedCallers.length = 0
					instance.UpdateVariablesValues()
					instance.checkFeedbacks(FeedbackId.groupBased, FeedbackId.groupBasedAdvanced)
				} else {
					instance.log('warn', 'No correct group selected')
				}
			},
		},
		[ActionIdGroups.renameGroup]: {
			name: 'Rename Group',
			options: [groupOption, options.name],
			callback: async (action) => {
				const newName = await instance.parseVariablesInString(action.options.name as string)
				instance.ZoomGroupData[action.options.group as number].groupName = newName
				instance.UpdateVariablesValues()
			},
		},
		[ActionIdGroups.selectGroup]: {
			name: 'Preselect group',
			options: [groupOption],
			callback: (action) => {
				PreviousSelectedCallersSave(instance)
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.ZoomGroupData[action.options.group as number].users?.forEach((user: { zoomID: any }) => {
					instance.ZoomClientDataObj.selectedCallers.push(user.zoomID)
				})
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
		[ActionIdGroups.selectUserFromGroupPosition]: {
			name: 'Preselect user by group Position',
			options: [
				groupOption,
				positionOrderOption,
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
				const position = (action.options.position as number) - 1
				PreviousSelectedCallersSave(instance)
				switch (action.options.option) {
					case 'toggle':
						instance.ZoomClientDataObj.PreviousSelectedCallers = instance.ZoomClientDataObj.selectedCallers
						toggleSelectedUser(instance, instance.ZoomGroupData[action.options.group as number].users[position].zoomID)
						break
					case 'select':
						if (instance.config.selectionMethod === selectionMethod.SingleSelection)
							instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAdd(
							instance.ZoomClientDataObj.selectedCallers,
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

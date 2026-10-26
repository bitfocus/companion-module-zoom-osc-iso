import type { VariableValues } from '../variables/variable-definitions.js'
import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions, CompanionInputFieldDropdown } from '@companion-module/base'
import { options, userExist } from '../utils.js'
import { FeedbackId } from '../feedback.js'
import { PreviousSelectedCallersSave, positionOrderOption, selectUser } from './action-utils.js'
import * as fs from 'fs'
import * as os from 'os'
import { updateGroupVariables, updateSelectedCallersVariables } from '../variables/variable-values.js'

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

export type ActionsSchemaGroups = {
	[ActionIdGroups.saveGroupToFile]: { options: { group: string; filepath: string } }
	[ActionIdGroups.loadGroupFromFile]: { options: { group: string; filepath: string } }
	[ActionIdGroups.addToGroup]: { options: { group: string; groupOption: string } }
	[ActionIdGroups.clearGroup]: { options: { group: string } }
	[ActionIdGroups.removeFromGroup]: { options: { userName: string; group: string } }
	[ActionIdGroups.renameGroup]: { options: { group: string; name: string } }
	[ActionIdGroups.selectGroup]: { options: { group: string } }
	[ActionIdGroups.selectUserFromGroupPosition]: { options: { group: string; position: string; option: string } }
}

export function GetActionsGroups(instance: ModuleInstance): CompanionActionDefinitions<ActionsSchemaGroups> {
	const CHOICES_GROUPS: { id: string; label: string }[] = []
	const CHOICES_GROUPS_NO_HOST: { id: string; label: string }[] = []
	const CHOICES_GROUPS_DEFAULT = '1'
	const CHOICES_GROUPS_NO_HOST_DEFAULT = '2'

	instance.ZoomGroupData.forEach((group: { groupName: any }, index: { toString: () => any }) => {
		CHOICES_GROUPS.push({ id: index.toString(), label: group.groupName })
		if (index != 0 && index !== 1) CHOICES_GROUPS_NO_HOST.push({ id: index.toString(), label: group.groupName })
	})

	const groupOption: CompanionInputFieldDropdown<'group', string> = {
		type: 'dropdown',
		label: 'Group',
		id: 'group',
		default: CHOICES_GROUPS_DEFAULT,
		choices: CHOICES_GROUPS,
	}

	const groupOptionNoHost: CompanionInputFieldDropdown<'group', string> = {
		type: 'dropdown',
		label: 'Group',
		id: 'group',
		default: CHOICES_GROUPS_NO_HOST_DEFAULT,
		choices: CHOICES_GROUPS_NO_HOST,
	}

	const actions: CompanionActionDefinitions<ActionsSchemaGroups> = {
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
			callback: (action): void => {
				const filepath = action.options.filepath.trim()
				const group = Number(action.options.group) // dropdown ids are strings; ZoomGroupData is indexed by number
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
			callback: (action): void => {
				const filepath = action.options.filepath.trim()
				const group = Number(action.options.group) // dropdown ids are strings; ZoomGroupData is indexed by number
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
													(o: { zoomID: string | number }) => o !== null && o.zoomID === user.zoomId,
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
								const variables: VariableValues = {}
								updateGroupVariables(instance, variables, group)
								instance.setVariableValues(variables)
								// instance.UpdateVariablesValues()
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
				const group = Number(action.options.group) // dropdown ids are strings; ZoomGroupData is indexed by number
				if (action.options.groupOption === 'replace') {
					instance.ZoomGroupData[group].users.length = 0
				}

				instance.ZoomClientDataObj.selectedCallers.forEach((zoomID: number) => {
					if (userExist(Number(zoomID), instance.ZoomUserData)) {
						if (!instance.ZoomGroupData[group].users.some((o: { zoomID: number }) => o.zoomID === zoomID)) {
							instance.ZoomGroupData[group].users.push({
								zoomID: zoomID,
								userName: instance.ZoomUserData[zoomID].userName,
							})
						}
					}
				})

				PreviousSelectedCallersSave(instance)
				const variables: VariableValues = {}
				updateGroupVariables(instance, variables, group)
				instance.setVariableValues(variables)
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced,
				)
			},
		},
		[ActionIdGroups.clearGroup]: {
			name: 'Clear group selection',
			options: [groupOptionNoHost],
			callback: (action) => {
				instance.ZoomGroupData[Number(action.options.group)].users.length = 0
				const variables: VariableValues = {}
				updateGroupVariables(instance, variables, Number(action.options.group))
				instance.setVariableValues(variables)
				// instance.UpdateVariablesValues()
				instance.checkFeedbacks(FeedbackId.groupBased, FeedbackId.groupBasedAdvanced)
			},
		},
		[ActionIdGroups.removeFromGroup]: {
			name: 'Remove from group',
			options: [options.userName, groupOptionNoHost],
			callback: (action) => {
				const group = Number(action.options.group) // dropdown ids are strings; ZoomGroupData is indexed by number
				const userName = action.options.userName
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
					const variables: VariableValues = {}
					updateGroupVariables(instance, variables, group)
					instance.setVariableValues(variables)
					instance.checkFeedbacks(FeedbackId.groupBased, FeedbackId.groupBasedAdvanced)
				} else {
					instance.log('warn', 'No correct group selected')
				}
			},
		},
		[ActionIdGroups.renameGroup]: {
			name: 'Rename Group',
			options: [groupOption, options.name],
			callback: (action) => {
				const newName = action.options.name
				instance.ZoomGroupData[Number(action.options.group)].groupName = newName

				const variables: VariableValues = {}
				variables[`Group${Number(action.options.group)}`] = newName
				instance.setVariableValues(variables)
			},
		},
		[ActionIdGroups.selectGroup]: {
			name: 'Preselect group',
			options: [groupOption],
			callback: (action) => {
				PreviousSelectedCallersSave(instance)
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.ZoomGroupData[Number(action.options.group)].users?.forEach((user: { zoomID: any }) => {
					instance.ZoomClientDataObj.selectedCallers.push(user.zoomID)
				})
				// instance.UpdateVariablesValues()
				const variables: VariableValues = {}
				updateSelectedCallersVariables(instance, variables)
				instance.setVariableValues(variables)
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced,
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
				const zoomId =
					instance.ZoomGroupData[Number(action.options.group)]?.users[Number(action.options.position) - 1]?.zoomID
				// nobody in that group position
				if (zoomId === undefined) return

				selectUser(instance, zoomId, action.options.option)

				// instance.UpdateVariablesValues()
				const variables: VariableValues = {}
				updateSelectedCallersVariables(instance, variables)
				instance.setVariableValues(variables)
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced,
				)
			},
		},
	}

	return actions
}

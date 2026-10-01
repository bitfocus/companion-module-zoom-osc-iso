import type ModuleInstance from '../index.js'
import type {
	CompanionActionDefinitions,
	CompanionInputFieldDropdown,
	CompanionVariableValues,
} from '@companion-module/base'
import { type ZoomGroupDataInterface, getUserFromName, options, userExist } from '../utils.js'
import { sendActionCommand, createCommand, select, selectUser } from './action-utils.js'
import { FeedbackId } from '../feedback.js'
import {
	updateAllGroupVariables,
	updateGalleryVariables,
	updateSelectedCallersVariables,
	updateZoomParticipantVariables,
	updateZoomUserVariables,
} from '../variables/variable-values.js'
import * as csv from '@fast-csv/parse'

// Helper function to update local data after renaming a user
function updateLocalUserData(instance: ModuleInstance, name: string, newName: string): void {
	const user = getUserFromName(name, instance.ZoomVariableLink)
	if (user !== undefined) {
		const oscPath = `/zoom/userName/rename`
		const sendToCommand: any = {
			id: 'rename',
			options: {
				command: oscPath,
				args: [
					{ type: 's', value: name },
					{ type: 's', value: newName },
				],
			},
		}
		sendActionCommand(instance, sendToCommand)

		instance.ZoomUserData[user.zoomId].userName = newName

		// Update position and group
		const index = instance.ZoomVariableLink.findIndex((finduser: { zoomId: number }) => finduser.zoomId === user.zoomId)
		if (index !== -1) instance.ZoomVariableLink[index].userName = newName
		instance.ZoomGroupData.forEach((group: ZoomGroupDataInterface) => {
			group.users.forEach((user) => {
				if (user.zoomID === user.zoomID) {
					user.userName = newName
					return
				}
			})
		})
	}
}

export enum ActionIdUserRolesAndAction {
	makeHost = 'makeHost',
	makeCoHost = 'makeCoHost',
	reclaimHost = 'reclaimHost',
	revokeCoHost = 'revokeCoHost',
	makePanelist = 'makePanelist',
	makeAttendee = 'makeAttendee',
	ejectParticipant = 'ejectParticipant',
	rename = 'rename',
	renameByName = 'renameByName',
	allowToRecord = 'allowToRecord',
	disallowToRecord = 'disallowToRecord',
	selectUser = 'select_User',
	bulkRename = 'bulk_Rename',
}

export type ActionsSchemaUserRolesAndAction = {
	[ActionIdUserRolesAndAction.selectUser]: { options: { user: string; option: string } }
	[ActionIdUserRolesAndAction.rename]: { options: { user: string; name: string } }
	[ActionIdUserRolesAndAction.renameByName]: { options: { name: string; newName: string } }
	[ActionIdUserRolesAndAction.bulkRename]: { options: { filepath: string; hasHeader: boolean } }
	[ActionIdUserRolesAndAction.makeHost]: { options: { userName: string } }
	[ActionIdUserRolesAndAction.makeCoHost]: { options: { userName: string } }
	[ActionIdUserRolesAndAction.revokeCoHost]: { options: { userName: string } }
	[ActionIdUserRolesAndAction.reclaimHost]: { options: Record<string, never> }
	[ActionIdUserRolesAndAction.makePanelist]: { options: { userName: string } }
	[ActionIdUserRolesAndAction.makeAttendee]: { options: { userName: string } }
	[ActionIdUserRolesAndAction.ejectParticipant]: { options: { userName: string } }
	[ActionIdUserRolesAndAction.allowToRecord]: { options: { userName: string } }
	[ActionIdUserRolesAndAction.disallowToRecord]: { options: { userName: string } }
}

export function GetActionsUserRolesAndAction(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaUserRolesAndAction> {
	let CHOICES_USERS_DEFAULT = '0'
	const CHOICES_USERS: {
		id: string
		label: string
	}[] = [{ id: '0', label: 'no users' }]

	if (instance.ZoomUserData) {
		CHOICES_USERS.length = 0
		for (const key in instance.ZoomUserData) {
			if (userExist(Number(key), instance.ZoomUserData)) {
				const user = instance.ZoomUserData[key]
				CHOICES_USERS.push({ id: user.zoomId.toString(), label: user.userName })
				CHOICES_USERS_DEFAULT = user.zoomId.toString()
			}
		}
	}

	const userOption: CompanionInputFieldDropdown<'user', string> = {
		type: 'dropdown',
		label: 'User',
		id: 'user',
		default: CHOICES_USERS_DEFAULT,
		choices: CHOICES_USERS,
	}

	const actions: CompanionActionDefinitions<ActionsSchemaUserRolesAndAction> = {
		[ActionIdUserRolesAndAction.selectUser]: {
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
				// v1 passed the dropdown's string id through unchanged (the `as number` cast did not convert it);
				// kept as-is so selection behaviour does not change in this migration.
				const zoomId = action.options.user as unknown as number

				selectUser(instance, zoomId, action.options.option)

				const variables: CompanionVariableValues = {}
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
		// Rename Actions
		[ActionIdUserRolesAndAction.rename]: {
			name: 'Rename (PRO)',
			options: [userOption, options.name],
			callback: (action) => {
				const newName = action.options.name
				// v1 passed the dropdown's string id through unchanged (the `as number` cast did not convert it);
				// kept as-is so the OSC argument and local updates do not change in this migration.
				const ZoomID = action.options.user as unknown as number
				const oscPath = `/zoom/zoomID/rename`
				const sendToCommand: any = {
					id: 'rename',
					options: {
						command: oscPath,
						args: [
							{ type: 'i', value: ZoomID },
							{ type: 's', value: newName },
						],
					},
				}
				sendActionCommand(instance, sendToCommand)
				// Also update locally
				if (userExist(ZoomID, instance.ZoomUserData)) {
					instance.ZoomUserData[ZoomID].userName = newName
				}

				// Update position and group
				const index = instance.ZoomVariableLink.findIndex((finduser: { zoomId: number }) => finduser.zoomId === ZoomID)
				if (index !== -1) instance.ZoomVariableLink[index].userName = newName
				instance.ZoomGroupData.forEach((group: ZoomGroupDataInterface) => {
					group.users.forEach((user) => {
						if (user.zoomID === ZoomID) {
							user.userName = newName
							return
						}
					})
				})

				const variables: CompanionVariableValues = {}
				updateAllGroupVariables(instance, variables)
				updateZoomParticipantVariables(instance, variables)
				updateSelectedCallersVariables(instance, variables)
				updateGalleryVariables(instance, variables)
				updateZoomUserVariables(instance, variables)
				instance.setVariableValues(variables)
				// instance.UpdateVariablesValues()
			},
		},
		[ActionIdUserRolesAndAction.renameByName]: {
			name: 'Rename By Name(PRO)',
			options: [options.name, options.newName],
			callback: (action) => {
				const name = action.options.name
				const newName = action.options.newName
				updateLocalUserData(instance, name, newName)
			},
		},
		[ActionIdUserRolesAndAction.bulkRename]: {
			name: 'Bulk Rename from CSV (PRO)',
			options: [
				{
					type: 'textinput',
					label: 'File to Load (Path and File Name)',
					id: 'filepath',
					useVariables: true,
					default: '',
				},
				{
					type: 'checkbox',
					label: 'Has Header Row',
					id: 'hasHeader',
					default: false,
				},
			],
			callback: (action): void => {
				const filepath = action.options.filepath.trim()
				const hasHeader = action.options.hasHeader
				try {
					let rowIndex = 0
					csv
						.parseFile(filepath, {
							headers: false,
							trim: true,
							ignoreEmpty: true,
						})
						.on('error', (error: any) => instance.log('error', error))
						.on('data', (row: any) => {
							if (hasHeader && rowIndex++ === 0) return

							const currentName = row[0]
							const newName = row[1]
							if (!currentName || !newName) {
								instance.log(
									'error',
									`[WARN] Skipping row ${rowIndex}: need at least two columns. ${currentName}, ${newName}`,
								)
								return
							}

							updateLocalUserData(instance, currentName, newName)
						})
						.on('end', (rowCount: number) => {
							if (rowCount > 0) {
								const variables: CompanionVariableValues = {}
								updateAllGroupVariables(instance, variables)
								updateZoomParticipantVariables(instance, variables)
								updateSelectedCallersVariables(instance, variables)
								updateGalleryVariables(instance, variables)
								updateZoomUserVariables(instance, variables)
								instance.setVariableValues(variables)
							}
						})
				} catch (error) {
					instance.log('error', 'Error Reading File: ' + error)
				}
			},
		},
		[ActionIdUserRolesAndAction.makeHost]: {
			name: 'Make Host',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/makeHost', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserRolesAndAction.makeHost,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserRolesAndAction.makeCoHost]: {
			name: 'Make CoHost',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/makeCoHost', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserRolesAndAction.makeCoHost,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserRolesAndAction.revokeCoHost]: {
			name: 'Revoke CoHost',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				if (userName === undefined || userName === '') {
					const selectedCallers: number[] | string = instance.ZoomClientDataObj.selectedCallers

					selectedCallers.forEach((zoomID) => {
						const command = createCommand(instance, '/zoomID/revokeCoHost')
						if (command.isValidCommand) {
							const sendToCommand = {
								id: ActionIdUserRolesAndAction.revokeCoHost,
								options: {
									command: command.oscPath,
									args: [{ type: 'i', value: zoomID }],
								},
							}
							sendActionCommand(instance, sendToCommand)
						}
					})
				} else {
					const command = createCommand(instance, '/revokeCoHost', userName, select.single)
					if (command.isValidCommand) {
						const sendToCommand = {
							id: ActionIdUserRolesAndAction.revokeCoHost,
							options: {
								command: command.oscPath,
								args: command.args,
							},
						}
						sendActionCommand(instance, sendToCommand)
					}
				}
			},
		},
		[ActionIdUserRolesAndAction.reclaimHost]: {
			name: 'Reclaim Host',
			options: [],
			callback: () => {
				// type: 'Global'
				const command = createCommand(instance, '/reclaimHost')
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserRolesAndAction.reclaimHost,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserRolesAndAction.makePanelist]: {
			name: 'Make Panelist',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/makePanelist', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserRolesAndAction.makePanelist,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserRolesAndAction.makeAttendee]: {
			name: 'Make Attendee',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/makeAttendee', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserRolesAndAction.makeAttendee,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserRolesAndAction.ejectParticipant]: {
			name: 'Eject Participant',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/eject', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserRolesAndAction.ejectParticipant,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserRolesAndAction.allowToRecord]: {
			name: 'Allow To Record (PRO)',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/allowToRecord', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserRolesAndAction.allowToRecord,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserRolesAndAction.disallowToRecord]: {
			name: 'Disallow To Record (PRO)',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/disallowToRecord', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserRolesAndAction.disallowToRecord,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
	}

	return actions
}

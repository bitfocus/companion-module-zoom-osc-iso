import { ActionIdUserRolesAndAction } from '../actions/action-user-roles-action.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetExt } from './preset-utils.js'
import { ActionIdUserWebinar } from '../actions/action-user-webinars.js'
import { ActionIdUserWaitingRoom } from '../actions/action-user-waiting-room.js'
import { ActionIdGlobal } from '../actions/action-global.js'
import { ActionIdGlobalWaitingRoomsAndZak } from '../actions/action-global-waitingrooms-and-zak.js'

export enum PresetIdRoleManagement {
	makeHost = 'Make_Host',
	makeCoHost = 'Make_CoHost',
	revokeCoHost = 'Revoke_CoHost',
	reclaimHost = 'Reclaim_Host',
	makePanelist = 'Make_Panelist',
	makeAttendee = 'Make_Attendee',
	ejectParticipant = 'Eject_Participant',
	ejectAll = 'Eject_All',
	admitParticipant = 'Admit_Participant',
	admitAllParticipant = 'Admit_All_Participant',
	sendToWaitingRoom = 'Send_to_Waiting_Room',
	enableWaitingRoom = 'Enable_Waiting_Room',
	disableWaitingRoom = 'Disable_Waiting_Room',
	allowToSpeak = 'Allow_To_Speak',
	disallowToSpeak = 'Disallow_To_Speak',
	enableUsersUnmute = 'Enable_Users_Unmute',
	disableUsersUnmute = 'Disable_Users_Unmute',
}

export function GetPresetsRoleManagement(): { [id in PresetIdRoleManagement]: CompanionPresetExt | undefined } {
	const presets: { [id in PresetIdRoleManagement]: CompanionPresetExt | undefined } = {
		/**
		 * Role & Management Actions
		 */
		[PresetIdRoleManagement.makeHost]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Make_Host`,
			style: {
				text: `Make Host`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserRolesAndAction.makeHost,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.makeCoHost]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Make_CoHost`,
			style: {
				text: `Make Co Host`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserRolesAndAction.makeCoHost,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.revokeCoHost]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Revoke_CoHost`,
			style: {
				text: `Revoke CoHost`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserRolesAndAction.revokeCoHost,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.reclaimHost]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Reclaim_Host`,
			style: {
				text: `Reclaim Host`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserRolesAndAction.reclaimHost,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.makePanelist]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Make_Panelist`,
			style: {
				text: `Make Panelist`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserRolesAndAction.makePanelist,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.makeAttendee]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Make_Attendee`,
			style: {
				text: `Make Attendee`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserRolesAndAction.makeAttendee,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.ejectParticipant]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Eject_Participant`,
			style: {
				text: `Eject Participant`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserRolesAndAction.ejectParticipant,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.ejectAll]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Eject_All`,
			style: {
				text: `Eject All`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobal.ejectAll,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.admitParticipant]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Admit_Participant`,
			style: {
				text: `Admit Participant`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserWaitingRoom.admitSomeoneFromWaitingRoom,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.admitAllParticipant]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Admit_All_Participant`,
			style: {
				text: `Admit All`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobalWaitingRoomsAndZak.admitEveryoneFromWaitingRoom,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.sendToWaitingRoom]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Send_to_Waiting_Room`,
			style: {
				text: `Send to Waiting Room`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserWaitingRoom.sendSomeoneToWaitingRoom,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.enableWaitingRoom]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Enable_Waiting_Room`,
			style: {
				text: `Enable Waiting Room`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobalWaitingRoomsAndZak.enableWaitingRoom,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.disableWaitingRoom]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Disable_Waiting_Room`,
			style: {
				text: `Disable Waiting Room`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobalWaitingRoomsAndZak.disableWaitingRoom,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.allowToSpeak]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Allow_To_speak`,
			style: {
				text: `Allow to Speak`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserWebinar.allowWebinarAttendeeToSpeak,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.disallowToSpeak]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Disallow_To_speak`,
			style: {
				text: `Disallow to Speak`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserWebinar.disallowToSpeak,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.enableUsersUnmute]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Enable_Users_Unmute`,
			style: {
				text: `Enable Users Unmute`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobal.enableUsersToUnmute,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.disableUsersUnmute]: {
			type: 'button',
			category: 'Role & Management Actions',
			name: `Disable_Users_Unmute`,
			style: {
				text: `Disable Users Unmute`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobal.disableUsersToUnmute,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	}
	return presets
}

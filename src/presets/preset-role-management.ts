import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { ActionIdUserRolesAndAction } from '../actions/action-user-roles-action.js'
import { colorBlack, colorLightGray } from '../utils.js'
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

export function GetPresetsRoleManagement(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdRoleManagement]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		/**
		 * Role & Management Actions
		 */
		[PresetIdRoleManagement.makeHost]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.makeCoHost]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.revokeCoHost]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.reclaimHost]: {
			type: 'simple',
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
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.makeAttendee]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.ejectParticipant]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.ejectAll]: {
			type: 'simple',
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
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.admitAllParticipant]: {
			type: 'simple',
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
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.enableWaitingRoom]: {
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.disallowToSpeak]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdRoleManagement.enableUsersUnmute]: {
			type: 'simple',
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
			type: 'simple',
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
	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'role_management',
		name: 'Role & Management Actions',
		definitions: Object.values(PresetIdRoleManagement),
	}

	return { section, presets }
}

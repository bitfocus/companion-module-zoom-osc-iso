import { ActionIdUserRolesAndAction } from '../actions/action-user-roles-action.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetDefinitionsExt } from './preset-utils.js'
import { ActionIdUserWebinar } from '../actions/action-user-webinars.js'
import { ActionIdUserWaitingRoom } from '../actions/action-user-waiting-room.js'
import { ActionIdGlobal } from '../actions/action-global.js'
import { ActionIdGlobalWaitingRoomsAndZak } from '../actions/action-global-waitingrooms-and-zak.js'

export function GetPresetsRoleManagement(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Role & Management Actions
	 */
	presets[`Make_Host`] = {
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
	}

	presets[`Make_CoHost`] = {
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
	}

	presets[`Revoke_CoHost`] = {
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
	}

	presets[`Reclaim_Host`] = {
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
	}

	presets[`Make_Panelist`] = {
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
	}

	presets[`Make_Attendee`] = {
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
	}

	presets[`Eject_Participant`] = {
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
	}

	presets[`Eject_All`] = {
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
	}

	presets[`Admit_Participant`] = {
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
	}

	presets[`Admit_All_Participant`] = {
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
	}

	presets[`Send_to_Waiting_Room`] = {
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
	}

	presets[`Enable_Waiting_Room`] = {
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
	}

	presets[`Disable_Waiting_Room`] = {
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
	}

	presets[`Allow_To_Speak`] = {
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
	}

	presets[`Disallow_To_Speak`] = {
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
	}

	presets[`Enable_Users_Unmute`] = {
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
	}

	presets[`Disable_Users_Unmute`] = {
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
	}

	return presets
}

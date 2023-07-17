import { ActionId } from '../actions'
import { colorBlack, colorLightGray } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'

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
						actionId: ActionId.makeHost,
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
						actionId: ActionId.makeCoHost,
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
						actionId: ActionId.revokeCoHost,
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
						actionId: ActionId.reclaimHost,
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
						actionId: ActionId.makePanelist,
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
						actionId: ActionId.makeAttendee,
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
						actionId: ActionId.ejectParticipant,
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
						actionId: ActionId.ejectAll,
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
						actionId: ActionId.admitSomeoneFromWaitingRoom,
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
						actionId: ActionId.admitEveryoneFromWaitingRoom,
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
						actionId: ActionId.sendSomeoneToWaitingRoom,
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
						actionId: ActionId.enableWaitingRoom,
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
						actionId: ActionId.disableWaitingRoom,
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
						actionId: ActionId.allowWebinarAttendeeToSpeak,
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
						actionId: ActionId.disallowToSpeak,
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
						actionId: ActionId.enableUsersToUnmute,
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
						actionId: ActionId.disableUsersToUnmute,
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

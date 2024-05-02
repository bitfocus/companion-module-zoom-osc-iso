import { FeedbackId, feedbackType } from '../feedback.js'
import { CompanionPresetDefinitionsExt, alignmentTopLeft } from './preset-utils.js'
import { colorBlack, colorDarkGray, colorLightGray, colorWhite } from '../utils.js'
import { ActionIdUsers } from '../actions/action-user.js'

export function GetPresetsManageSelections(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Manage Selections & Groups
	 */
	presets[`Restore_Previous_Selection`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Restore Previous Selection`,
		style: {
			text: `Restore Previous Selection`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [{ actionId: ActionIdUsers.restorePreviousSelection, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	//clear selection
	presets[`Clear_Participants`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Clear Selections`,
		style: {
			text: `Clear Selections ($(zoomosc:selectedNumberOfCallers))`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [{ actionId: ActionIdUsers.clearParticipants, options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	// Selection method
	presets[`Toggle_Selection_Method`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Selection Method`,
		style: {
			text: `Toggle Selection Method`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [{ down: [{ actionId: ActionIdUsers.selectionMethod, options: { selectionMethod: 2 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: FeedbackId.selectionMethod,
				options: {
					selectionMethod: 1,
				},
				style: {
					text: 'Single selection',
				},
			},
			{
				feedbackId: FeedbackId.selectionMethod,
				options: {
					selectionMethod: 0,
				},
				style: {
					text: 'Multiple selection',
				},
			},
		],
	}
	// Single selection
	presets[`Single_selection`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Single selection`,
		style: {
			text: `Single selection`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [{ down: [{ actionId: ActionIdUsers.selectionMethod, options: { selectionMethod: 1 } }], up: [] }],
		feedbacks: [],
	}
	// Select by name
	presets[`Select_by_name`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Select by name`,
		style: {
			text: `Select by name`,
			size: '7',
			color: colorWhite,
			bgcolor: colorBlack,
			alignment: alignmentTopLeft,
		},
		steps: [{ down: [{ actionId: ActionIdUsers.selectUserByName, options: { option: 'toggle' } }], up: [] }],
		feedbacks: [
			{
				feedbackId: FeedbackId.userNameBased,
				options: {
					name: '',
					type: feedbackType.selected,
				},
				style: {
					color: colorBlack,
					bgcolor: colorDarkGray,
				},
			},
			{
				feedbackId: FeedbackId.userNameBasedAdvanced,
				options: {
					name: '',
				},
				style: {
					color: colorBlack,
					bgcolor: colorLightGray,
				},
			},
		],
	}

	// Multiple selection
	presets[`Multiple_selection`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Multiple selection`,
		style: {
			text: `Multiple selection`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUsers.selectionMethod,
						options: {
							selectionMethod: 0,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	// Next participants
	presets[`Next_participants`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Next participants`,
		style: {
			text: `Next participants`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUsers.nextParticipants,
						options: {
							shift: 30,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	// Previous participants
	presets[`Previous _participants`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Previous participants`,
		style: {
			text: `Previous participants`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUsers.previousParticipants,
						options: {
							shift: 30,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`save_participants`] = {
		type: 'button',
		category: 'Manage Selections of Participants',
		name: `Save Participant List`,
		style: {
			text: `Save Participants`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUsers.saveParticipants,
						options: {
							filepath: '',
							includeVideoState: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	return presets
}

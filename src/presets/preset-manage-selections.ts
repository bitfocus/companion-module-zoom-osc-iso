import { ActionId } from '../actions'
import { FeedbackId, feedbackType } from '../feedback'
import { CompanionPresetDefinitionsExt, alignmentTopLeft } from './preset-utils'
import { colorBlack, colorDarkGray, colorLightGray, colorWhite } from '../utils'

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
				down: [{ actionId: ActionId.restorePreviousSelection, options: {} }],
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
				down: [{ actionId: ActionId.clearParticipants, options: {} }],
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
		steps: [{ down: [{ actionId: ActionId.selectionMethod, options: { selectionMethod: 2 } }], up: [] }],
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
		steps: [{ down: [{ actionId: ActionId.selectionMethod, options: { selectionMethod: 1 } }], up: [] }],
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
		steps: [{ down: [{ actionId: ActionId.selectUserByName, options: { option: 'toggle' } }], up: [] }],
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
						actionId: ActionId.selectionMethod,
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
						actionId: ActionId.nextParticipants,
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
						actionId: ActionId.previousParticipants,
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
	return presets
}

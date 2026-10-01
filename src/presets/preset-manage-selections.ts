import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { FeedbackId, feedbackType } from '../feedback.js'
import { alignmentTopLeft } from './preset-utils.js'
import { colorBlack, colorDarkGray, colorLightGray, colorWhite } from '../utils.js'
import { ActionIdUsers } from '../actions/action-user.js'

export enum PresetIdManageSelections {
	restorePreviousSelection = 'Restore_Previous_Selection',
	clearParticipants = 'Clear_Participants',
	toggleSelectionMethod = 'Toggle_Selection_Method',
	singleSelection = 'Single_selection',
	selectByName = 'Select_by_name',
	multipleSelection = 'Multiple_selection',
	nextParticipants = 'Next_participants',
	previousParticipants = 'Previous _participants',
	saveParticipants = 'save_participants',
}

export function GetPresetsManageSelections(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdManageSelections]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		/**
		 * Manage Selections & Groups
		 */
		[PresetIdManageSelections.restorePreviousSelection]: {
			type: 'simple',
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
		},
		//clear selection
		[PresetIdManageSelections.clearParticipants]: {
			type: 'simple',
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
		},
		// Selection method
		[PresetIdManageSelections.toggleSelectionMethod]: {
			type: 'simple',
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
		},
		// Single selection
		[PresetIdManageSelections.singleSelection]: {
			type: 'simple',
			name: `Single selection`,
			style: {
				text: `Single selection`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [{ down: [{ actionId: ActionIdUsers.selectionMethod, options: { selectionMethod: 1 } }], up: [] }],
			feedbacks: [],
		},
		// Select by name
		[PresetIdManageSelections.selectByName]: {
			type: 'simple',
			name: `Select by name`,
			style: {
				text: `Select by name`,
				size: '7',
				color: colorWhite,
				bgcolor: colorBlack,
				alignment: alignmentTopLeft,
			},
			steps: [
				{ down: [{ actionId: ActionIdUsers.selectUserByName, options: { option: 'toggle', name: '' } }], up: [] },
			],
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
					// advanced feedback: v2 presets cannot carry a style for it (v1 ignored it)
					feedbackId: FeedbackId.userNameBasedAdvanced,
					options: {
						name: '',
					},
				},
			],
		},
		// Multiple selection
		[PresetIdManageSelections.multipleSelection]: {
			type: 'simple',
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
		},
		// Next participants
		[PresetIdManageSelections.nextParticipants]: {
			type: 'simple',
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
		},
		// Previous participants
		[PresetIdManageSelections.previousParticipants]: {
			type: 'simple',
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
		},
		[PresetIdManageSelections.saveParticipants]: {
			type: 'simple',
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
		},
	}

	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'manage_selections',
		name: 'Manage Selections of Participants',
		definitions: [
			{
				id: 'manage_selections_buttons',
				type: 'simple',
				name: 'Manage Selections of Participants',
				presets: Object.values(PresetIdManageSelections),
			},
		],
	}

	return { section, presets }
}

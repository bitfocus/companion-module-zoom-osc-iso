import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { FeedbackId } from '../feedback.js'
import { buildParticipantLayeredPreset } from './preset-utils.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { presetImages } from '../images-presets.js'
import { ActionIdUsers } from '../actions/action-user.js'

export enum PresetIdManageSelections {
	restorePreviousSelection = 'Restore_Previous_Selection',
	clearParticipants = 'Clear_Participants',
	toggleSelectionMethod = 'Toggle_Selection_Method',
	singleSelection = 'Single_selection',
	selectByName = 'Select_by_name',
	activeSpeaker = 'Active_Speaker',
	multipleSelection = 'Multiple_selection',
	nextParticipants = 'Next_participants',
	previousParticipants = 'Previous _participants',
	saveParticipants = 'save_participants',
}

/** The Select by name button stores the participant name in this local variable */
const localName = '$(local:name)'
/** The name of whoever is currently speaking, kept up to date by the module */
const activeSpeakerName = '$(zoomosc:activeSpeaker)'

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
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.restorePreviousSelections,
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
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.clearSelections,
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
			name: `Toggle Selection Method`,
			// shows the icon of the selection method currently in use
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.selectSingle,
			},
			steps: [{ down: [{ actionId: ActionIdUsers.selectionMethod, options: { selectionMethod: 2 } }], up: [] }],
			feedbacks: [
				{
					feedbackId: FeedbackId.selectionMethod,
					options: {
						selectionMethod: 1,
					},
					style: {
						text: '',
						png64: presetImages.selectSingle,
					},
				},
				{
					feedbackId: FeedbackId.selectionMethod,
					options: {
						selectionMethod: 0,
					},
					style: {
						text: '',
						png64: presetImages.selectMulti,
					},
				},
			],
		},
		// Single selection
		[PresetIdManageSelections.singleSelection]: {
			type: 'simple',
			name: `Single selection`,
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.selectSingle,
			},
			steps: [{ down: [{ actionId: ActionIdUsers.selectionMethod, options: { selectionMethod: 1 } }], up: [] }],
			feedbacks: [],
		},
		// Select by name: a layered participant button for the participant named in the button's `name` local variable
		[PresetIdManageSelections.selectByName]: buildParticipantLayeredPreset({
			name: 'Select by name',
			nameExpression: `${localName} || 'Select by name'`,
			target: { feedbackId: FeedbackId.userNameBased, options: { name: localName } },
			steps: [
				{
					down: [{ actionId: ActionIdUsers.selectUserByName, options: { option: 'toggle', name: localName } }],
					up: [],
				},
			],
			localVariables: [{ variableType: 'simple', variableName: 'name', startupValue: '' }],
		}),
		// Active Speaker: the same layered participant button for whoever is currently speaking, so its speaker bar is
		// always on
		[PresetIdManageSelections.activeSpeaker]: buildParticipantLayeredPreset({
			name: 'Active Speaker',
			nameExpression: activeSpeakerName,
			target: { feedbackId: FeedbackId.userNameBased, options: { name: activeSpeakerName } },
			alwaysSpeaking: true,
			steps: [
				{
					down: [{ actionId: ActionIdUsers.selectUserByName, options: { option: 'toggle', name: activeSpeakerName } }],
					up: [],
				},
			],
		}),
		// Multiple selection
		[PresetIdManageSelections.multipleSelection]: {
			type: 'simple',
			name: `Multiple selection`,
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.selectMulti,
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
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.viewNext,
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
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.viewPrevious,
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
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.saveNamesWithCameraStatus,
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
		definitions: Object.values(PresetIdManageSelections),
	}

	return { section, presets }
}

import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import type ModuleInstance from '../index.js'
import { FeedbackId } from '../feedback.js'
import { colorBlack, colorLightGray, type ZoomGroupDataInterface } from '../utils.js'
import { buildParticipantTemplateSection, positionVariableExpression } from './preset-utils.js'
import { ActionIdGroups } from '../actions/action-group.js'

/** Positions listed per group; the Spotlights group (index 1) has always offered 9 */
const groupPositions = 49
const spotlightGroupPositions = 9

export enum PresetIdGroups {
	replaceGroup = 'Replace_group_',
	addToGroup = 'Add_to_group_',
	clearGroup = 'Clear_group_',
	removeFromGroup = 'Remove_from_group_',
	saveGroupToFile = 'Save_',
	loadGroupFromFile = 'Load_',
	renameGroup = 'Rename_',
	selectGroup = 'Select_',
	groupPosition = 'Group',
}

/**
 * Group presets. The PresetIdGroups values are id prefixes; the ids themselves include the group name or index.
 * Each v1 category is its own top-level section (no nested groups), since sections can be collapsed in Companion.
 */
export function GetPresetsGroups(instance: ModuleInstance): {
	sections: CompanionPresetSection<ModuleSchema>[]
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: CompanionPresetDefinitions<ModuleSchema> = {}
	// v1 category "Manage Selections of Groups"
	const manageIds: string[] = []
	// v1 categories "Select <group name> participants", one per group
	const positionSections: CompanionPresetSection<ModuleSchema>[] = []
	const listIn = (list: string[], id: string): string => {
		list.push(id)
		return id
	}

	const ZoomGroupData: ZoomGroupDataInterface[] = instance.ZoomGroupData

	// Group presets
	for (let index = 0; index < ZoomGroupData.length; index++) {
		if (index !== 0 && index !== 1) {
			presets[listIn(manageIds, `Replace_group_${ZoomGroupData[index].groupName}`)] = {
				type: 'simple',
				name: `Replace ${ZoomGroupData[index].groupName} participants`,
				style: {
					text: `Replace\\n$(zoomosc:Group${index})\\nparticip.`,
					size: '14',
					color: colorBlack,
					bgcolor: colorLightGray,
				},
				steps: [
					{
						down: [
							{
								actionId: ActionIdGroups.addToGroup,
								options: {
									group: String(index),
									groupOption: 'replace',
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
			presets[listIn(manageIds, `Add_to_group_${ZoomGroupData[index].groupName}`)] = {
				type: 'simple',
				name: `Add to group: ${ZoomGroupData[index].groupName}`,
				style: {
					text: `Add to group:\\n$(zoomosc:Group${index})`,
					size: '14',
					color: colorBlack,
					bgcolor: colorLightGray,
				},
				steps: [
					{
						down: [
							{
								actionId: ActionIdGroups.addToGroup,
								options: {
									group: String(index),
									groupOption: 'add',
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
			presets[listIn(manageIds, `Clear_group_${ZoomGroupData[index].groupName}`)] = {
				type: 'simple',
				name: `Clear group: ${ZoomGroupData[index].groupName}`,
				style: {
					text: `Clear group:\\n$(zoomosc:Group${index})`,
					size: '14',
					color: colorBlack,
					bgcolor: colorLightGray,
				},
				steps: [
					{
						down: [
							{
								actionId: ActionIdGroups.clearGroup,
								options: {
									group: String(index),
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
			presets[listIn(manageIds, `Remove_from_group_${ZoomGroupData[index].groupName}`)] = {
				type: 'simple',
				name: `Remove_from group: ${ZoomGroupData[index].groupName}`,
				style: {
					text: `Remove from\\n$(zoomosc:Group${index})`,
					size: '14',
					color: colorBlack,
					bgcolor: colorLightGray,
				},
				steps: [
					{
						down: [
							{
								actionId: ActionIdGroups.removeFromGroup,
								options: {
									group: String(index),
									userName: '',
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
			presets[listIn(manageIds, `Save_${ZoomGroupData[index].groupName}_To_File`)] = {
				type: 'simple',
				name: ZoomGroupData[index].groupName,
				style: {
					text: `Save\\n$(zoomosc:Group${index})`,
					size: '14',
					color: colorBlack,
					bgcolor: colorLightGray,
				},
				steps: [
					{
						down: [
							{
								actionId: ActionIdGroups.saveGroupToFile,
								options: {
									group: String(index),
									filepath: '',
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
			presets[listIn(manageIds, `Load_${ZoomGroupData[index].groupName}_To_File`)] = {
				type: 'simple',
				name: ZoomGroupData[index].groupName,
				style: {
					text: `Load\\n$(zoomosc:Group${index})`,
					size: '14',
					color: colorBlack,
					bgcolor: colorLightGray,
				},
				steps: [
					{
						down: [
							{
								actionId: ActionIdGroups.loadGroupFromFile,
								options: {
									group: String(index),
									filepath: '',
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
			presets[listIn(manageIds, `Rename_${ZoomGroupData[index].groupName}`)] = {
				type: 'simple',
				name: ZoomGroupData[index].groupName,
				style: {
					text: `Rename\\nGroup\\n$(zoomosc:Group${index})`,
					size: '14',
					color: colorBlack,
					bgcolor: colorLightGray,
				},
				steps: [
					{
						down: [
							{
								actionId: ActionIdGroups.renameGroup,
								options: {
									group: String(index),
									name: ZoomGroupData[index].groupName,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}

		presets[listIn(manageIds, `Select_${ZoomGroupData[index].groupName}`)] = {
			type: 'simple',
			name: ZoomGroupData[index].groupName,
			style: {
				text: `Select\\n$(zoomosc:Group${index}) ($(zoomosc:CallersInGroup${index}))`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGroups.selectGroup,
							options: {
								group: String(index),
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		// One layered template per group; further positions are reached by changing a button's position local variable
		const groupSection = buildParticipantTemplateSection({
			sectionId: `groups_group${index}`,
			sectionName: `Select ${ZoomGroupData[index].groupName} participants`,
			presetId: `Group${index}_Position`,
			presetName: 'Group selection',
			positions: index === 1 ? spotlightGroupPositions : groupPositions,
			positionName: (position) => `${ZoomGroupData[index].groupName} ${position}`,
			nameExpression: positionVariableExpression(`Group${index}Position`),
			target: (position) => ({ feedbackId: FeedbackId.groupBased, options: { group: String(index), position } }),
			action: (position) => ({
				actionId: ActionIdGroups.selectUserFromGroupPosition,
				options: { group: String(index), position, option: 'toggle' },
			}),
		})
		positionSections.push(groupSection.section)
		Object.assign(presets, groupSection.presets)
	}

	const sections: CompanionPresetSection<ModuleSchema>[] = [
		...(manageIds.length > 0
			? [{ id: 'groups_manage', name: 'Manage Selections of Groups', definitions: manageIds }]
			: []),
		...positionSections,
	]

	return { sections, presets }
}

import { FeedbackId, feedbackType } from '../feedback'
import { colorBlack, colorLightGray, InstanceBaseExt, ZoomGroupDataInterface } from '../utils'
import { CompanionPresetDefinitionsExt, getFeedbackStyleSelected, getParticipantStyleDefault } from './preset-utils'
import { ZoomConfig } from '../config'
import { ActionIdGroups } from '../actions/action-group'

export function GetPresetsGroups(
	instance: InstanceBaseExt<ZoomConfig>,
	ZoomGroupData: ZoomGroupDataInterface[]
): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	// Group presets
	for (let index = 0; index < ZoomGroupData.length; index++) {
		if (index !== 0) {
			presets[`Replace_group_${ZoomGroupData[index].groupName}`] = {
				type: 'button',
				category: 'Manage Selections of Groups',
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
									group: index,
									groupOption: 'replace',
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
			presets[`Add_to_group_${ZoomGroupData[index].groupName}`] = {
				type: 'button',
				category: 'Manage Selections of Groups',
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
									group: index,
									groupOption: 'add',
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
			presets[`Clear_group_${ZoomGroupData[index].groupName}`] = {
				type: 'button',
				category: 'Manage Selections of Groups',
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
									group: index,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
			presets[`Remove_from_group_${ZoomGroupData[index].groupName}`] = {
				type: 'button',
				category: 'Manage Selections of Groups',
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
									group: index,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}
		presets[`Rename_${ZoomGroupData[index].groupName}`] = {
			type: 'button',
			category: 'Manage Selections of Groups',
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
								group: index,
								name: ZoomGroupData[index].groupName,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets[`Select_${ZoomGroupData[index].groupName}`] = {
			type: 'button',
			category: `Manage Selections of Groups`,
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
								group: index,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		for (let position = 1; position < 50; position++) {
			presets[`Group${index}_Position${position}`] = {
				type: 'button',
				category: `Select ${ZoomGroupData[index].groupName} participants`,
				name: 'Group selection',
				style: getParticipantStyleDefault(instance, `$(zoomosc:Group${index}Position${position})`, position),
				steps: [
					{
						down: [
							{
								actionId: ActionIdGroups.selectUserFromGroupPosition,
								options: { group: index, position: position, option: 'toggle' },
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackId.groupBased,
						options: {
							group: index,
							position: position,
							type: feedbackType.selected,
						},
						style: getFeedbackStyleSelected(),
					},
					{
						feedbackId: FeedbackId.groupBasedAdvanced,
						options: {
							group: index,
							position: position,
						},
					},
				],
			}
		}
	}
	return presets
}

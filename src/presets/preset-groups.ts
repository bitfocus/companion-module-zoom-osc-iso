import { ActionId } from '../actions'
import { FeedbackId, feedbackType } from '../feedback'
import { colorBlack, colorLightGray, InstanceBaseExt, ZoomGroupDataInterface } from '../utils'
import {
	CompanionPresetDefinitionsExt,
	PresetFeedbackDefinition,
	feedbackStyleSelected,
	getParticipantStyleActiveSpeaker,
	getParticipantStyleDefault,
} from './preset-utils'
import { ZoomConfig } from '../config'

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
								actionId: ActionId.addToGroup,
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
								actionId: ActionId.addToGroup,
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
								actionId: ActionId.clearGroup,
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
								actionId: ActionId.removeFromGroup,
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
							actionId: ActionId.renameGroup,
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
							actionId: ActionId.selectGroup,
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
			const groupFeedbacks: PresetFeedbackDefinition = [
				{
					feedbackId: FeedbackId.groupBased,
					options: {
						group: index,
						position: position,
						type: feedbackType.selected,
					},
					style: feedbackStyleSelected,
				},
			]

			if (instance.config.feedbackImagesWithIcons !== 4) {
				groupFeedbacks.push({
					feedbackId: FeedbackId.groupBased,
					options: {
						group: index,
						position: position,
						type: feedbackType.activeSpeaker,
					},
					style: getParticipantStyleActiveSpeaker(`$(zoomosc:Group${index}Position${position})`, position),
				})
			}

			groupFeedbacks.push({
				feedbackId: FeedbackId.groupBasedAdvanced,
				options: {
					group: index,
					position: position,
				},
			})

			presets[`Group${index}_Position${position}`] = {
				type: 'button',
				category: `Select ${ZoomGroupData[index].groupName} participants`,
				name: 'Group selection',
				style: getParticipantStyleDefault(instance, `$(zoomosc:Group${index}Position${position})`, position),
				steps: [
					{
						down: [
							{
								actionId: ActionId.selectUserFromGroupPosition,
								options: { group: index, position: position, option: 'toggle' },
							},
						],
						up: [],
					},
				],
				feedbacks: groupFeedbacks,
			}
		}
	}
	return presets
}

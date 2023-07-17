import {
	CompanionButtonPresetDefinition,
	CompanionButtonStyleProps,
	CompanionFeedbackButtonStyleResult,
} from '@companion-module/base'
import { ActionId } from '../actions'
import { FeedbackId } from '../feedback'
import { ZoomConfig } from '../config'
import { InstanceBaseExt, colorBlack, colorDarkGray, colorWhite } from '../utils'

export type PresetFeedbackDefinition = Array<
	{
		feedbackId: FeedbackId
	} & CompanionButtonPresetDefinition['feedbacks'][0]
>

export interface CompanionPresetExt extends CompanionButtonPresetDefinition {
	feedbacks: PresetFeedbackDefinition
	steps: Array<{
		down: Array<
			{
				actionId: ActionId
			} & CompanionButtonPresetDefinition['steps'][0]['down'][0]
		>
		up: Array<
			{
				actionId: ActionId
			} & CompanionButtonPresetDefinition['steps'][0]['up'][0]
		>
	}>
}
export interface CompanionPresetDefinitionsExt {
	[id: string]: CompanionPresetExt | undefined
}

export const buttonTextDefaultLength = 50
export const buttonTextActiveSpeakerLength = 40
export const alignmentTopLeft = 'left:top'
export const alignmentTopCenter = 'center:top'
export const feedbackStyleSelected: CompanionFeedbackButtonStyleResult = {
	color: colorBlack,
	bgcolor: colorDarkGray,
}

export const getParticipantStyleDefault = (
	instance: InstanceBaseExt<ZoomConfig>,
	text: string,
	position: number
): CompanionButtonStyleProps => {
	return {
		text:
			instance.config.feedbackImagesWithIcons === 4
				? `${position}. ${text})`
				: `\`${position}. \${substr(${text},0,${buttonTextDefaultLength})}\``,
		size: '7',
		color: colorWhite,
		bgcolor: colorBlack,
		alignment: alignmentTopCenter,
		show_topbar: false,
		textExpression: instance.config.feedbackImagesWithIcons === 4 ? false : true,
	} as CompanionButtonStyleProps
}

export const getParticipantStyleActiveSpeaker = (text: string, position: number): CompanionButtonStyleProps => {
	return {
		text: `\`\\n${position}. \${substr(${text},0,${buttonTextActiveSpeakerLength})}\``,
		alignment: alignmentTopLeft,
	} as CompanionButtonStyleProps
}

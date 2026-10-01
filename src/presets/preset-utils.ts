import type ModuleInstance from '../index.js'
import type { CompanionButtonStyleProps, CompanionFeedbackButtonStyleResult } from '@companion-module/base'
import { colorBlack, colorDarkGray, colorDarkRed, colorWhite } from '../utils.js'

export const buttonTextDefaultLength = 50
export const buttonTextActiveSpeakerLength = 40
export const alignmentTopLeft = 'left:top'
export const alignmentTopCenter = 'center:top'

export const getFeedbackStyleSelected = (): CompanionFeedbackButtonStyleResult => {
	return {
		color: colorBlack,
		bgcolor: colorDarkGray,
	}
}

export const getFeedbackStyleSpotlight = (): CompanionFeedbackButtonStyleResult => {
	return {
		color: colorWhite,
		bgcolor: colorDarkRed,
	}
}

export const getParticipantStyleDefault = (instance: ModuleInstance, text: string, position: number): any => {
	return {
		text:
			instance.config.feedbackImagesWithIcons === 4
				? `${position}. ${text}`
				: `\`${position}. \${substr(${text},0,${buttonTextDefaultLength})}\``,
		size: '10',
		color: colorWhite,
		bgcolor: colorBlack,
		alignment: alignmentTopCenter,
		show_topbar: false,
		textExpression: instance.config.feedbackImagesWithIcons === 4 ? false : true,
	} //as CompanionButtonStyleProps
}

export const getParticipantStyleActiveSpeaker = (text: string, position: number): CompanionButtonStyleProps => {
	return {
		text: `\`\\n${position}. \${substr(${text},0,${buttonTextActiveSpeakerLength})}\``,
		alignment: alignmentTopLeft,
	} as CompanionButtonStyleProps
}

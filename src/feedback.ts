import ZoomInstance from './'
import {
	CompanionFeedbackEvent,
	SomeCompanionInputField,
	CompanionBankRequiredProps,
	CompanionBankAdditionalStyleProps,
	CompanionFeedbackEventInfo,
	CompanionBankPNG,
} from '../../../instance_skel_types'
import { options } from './utils'

export interface ZoomFeedbacks {
	// Audio
	microphoneMute: ZoomFeedback<microphoneMuteCallback>
	// Video
	camera: ZoomFeedback<cameraCallback>

	// Index signature
	[key: string]: ZoomFeedback<any>
}

// Audio
interface microphoneMuteCallback {
	type: 'microphoneMute'
	options: Readonly<{
		fg: number
		bg: number
		mute: number
		user: number
	}>
}
interface cameraCallback {
	type: 'camera'
	options: Readonly<{
		fg: number
		bg: number
		video: number
		user: number
	}>
}

// Callback type for Presets
export type FeedbackCallbacks = microphoneMuteCallback | cameraCallback

// Force options to have a default to prevent sending undefined values
type InputFieldWithDefault = Exclude<SomeCompanionInputField, 'default'> & { default: string | number | boolean | null }

// Zoom Boolean and Advanced feedback types
interface ZoomFeedbackBoolean<T> {
	type: 'boolean'
	label: string
	description: string
	style: Partial<CompanionBankRequiredProps & CompanionBankAdditionalStyleProps>
	options: InputFieldWithDefault[]
	callback?: (
		feedback: Readonly<Omit<CompanionFeedbackEvent, 'options' | 'type'> & T>,
		bank: Readonly<CompanionBankPNG | null>,
		info: Readonly<CompanionFeedbackEventInfo | null>
	) => boolean
	subscribe?: (feedback: Readonly<Omit<CompanionFeedbackEvent, 'options' | 'type'> & T>) => boolean
	unsubscribe?: (feedback: Readonly<Omit<CompanionFeedbackEvent, 'options' | 'type'> & T>) => boolean
}

interface ZoomFeedbackAdvanced<T> {
	type: 'advanced'
	label: string
	description: string
	options: InputFieldWithDefault[]
	callback?: (
		feedback: Readonly<Omit<CompanionFeedbackEvent, 'options' | 'type'> & T>,
		bank: Readonly<CompanionBankPNG | null>,
		info: Readonly<CompanionFeedbackEventInfo | null>
	) => Partial<CompanionBankRequiredProps & CompanionBankAdditionalStyleProps> | void
	subscribe?: (
		feedback: Readonly<Omit<CompanionFeedbackEvent, 'options' | 'type'> & T>
	) => Partial<CompanionBankRequiredProps & CompanionBankAdditionalStyleProps> | void
	unsubscribe?: (
		feedback: Readonly<Omit<CompanionFeedbackEvent, 'options' | 'type'> & T>
	) => Partial<CompanionBankRequiredProps & CompanionBankAdditionalStyleProps> | void
}

export type ZoomFeedback<T> = ZoomFeedbackBoolean<T> | ZoomFeedbackAdvanced<T>

export function getFeedbacks(instance: ZoomInstance): ZoomFeedbacks {
	let CHOICES_USERS = [{ id: '', label: 'no users' }]
	if (instance.ZoomUserData.length !== 0) {
		CHOICES_USERS = instance.ZoomUserData.filter((n) => n).map((id) => ({
			id: id.zoomId.toString(),
			label: id.username,
		}))
	}

	return {
		microphoneMute: {
			type: 'advanced',
			label: 'Mute microphone',
			description: 'Indicates if a user has muted their microphone',
			options: [
				{
					type: 'dropdown',
					label: 'User',
					id: 'user',
					default: instance.ZoomUserData.find((element) => element !== undefined)
						? instance.ZoomUserData.find((element) => element !== undefined)!.zoomId
						: 'no user yet',
					choices: CHOICES_USERS,
				},
				options.mute,
				options.foregroundColor,
				options.backgroundColorProgram,
			],
			callback: (feedback) => {
				if (instance.ZoomUserData[feedback.options.user].mute === (feedback.options.mute == 1 ? true : false))
					return { color: feedback.options.fg, bgcolor: feedback.options.bg }
				else return
			},
		},
		camera: {
			type: 'advanced',
			label: 'Camera on/of',
			description: 'Indicates if camera is on or off',
			options: [
				{
					type: 'dropdown',
					label: 'User',
					id: 'user',
					default: instance.ZoomUserData.find((element) => element !== undefined)
						? instance.ZoomUserData.find((element) => element !== undefined)!.zoomId
						: 'no user yet',
					choices: CHOICES_USERS,
				},
				options.video,
				options.foregroundColor,
				options.backgroundColorProgram,
			],
			callback: (feedback) => {
				if (instance.ZoomUserData[feedback.options.user].videoOn === (feedback.options.video == 1 ? true : false))
					return { color: feedback.options.fg, bgcolor: feedback.options.bg }
				else return
			},
		},
	}
}

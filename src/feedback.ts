import ZoomInstance from './'
import {
	CompanionFeedbackEvent,
	SomeCompanionInputField,
	CompanionBankRequiredProps,
	CompanionBankAdditionalStyleProps,
	CompanionFeedbackEventInfo,
	CompanionBankPNG,
} from '../../../instance_skel_types'
import { options, rgb } from './utils'

export interface ZoomFeedbacks {
	// Audio
	microphoneLive: ZoomFeedback<microphoneMuteCallback>
	// Video
	camera: ZoomFeedback<cameraCallback>
	handRaised: ZoomFeedback<handRaisedCallback>
	selectedUser: ZoomFeedback<selectedUserCallback>
	selectedInAGroup: ZoomFeedback<selectedInAGroupCallback>

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
interface handRaisedCallback {
	type: ' handRaised'
	options: Readonly<{
		fg: number
		bg: number
		user: number
		handRaised: number
	}>
}
interface selectedUserCallback {
	type: 'selectedUser'
	options: Readonly<{
		fg: number
		bg: number
		user: number
	}>
}
interface selectedInAGroupCallback {
	type: 'selectedAddToGroup'
	options: Readonly<{
		fg: number
		bg: number
		user: number
		group: number
	}>
}

// Callback type for Presets
export type FeedbackCallbacks = microphoneMuteCallback | cameraCallback | selectedUserCallback | handRaisedCallback

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
	let CHOICES_USERS = [{ id: '0', label: 'no users' }]
	let CHOICES_GALLERY = [{ id: '0', label: 'no position' }]
	let CHOICES_USERS_DEFAULT = '0'
	if (instance.ZoomUserData) {
		CHOICES_USERS.length = 0
		for (const key in instance.ZoomUserData) {
			if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
				const user = instance.ZoomUserData[key]
				CHOICES_USERS.push({ id: user.zoomId.toString(), label: user.userName })
			}
		}
		CHOICES_USERS_DEFAULT = CHOICES_USERS.length > 0 ? CHOICES_USERS[0].id : '0'
		CHOICES_GALLERY = [{ id: '0', label: 'empty gallery' }]
		if (instance.ZoomClientDataObj.galleryOrder.length > 1) {
			CHOICES_GALLERY.length = 0
			for (let index = 0; index < instance.ZoomClientDataObj.galleryOrder.length; index++) {
				CHOICES_GALLERY.push({ id: index.toString(), label: `Gallery position ${index}` })
			}
		}
	}

	return {
		microphoneLive: {
			type: 'boolean',
			label: 'Microphone live',
			description: 'Indicates if a user has their microphone on',
			style: {
				bgcolor: rgb(255, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'User',
					id: 'user',
					default: CHOICES_USERS_DEFAULT,
					choices: CHOICES_USERS,
				},
			],
			callback: (feedback) => {
				if (instance.ZoomUserData[feedback.options.user].mute === false) return true
				else return false
			},
		},
		microphoneLiveGalPos: {
			type: 'boolean',
			label: 'Microphone live',
			description: 'Indicates if a user has their microphone on',
			style: {
				bgcolor: rgb(255, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Position',
					id: 'position',
					default: '0',
					choices: CHOICES_GALLERY,
				},
			],
			callback: (feedback) => {
				if (instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position]].mute === false)
					return true
				else return false
			},
		},
		camera: {
			type: 'boolean',
			label: 'Camera on/of',
			description: 'Indicates if camera is on or off',
			style: {
				color: rgb(255, 255, 255),
				bgcolor: rgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'User',
					id: 'user',
					default: CHOICES_USERS_DEFAULT,
					choices: CHOICES_USERS,
				},
				options.video,
			],
			callback: (feedback) => {
				if (instance.ZoomUserData[feedback.options.user].videoOn === (feedback.options.video == 1 ? true : false))
					return true
				else return false
			},
		},
		cameraGalPos: {
			type: 'boolean',
			label: 'Camera on/of',
			description: 'Indicates if camera is on or off',
			style: {
				color: rgb(255, 255, 255),
				bgcolor: rgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Position',
					id: 'position',
					default: '0',
					choices: CHOICES_GALLERY,
				},
				options.video,
			],
			callback: (feedback) => {
				if (
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position]].videoOn ===
					(feedback.options.video == 1 ? true : false)
				)
					return true
				else return false
			},
		},
		handRaised: {
			type: 'boolean',
			label: 'hand raised',
			description: 'Indicates when hand is raised',
			style: {
				color: rgb(255, 255, 255),
				bgcolor: rgb(255, 255, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'User',
					id: 'user',
					default: CHOICES_USERS_DEFAULT,
					choices: CHOICES_USERS,
				},
				options.handRaised,
			],
			callback: (feedback) => {
				if (
					instance.ZoomUserData[feedback.options.user].handRaised === (feedback.options.handRaised == 1 ? true : false)
				)
					return true
				else return false
			},
		},
		handRaisedGalPos: {
			type: 'boolean',
			label: 'hand raised',
			description: 'Indicates when hand is raised',
			style: {
				color: rgb(255, 255, 255),
				bgcolor: rgb(255, 255, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Position',
					id: 'position',
					default: '0',
					choices: CHOICES_GALLERY,
				},
				options.handRaised,
			],
			callback: (feedback) => {
				if (
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position]].handRaised ===
					(feedback.options.handRaised == 1 ? true : false)
				)
					return true
				else return false
			},
		},
		selectedUser: {
			type: 'boolean',
			label: 'Selected user',
			description: 'Indicate if a user is pre-selected for a command/action',
			style: {
				color: rgb(255, 255, 255),
				bgcolor: rgb(255, 255, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'User',
					id: 'user',
					default: CHOICES_USERS_DEFAULT,
					choices: CHOICES_USERS,
				},
			],
			callback: (feedback) => {
				if (instance.ZoomClientDataObj.selectedCallers.find((element) => element === feedback.options.user)) return true
				else return false
			},
		},
		selectedUserGalPos: {
			type: 'boolean',
			label: 'Selected user',
			description: 'Indicate if a user is pre-selected for a command/action',
			style: {
				color: rgb(255, 255, 255),
				bgcolor: rgb(255, 255, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Position',
					id: 'position',
					default: '0',
					choices: CHOICES_GALLERY,
				},
			],
			callback: (feedback) => {
				if (
					instance.ZoomClientDataObj.selectedCallers.find(
						(element) => element === instance.ZoomClientDataObj.galleryOrder[feedback.options.position]
					)
				)
					return true
				else return false
			},
		},
		selectedInAGroup: {
			type: 'boolean',
			label: 'User is in group',
			description: 'Indicate if a user is in a group-selection',
			style: {
				color: rgb(255, 255, 255),
				bgcolor: rgb(155, 155, 155),
			},
			options: [
				{
					type: 'dropdown',
					label: 'User',
					id: 'user',
					default: CHOICES_USERS_DEFAULT,
					choices: CHOICES_USERS,
				},
			],
			callback: (feedback) => {
				for (let index = 1; index - 1 < instance.ZoomClientDataObj.numberOfGroups; index++) {
					if (instance.ZoomUserData[index].users.find((element) => element === feedback.options.user)) return true
				}
				return false
			},
		},
		selectedInAGroupGalPos: {
			type: 'boolean',
			label: 'User is in group',
			description: 'Indicate if a user is in a group-selection',
			style: {
				color: rgb(255, 255, 255),
				bgcolor: rgb(155, 155, 155),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Position',
					id: 'position',
					default: '0',
					choices: CHOICES_GALLERY,
				},
			],
			callback: (feedback) => {
				for (let index = 1; index - 1 < instance.ZoomClientDataObj.numberOfGroups; index++) {
					if (
						instance.ZoomUserData[index].users.find(
							(element) => element === instance.ZoomClientDataObj.galleryOrder[feedback.options.position]
						)
					)
						return true
				}
				return false
			},
		},
	}
}

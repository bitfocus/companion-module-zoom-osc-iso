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
	selectionMethod: ZoomFeedback<selectionMethodCallback>
	groupBased: ZoomFeedback<groupBasedCallback>

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
		type: string
		position: number
	}>
}
interface cameraCallback {
	type: 'camera'
	options: Readonly<{
		fg: number
		bg: number
		video: number
		user: number
		type: string
		position: number
	}>
}
interface handRaisedCallback {
	type: ' handRaised'
	options: Readonly<{
		fg: number
		bg: number
		user: number
		handRaised: number
		type: string
		position: number
	}>
}
interface selectedUserCallback {
	type: 'selectedUser'
	options: Readonly<{
		fg: number
		bg: number
		user: number
		type: string
		position: number
	}>
}
interface selectionMethodCallback {
	type: 'selectionMethod'
	options: Readonly<{
		selectionMethod: number
	}>
}
interface groupBasedCallback {
	type: 'groupBased'
	options: Readonly<{
		group: number
		position: number
		type: string
	}>
}

// Callback type for Presets
export type FeedbackCallbacks = microphoneMuteCallback | cameraCallback | selectedUserCallback | handRaisedCallback | selectionMethodCallback | groupBasedCallback

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
	// Create the choices
	let CHOICES_POSITION = []
	for (let index = 1; index < 1000; index++) {
		CHOICES_POSITION.push({ id: index.toString(), label: `Position ${index}` })
	}
	let CHOICES_GALLERY = []
	for (let index = 1; index < 50; index++) {
		CHOICES_GALLERY.push({ id: index.toString(), label: `Gallery position ${index}` })
	}
	let CHOICES_GROUPS = [{ id: '0', label: 'no position' }]
	for (let index = 0; index < instance.ZoomGroupData.length; index++) {
		CHOICES_GROUPS.push({ id: index.toString(), label: `Group ${index + 1}` })
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
					label: 'Position',
					id: 'position',
					default: '1',
					choices: CHOICES_POSITION,
				},
				{
					type: 'dropdown',
					label: 'type',
					id: 'type',
					default: 'index',
					choices: [
						{ id: 'gallery', label: 'gallery' },
						{ id: 'index', label: 'index' },
					],
				},
			],
			callback: (feedback) => {
				if (
					feedback.options.type === 'gallery' &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]] &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]].mute === false
				) {
					return true
				} else if (
					feedback.options.type === 'index' &&
					instance.ZoomVariableLink[feedback.options.position - 1] &&
					instance.ZoomUserData[instance.ZoomVariableLink[feedback.options.position - 1].zoomId].mute === false
				) {
					return true
				}
				return false
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
					label: 'Position',
					id: 'position',
					default: '1',
					choices: CHOICES_POSITION,
				},
				{
					type: 'dropdown',
					label: 'type',
					id: 'type',
					default: 'index',
					choices: [
						{ id: 'gallery', label: 'gallery' },
						{ id: 'index', label: 'index' },
					],
				},
				options.video,
			],
			callback: (feedback) => {
				if (
					feedback.options.type === 'gallery' &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position]] &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position]].videoOn ===
						(feedback.options.video == 1 ? true : false)
				) {
					return true
				} else if (
					feedback.options.type === 'index' &&
					instance.ZoomVariableLink[feedback.options.position - 1] &&
					instance.ZoomUserData[instance.ZoomVariableLink[feedback.options.position - 1].zoomId].videoOn ===
						(feedback.options.video == 1 ? true : false)
				) {
					return true
				}
				return false
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
					label: 'Position',
					id: 'position',
					default: '1',
					choices: CHOICES_POSITION,
				},
				{
					type: 'dropdown',
					label: 'type',
					id: 'type',
					default: 'index',
					choices: [
						{ id: 'gallery', label: 'gallery' },
						{ id: 'index', label: 'index' },
					],
				},
				options.handRaised,
			],
			callback: (feedback) => {
				if (
					feedback.options.type === 'gallery' &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]] &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]].handRaised ===
						(feedback.options.handRaised == 1 ? true : false)
				) {
					return true
				} else if (
					feedback.options.type === 'index' &&
					instance.ZoomVariableLink[feedback.options.position - 1] &&
					instance.ZoomUserData[instance.ZoomVariableLink[feedback.options.position - 1].zoomId].handRaised ===
						(feedback.options.handRaised == 1 ? true : false)
				) {
					return true
				}
				return false
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
					label: 'Position',
					id: 'position',
					default: '1',
					choices: CHOICES_POSITION,
				},
				{
					type: 'dropdown',
					label: 'type',
					id: 'type',
					default: 'index',
					choices: [
						{ id: 'gallery', label: 'gallery' },
						{ id: 'index', label: 'index' },
					],
				},
			],
			callback: (feedback) => {
				if (
					feedback.options.type === 'gallery' &&
					instance.ZoomClientDataObj.selectedCallers &&
					instance.ZoomClientDataObj.selectedCallers.find(
						(element) => element === instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]
					)
				) {
					return true
				} else if (
					feedback.options.type === 'index' &&
					instance.ZoomClientDataObj.selectedCallers &&
					instance.ZoomVariableLink[feedback.options.position - 1] &&
					instance.ZoomClientDataObj.selectedCallers.find(
						(element) => element === instance.ZoomVariableLink[feedback.options.position - 1].zoomId
					)
				) {
					return true
				}
				return false
			},
		},
		selectionMethod: {
			type: 'boolean',
			label: 'selection method',
			description: 'Use of single or multi select',
			style: {
				text: 'Single selection',
			},
			options: [
				{
					type: 'dropdown',
					label: 'Selection Method',
					id: 'selectionMethod',
					default: 1,
					choices: [
						{ id: 1, label: 'Single selection' },
						{ id: 0, label: 'Multi selection' },
					],
				},
			],
			callback: (feedback) => {
				if (instance.config.selectionMethod === undefined) instance.config.selectionMethod = 1
				if (instance.config.selectionMethod === feedback.options.selectionMethod) {
					return true
				} else {
					return false
				}
			},
		},
		groupBased: {
			type: 'boolean',
			label: 'In a group feedback',
			description: 'Indicates feedback based on selection',
			style: {
				bgcolor: rgb(255, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group',
					default: '1',
					choices: CHOICES_GROUPS,
				},
				{
					type: 'dropdown',
					label: 'Position',
					id: 'position',
					default: '1',
					choices: CHOICES_POSITION,
				},
				{
					type: 'dropdown',
					label: 'Type of feedback',
					id: 'type',
					default: 'selected',
					choices: [
						{ id: 'selected', label: 'Selected' },
						{ id: 'micLive', label: 'Mic Live' },
						{ id: 'handRaised', label: 'Hand Raised' },
						{ id: 'camera', label: 'Camera Live' },
					],
				},
			],
			callback: (feedback) => {
				if (
					feedback.options.type === 'selected' &&
					instance.ZoomClientDataObj.selectedCallers &&
					instance.ZoomClientDataObj.selectedCallers.find(
						(element) =>
							element === instance.ZoomGroupData[feedback.options.group].users[feedback.options.position].zoomID
					)
				) {
					return true
				} else if (
					feedback.options.type === 'micLive' &&
					instance.ZoomUserData[
						instance.ZoomGroupData[feedback.options.group].users[feedback.options.position].zoomID
					] &&
					instance.ZoomUserData[instance.ZoomGroupData[feedback.options.group].users[feedback.options.position].zoomID]
						.mute === true
				) {
					return true
				} else if (
					feedback.options.type === 'handRaised' &&
					instance.ZoomUserData[
						instance.ZoomGroupData[feedback.options.group].users[feedback.options.position].zoomID
					] &&
					instance.ZoomUserData[instance.ZoomGroupData[feedback.options.group].users[feedback.options.position].zoomID]
						.handRaised === true
				) {
					return true
				} else if (feedback.options.type === 'camera' &&
				instance.ZoomUserData[
					instance.ZoomGroupData[feedback.options.group].users[feedback.options.position].zoomID
				] &&
				instance.ZoomUserData[instance.ZoomGroupData[feedback.options.group].users[feedback.options.position].zoomID]
					.videoOn === true) {
					return true
				}
				return false
			},
		},
	}
}

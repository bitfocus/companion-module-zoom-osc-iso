import ZoomInstance from './'
import {
	CompanionFeedbackEvent,
	SomeCompanionInputField,
	CompanionBankRequiredProps,
	CompanionBankAdditionalStyleProps,
	CompanionFeedbackEventInfo,
	CompanionBankPNG,
} from '../../../instance_skel_types'
import { rgb } from './utils'

export interface ZoomFeedbacks {
	selectionMethod: ZoomFeedback<selectionMethodCallback>
	groupBased: ZoomFeedback<groupBasedCallback>
	indexBased: ZoomFeedback<indexBasedCallback>
	galleryBased: ZoomFeedback<galleryBasedCallback>
	userNameBased: ZoomFeedback<userNameBasedCallback>
	// Index signature
	[key: string]: ZoomFeedback<any>
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
interface indexBasedCallback {
	type: 'indexBased'
	options: Readonly<{
		position: number
		type: string
	}>
}
interface galleryBasedCallback {
	type: 'galleryBased'
	options: Readonly<{
		position: number
		type: string
	}>
}

interface userNameBasedCallback {
	type: 'userNameBased'
	options: Readonly<{
		type: string
		name: string
	}>
}

// Callback type for Presets
export type FeedbackCallbacks =
	| selectionMethodCallback
	| groupBasedCallback
	| indexBasedCallback
	| galleryBasedCallback
	| userNameBasedCallback

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
	let CHOICES_GROUPS = instance.ZoomGroupData.length === 0 ? [{ id: '0', label: 'no position' }] : []
	for (let index = 0; index < instance.ZoomGroupData.length; index++) {
		CHOICES_GROUPS.push({ id: index.toString(), label: `Group ${index + 1}` })
	}

	return {
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
				if (instance.ZoomGroupData[feedback.options.group].users[feedback.options.position - 1]) {
					let zoomID = instance.ZoomGroupData[feedback.options.group].users[feedback.options.position - 1].zoomID
					switch (feedback.options.type) {
						case 'micLive':
							return instance.ZoomUserData[zoomID].mute === false ? true : false
						case 'camera':
							return instance.ZoomUserData[zoomID].videoOn === false ? true : false
						case 'handRaised':
							return instance.ZoomUserData[zoomID].handRaised === true ? true : false
						case 'activeSpeaker':
							return instance.ZoomClientDataObj.activeSpeaker === instance.ZoomUserData[zoomID].userName ? true : false
						case 'selected':
							return instance.ZoomClientDataObj.selectedCallers.find((element) => element === zoomID) ? true : false
					}
				}
				return false
			},
		},
		indexBased: {
			type: 'boolean',
			label: 'index based feedback',
			description: 'Index based feedback',
			style: {
				bgcolor: rgb(255, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Index',
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
						{ id: 'camera', label: 'Camera off' },
						{ id: 'activeSpeaker', label: 'Active speaker' },
					],
				},
			],
			callback: (feedback) => {
				if (instance.ZoomVariableLink[feedback.options.position - 1]) {
					let zoomID = instance.ZoomVariableLink[feedback.options.position - 1].zoomId
					switch (feedback.options.type) {
						case 'micLive':
							return instance.ZoomUserData[zoomID].mute === false ? true : false
						case 'camera':
							return instance.ZoomUserData[zoomID].videoOn === false ? true : false
						case 'handRaised':
							return instance.ZoomUserData[zoomID].handRaised === true ? true : false
						case 'activeSpeaker':
							return instance.ZoomClientDataObj.activeSpeaker === instance.ZoomUserData[zoomID].userName ? true : false
						case 'selected':
							return instance.ZoomClientDataObj.selectedCallers.find((element) => element === zoomID) ? true : false
					}
				}
				return false
			},
		},
		userNameBased: {
			type: 'boolean',
			label: 'username based feedback',
			description: 'username based feedback',
			style: {
				bgcolor: rgb(255, 0, 0),
			},
			options: [
				{
					type: 'textinput',
					label: 'Name',
					id: 'name',
					default: '',
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
						{ id: 'camera', label: 'Camera off' },
						{ id: 'activeSpeaker', label: 'Active speaker' },
					],
				},
			],
			callback: (feedback) => {
				let name = feedback.options.name
				let zoomID = 0
				for (const iterator of instance.ZoomVariableLink) {
					if (iterator.userName === name) {
						zoomID = iterator.zoomId

						switch (feedback.options.type) {
							case 'micLive':
								return instance.ZoomUserData[zoomID].mute === false ? true : false
							case 'camera':
								return instance.ZoomUserData[zoomID].videoOn === false ? true : false
							case 'handRaised':
								return instance.ZoomUserData[zoomID].handRaised === true ? true : false
							case 'activeSpeaker':
								return instance.ZoomClientDataObj.activeSpeaker === name ? true : false
							case 'selected':
								return instance.ZoomClientDataObj.selectedCallers.find((element) => element === zoomID) ? true : false
							default:
								return false
						}
					}
				}
				return false
			},
		},
		galleryBased: {
			type: 'boolean',
			label: 'Gallery based feedback',
			description: 'Gallery based feedback',
			style: {
				bgcolor: rgb(255, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Gallery position',
					id: 'position',
					default: '1',
					choices: CHOICES_GALLERY,
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
						{ id: 'camera', label: 'Camera off' },
						{ id: 'activeSpeaker', label: 'Active Speaker' },
					],
				},
			],
			callback: (feedback) => {
				if (instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]]) {
					let zoomID =
						instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]].zoomId
					switch (feedback.options.type) {
						case 'micLive':
							instance.ZoomUserData[zoomID].mute === false ? true : false
						case 'camera':
							return instance.ZoomUserData[zoomID].videoOn === false ? true : false
						case 'handraised':
							return instance.ZoomUserData[zoomID].handRaised === true ? true : false
						case 'activeSpeaker':
							return instance.ZoomClientDataObj.activeSpeaker === instance.ZoomUserData[zoomID].userName ? true : false
						case 'selected':
							return instance.ZoomClientDataObj.selectedCallers.find((element) => element === zoomID) ? true : false
						default:
							return false
					}
				}
				return false
			},
		},
	}
}

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

// Callback type for Presets
export type FeedbackCallbacks = selectionMethodCallback | groupBasedCallback | indexBasedCallback | galleryBasedCallback

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
				if (
					feedback.options.type === 'selected' &&
					instance.ZoomClientDataObj.selectedCallers &&
					instance.ZoomClientDataObj.selectedCallers.find(
						(element) =>
							element === instance.ZoomGroupData[feedback.options.group].users[feedback.options.position - 1].zoomID
					)
				) {
					return true
				} else if (
					feedback.options.type === 'micLive' &&
					instance.ZoomGroupData[feedback.options.group].users[feedback.options.position - 1] &&
					instance.ZoomUserData[
						instance.ZoomGroupData[feedback.options.group].users[feedback.options.position - 1].zoomID
					].mute === false
				) {
					return true
				} else if (
					feedback.options.type === 'handRaised' &&
					instance.ZoomGroupData[feedback.options.group].users[feedback.options.position - 1] &&
					instance.ZoomUserData[
						instance.ZoomGroupData[feedback.options.group].users[feedback.options.position - 1].zoomID
					].handRaised === true
				) {
					return true
				} else if (
					feedback.options.type === 'camera' &&
					instance.ZoomGroupData[feedback.options.group].users[feedback.options.position - 1] &&
					instance.ZoomUserData[
						instance.ZoomGroupData[feedback.options.group].users[feedback.options.position - 1].zoomID
					].videoOn === true
				) {
					return true
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
				if (
					feedback.options.type === 'micLive' &&
					instance.ZoomVariableLink[feedback.options.position - 1] &&
					instance.ZoomUserData[instance.ZoomVariableLink[feedback.options.position - 1].zoomId].mute === false
				) {
					return true
				} else if (
					feedback.options.type === 'camera' &&
					instance.ZoomVariableLink[feedback.options.position - 1] &&
					instance.ZoomUserData[instance.ZoomVariableLink[feedback.options.position - 1].zoomId].videoOn === false
				) {
					return true
				} else if (
					feedback.options.type === 'handRaised' &&
					instance.ZoomVariableLink[feedback.options.position - 1] &&
					instance.ZoomUserData[instance.ZoomVariableLink[feedback.options.position - 1].zoomId].handRaised === true
				) {
					return true
				} else if (
					feedback.options.type === 'activeSpeaker' &&
					instance.ZoomClientDataObj.activeSpeaker === (feedback.options.position -1).toString()
				) {
					return true
				} else if (
					feedback.options.type === 'selected' &&
					instance.ZoomClientDataObj.activeSpeaker &&
					instance.ZoomVariableLink[feedback.options.position - 1] &&
					instance.ZoomClientDataObj.selectedCallers.find(
						(element) => element === instance.ZoomVariableLink[feedback.options.position - 1].zoomId
					)
				) {
					return true
				} else {
					return false
				}
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
					],
				},
			],
			callback: (feedback) => {
				if (
					feedback.options.type === 'micLive' &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]] &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]].mute === false
				) {
					return true
				} else if (
					feedback.options.type === 'camera' &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position]] &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position]].videoOn === false
				) {
					return true
				} else if (
					feedback.options.type === 'handRaised' &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]] &&
					instance.ZoomUserData[instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]].handRaised ===
						true
				) {
					return true
				}
				if (
					feedback.options.type === 'selected' &&
					instance.ZoomClientDataObj.selectedCallers &&
					instance.ZoomClientDataObj.selectedCallers.find(
						(element) => element === instance.ZoomClientDataObj.galleryOrder[feedback.options.position - 1]
					)
				) {
					return true
				} else {
					return false
				}
			},
		},
	}
}

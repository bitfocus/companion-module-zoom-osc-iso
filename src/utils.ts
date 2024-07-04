import {
	CompanionInputFieldDropdown,
	CompanionInputFieldNumber,
	CompanionInputFieldTextInput,
	InstanceBase,
	combineRgb,
} from '@companion-module/base'

type TimeFormat = 'hh:mm:ss' | 'hh:mm:ss.ms' | 'mm:ss' | 'mm:ss.ms'

// Force options to have a default to prevent sending undefined values
type EnforceDefault<T, U> = Omit<T, 'default'> & { default: U }

export const colorDarkGray = combineRgb(72, 72, 72)
export const colorLightGray = combineRgb(230, 230, 230)
export const colorBlack = combineRgb(0, 0, 0)
export const colorWhite = combineRgb(255, 255, 255)
export const colorRed = combineRgb(255, 0, 0)
export const colorDarkRed = combineRgb(102, 25, 25)
export const colorGreenOlive = combineRgb(141, 218, 77)
export const colorTeal = combineRgb(111, 222, 222)

export enum SubscribeMode {
	None = 0,
	TargetList = 1,
	All = 2,
	Panelists = 3,
	OnlyGallery = 4,
}

export enum ZoomVersion {
	ZoomOSC = 0,
	ZoomISO = 1,
}

export interface ZoomClientDataObjInterface {
	last_response: number
	subscribeMode: number
	selectedCallers: number[]
	PreviousSelectedCallers: number[]
	selectedOutputs: number[]
	selectedAudioOutputs: number[]
	activeSpeaker: string
	isSpeaking: string
	zoomOSCVersion: string | number
	callStatus: string | number
	galleryCount: number
	galleryOrder: number[]
	numberOfGroups: number
	engineState: number
	capturePermissionGranted: boolean
}

export interface ZoomUserDataInterface {
	[key: number]: {
		zoomId: number
		userName: string
		targetIndex: number
		galleryIndex: number
		mute?: boolean
		videoOn?: boolean
		handRaised?: boolean
		userRole?: number
		spotlighted?: boolean
		users: number[]
	}
}

export interface ZoomOutputDataInterface {
	[key: number]: {
		numberOfOutputs: number
		outputNumber: number
		enabled: boolean
		outputName: string
		mode: string
		selection: string
		resolution: string
		embeddedAudioInfo: string
		status: string
	}
}

export interface ZoomAudioLevelDataInterface {
	[key: number]: {
		channel: number
		level: number
	}
}

export interface ZoomAudioRoutingDataInterface {
	[key: number]: {
		audio_device: string
		num_channels: number
		channel: number
		mode: string
		gain_reduction: number
		selection: string
	}
}

export interface ZoomUserOfflineInterface {
	[key: number]: {
		zoomId: number
		userName: string
		targetIndex: number
		galleryIndex: number
		mute?: boolean
		videoOn?: boolean
		handRaised?: boolean
		userRole?: number
		users: number[]
	}
}

export interface ZoomGroupDataInterface {
	groupName: string
	users: { zoomID: number; userName: string }[]
}

export interface ZoomVariableLinkInterface {
	zoomId: number
	userName: string
}
export interface Options {
	message: EnforceDefault<CompanionInputFieldTextInput, string>
	name: EnforceDefault<CompanionInputFieldTextInput, string>
	breakoutName: EnforceDefault<CompanionInputFieldTextInput, string>
	channel: EnforceDefault<CompanionInputFieldNumber, number>
	reductionAmount: EnforceDefault<CompanionInputFieldNumber, number>
	userName: EnforceDefault<CompanionInputFieldTextInput, string>
	meetingID: EnforceDefault<CompanionInputFieldTextInput, string>
	path: EnforceDefault<CompanionInputFieldTextInput, string>
	customArgs: EnforceDefault<CompanionInputFieldTextInput, string>
	videoLossMode: EnforceDefault<CompanionInputFieldDropdown, string>
	intX: EnforceDefault<CompanionInputFieldNumber, number>
	intY: EnforceDefault<CompanionInputFieldNumber, number>
	level: EnforceDefault<CompanionInputFieldNumber, number>
	output: EnforceDefault<CompanionInputFieldNumber, number>
	count: EnforceDefault<CompanionInputFieldNumber, number>
	mode: EnforceDefault<CompanionInputFieldNumber, number>
	id: EnforceDefault<CompanionInputFieldNumber, number>
	password: EnforceDefault<CompanionInputFieldTextInput, string>
	zak: EnforceDefault<CompanionInputFieldTextInput, string>
	video: EnforceDefault<CompanionInputFieldDropdown, number>
	allowChooseBreakout: EnforceDefault<CompanionInputFieldDropdown, number>
	postCloseSeconds: EnforceDefault<CompanionInputFieldNumber, number>
	allowReturnAtWill: EnforceDefault<CompanionInputFieldDropdown, number>
	autoMoveParticipants: EnforceDefault<CompanionInputFieldDropdown, number>
	useTimer: EnforceDefault<CompanionInputFieldDropdown, number>
	closeWithTimer: EnforceDefault<CompanionInputFieldDropdown, number>
	breakoutDurrationSeconds: EnforceDefault<CompanionInputFieldNumber, number>
}

/**
 * @param red 0-255
 * @param green 0-255
 * @param blue 0-255
 * @returns RGB value encoded for Companion Bank styling
 */
export const rgb = (red: number, green: number, blue: number): number => {
	return ((red & 0xff) << 16) | ((green & 0xff) << 8) | (blue & 0xff)
}

export const userExist = (zoomId: number, zoomUserData: ZoomUserDataInterface): boolean => {
	if (Object.prototype.hasOwnProperty.call(zoomUserData, zoomId)) {
		return true
	}

	return false
}

export const options: Options = {
	message: {
		type: 'textinput',
		label: 'Message',
		id: 'message',
		default: '',
	},
	name: {
		type: 'textinput',
		useVariables: true,
		label: 'Name',
		id: 'name',
		default: '',
	},
	breakoutName: {
		type: 'textinput',
		useVariables: true,
		label: 'Name of breakout room',
		id: 'breakoutName',
		default: '',
	},
	channel: {
		type: 'number',
		label: 'number',
		id: 'number',
		default: 1,
		min: 1,
		max: 256,
	},
	reductionAmount: {
		type: 'number',
		label: 'Reduction Amount',
		id: 'reductionAmount',
		default: 1,
		min: 1,
		max: 256,
	},
	userName: {
		type: 'textinput',
		label: 'single username (keep blank when you pre-select)',
		id: 'userName',
		useVariables: true,
		default: '',
	},
	meetingID: {
		type: 'textinput',
		useVariables: true,
		label: 'Meeting ID',
		id: 'meetingID',
		default: '',
	},
	path: {
		type: 'textinput',
		label: 'absolute path',
		id: 'path',
		default: '',
	},
	customArgs: {
		type: 'textinput',
		label: 'Arguments JSON style',
		id: 'customArgs',
		default: '{type: "i", value: 0}',
	},
	videoLossMode: {
		type: 'dropdown',
		label: 'Video Loss Mode',
		id: 'videoLossMode',
		choices: [
			{ id: 'Black', label: 'Black' },
			{ id: 'Freeze', label: 'Freeze' },
			{ id: 'Transparent', label: 'Transparent' },
			{ id: 'Image', label: 'Image' },
			{ id: 'Testcard', label: 'Testcard' },
		],
		default: 'Black',
	},
	intX: {
		type: 'number',
		label: 'int X',
		id: 'intX',
		min: 0,
		max: 5000,
		default: 0,
	},
	intY: {
		type: 'number',
		label: 'int Y',
		id: 'intY',
		min: 0,
		max: 5000,
		default: 0,
	},
	level: {
		type: 'number',
		label: 'Level',
		id: 'level',
		min: 0,
		max: 5,
		default: 0,
	},
	output: {
		type: 'number',
		label: 'Output',
		id: 'output',
		min: 0,
		max: 512,
		default: 1,
	},
	count: {
		type: 'number',
		label: 'count',
		id: 'count',
		min: 0,
		max: 512,
		default: 1,
	},
	mode: {
		type: 'number',
		label: 'Mode',
		id: 'mode',
		min: 0,
		max: 5,
		default: 0,
	},
	id: {
		type: 'number',
		label: 'ID',
		id: 'id',
		min: 0,
		max: 99999999,
		default: 0,
	},
	password: {
		type: 'textinput',
		label: 'Password(optional)',
		id: 'password',
		default: '',
	},
	zak: {
		type: 'textinput',
		useVariables: true,
		label: 'Zak',
		id: 'zak',
		default: '',
	},
	video: {
		type: 'dropdown',
		label: 'Camera on/of',
		id: 'video',
		default: 0,
		choices: [
			{ id: 0, label: 'off' },
			{ id: 1, label: 'on' },
		],
	},
	allowChooseBreakout: {
		type: 'dropdown',
		label: 'Allow Choose Breakout',
		id: 'allowChooseBreakout',
		default: 0,
		choices: [
			{ id: 0, label: 'false' },
			{ id: 1, label: 'true' },
		],
	},
	postCloseSeconds: {
		type: 'number',
		label: 'postCloseSeconds',
		id: 'postCloseSeconds',
		min: 0,
		max: 99999,
		default: 0,
	},
	allowReturnAtWill: {
		type: 'dropdown',
		label: 'Allow Return At Will',
		id: 'allowReturnAtWill',
		default: 0,
		choices: [
			{ id: 0, label: 'false' },
			{ id: 1, label: 'true' },
		],
	},
	autoMoveParticipants: {
		type: 'dropdown',
		label: 'Auto Move Participants',
		id: 'autoMoveParticipants',
		default: 0,
		choices: [
			{ id: 0, label: 'false' },
			{ id: 1, label: 'true' },
		],
	},
	useTimer: {
		type: 'dropdown',
		label: 'Use Timer',
		id: 'useTimer',
		default: 0,
		choices: [
			{ id: 0, label: 'false' },
			{ id: 1, label: 'true' },
		],
	},
	closeWithTimer: {
		type: 'dropdown',
		label: 'Close With Timer',
		id: 'closeWithTimer',
		default: 0,
		choices: [
			{ id: 0, label: 'false' },
			{ id: 1, label: 'true' },
		],
	},
	breakoutDurrationSeconds: {
		type: 'number',
		label: 'Breakout Durration Seconds',
		id: 'breakoutDurrationSeconds',
		min: 0,
		max: 99999,
		default: 0,
	},
}

/**
 * Returns a filtered array removing the requested value
 * @param arr
 * @param value
 * @returns
 */
export const arrayRemove = (arr: Array<number>, value: number): Array<number> => {
	// return arr.filter((element) => {
	// 	return element != value
	// })
	return arr.filter((element: number) => element !== value)
}

/**
 * Add's an Item to the array only when none existing
 * @param arr
 * @param value
 * @returns
 */
export const arrayAdd = (arr: Array<number>, value: number): Array<number> => {
	// const item = arr.find((element) => element === value)
	// // Create a temp array
	// const tempArr = arr
	// if (item === undefined) {
	// 	tempArr.push(value)
	// 	return tempArr
	// } else {
	// 	return tempArr
	// }

	return arr.includes(value) ? arr : [...arr, value]
}

/**
 * Add or remove an Item from the array
 * @param arr
 * @param value
 * @returns
 */
export const arrayAddRemove = (arr: Array<number>, value: number): Array<number> => {
	// // Find a index of the value (use this so we can use it for remove)
	// const index = arr.findIndex((element) => element === value)
	// // Create a temp array
	// const tempArr = arr
	// if (index === -1) {
	// 	tempArr.push(value)
	// 	return tempArr
	// } else {
	// 	tempArr.splice(index, 1)
	// 	return tempArr
	// }
	const index = arr.indexOf(value)
	if (index === -1) {
		return [...arr, value]
	} else {
		return arr.filter((_, i) => i !== index)
	}
}

/**
 * @param time Time in miliseconds or seconds
 * @param interval Interval of the time value - 'ms' or 's'
 * @param format String formatting - 'hh:mm:ss', 'hh:mm:ss.ms', 'mm:ss', or 'mm:ss.ms'
 * @returns Formated time string
 */
export const formatTime = (time: number, interval: 'ms' | 's', format: TimeFormat): string => {
	const timeMS = time * (interval === 'ms' ? 1 : 1000)
	const padding = (value: number): string => (value < 10 ? '0' + value : value.toString())

	const hh = padding(Math.floor(timeMS / 360000))
	const mm = padding(Math.floor(timeMS / 60000) % 60)
	const ss = padding(Math.floor(timeMS / 1000) % 60)
	const ms = (timeMS % 1000) / 100

	const result = `${format.includes('hh') ? `${hh}:` : ''}${mm}:${ss}${format.includes('ms') ? `.${ms}` : ''}`
	return result
}

export const padding = (num: number, size: number): string => {
	let converted = num.toString()
	while (converted.length < size) converted = '0' + converted
	return converted
}

export interface InstanceBaseExt<TConfig> extends InstanceBase<TConfig> {
	[x: string]: any
	ZoomVariableLink: ZoomVariableLinkInterface[]
	ZoomClientDataObj: ZoomClientDataObjInterface
	OSC: any
	ZoomGroupData: ZoomGroupDataInterface[]
	ZoomUserData: ZoomUserDataInterface
	ZoomOutputData: ZoomOutputDataInterface
	ZoomAudioLevelData: ZoomAudioLevelDataInterface
	ZoomAudioRoutingData: ZoomAudioRoutingDataInterface
	ZoomUserOffline: ZoomUserOfflineInterface
	config: TConfig
	InitVariables(): void
}

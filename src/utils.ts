import {
	SomeCompanionConfigField,
	CompanionInputFieldColor,
	CompanionInputFieldDropdown,
	CompanionInputFieldNumber,
	CompanionInputFieldTextWithVariablesInput,
} from '../../../instance_skel_types'

type TimeFormat = 'hh:mm:ss' | 'hh:mm:ss.ms' | 'mm:ss' | 'mm:ss.ms'

// Force options to have a default to prevent sending undefined values
type EnforceDefault<T, U> = Omit<T, 'default'> & { default: U }

enum SubscribeMode {
	None = 0,
	TargetList = 1,
	All = 2,
	Panelists = 3,
	OnlyGallery = 4,
}

export interface Options {
	mute: EnforceDefault<CompanionInputFieldDropdown, number>
	message: EnforceDefault<CompanionInputFieldTextWithVariablesInput, string>
	userSelectedInfo: SomeCompanionConfigField
	password: EnforceDefault<CompanionInputFieldTextWithVariablesInput, string>
	zak: EnforceDefault<CompanionInputFieldTextWithVariablesInput, string>
	name: EnforceDefault<CompanionInputFieldTextWithVariablesInput, string>
	userName: EnforceDefault<CompanionInputFieldTextWithVariablesInput, string>
	meetingID: EnforceDefault<CompanionInputFieldTextWithVariablesInput, string>
	intX: EnforceDefault<CompanionInputFieldNumber, number>
	intY: EnforceDefault<CompanionInputFieldNumber, number>
	level: EnforceDefault<CompanionInputFieldNumber, number>
	output: EnforceDefault<CompanionInputFieldNumber, number>
	subscribeLevel: EnforceDefault<CompanionInputFieldDropdown, number>
	mode: EnforceDefault<CompanionInputFieldNumber, number>
	id: EnforceDefault<CompanionInputFieldNumber, number>
	handRaised: EnforceDefault<CompanionInputFieldDropdown, number>
	video: EnforceDefault<CompanionInputFieldDropdown, number>
	foregroundColor: EnforceDefault<CompanionInputFieldColor, number>
	foregroundColorBlack: EnforceDefault<CompanionInputFieldColor, number>
	backgroundColorPreview: EnforceDefault<CompanionInputFieldColor, number>
	backgroundColorProgram: EnforceDefault<CompanionInputFieldColor, number>
	backgroundColorMicLive: EnforceDefault<CompanionInputFieldColor, number>
	backgroundColorYellow: EnforceDefault<CompanionInputFieldColor, number>
	backgroundColorGray: EnforceDefault<CompanionInputFieldColor, number>
	backgroundColorGroup: EnforceDefault<CompanionInputFieldColor, number>
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

export const options: Options = {
	userSelectedInfo: {
		type: 'text',
		id: 'info',
		width: 12,
		label: 'Make sure you select a user or a group first, via presets',
		value: '',
	},
	message: {
		type: 'textwithvariables',
		label: 'Message',
		id: 'msg',
		default: '',
	},
	name: {
		type: 'textwithvariables',
		label: 'Name',
		id: 'name',
		default: '',
	},
	userName: {
		type: 'textwithvariables',
		label: 'username (keep blank when you pre-select)',
		id: 'name',
		default: '',
	},
	meetingID: {
		type: 'textwithvariables',
		label: 'Meeting ID',
		id: 'meetingID',
		default: '',
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
		min: 1,
		max: 12,
		default: 1,
	},
	subscribeLevel: {
		type: 'dropdown',
		label: 'Subscribtion level',
		id: 'level',
		choices: [
			{ id: SubscribeMode.None, label: 'None' },
			{ id: SubscribeMode.TargetList, label: 'Target List' },
			{ id: SubscribeMode.All, label: 'All' },
			{ id: SubscribeMode.Panelists, label: 'Panelists' },
			{ id: SubscribeMode.OnlyGallery, label: 'Only Gallery' },
		],
		default: SubscribeMode.All,
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
		type: 'textwithvariables',
		label: 'Password(optional)',
		id: 'password',
		default: '',
	},
	zak: {
		type: 'textwithvariables',
		label: 'Zak',
		id: 'zak',
		default: '',
	},
	mute: {
		type: 'dropdown',
		label: 'Mute',
		id: 'mute',
		default: 0,
		choices: [
			{ id: 0, label: 'unmute' },
			{ id: 1, label: 'mute' },
		],
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

	handRaised: {
		type: 'dropdown',
		label: 'Handraise or lower',
		id: 'handRaised',
		default: 0,
		choices: [
			{ id: 0, label: 'raised' },
			{ id: 1, label: 'lowered' },
		],
	},

	foregroundColor: {
		type: 'colorpicker',
		label: 'Foreground color',
		id: 'fg',
		default: rgb(255, 255, 255),
	},

	foregroundColorBlack: {
		type: 'colorpicker',
		label: 'Foreground color',
		id: 'fg',
		default: rgb(0, 0, 0),
	},

	backgroundColorPreview: {
		type: 'colorpicker',
		label: 'Background color when in preview',
		id: 'bg_pvw',
		default: rgb(0, 255, 0),
	},

	backgroundColorGray: {
		type: 'colorpicker',
		label: 'Background color',
		id: 'bg',
		default: rgb(125, 125, 125),
	},

	backgroundColorGroup: {
		type: 'colorpicker',
		label: 'Background color',
		id: 'bg',
		default: rgb(125, 125, 125),
	},

	backgroundColorProgram: {
		type: 'colorpicker',
		label: 'Background color when in grogram',
		id: 'bg',
		default: rgb(255, 0, 0),
	},

	backgroundColorMicLive: {
		type: 'colorpicker',
		label: 'Background color when microphone is live',
		id: 'bg',
		default: rgb(255, 0, 0),
	},

	backgroundColorYellow: {
		type: 'colorpicker',
		label: 'Background color',
		id: 'bg',
		default: rgb(255, 255, 0),
	},
}

export const arrayRemove = (arr: Array<number>, value: number) => { 
	return arr.filter(function(element){ 
			return element != value; 
	});
}

export const arrayAddRemove = (arr: Array<number>, value: number): Array<number> => { 
	// Find a index of the value (use this so we can use it for remove)
	let index = arr.findIndex(element => element === value)
	// Create a temp array
	let tempArr = arr
	if(index === -1) {
		tempArr.push(value)
		return tempArr
	} else {
		tempArr.splice(index, 1)
		return tempArr
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

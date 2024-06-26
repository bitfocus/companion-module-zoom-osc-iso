import { Regex, SomeCompanionConfigField } from '@companion-module/base'

export interface ZoomConfig {
	label: string
	host: string
	tx_port: number
	rx_port: number
	version: number
	selectionMethod: number
	numberOfGroups: number
	pulling: number
	feedbackImagesWithIcons: number
	enableSocialStream: boolean
	socialStreamId: string
}

export const GetConfigFields = (): SomeCompanionConfigField[] => {
	return [
		{
			type: 'static-text',
			width: 12,
			value:
				'Please make sure you have the following settings corectly in your OSC/ISO client;</br>"Subscribe to:" <b>All</b></br>"Gallery Tracking Mode:" <b>ZoomID</b>',
			id: 'info on license',
			label: 'Important note',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target host',
			width: 6,
			default: '127.0.0.1',
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'tx_port',
			label: 'Sending port',
			width: 6,
			default: 9090,
			min: 1,
			max: 65535,
			step: 1,
		},
		{
			type: 'number',
			id: 'rx_port',
			label: 'Receive port',
			width: 6,
			default: 1234,
			min: 1,
			max: 65535,
			step: 1,
		},
		{
			type: 'dropdown',
			id: 'selectionMethod',
			label: 'Default selection method',
			choices: [
				{ id: 1, label: 'Single Selection' },
				{ id: 0, label: 'Multi Selection' },
			],
			default: 1,
			width: 6,
		},
		{
			type: 'dropdown',
			id: 'pulling',
			label: 'Sync iso configuration time in seconds (only for ZoomISO)',
			choices: [
				{ id: 1000, label: 'Fast (1000msec)' },
				{ id: 2500, label: 'Medium (2500msec)' },
				{ id: 5000, label: 'Slow (5000msec)' },
				{ id: 60000, label: 'Extra Slow (10000msec)' },
			],
			default: 1000,
			width: 6,
		},
		{
			type: 'number',
			id: 'numberOfGroups',
			label: 'Number of selectable groups',
			min: 1,
			max: 100,
			default: 3,
			width: 6,
		},
		{
			type: 'dropdown',
			id: 'feedbackImagesWithIcons',
			label: 'Participant Multi-State Feedback Design',
			tooltip: 'Adds icons to button for camera, mic, and hand raised state',
			choices: [
				{ id: 0, label: 'Bottom (On and Off For Mic/Camera, Only on for Hand Raise)' },
				{ id: 2, label: 'Bottom (Only Active States)' },
				{ id: 3, label: 'Bottom (On and Off States)' },
				{ id: 4, label: 'Disable' },
			],
			default: 1,
			width: 6,
		},
		{
			type: 'static-text',
			width: 12,
			value:
				'If you are using the lite version of ZoomOSC or ZoomISO, some core functionality like the gallery tracking will not work as it requires commands that are only available in the PRO version and ZoomISO is limitged to a maximum of 4 outputs.  As well, only the actions that are not listed as PRO in the <a target="_blank" href="https://www.liminalet.com/zoomosc-resources">ZoomOSC API/Command List</a> and the <a target="_blank" href="https://www.liminalet.com/zoomiso">ZoomISO Documentation (User Guide)</a> work with the lite version',
			id: 'liteNote',
			label: 'If You Are Using The Lite Version',
		},
		{
			type: 'checkbox',
			id: 'enableSocialStream',
			width: 12,
			default: false,
			label: 'Enable Social Stream for Chat',
			tooltip: 'Sent all Chat Message to Social Stream Ninja',
		},
		{
			type: 'textinput',
			id: 'socialStreamId',
			label: 'Session Id for Social Stream',
			width: 12,
			default: '',
			isVisible: (options) => options['enableSocialStream'] === true,
		},
	]
}

import { SomeCompanionConfigField } from '@companion-module/base'

export interface ZoomConfig {
	label: string
	host: string
	tx_port: number
	rx_port: number
	version: number
	selectionMethod: number
	numberOfGroups: number
	pulling: number
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
		// {
		// 	type: 'dropdown',
		// 	id: 'version',
		// 	label: 'Using ZoomOSC or ZoomISO',
		// 	choices: [
		// 		{ id: ZoomVersion.ZoomISO, label: 'ZoomISO' },
		// 		{ id: ZoomVersion.ZoomOSC, label: 'ZoomOSC' },
		// 	],
		// 	default: ZoomVersion.ZoomOSC,
		// 	width: 6,
		// },
		{
			type: 'dropdown',
			id: 'pulling',
			label: 'Sync iso configuration time in seconds (only for ZoomISO)',
			choices: [
				{ id: 1000, label: 'Fast (1000msec)' },
				{ id: 2500, label: 'Medium (2500msec)' },
				{ id: 5000, label: 'Slow (5000msec)' },
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
			default: 2,
			width: 6,
		},
	]
}

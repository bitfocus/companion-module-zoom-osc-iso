import { SomeCompanionConfigField } from '../../../instance_skel_types'

export interface Config {
	label: string
	host: string
	tx_port: number
	rx_port: number
	selectionMethod: number
	numberOfGroups: number
}

export const getConfigFields = (): SomeCompanionConfigField[] => {
	return [
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

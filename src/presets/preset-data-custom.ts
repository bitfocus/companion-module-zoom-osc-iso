import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { ActionIdGlobalGalleryTrackingAndDataRequest } from '../actions/action-global-gallery-tracking-and-data-request.js'
import { ActionIdCustom } from '../actions/action-custom.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { ActionIdGlobal } from '../actions/action-global.js'
import { ActionIdGlobalBreakoutRooms } from '../actions/action-global-breakout-rooms.js'
import { ActionIdGlobalMemoryManagement } from '../actions/action-global-memory-management.js'

export enum PresetIdDataCustom {
	ping = 'Ping',
	requestListParticipants = 'Request_List_Participants',
	requestListOfBreakoutRooms = 'Request_List_of_Breakout_Rooms',
	requestGalleryOrder = 'Request_Gallery_Order',
	requestGalleryCount = 'Request_Gallery_Count',
	customCommand = 'Custom_Command',
	customCommandWithArguments = 'Custom_Command_with_Arguments',
}

export function GetPresetsDataCustom(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdDataCustom]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		/**
		 * Data and Custom Actions
		 */
		[PresetIdDataCustom.ping]: {
			type: 'simple',
			name: `Ping`,
			style: {
				text: `Ping`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobal.pingZoomOSC,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},

		[PresetIdDataCustom.requestListParticipants]: {
			type: 'simple',
			name: `Request_List_Participants`,
			style: {
				text: `Request List of Participants`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobalMemoryManagement.listUsers,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},

		[PresetIdDataCustom.requestListOfBreakoutRooms]: {
			type: 'simple',
			name: `Request_List_of_Breakout_Rooms`,
			style: {
				text: `Request List of Breakout Rooms`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobalBreakoutRooms.requestListOfBreakoutRooms,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},

		[PresetIdDataCustom.requestGalleryOrder]: {
			type: 'simple',
			name: `Request_Gallery_Order`,
			style: {
				text: `Request Gallery Order`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfGalleryView,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},

		[PresetIdDataCustom.requestGalleryCount]: {
			type: 'simple',
			name: `Request_Gallery_Count`,
			style: {
				text: `Request Gallery Count`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobalGalleryTrackingAndDataRequest.requestGalleryCountNew,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},

		[PresetIdDataCustom.customCommand]: {
			type: 'simple',
			name: `Custom_Command`,
			style: {
				text: `Custom Command`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdCustom.customCommand,
							options: { path: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},

		[PresetIdDataCustom.customCommandWithArguments]: {
			type: 'simple',
			name: `Custom_Command_with_Arguments`,
			style: {
				text: `Custom Command with Arguments`,
				size: '7',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdCustom.customCommandWithArguments,
							options: { path: '', customArgs: '{type: "i", value: 0}' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	}

	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'data_custom',
		name: 'Data and Custom Actions',
		definitions: Object.values(PresetIdDataCustom),
	}

	return { section, presets }
}

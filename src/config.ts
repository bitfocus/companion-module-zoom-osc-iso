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
	enableVariablesForEachUser: boolean
	enableVariablesForParticipants: boolean
	enableActionPresetAndFeedbackSync: boolean
	enableSocialStream: boolean
	socialStreamId: string
	socialStreamQuestionPrefix: string
	socialStreamChatTypeToSend: number[]
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
			type: 'static-text',
			width: 12,
			value:
				'If you are using the lite version of ZoomOSC or ZoomISO, some core functionality like the gallery tracking will not work as it requires commands that are only available in the PRO version and ZoomISO is limitged to a maximum of 4 outputs.  As well, only the actions that are not listed as PRO in the <a target="_blank" href="https://www.liminalet.com/zoomosc-resources">ZoomOSC API/Command List</a> and the <a target="_blank" href="https://www.liminalet.com/zoomiso">ZoomISO Documentation (User Guide)</a> work with the lite version',
			id: 'liteNote',
			label: 'If You Are Using The Lite Version',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'ZoomISO/ZoomOSC Transmission IP (e.g. Target host)',
			width: 6,
			default: '127.0.0.1',
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'tx_port',
			label: 'ZoomISO/ZoomOSC Receiving Port',
			width: 6,
			default: 9090,
			min: 1,
			max: 65535,
			step: 1,
		},
		{
			type: 'number',
			id: 'rx_port',
			label: 'ZoomISO/ZoomOSC Transmission Port',
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
			min: 0,
			max: 100,
			default: 3,
			width: 6,
		},
		{
			type: 'dropdown',
			id: 'pulling',
			label: 'Sync iso configuration time in seconds (only for ZoomISO)',
			tooltip: 'How often to update the ZoomISO audioLevels, outputRouting, audioRouting, and engineState',
			choices: [
				{ id: 1000, label: 'Fast (1 second) - Recommended' },
				{ id: 2500, label: 'Medium (2.5 seconds)' },
				{ id: 5000, label: 'Slow (5 seconds)' },
				{ id: 10000, label: 'Extra Slow (10 seconds)' },
			],
			default: 1000,
			width: 12,
		},
		{
			type: 'dropdown',
			id: 'feedbackImagesWithIcons',
			label: 'Participant Multi-State Feedback',
			tooltip: 'If enabled, adds icons to bottom of button for camera, mic, and hand raised state',
			choices: [
				{ id: 0, label: 'Bottom (On and Off For Mic/Camera, Only on for Hand Raise) - Recommended' },
				{ id: 2, label: 'Bottom (Only Active States)' },
				{ id: 3, label: 'Bottom (On and Off States)' },
				{ id: 4, label: 'Disable - Only If You Do Not Need To See Camera, Mic, and Hand Raised State' },
			],
			default: 0,
			width: 12,
		},
		{
			type: 'static-text',
			width: 12,
			value: '<hr>',
			id: 'hr1',
			label: '',
		},
		{
			type: 'static-text',
			width: 12,
			value:
				'If you would like to send the Zoom chat messages to <a target="blank" href="https://github.com/steveseguin/social_stream">Social Stream Ninja</a>, enable the integration below and add your Session Id.  See module help for how to configure social stream ninja.',
			id: 'socialStreamNote',
			label: 'Sent Zoom Chat to Social Stream Ninja',
		},
		{
			type: 'checkbox',
			id: 'enableSocialStream',
			width: 2,
			default: false,
			label: 'Enable',
		},
		{
			type: 'textinput',
			id: 'socialStreamId',
			label: 'Session Id for Social Stream',
			width: 5,
			default: '',
			isVisible: (options) => options['enableSocialStream'] === true,
		},
		{
			type: 'textinput',
			id: 'socialStreamQuestionPrefix',
			label: 'Prefix for Zoom Q&A Questions',
			width: 5,
			default: '',
			isVisible: (options) => options['enableSocialStream'] === true,
		},
		{
			type: 'static-text',
			width: 2,
			value: '',
			id: 'socialStreamNote2',
			label: '',
		},
		{
			type: 'multidropdown',
			id: 'socialStreamChatTypeToSend',
			label: 'Chat Message Type to Send to Social Stream',
			default: [0, 1, 2],
			choices: [
				{ id: 0, label: 'None' },
				{ id: 1, label: 'All' },
				{ id: 2, label: 'All Panelist' },
				{ id: 3, label: 'Individual Panelist (DM)' },
				{ id: 4, label: 'Individual (DM)' },
				{ id: 5, label: 'Waiting Room' },
			],
			minChoicesForSearch: 0,
			width: 10,
			isVisible: (options) => options['enableSocialStream'] === true,
		},
		{
			type: 'static-text',
			width: 12,
			value:
				'<hr />Advanced - Optional Performance Tweaks<br /><b>IMPORTANT NOTE: The section below is for power users that would like to tweak the module performance. </b><br /><br />Depending on your usage of ZoomOSC and ZoomISO, there may be things going on behind the scenes that you may not be using and can disable to try to get even better performance from this module.',
			id: 'socialStreamNote',
			label: '',
		},
		{
			type: 'static-text',
			width: 12,
			value:
				'<hr /><b>Enable Variable For Each User (variables that are the ZoomId for each participant).</b><p>For larger meetings this could impact performance tracking of us to 1,000 users.  This only impacts using variables on your buttons to get a participant by their ZoomId which does change each time they join the meeting.</p><p><b>Note:</b> Set to true keep the behavior of previous versions.</p>',
			id: 'enableVariablesForEachUserNote',
			label: '',
		},
		{
			type: 'checkbox',
			id: 'enableVariablesForEachUser',
			width: 12,
			default: true,
			label: 'Enable Variable For Each User',
		},
		{
			type: 'static-text',
			width: 12,
			value:
				'<hr /><b>Enable Variable For Participants (e.g. Participant001 to Participant999)</b><p>Enable Variable For Participants.  This impacts the participant presets, participant buttons, and participant variables. For many shows, these buttons are not used as it is the list of all participants in the order that they joined and for large meetings, it is typically quicker to find a person using the Zoom participant list and manually taking action on them.</p><p><b>Note:</b> Set to true keep the behavior of previous versions.</p>',
			id: 'actionPresetAndFeedbackSyncNote',
			label: '',
		},
		{
			type: 'checkbox',
			id: 'enableVariablesForParticipants',
			width: 12,
			default: true,
			label: 'Enable Variable For Participants',
		},
		{
			type: 'static-text',
			width: 12,
			value:
				'<hr /><b>Sync Action/Presets/Feedbacks</b><p>As participants, groups, and zISO are updated behind the scenes, it is <ol><li>Keeping the option dropdown for the actions updated with the participant names, group names, zISO output/ audio names, zISO audio levels </li><li>Keeping the presets updated for the number of participant names, group names, zISO output / audio names</li><li>Keeping the feedbacks option dropdowns updated with the participant and group names.</li></ol>Keeping all these in sync is important and needed when setting up your button layout but typically when you are running the show you are not pulling in new presets, adding / removing groups, or picking a different options from the option dropdowns.</p><p><b>Note 1:</b> Set to true keep the behavior of previous versions.</p><p><b>Note 2:</b> If you do need to sync the values manually, there is a new action called "Update Actions/Feedbacks/Presets with current Zoom Data"</p>',
			id: 'actionPresetAndFeedbackSyncNote',
			label: '',
		},
		{
			type: 'checkbox',
			id: 'enableActionPresetAndFeedbackSync',
			width: 12,
			default: true,
			label: 'Enable Sync Action/Presets/Feedbacks',
		},
	]
}

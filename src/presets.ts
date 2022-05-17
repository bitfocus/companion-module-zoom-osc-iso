import { CompanionPreset } from '../../../instance_skel_types'
import ZoomInstance from './index'
import { GlobalActionCallbacks } from './actions'
import { FeedbackCallbacks } from './feedback'
// const UserActions = require('./osccommands').UserActions
const GlobalActions = require('./osccommands').GlobalActions

// export type PresetCategory =
//   | 'Player | play'
//   | 'Macro'
//   | 'Multiviewer'
//   | 'Switching'
//   | 'Transition'
//   | 'Snapshots'
//   | 'Audio Mute'
// 	| 'AUX'

// interface ZoomUserPresetAdditions {
// 	category: string
// 	actions: UserActionCallbacks[]
// 	release_actions?: UserActionCallbacks[]
// 	feedbacks: FeedbackCallbacks[]
// }
interface ZoomGlobalPresetAdditions {
	category: string
	actions: GlobalActionCallbacks[]
	release_actions?: GlobalActionCallbacks[]
	feedbacks: FeedbackCallbacks[]
}

// interface userActionType {
// 	shortDescription: string
// 	command: string
// 	description: string
// }

export type ZoomPreset = Exclude<CompanionPreset, 'category' | 'actions' | 'release_actions' | 'feedbacks'> &
ZoomGlobalPresetAdditions

export function getPresets(instance: ZoomInstance): ZoomPreset[] {
	let presets: ZoomPreset[] = []
	// Switch INPUT per Layer
	// UserActions.forEach((userAction: userActionType) => {
	// 	presets.push({
	// 		category: 'User Presets',
	// 		label: userAction.shortDescription,
	// 		bank: {
	// 			style: 'text',
	// 			text: userAction.shortDescription,
	// 			size: 'auto',
	// 			color: instance.rgb(255, 255, 255),
	// 			bgcolor: instance.rgb(0, 0, 0),
	// 		},
	// 		actions: [{ action: userAction.description, options: { args: '', user: '', command: ''} }],
	// 		feedbacks: [],
	// 	})
	// });

	for (const key in GlobalActions) {
		if (Object.prototype.hasOwnProperty.call(GlobalActions, key)) {
			const element = GlobalActions[key]
			console.log(element.description);
			
			presets.push({
				category: 'Global Presets',
				label: element.shortDescription,
				bank: {
					style: 'text',
					text: element.shortDescription,
					size: 'auto',
					color: instance.rgb(255, 255, 255),
					bgcolor: instance.rgb(0, 0, 0),
				},
				actions: [{ action: element.shortDescription, options: {command: element.command} }],
				feedbacks: [],
			})
		}
	}
	
	return presets
}

import { CompanionActionEventInfo, CompanionActionEvent, SomeCompanionInputField } from '../../../instance_skel_types'
import ZoomInstance from './index'
import { options } from './utils'

const UserActions = require('./osccommands').UserActions
const GlobalActions = require('./osccommands').GlobalActions

export interface ZoomActions {
	// UserAction
	Pin: ZoomAction<UserActionCallback>
	AddPin: ZoomAction<UserActionCallback>
	Mute: ZoomAction<UserActionCallback>
	Unmute: ZoomAction<UserActionCallback>
	SelectUser: ZoomAction<UserActionCallback>
	SendAChatViaDM: ZoomAction<UserActionCallback>
	UserVideoOnOutputOutput: ZoomAction<UserActionCallback>
	UserVideoOffOutputOutput: ZoomAction<UserActionCallback>
	// Global Actions
	EnableUsersUnmute: ZoomAction<GlobalActionCallback>
	// Index signature
	[key: string]: ZoomAction<any>
}

// UserAction
interface UserActionCallback {
	action: string
	options: Readonly<{
		args: string
		user: string
		command: string
		msg?: string
		breakoutRoom?: string
	}>
}

interface GlobalActionCallback {
	action: string
	options: Readonly<{
		command: string
	}>
}

export type UserActionCallbacks = UserActionCallback

export type GlobalActionCallbacks = GlobalActionCallback

// Force options to have a default to prevent sending undefined values
type InputFieldWithDefault = Exclude<SomeCompanionInputField, 'default'> & { default: string | number | boolean | null }
// type InputField = SomeCompanionInputField

// Actions specific to Zoom
export interface ZoomAction<T> {
	label: string
	description?: string
	options: InputFieldWithDefault[]
	callback: (
		action: Readonly<Omit<CompanionActionEvent, 'options' | 'id'> & T>,
		info: Readonly<CompanionActionEventInfo | null>
	) => void
	subscribe?: (action: Readonly<Omit<CompanionActionEvent, 'options' | 'id'> & T>) => void
	unsubscribe?: (action: Readonly<Omit<CompanionActionEvent, 'options' | 'id'> & T>) => void
}

export function getActions(instance: ZoomInstance): ZoomActions {
	let selectedCallers = instance.ZoomClientDataObj.selectedCallers
	// Make list of users ready for Companion
	let CHOICES_USERS = [{ id: '', label: 'no users' }]
	let CHOICES_USERS_DEFAULT = '0'
	if (instance.ZoomUserData.length !== 0) {
		CHOICES_USERS = instance.ZoomUserData.filter((n) => n).map((id) => ({
			id: id.zoomId.toString(),
			label: id.userName,
		}))
		CHOICES_USERS_DEFAULT = CHOICES_USERS.find((element) => element !== undefined)
			? CHOICES_USERS.find((element) => element !== undefined)!.id
			: '0'
	}
	// let CHOICES_BREAKOUTROOMS = [{ id: '', label: 'no breakout rooms' }]

	let userOption: InputFieldWithDefault = {
		type: 'dropdown',
		label: 'User',
		id: 'user',
		default: CHOICES_USERS_DEFAULT,
		choices: CHOICES_USERS,
	}

	// let breakoutOption: InputField = {
	// 	type: 'dropdown',
	// 	label: 'Breakout',
	// 	id: 'breakoutRoom',
	// 	multiple: false,
	// 	default: '',
	// 	choices: CHOICES_BREAKOUTROOMS,
	// }

	const sendUserActionCommand = (
		action: Readonly<UserActionCallbacks>,
		_info?: CompanionActionEventInfo | null
	): void => {
		// Construct command
		let oscPath = `/zoom/zoomID${action.options.command}`
		let args = action.options.args
		if (instance.OSC) instance.OSC.sendCommand(oscPath, args)
	}

	const sendGlobalActionCommand = (
		action: Readonly<GlobalActionCallbacks>,
		_info?: CompanionActionEventInfo | null
	): void => {
		// Construct command
		let oscPath = action.options.command
		if (instance.OSC) instance.OSC.sendCommand(oscPath)
	}

	// Create all User Actions
	let returningUserActionsObj = UserActions
	for (const key in returningUserActionsObj) {
		if (Object.prototype.hasOwnProperty.call(returningUserActionsObj, key)) {
			const element = returningUserActionsObj[key]
			element.label = element.description
			element.options = [userOption]
			element.callback = () => {
				const sendToCommand: any = {
					id: element.shortDescription,
					options: {
						args: { type: 'i', value: selectedCallers },
						command: element.command,
					},
				}
				sendUserActionCommand(sendToCommand)
			}
		}
	}

	// Create all Global actions
	let returningGlobalActionsObj = GlobalActions
	for (const key in returningGlobalActionsObj) {
		if (Object.prototype.hasOwnProperty.call(returningGlobalActionsObj, key)) {
			const element = returningGlobalActionsObj[key]
			element.label = element.description
			if (element.args && element.args[0] === 'msg') {
				element.options = [options.message]
				element.callback = (action: { options: { msg: any } }) => {
					const sendToCommand: any = {
						id: element.shortDescription,
						options: {
							command: element.command,
							args: { type: 's', value: action.options.msg },
						},
					}
					sendGlobalActionCommand(sendToCommand)
				}
			} else {
				element.options = []
				element.callback = () => {
					const sendToCommand: any = {
						id: element.shortDescription,
						options: {
							command: element.command,
						},
					}
					sendGlobalActionCommand(sendToCommand)
				}
			}
		}
	}

	let extraActions = {
		// User Actions
		SelectUser: {
			label: 'Preselect user',
			options: [userOption],
			callback: (action: { options: { user: number } }) => {
				instance.ZoomClientDataObj.selectedCallers[0] = action.options.user
				instance.checkFeedbacks('selectedUser')
			},
		},
	}

	return { ...extraActions, ...returningUserActionsObj, ...returningGlobalActionsObj }
	// 	Pin: {
	// 		label: 'User action: Pin User',
	// 		options: [],
	// 		callback: () => {
	// 			const Pin: any = {
	// 				id: 'Pin',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.Pin.command,
	// 				},
	// 			}
	// 			sendUserActionCommand(Pin)
	// 		},
	// 	},
	// 	AddPin: {
	// 		label: 'User action: Add pin',
	// 		options: [],
	// 		callback: () => {
	// 			const AddPin: any = {
	// 				id: 'AddPin',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.AddPin,
	// 				},
	// 			}
	// 			sendUserActionCommand(AddPin)
	// 		},
	// 	},
	// 	Unpin: {
	// 		label: 'User action: Un pin',
	// 		options: [],
	// 		callback: () => {
	// 			const Unpin: any = {
	// 				id: 'Unpin',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.Unpin,
	// 				},
	// 			}
	// 			sendUserActionCommand(Unpin)
	// 		},
	// 	},
	// 	ClearPins: {
	// 		label: 'User action: Clear Pins',
	// 		options: [],
	// 		callback: () => {
	// 			const ClearPins: any = {
	// 				id: 'ClearPins',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.ClearPins,
	// 				},
	// 			}
	// 			sendUserActionCommand(ClearPins)
	// 		},
	// 	},
	// 	TogglePin: {
	// 		label: 'User action: Toggle Pin',
	// 		options: [],
	// 		callback: () => {
	// 			const TogglePin: any = {
	// 				id: 'TogglePin',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.TogglePin,
	// 				},
	// 			}
	// 			sendUserActionCommand(TogglePin)
	// 		},
	// 	},
	// 	PinScreen2: {
	// 		label: 'User action: Pin Screen 2',
	// 		options: [],
	// 		callback: () => {
	// 			const PinScreen2: any = {
	// 				id: 'PinScreen2',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.PinScreen2,
	// 				},
	// 			}
	// 			sendUserActionCommand(PinScreen2)
	// 		},
	// 	},
	// 	UnpinScreen2: {
	// 		label: 'User action: Un pin Screen 2',
	// 		options: [],
	// 		callback: () => {
	// 			const UnpinScreen2: any = {
	// 				id: 'UnpinScreen2',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.UnpinScreen2,
	// 				},
	// 			}
	// 			sendUserActionCommand(UnpinScreen2)
	// 		},
	// 	},
	// 	ClearPinsScreen2: {
	// 		label: 'User action: Clear Pins Screen 2',
	// 		options: [],
	// 		callback: () => {
	// 			const ClearPinsScreen2: any = {
	// 				id: 'ClearPinsScreen2',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.ClearPinsScreen2,
	// 				},
	// 			}
	// 			sendUserActionCommand(ClearPinsScreen2)
	// 		},
	// 	},
	// 	TogglePinScreen2: {
	// 		label: 'User action: Toggle Pin Screen 2',
	// 		options: [],
	// 		callback: () => {
	// 			const TogglePinScreen2: any = {
	// 				id: 'TogglePinScreen2',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.TogglePinScreen2,
	// 				},
	// 			}
	// 			sendUserActionCommand(TogglePinScreen2)
	// 		},
	// 	},
	// 	RemotePin: {
	// 		label: 'User action: RemotePin',
	// 		options: [],
	// 		callback: () => {
	// 			const RemotePin: any = {
	// 				id: 'RemotePin',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.RemotePin,
	// 				},
	// 			}
	// 			sendUserActionCommand(RemotePin)
	// 		},
	// 	},
	// 	RemoteAddPin: {
	// 		label: 'User action: Remote Add Pin',
	// 		options: [],
	// 		callback: () => {
	// 			const RemoteAddPin: any = {
	// 				id: 'RemoteAddPin',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.RemoteAddPin,
	// 				},
	// 			}
	// 			sendUserActionCommand(RemoteAddPin)
	// 		},
	// 	},
	// 	RemoteUnpin: {
	// 		label: 'User action: RemoteUnpin',
	// 		options: [],
	// 		callback: () => {
	// 			const RemoteUnpin: any = {
	// 				id: 'RemoteUnpin',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.RemoteUnpin,
	// 				},
	// 			}
	// 			sendUserActionCommand(RemoteUnpin)
	// 		},
	// 	},
	// 	RemoteClearPin: {
	// 		label: 'User action: Remote Clear Pin',
	// 		options: [],
	// 		callback: () => {
	// 			const RemoteClearPin: any = {
	// 				id: 'RemoteClearPin',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.RemoteClearPin,
	// 				},
	// 			}
	// 			sendUserActionCommand(RemoteClearPin)
	// 		},
	// 	},
	// 	RemoteTogglePin: {
	// 		label: 'User action: Remote Toggle Pin',
	// 		options: [],
	// 		callback: () => {
	// 			const RemoteTogglePin: any = {
	// 				id: 'RemoteTogglePin',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.RemoteTogglePin,
	// 				},
	// 			}
	// 			sendUserActionCommand(RemoteTogglePin)
	// 		},
	// 	},
	// 	RemotePinScreen2: {
	// 		label: 'User action: Remote Pin Screen 2',
	// 		options: [],
	// 		callback: () => {
	// 			const RemotePinScreen2: any = {
	// 				id: 'RemotePinScreen2',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.RemotePinScreen2,
	// 				},
	// 			}
	// 			sendUserActionCommand(RemotePinScreen2)
	// 		},
	// 	},
	// 	RemoteUnpinScreen2: {
	// 		label: 'User action: Remote Unpin Screen 2',
	// 		options: [],
	// 		callback: () => {
	// 			const RemoteUnpinScreen2: any = {
	// 				id: 'RemoteUnpinScreen2',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.RemoteUnpinScreen2,
	// 				},
	// 			}
	// 			sendUserActionCommand(RemoteUnpinScreen2)
	// 		},
	// 	},
	// 	RemoteClearPinScreen2: {
	// 		label: 'User action: Remote Clear Pin Screen 2',
	// 		options: [],
	// 		callback: () => {
	// 			const RemoteClearPinScreen2: any = {
	// 				id: 'RemoteClearPinScreen2',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.RemoteClearPinScreen2,
	// 				},
	// 			}
	// 			sendUserActionCommand(RemoteClearPinScreen2)
	// 		},
	// 	},
	// 	RemoteTogglePinScreen2: {
	// 		label: 'User action: Remote Toggle Pin Screen 2',
	// 		options: [],
	// 		callback: () => {
	// 			const RemoteTogglePinScreen2: any = {
	// 				id: 'RemoteTogglePinScreen2',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.RemoteTogglePinScreen2,
	// 				},
	// 			}
	// 			sendUserActionCommand(RemoteTogglePinScreen2)
	// 		},
	// 	},
	// 	Spotlight: {
	// 		label: 'User action: Spotlight',
	// 		options: [],
	// 		callback: () => {
	// 			const Spotlight: any = {
	// 				id: 'Spotlight',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.Spotlight,
	// 				},
	// 			}
	// 			sendUserActionCommand(Spotlight)
	// 		},
	// 	},
	// 	AddSpotlight: {
	// 		label: 'User action: Add Spotlight',
	// 		options: [],
	// 		callback: () => {
	// 			const AddSpotlight: any = {
	// 				id: 'AddSpotlight',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.AddSpotlight,
	// 				},
	// 			}
	// 			sendUserActionCommand(AddSpotlight)
	// 		},
	// 	},
	// 	UnSpotlight: {
	// 		label: 'User action: Un-Spotlight',
	// 		options: [],
	// 		callback: () => {
	// 			const UnSpotlight: any = {
	// 				id: 'UnSpotlight',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.UnSpotlight,
	// 				},
	// 			}
	// 			sendUserActionCommand(UnSpotlight)
	// 		},
	// 	},
	// 	ToggleSpotlight: {
	// 		label: 'User action: Toggle Spotlight',
	// 		options: [],
	// 		callback: () => {
	// 			const ToggleSpotlight: any = {
	// 				id: 'ToggleSpotlight',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.ToggleSpotlight,
	// 				},
	// 			}
	// 			sendUserActionCommand(ToggleSpotlight)
	// 		},
	// 	},
	// 	TurnVideoOn: {
	// 		label: 'User action: Turn Video On',
	// 		options: [],
	// 		callback: () => {
	// 			const TurnVideoOn: any = {
	// 				id: 'TurnVideoOn',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.TurnVideoOn,
	// 				},
	// 			}
	// 			sendUserActionCommand(TurnVideoOn)
	// 		},
	// 	},
	// 	TurnVideoOff: {
	// 		label: 'User action: Turn Video Off',
	// 		options: [],
	// 		callback: () => {
	// 			const TurnVideoOff: any = {
	// 				id: 'TurnVideoOff',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.TurnVideoOff,
	// 				},
	// 			}
	// 			sendUserActionCommand(TurnVideoOff)
	// 		},
	// 	},
	// 	ToggleVideoState: {
	// 		label: 'User action: Toggle Video State',
	// 		options: [],
	// 		callback: () => {
	// 			const ToggleVideoState: any = {
	// 				id: 'ToggleVideoState',
	// 				options: {
	// 					args: { type: 'i', value: selectedCallers },
	// 					command: UserActions.ToggleVideoState,
	// 				},
	// 			}
	// 			sendUserActionCommand(ToggleVideoState)
	// 		},
	// 	},
	// 	Mute: {
	// 		label: 'User action: Mute user',
	// 		options: [],
	// 		callback: () => {
	// 			const Mute: any = {
	// 				id: 'Mute',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.Mute,
	// 				},
	// 			}
	// 			sendUserActionCommand(Mute)
	// 		},
	// 	},
	// 	Unmute: {
	// 		label: 'User action: Unmute user',
	// 		options: [],
	// 		callback: () => {
	// 			const Unmute: any = {
	// 				id: 'Unmute',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.Unmute,
	// 				},
	// 			}
	// 			sendUserActionCommand(Unmute)
	// 		},
	// 	},
	// 	ToggleMuteState: {
	// 		label: 'User action: Toggle Mute State',
	// 		options: [],
	// 		callback: () => {
	// 			const ToggleMuteState: any = {
	// 				id: 'ToggleMuteState',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.ToggleMuteState,
	// 				},
	// 			}
	// 			sendUserActionCommand(ToggleMuteState)
	// 		},
	// 	},
	// 	SendAChatViaDM: {
	// 		label: 'User action: Send A Chat Via DM',
	// 		options: [options.message],
	// 		callback: (action) => {
	// 			const SendAChatViaDM: any = {
	// 				id: 'SendAChatViaDM',
	// 				options: {
	// 					args: [
	// 						{ type: 'i', value: selectedCallers },
	// 						{ type: 's', value: action.options.msg },
	// 					],
	// 					command: UserActions.SendAChatViaDM,
	// 				},
	// 			}
	// 			sendUserActionCommand(SendAChatViaDM)
	// 		},
	// 	},
	// 	RemoteChat: {
	// 		label: 'User action: RemoteChat',
	// 		options: [options.message],
	// 		callback: (action) => {
	// 			const RemoteChat: any = {
	// 				id: 'RemoteChat',
	// 				options: {
	// 					args: [, { type: 's', value: action.options.msg }],
	// 					command: UserActions.RemoteChat,
	// 				},
	// 			}
	// 			sendUserActionCommand(RemoteChat)
	// 		},
	// 	},
	// 	RaiseHand: {
	// 		label: 'User action: Raise Hand',
	// 		options: [],
	// 		callback: () => {
	// 			const RaiseHand: any = {
	// 				id: 'RaiseHand',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.RaiseHand,
	// 				},
	// 			}
	// 			sendUserActionCommand(RaiseHand)
	// 		},
	// 	},
	// 	LowerHand: {
	// 		label: 'User action: Lower Hand',
	// 		options: [],
	// 		callback: () => {
	// 			const LowerHand: any = {
	// 				id: 'LowerHand',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.LowerHand,
	// 				},
	// 			}
	// 			sendUserActionCommand(LowerHand)
	// 		},
	// 	},
	// 	ToggleHand: {
	// 		label: 'User action: Toggle Hand',
	// 		options: [],
	// 		callback: () => {
	// 			const ToggleHand: any = {
	// 				id: 'ToggleHand',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.ToggleHand,
	// 				},
	// 			}
	// 			sendUserActionCommand(ToggleHand)
	// 		},
	// 	},
	// 	Rename: {
	// 		label: 'User action: Rename',
	// 		options: [],
	// 		callback: () => {
	// 			const Rename: any = {
	// 				id: 'Rename',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.Rename,
	// 				},
	// 			}
	// 			sendUserActionCommand(Rename)
	// 		},
	// 	},
	// 	MakeHost: {
	// 		label: 'User action: Make Host',
	// 		options: [],
	// 		callback: () => {
	// 			const MakeHost: any = {
	// 				id: 'MakeHost',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.MakeHost,
	// 				},
	// 			}
	// 			sendUserActionCommand(MakeHost)
	// 		},
	// 	},
	// 	MakeCoHost: {
	// 		label: 'User action: Make Co-Host',
	// 		options: [],
	// 		callback: () => {
	// 			const MakeCoHost: any = {
	// 				id: 'MakeCoHost',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.MakeCoHost,
	// 				},
	// 			}
	// 			sendUserActionCommand(MakeCoHost)
	// 		},
	// 	},
	// 	RevokeCoHost: {
	// 		label: 'User action: Revoke Co-Host',
	// 		options: [],
	// 		callback: () => {
	// 			const RevokeCoHost: any = {
	// 				id: 'RevokeCoHost',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.RevokeCoHost,
	// 				},
	// 			}
	// 			sendUserActionCommand(RevokeCoHost)
	// 		},
	// 	},
	// 	ReclaimHost: {
	// 		label: 'User action: Reclaim Host',
	// 		options: [],
	// 		callback: () => {
	// 			const ReclaimHost: any = {
	// 				id: 'ReclaimHost',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.ReclaimHost,
	// 				},
	// 			}
	// 			sendUserActionCommand(ReclaimHost)
	// 		},
	// 	},
	// 	MakePanelist: {
	// 		label: 'User action: Make Panelist',
	// 		options: [],
	// 		callback: () => {
	// 			const MakePanelist: any = {
	// 				id: 'MakePanelist',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.MakePanelist,
	// 				},
	// 			}
	// 			sendUserActionCommand(MakePanelist)
	// 		},
	// 	},
	// 	MakeAttendee: {
	// 		label: 'User action: Make Attendee',
	// 		options: [],
	// 		callback: () => {
	// 			const MakeAttendee: any = {
	// 				id: 'MakeAttendee',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.MakeAttendee,
	// 				},
	// 			}
	// 			sendUserActionCommand(MakeAttendee)
	// 		},
	// 	},
	// 	EjectParticipant: {
	// 		label: 'User action: Eject Participant',
	// 		options: [],
	// 		callback: () => {
	// 			const EjectParticipant: any = {
	// 				id: 'EjectParticipant',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.EjectParticipant,
	// 				},
	// 			}
	// 			sendUserActionCommand(EjectParticipant)
	// 		},
	// 	},
	// 	SendParticipantToBreakoutRoom: {
	// 		label: 'User action: Send Participant To Breakout Room',
	// 		options: [breakoutOption],
	// 		callback: (action) => {
	// 			const SendParticipantToBreakoutRoom: any = {
	// 				id: 'SendParticipantToBreakoutRoom',
	// 				options: {
	// 					args: [
	// 						{ type: 'i', value: selectedCallers },
	// 						{ type: 'i', value: action.options.breakoutRoom },
	// 					],
	// 					command: UserActions.EjectParticipant,
	// 				},
	// 			}
	// 			sendUserActionCommand(SendParticipantToBreakoutRoom)
	// 		},
	// 	},
	// 	RemoveParticipantFromBreakoutRoom: {
	// 		label: 'User action: Remove Participant From Breakout Room',
	// 		options: [breakoutOption],
	// 		callback: (action) => {
	// 			const RemoveParticipantFromBreakoutRoom: any = {
	// 				id: 'RemoveParticipantFromBreakoutRoom',
	// 				options: {
	// 					args: [
	// 						{ type: 'i', value: selectedCallers },
	// 						{ type: 'i', value: action.options.breakoutRoom },
	// 					],
	// 					command: UserActions.RemoveParticipantFromBreakoutRoom,
	// 				},
	// 			}
	// 			sendUserActionCommand(RemoveParticipantFromBreakoutRoom)
	// 		},
	// 	},
	// 	AssignParticipantToBreakoutRoom: {
	// 		label: 'User action: Assign Participant To Breakout Room',
	// 		options: [breakoutOption],
	// 		callback: (action) => {
	// 			const AssignParticipantToBreakoutRoom: any = {
	// 				id: 'AssignParticipantToBreakoutRoom',
	// 				options: {
	// 					args: [
	// 						{ type: 'i', value: selectedCallers },
	// 						{ type: 'i', value: action.options.breakoutRoom },
	// 					],
	// 					command: UserActions.AssignParticipantToBreakoutRoom,
	// 				},
	// 			}
	// 			sendUserActionCommand(AssignParticipantToBreakoutRoom)
	// 		},
	// 	},
	// 	UnassignParticipantFromBreakoutRoom: {
	// 		label: 'User action: Unassign Participant From Breakout Room',
	// 		options: [breakoutOption],
	// 		callback: (action) => {
	// 			const UnassignParticipantFromBreakoutRoom: any = {
	// 				id: 'UnassignParticipantFromBreakoutRoom',
	// 				options: {
	// 					args: [
	// 						{ type: 'i', value: selectedCallers },
	// 						{ type: 'i', value: action.options.breakoutRoom },
	// 					],
	// 					command: UserActions.UnassignParticipantFromBreakoutRoom,
	// 				},
	// 			}
	// 			sendUserActionCommand(UnassignParticipantFromBreakoutRoom)
	// 		},
	// 	},
	// 	ReturnSelfToMainMeeting: {
	// 		label: 'User action: Return Self To Main Meeting',
	// 		options: [],
	// 		callback: () => {
	// 			const ReturnSelfToMainMeeting: any = {
	// 				id: 'ReturnSelfToMainMeeting',
	// 				options: {
	// 					user: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.ReturnSelfToMainMeeting,
	// 				},
	// 			}
	// 			sendUserActionCommand(ReturnSelfToMainMeeting)
	// 		},
	// 	},
	// 	AdmitSomeoneFromWaitingRoom: {
	// 		label: 'User action: Admit Someone From Waiting Room',
	// 		options: [],
	// 		callback: () => {
	// 			const AdmitSomeoneFromWaitingRoom: any = {
	// 				id: 'AdmitSomeoneFromWaitingRoom',
	// 				options: {
	// 					user: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.AdmitSomeoneFromWaitingRoom,
	// 				},
	// 			}
	// 			sendUserActionCommand(AdmitSomeoneFromWaitingRoom)
	// 		},
	// 	},
	// 	SendSomeoneToWaitingRoom: {
	// 		label: 'User action: Send Someone To Waiting Room',
	// 		options: [],
	// 		callback: () => {
	// 			const SendSomeoneToWaitingRoom: any = {
	// 				id: 'SendSomeoneToWaitingRoom',
	// 				options: {
	// 					user: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.SendSomeoneToWaitingRoom,
	// 				},
	// 			}
	// 			sendUserActionCommand(SendSomeoneToWaitingRoom)
	// 		},
	// 	},
	// 	AllowWebinarAttendeeToSpeak: {
	// 		label: 'User action: Allow Webinar Attendee To Speak',
	// 		options: [],
	// 		callback: () => {
	// 			const AllowWebinarAttendeeToSpeak: any = {
	// 				id: 'AllowWebinarAttendeeToSpeak',
	// 				options: {
	// 					user: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.AllowWebinarAttendeeToSpeak,
	// 				},
	// 			}
	// 			sendUserActionCommand(AllowWebinarAttendeeToSpeak)
	// 		},
	// 	},
	// 	ShutUpWebinarAttendee: {
	// 		label: 'User action: ShutUp Webinar Attendee',
	// 		options: [],
	// 		callback: () => {
	// 			const ShutUpWebinarAttendee: any = {
	// 				id: 'ShutUpWebinarAttendee',
	// 				options: {
	// 					user: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.ShutUpWebinarAttendee,
	// 				},
	// 			}
	// 			sendUserActionCommand(ShutUpWebinarAttendee)
	// 		},
	// 	},

	// 	UserVideoOnOutputOutput: {
	// 		label: 'User action: Camera on for user',
	// 		options: [],
	// 		callback: () => {
	// 			const UserVideoOnOutputOutput: any = {
	// 				id: 'UserVideoOnOutputOutput',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.UserVideoOnOutputOutput,
	// 				},
	// 			}
	// 			sendUserActionCommand(UserVideoOnOutputOutput)
	// 		},
	// 	},
	// 	UserVideoOffOutputOutput: {
	// 		label: 'User action: Camera off for user',
	// 		options: [],
	// 		callback: () => {
	// 			const UserVideoOffOutputOutput: any = {
	// 				id: 'UserVideoOffOutputOutput',
	// 				options: {
	// 					args: [{ type: 'i', value: selectedCallers }],
	// 					command: UserActions.UserVideoOffOutputOutput,
	// 				},
	// 			}
	// 			sendUserActionCommand(UserVideoOffOutputOutput)
	// 		},
	// 	},
	// 	// Global actions
	// 	MuteAll: {
	// 		label: 'User action: Mute All',
	// 		options: [],
	// 		callback: () => {
	// 			const MuteAll: any = {
	// 				id: 'MuteAll',
	// 				options: {
	// 					command: UserActions.MuteAll,
	// 				},
	// 			}
	// 			sendGlobalActionCommand(MuteAll)
	// 		},
	// 	},
	// 	UnmuteAll: {
	// 		label: 'User action: Unmute All',
	// 		options: [],
	// 		callback: () => {
	// 			const UnmuteAll: any = {
	// 				id: 'UnmuteAll',
	// 				options: {
	// 					command: UserActions.UnmuteAll,
	// 				},
	// 			}
	// 			sendGlobalActionCommand(UnmuteAll)
	// 		},
	// 	},
	// 	EnableUsersUnmute: {
	// 		label: 'Global action: Enable Users to Unmute',
	// 		options: [],
	// 		callback: () => {
	// 			const EnableUsersToUnmute: any = {
	// 				id: 'EnableUsersUnmute',
	// 				options: {
	// 					command: GlobalActions.EnableUsersToUnmute,
	// 				},
	// 			}
	// 			sendGlobalActionCommand(EnableUsersToUnmute)
	// 		},
	// 	},
	// }
}

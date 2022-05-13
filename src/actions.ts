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
type InputField = SomeCompanionInputField

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
	let CHOICES_BREAKOUTROOMS = [{ id: '', label: 'no breakout rooms' }]

	let userOption: InputFieldWithDefault = {
		type: 'dropdown',
		label: 'User',
		id: 'user',
		default: CHOICES_USERS_DEFAULT,
		choices: CHOICES_USERS,
	}

	let breakoutOption: InputField = {
		type: 'dropdown',
		label: 'Breakout',
		id: 'breakoutRoom',
		multiple: false,
		default: '',
		choices: CHOICES_BREAKOUTROOMS,
	}

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

	return {
		// User Actions
		Pin: {
			label: 'User action: Pin User',
			options: [userOption],
			callback: (action) => {
				const Pin: any = {
					id: 'Pin',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.Pin,
					},
				}
				sendUserActionCommand(Pin)
			},
		},
		AddPin: {
			label: 'User action: Add pin',
			options: [userOption],
			callback: (action) => {
				const AddPin: any = {
					id: 'AddPin',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.AddPin,
					},
				}
				sendUserActionCommand(AddPin)
			},
		},
		Unpin: {
			label: 'User action: Un pin',
			options: [userOption],
			callback: (action) => {
				const Unpin: any = {
					id: 'Unpin',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.AddPin,
					},
				}
				sendUserActionCommand(Unpin)
			},
		},
		ClearPins: {
			label: 'User action: Clear Pins',
			options: [userOption],
			callback: (action) => {
				const ClearPins: any = {
					id: 'ClearPins',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.ClearPins,
					},
				}
				sendUserActionCommand(ClearPins)
			},
		},
		TogglePin: {
			label: 'User action: Toggle Pin',
			options: [userOption],
			callback: (action) => {
				const TogglePin: any = {
					id: 'TogglePin',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.TogglePin,
					},
				}
				sendUserActionCommand(TogglePin)
			},
		},
		PinScreen2: {
			label: 'User action: Pin Screen 2',
			options: [userOption],
			callback: (action) => {
				const PinScreen2: any = {
					id: 'PinScreen2',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.PinScreen2,
					},
				}
				sendUserActionCommand(PinScreen2)
			},
		},
		UnpinScreen2: {
			label: 'User action: Un pin Screen 2',
			options: [userOption],
			callback: (action) => {
				const UnpinScreen2: any = {
					id: 'UnpinScreen2',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.UnpinScreen2,
					},
				}
				sendUserActionCommand(UnpinScreen2)
			},
		},
		ClearPinsScreen2: {
			label: 'User action: Clear Pins Screen 2',
			options: [userOption],
			callback: (action) => {
				const ClearPinsScreen2: any = {
					id: 'ClearPinsScreen2',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.ClearPinsScreen2,
					},
				}
				sendUserActionCommand(ClearPinsScreen2)
			},
		},
		TogglePinScreen2: {
			label: 'User action: Toggle Pin Screen 2',
			options: [userOption],
			callback: (action) => {
				const TogglePinScreen2: any = {
					id: 'TogglePinScreen2',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.TogglePinScreen2,
					},
				}
				sendUserActionCommand(TogglePinScreen2)
			},
		},
		RemotePin: {
			label: 'User action: RemotePin',
			options: [userOption],
			callback: (action) => {
				const RemotePin: any = {
					id: 'RemotePin',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.RemotePin,
					},
				}
				sendUserActionCommand(RemotePin)
			},
		},
		RemoteAddPin: {
			label: 'User action: Remote Add Pin',
			options: [userOption],
			callback: (action) => {
				const RemoteAddPin: any = {
					id: 'RemoteAddPin',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.RemoteAddPin,
					},
				}
				sendUserActionCommand(RemoteAddPin)
			},
		},
		RemoteUnpin: {
			label: 'User action: RemoteUnpin',
			options: [userOption],
			callback: (action) => {
				const RemoteUnpin: any = {
					id: 'RemoteUnpin',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.RemoteUnpin,
					},
				}
				sendUserActionCommand(RemoteUnpin)
			},
		},
		RemoteClearPin: {
			label: 'User action: Remote Clear Pin',
			options: [userOption],
			callback: (action) => {
				const RemoteClearPin: any = {
					id: 'RemoteClearPin',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.RemoteClearPin,
					},
				}
				sendUserActionCommand(RemoteClearPin)
			},
		},
		RemoteTogglePin: {
			label: 'User action: Remote Toggle Pin',
			options: [userOption],
			callback: (action) => {
				const RemoteTogglePin: any = {
					id: 'RemoteTogglePin',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.RemoteTogglePin,
					},
				}
				sendUserActionCommand(RemoteTogglePin)
			},
		},
		RemotePinScreen2: {
			label: 'User action: Remote Pin Screen 2',
			options: [userOption],
			callback: (action) => {
				const RemotePinScreen2: any = {
					id: 'RemotePinScreen2',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.RemotePinScreen2,
					},
				}
				sendUserActionCommand(RemotePinScreen2)
			},
		},
		RemoteUnpinScreen2: {
			label: 'User action: Remote Unpin Screen 2',
			options: [userOption],
			callback: (action) => {
				const RemoteUnpinScreen2: any = {
					id: 'RemoteUnpinScreen2',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.RemoteUnpinScreen2,
					},
				}
				sendUserActionCommand(RemoteUnpinScreen2)
			},
		},
		RemoteClearPinScreen2: {
			label: 'User action: Remote Clear Pin Screen 2',
			options: [userOption],
			callback: (action) => {
				const RemoteClearPinScreen2: any = {
					id: 'RemoteClearPinScreen2',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.RemoteClearPinScreen2,
					},
				}
				sendUserActionCommand(RemoteClearPinScreen2)
			},
		},
		RemoteTogglePinScreen2: {
			label: 'User action: Remote Toggle Pin Screen 2',
			options: [userOption],
			callback: (action) => {
				const RemoteTogglePinScreen2: any = {
					id: 'RemoteTogglePinScreen2',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.RemoteTogglePinScreen2,
					},
				}
				sendUserActionCommand(RemoteTogglePinScreen2)
			},
		},
		Spotlight: {
			label: 'User action: Spotlight',
			options: [userOption],
			callback: (action) => {
				const Spotlight: any = {
					id: 'Spotlight',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.Spotlight,
					},
				}
				sendUserActionCommand(Spotlight)
			},
		},
		AddSpotlight: {
			label: 'User action: Add Spotlight',
			options: [userOption],
			callback: (action) => {
				const AddSpotlight: any = {
					id: 'AddSpotlight',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.AddSpotlight,
					},
				}
				sendUserActionCommand(AddSpotlight)
			},
		},
		UnSpotlight: {
			label: 'User action: Un-Spotlight',
			options: [userOption],
			callback: (action) => {
				const UnSpotlight: any = {
					id: 'UnSpotlight',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.UnSpotlight,
					},
				}
				sendUserActionCommand(UnSpotlight)
			},
		},
		ToggleSpotlight: {
			label: 'User action: Toggle Spotlight',
			options: [userOption],
			callback: (action) => {
				const ToggleSpotlight: any = {
					id: 'ToggleSpotlight',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.ToggleSpotlight,
					},
				}
				sendUserActionCommand(ToggleSpotlight)
			},
		},
		TurnVideoOn: {
			label: 'User action: Turn Video On',
			options: [userOption],
			callback: (action) => {
				const TurnVideoOn: any = {
					id: 'TurnVideoOn',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.TurnVideoOn,
					},
				}
				sendUserActionCommand(TurnVideoOn)
			},
		},
		TurnVideoOff: {
			label: 'User action: Turn Video Off',
			options: [userOption],
			callback: (action) => {
				const TurnVideoOff: any = {
					id: 'TurnVideoOff',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.TurnVideoOff,
					},
				}
				sendUserActionCommand(TurnVideoOff)
			},
		},
		ToggleVideoState: {
			label: 'User action: Toggle Video State',
			options: [userOption],
			callback: (action) => {
				const ToggleVideoState: any = {
					id: 'ToggleVideoState',
					options: {
						args: { type: 'i', value: action.options.user },
						command: UserActions.ToggleVideoState,
					},
				}
				sendUserActionCommand(ToggleVideoState)
			},
		},
		Mute: {
			label: 'User action: Mute user',
			options: [userOption],
			callback: (action) => {
				const Mute: any = {
					id: 'Mute',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.Mute,
					},
				}
				sendUserActionCommand(Mute)
			},
		},
		Unmute: {
			label: 'User action: Unmute user',
			options: [userOption],
			callback: (action) => {
				const Unmute: any = {
					id: 'Unmute',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.Unmute,
					},
				}
				sendUserActionCommand(Unmute)
			},
		},
		ToggleMuteState: {
			label: 'User action: Toggle Mute State',
			options: [userOption],
			callback: (action) => {
				const ToggleMuteState: any = {
					id: 'ToggleMuteState',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.ToggleMuteState,
					},
				}
				sendUserActionCommand(ToggleMuteState)
			},
		},
		SendAChatViaDM: {
			label: 'User action: Send A Chat Via DM',
			options: [userOption, options.message],
			callback: (action) => {
				const SendAChatViaDM: any = {
					id: 'SendAChatViaDM',
					options: {
						args: [
							{ type: 'i', value: action.options.user },
							{ type: 's', value: action.options.msg },
						],
						command: UserActions.SendAChatViaDM,
					},
				}
				sendUserActionCommand(SendAChatViaDM)
			},
		},
		RemoteChat: {
			label: 'User action: RemoteChat',
			options: [userOption, options.message],
			callback: (action) => {
				const RemoteChat: any = {
					id: 'RemoteChat',
					options: {
						args: [userOption, { type: 's', value: action.options.msg }],
						command: UserActions.RemoteChat,
					},
				}
				sendUserActionCommand(RemoteChat)
			},
		},
		RaiseHand: {
			label: 'User action: Raise Hand',
			options: [userOption],
			callback: (action) => {
				const RaiseHand: any = {
					id: 'RaiseHand',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.RaiseHand,
					},
				}
				sendUserActionCommand(RaiseHand)
			},
		},
		LowerHand: {
			label: 'User action: Lower Hand',
			options: [userOption],
			callback: (action) => {
				const LowerHand: any = {
					id: 'LowerHand',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.LowerHand,
					},
				}
				sendUserActionCommand(LowerHand)
			},
		},
		ToggleHand: {
			label: 'User action: Toggle Hand',
			options: [userOption],
			callback: (action) => {
				const ToggleHand: any = {
					id: 'ToggleHand',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.ToggleHand,
					},
				}
				sendUserActionCommand(ToggleHand)
			},
		},
		Rename: {
			label: 'User action: Rename',
			options: [userOption],
			callback: (action) => {
				const Rename: any = {
					id: 'Rename',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.Rename,
					},
				}
				sendUserActionCommand(Rename)
			},
		},
		MakeHost: {
			label: 'User action: Make Host',
			options: [userOption],
			callback: (action) => {
				const MakeHost: any = {
					id: 'MakeHost',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.MakeHost,
					},
				}
				sendUserActionCommand(MakeHost)
			},
		},
		MakeCoHost: {
			label: 'User action: Make Co-Host',
			options: [userOption],
			callback: (action) => {
				const MakeCoHost: any = {
					id: 'MakeCoHost',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.MakeCoHost,
					},
				}
				sendUserActionCommand(MakeCoHost)
			},
		},
		RevokeCoHost: {
			label: 'User action: Revoke Co-Host',
			options: [userOption],
			callback: (action) => {
				const RevokeCoHost: any = {
					id: 'RevokeCoHost',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.RevokeCoHost,
					},
				}
				sendUserActionCommand(RevokeCoHost)
			},
		},
		ReclaimHost: {
			label: 'User action: Reclaim Host',
			options: [userOption],
			callback: (action) => {
				const ReclaimHost: any = {
					id: 'ReclaimHost',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.ReclaimHost,
					},
				}
				sendUserActionCommand(ReclaimHost)
			},
		},
		MakePanelist: {
			label: 'User action: Make Panelist',
			options: [userOption],
			callback: (action) => {
				const MakePanelist: any = {
					id: 'MakePanelist',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.MakePanelist,
					},
				}
				sendUserActionCommand(MakePanelist)
			},
		},
		MakeAttendee: {
			label: 'User action: Make Attendee',
			options: [userOption],
			callback: (action) => {
				const MakeAttendee: any = {
					id: 'MakeAttendee',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.MakeAttendee,
					},
				}
				sendUserActionCommand(MakeAttendee)
			},
		},
		EjectParticipant: {
			label: 'User action: Eject Participant',
			options: [userOption],
			callback: (action) => {
				const EjectParticipant: any = {
					id: 'EjectParticipant',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.EjectParticipant,
					},
				}
				sendUserActionCommand(EjectParticipant)
			},
		},
		SendParticipantToBreakoutRoom: {
			label: 'User action: Send Participant To Breakout Room',
			options: [userOption, breakoutOption],
			callback: (action) => {
				const SendParticipantToBreakoutRoom: any = {
					id: 'SendParticipantToBreakoutRoom',
					options: {
						args: [
							{ type: 'i', value: action.options.user },
							{ type: 'i', value: action.options.breakoutRoom },
						],
						command: UserActions.EjectParticipant,
					},
				}
				sendUserActionCommand(SendParticipantToBreakoutRoom)
			},
		},
		RemoveParticipantFromBreakoutRoom: {
			label: 'User action: Remove Participant From Breakout Room',
			options: [userOption, breakoutOption],
			callback: (action) => {
				const RemoveParticipantFromBreakoutRoom: any = {
					id: 'RemoveParticipantFromBreakoutRoom',
					options: {
						args: [
							{ type: 'i', value: action.options.user },
							{ type: 'i', value: action.options.breakoutRoom },
						],
						command: UserActions.RemoveParticipantFromBreakoutRoom,
					},
				}
				sendUserActionCommand(RemoveParticipantFromBreakoutRoom)
			},
		},
		AssignParticipantToBreakoutRoom: {
			label: 'User action: Assign Participant To Breakout Room',
			options: [userOption, breakoutOption],
			callback: (action) => {
				const AssignParticipantToBreakoutRoom: any = {
					id: 'AssignParticipantToBreakoutRoom',
					options: {
						args: [
							{ type: 'i', value: action.options.user },
							{ type: 'i', value: action.options.breakoutRoom },
						],
						command: UserActions.AssignParticipantToBreakoutRoom,
					},
				}
				sendUserActionCommand(AssignParticipantToBreakoutRoom)
			},
		},
		UnassignParticipantFromBreakoutRoom: {
			label: 'User action: Unassign Participant From Breakout Room',
			options: [userOption, breakoutOption],
			callback: (action) => {
				const UnassignParticipantFromBreakoutRoom: any = {
					id: 'UnassignParticipantFromBreakoutRoom',
					options: {
						args: [
							{ type: 'i', value: action.options.user },
							{ type: 'i', value: action.options.breakoutRoom },
						],
						command: UserActions.UnassignParticipantFromBreakoutRoom,
					},
				}
				sendUserActionCommand(UnassignParticipantFromBreakoutRoom)
			},
		},
		ReturnSelfToMainMeeting: {
			label: 'User action: Return Self To Main Meeting',
			options: [userOption],
			callback: (action) => {
				const ReturnSelfToMainMeeting: any = {
					id: 'ReturnSelfToMainMeeting',
					options: {
						user: [{ type: 'i', value: action.options.user }],
						command: UserActions.ReturnSelfToMainMeeting,
					},
				}
				sendUserActionCommand(ReturnSelfToMainMeeting)
			},
		},
		AdmitSomeoneFromWaitingRoom: {
			label: 'User action: Admit Someone From Waiting Room',
			options: [userOption],
			callback: (action) => {
				const AdmitSomeoneFromWaitingRoom: any = {
					id: 'AdmitSomeoneFromWaitingRoom',
					options: {
						user: [{ type: 'i', value: action.options.user }],
						command: UserActions.AdmitSomeoneFromWaitingRoom,
					},
				}
				sendUserActionCommand(AdmitSomeoneFromWaitingRoom)
			},
		},
		SendSomeoneToWaitingRoom: {
			label: 'User action: Send Someone To Waiting Room',
			options: [userOption],
			callback: (action) => {
				const SendSomeoneToWaitingRoom: any = {
					id: 'SendSomeoneToWaitingRoom',
					options: {
						user: [{ type: 'i', value: action.options.user }],
						command: UserActions.SendSomeoneToWaitingRoom,
					},
				}
				sendUserActionCommand(SendSomeoneToWaitingRoom)
			},
		},
		AllowWebinarAttendeeToSpeak: {
			label: 'User action: Allow Webinar Attendee To Speak',
			options: [userOption],
			callback: (action) => {
				const AllowWebinarAttendeeToSpeak: any = {
					id: 'AllowWebinarAttendeeToSpeak',
					options: {
						user: [{ type: 'i', value: action.options.user }],
						command: UserActions.AllowWebinarAttendeeToSpeak,
					},
				}
				sendUserActionCommand(AllowWebinarAttendeeToSpeak)
			},
		},
		ShutUpWebinarAttendee: {
			label: 'User action: ShutUp Webinar Attendee',
			options: [userOption],
			callback: (action) => {
				const ShutUpWebinarAttendee: any = {
					id: 'ShutUpWebinarAttendee',
					options: {
						user: [{ type: 'i', value: action.options.user }],
						command: UserActions.ShutUpWebinarAttendee,
					},
				}
				sendUserActionCommand(ShutUpWebinarAttendee)
			},
		},
		
		UserVideoOnOutputOutput: {
			label: 'User action: Camera on for user',
			options: [userOption],
			callback: (action) => {
				const UserVideoOnOutputOutput: any = {
					id: 'UserVideoOnOutputOutput',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.UserVideoOnOutputOutput,
					},
				}
				sendUserActionCommand(UserVideoOnOutputOutput)
			},
		},
		UserVideoOffOutputOutput: {
			label: 'User action: Camera off for user',
			options: [userOption],
			callback: (action) => {
				const UserVideoOffOutputOutput: any = {
					id: 'UserVideoOffOutputOutput',
					options: {
						args: [{ type: 'i', value: action.options.user }],
						command: UserActions.UserVideoOffOutputOutput,
					},
				}
				sendUserActionCommand(UserVideoOffOutputOutput)
			},
		},
		// Global actions
		MuteAll: {
			label: 'User action: Mute All',
			options: [userOption],
			callback: () => {
				const MuteAll: any = {
					id: 'MuteAll',
					options: {
						command: UserActions.MuteAll,
					},
				}
				sendGlobalActionCommand(MuteAll)
			},
		},
		UnmuteAll: {
			label: 'User action: Unmute All',
			options: [userOption],
			callback: () => {
				const UnmuteAll: any = {
					id: 'UnmuteAll',
					options: {
						command: UserActions.UnmuteAll,
					},
				}
				sendGlobalActionCommand(UnmuteAll)
			},
		},
		EnableUsersUnmute: {
			label: 'Global action: Enable Users to Unmute',
			options: [],
			callback: () => {
				const EnableUsersToUnmute: any = {
					id: 'EnableUsersUnmute',
					options: {
						command: GlobalActions.EnableUsersToUnmute,
					},
				}
				sendGlobalActionCommand(EnableUsersToUnmute)
			},
		},
	}
}

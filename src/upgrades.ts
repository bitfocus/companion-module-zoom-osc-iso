import type {
	CompanionMigrationAction,
	CompanionMigrationFeedback,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
	CompanionUpgradeContext,
} from '@companion-module/base'

import { ZoomConfig } from './config'
import { ActionId } from './actions'
import { FeedbackId, feedbackType } from './feedback'

export function UpgradeV2toV3(
	_context: CompanionUpgradeContext,
	_props: CompanionStaticUpgradeProps<ZoomConfig>
): CompanionStaticUpgradeResult<ZoomConfig> {
	const result: CompanionStaticUpgradeResult<ZoomConfig> = {
		updatedActions: [],
		updatedConfig: null,
		updatedFeedbacks: [],
	}

	return result
}
export interface v2ActionType {
	[key: string]: {
		oldActionId: string
		newActionId: string
	}
}

const v2UserActions: v2ActionType = {
	Spotlight: {
		oldActionId: 'Spotlight',
		newActionId: ActionId.spotLight,
	},
	AddSpotlight: {
		oldActionId: 'AddSpotlight',
		newActionId: ActionId.addSpotlight,
	},
	Pin: {
		oldActionId: 'Pin',
		newActionId: ActionId.pin,
	},
	AddPin: {
		oldActionId: 'AddPin',
		newActionId: ActionId.addPin,
	},
	Unpin: {
		oldActionId: 'Unpin',
		newActionId: ActionId.unpin,
	},
	PinScreen2: {
		oldActionId: 'PinScreen2',
		newActionId: ActionId.pinScreen2,
	},
	UnpinScreen2: {
		oldActionId: 'UnpinScreen2',
		newActionId: ActionId.unPinScreen2,
	},
	TogglePinScreen2: {
		oldActionId: 'TogglePinScreen2',
		newActionId: ActionId.togglePinScreen2,
	},
	UnSpotlight: {
		oldActionId: 'UnSpotlight',
		newActionId: ActionId.unSpotLight,
	},
	ToggleSpotlight: {
		oldActionId: 'ToggleSpotlight',
		newActionId: ActionId.toggleSpotlight,
	},
	TurnVideoOn: {
		oldActionId: 'TurnVideoOn',
		newActionId: ActionId.turnVideoOn,
	},
	TurnVideoOff: {
		oldActionId: 'TurnVideoOff',
		newActionId: ActionId.turnVideoOff,
	},
	ToggleVideoState: {
		oldActionId: 'ToggleVideoState',
		newActionId: ActionId.toggleVideoState,
	},
	Mute: {
		oldActionId: 'Mute',
		newActionId: ActionId.mute,
	},
	Unmute: {
		oldActionId: 'Unmute',
		newActionId: ActionId.unmute,
	},
	ToggleMuteState: {
		oldActionId: 'ToggleMuteState',
		newActionId: ActionId.toggleMuteState,
	},
	RaiseHand: {
		oldActionId: 'RaiseHand',
		newActionId: ActionId.raiseHand,
	},
	LowerHand: {
		oldActionId: 'LowerHand',
		newActionId: ActionId.lowerHand,
	},
	ToggleHand: {
		oldActionId: 'ToggleHand',
		newActionId: ActionId.toggleHand,
	},
	MakeHost: {
		oldActionId: 'MakeHost',
		newActionId: ActionId.makeHost,
	},
	MakeCoHost: {
		oldActionId: 'MakeCoHost',
		newActionId: ActionId.makeCoHost,
	},
	RevokeCoHost: {
		oldActionId: 'RevokeCoHost',
		newActionId: ActionId.revokeCoHost,
	},
	ReclaimHost: {
		oldActionId: 'ReclaimHost',
		newActionId: ActionId.reclaimHost,
	},
	MakePanelist: {
		oldActionId: 'MakePanelist',
		newActionId: ActionId.makePanelist,
	},
	MakeAttendee: {
		oldActionId: 'MakeAttendee',
		newActionId: ActionId.makeAttendee,
	},
	EjectParticipant: {
		oldActionId: 'EjectParticipant',
		newActionId: ActionId.ejectParticipant,
	},
	ReturnSelfToMainMeeting: {
		oldActionId: 'ReturnSelfToMainMeeting',
		newActionId: ActionId.returnSelfToMainMeeting,
	},
	AdmitSomeoneFromWaitingRoom: {
		oldActionId: 'AdmitSomeoneFromWaitingRoom',
		newActionId: ActionId.admitSomeoneFromWaitingRoom,
	},
	SendSomeoneToWaitingRoom: {
		oldActionId: 'SendSomeoneToWaitingRoom',
		newActionId: ActionId.sendSomeoneToWaitingRoom,
	},
	AllowWebinarAttendeeToSpeak: {
		oldActionId: 'AllowWebinarAttendeeToSpeak',
		newActionId: ActionId.allowWebinarAttendeeToSpeak,
	},
	AllowToRecord: {
		oldActionId: 'AllowToRecord',
		newActionId: ActionId.allowToRecord,
	},
	DisallowToRecord: {
		oldActionId: 'DisallowToRecord',
		newActionId: ActionId.disallowToRecord,
	},
	EnableOriginalSound: {
		oldActionId: 'EnableOriginalSound',
		newActionId: ActionId.enableOriginalSound,
	},
	DisableOriginalSound: {
		oldActionId: 'DisableOriginalSound',
		newActionId: ActionId.disableOriginalSound,
	},
	EnableMirrorVideo: {
		oldActionId: 'EnableMirrorVideo',
		newActionId: ActionId.enableMirrorVideo,
	},
	DisableMirrorVideo: {
		oldActionId: 'DisableMirrorVideo',
		newActionId: ActionId.disableMirrorVideo,
	},
	SendParticipantToBreakoutRoom: {
		oldActionId: 'SendParticipantToBreakoutRoom',
		newActionId: ActionId.sendParticipantToBreakoutRoom,
	},
	RemoveParticipantFromBreakoutRoom: {
		oldActionId: 'RemoveParticipantFromBreakoutRoom',
		newActionId: ActionId.removeParticipantFromBreakoutRoom,
	},
	AssignParticipantToBreakoutRoom: {
		oldActionId: 'AssignParticipantToBreakoutRoom',
		newActionId: ActionId.assignParticipantToBreakoutRoom,
	},
	UnassignParticipantFromBreakoutRoom: {
		oldActionId: 'UnassignParticipantFromBreakoutRoom',
		newActionId: ActionId.unassignParticipantFromBreakoutRoom,
	},
	Rename: {
		oldActionId: 'Rename',
		newActionId: ActionId.rename,
	},
	SetWindowPosition: {
		oldActionId: 'SetWindowPosition',
		newActionId: ActionId.SetWindowPosition,
	},
	SetWindowSize: {
		oldActionId: 'SetWindowSize',
		newActionId: ActionId.SetWindowSize,
	},
	SetVirtualBackground: {
		oldActionId: 'SetVirtualBackground',
		newActionId: ActionId.setVirtualBackground,
	},
	SetVideoFilter: {
		oldActionId: 'SetVideoFilter',
		newActionId: ActionId.setVideoFilter,
	},
	SetCameraDevice: {
		oldActionId: 'SetCameraDevice',
		newActionId: ActionId.setCameraDevice,
	},
	SetSpeakerVolume: {
		oldActionId: 'SetSpeakerVolume',
		newActionId: ActionId.setSpeakerVolume,
	},
	SetSpeakerDevice: {
		oldActionId: 'SetSpeakerDevice',
		newActionId: ActionId.setSpeakerDevice,
	},
	SetMicDevice: {
		oldActionId: 'SetMicDevice',
		newActionId: ActionId.setMicDevice,
	},
	SetMicLevel: {
		oldActionId: 'SetMicLevel',
		newActionId: ActionId.setMicLevel,
	},
	SendAChatViaDM: {
		oldActionId: 'SendAChatViaDM',
		newActionId: ActionId.sendAChatViaDM,
	},
}

const v2GlobalActions: v2ActionType = {
	ClearPins: {
		oldActionId: 'ClearPins',
		newActionId: ActionId.clearPins,
	},
	TogglePin: {
		oldActionId: 'TogglePin',
		newActionId: ActionId.togglePin,
	},
	ClearPinsScreen2: {
		oldActionId: 'ClearPinsScreen2',
		newActionId: ActionId.clearPinsScreen2,
	},
	StartScreenShareWithPrimaryScreen: {
		oldActionId: 'StartScreenShareWithPrimaryScreen',
		newActionId: ActionId.startScreenShareWithPrimaryScreen,
	},
	CycleSharedCameraToNextAvailable: {
		oldActionId: 'CycleSharedCameraToNextAvailable',
		newActionId: ActionId.cycleSharedCameraToNextAvailable,
	},
	StopSharing: {
		oldActionId: 'StopSharing',
		newActionId: ActionId.stopSharing,
	},
	GotoNextGalleryPage: {
		oldActionId: 'GotoNextGalleryPage',
		newActionId: ActionId.gotoNextGalleryPage,
	},
	GotoPreviousGalleryPage: {
		oldActionId: 'GotoPreviousGalleryPage',
		newActionId: ActionId.gotoPreviousGalleryPage,
	},
	SetSpeakerView: {
		oldActionId: 'SetSpeakerView',
		newActionId: ActionId.setSpeakerView,
	},
	ShowNonVideoParticipants: {
		oldActionId: 'ShowNonVideoParticipants',
		newActionId: ActionId.showNonVideoParticipants,
	},
	HideNonVideoParticipants: {
		oldActionId: 'HideNonVideoParticipants',
		newActionId: ActionId.hideNonVideoParticipants,
	},
	ShowUserNamesOnVideo: {
		oldActionId: 'ShowUserNamesOnVideo',
		newActionId: ActionId.showUserNamesOnVideo,
	},
	HideUserNamesOnVideo: {
		oldActionId: 'HideUserNamesOnVideo',
		newActionId: ActionId.hideUserNamesOnVideo,
	},
	EnableHDVideo: {
		oldActionId: 'EnableHDVideo',
		newActionId: ActionId.enableHDVideo,
	},
	DisableHDVideo: {
		oldActionId: 'DisableHDVideo',
		newActionId: ActionId.disableHDVideo,
	},
	EnableOptimizeVideoForSharing: {
		oldActionId: 'EnableOptimizeVideoForSharing',
		newActionId: ActionId.enableOptimizeVideoForSharing,
	},
	DisableOptimizeVideoForSharing: {
		oldActionId: 'DisableOptimizeVideoForSharing',
		newActionId: ActionId.disableOptimizeVideoForSharing,
	},
	EnableComputerSoundWhenSharing: {
		oldActionId: 'EnableComputerSoundWhenSharing',
		newActionId: ActionId.enableComputerSoundWhenSharing,
	},
	DisableComputerSoundWhenSharing: {
		oldActionId: 'DisableComputerSoundWhenSharing',
		newActionId: ActionId.disableComputerSoundWhenSharing,
	},
	SetGalleryView: {
		oldActionId: 'SetGalleryView',
		newActionId: ActionId.setGalleryView,
	},
	MuteAll: {
		oldActionId: 'MuteAll',
		newActionId: ActionId.muteAll,
	},
	UnmuteAll: {
		oldActionId: 'UnmuteAll',
		newActionId: ActionId.unmuteAll,
	},
	ClearSpotlight: {
		oldActionId: 'ClearSpotlight',
		newActionId: ActionId.clearSpotlight,
	},
	EnableUsersToUnmute: {
		oldActionId: 'EnableUsersToUnmute',
		newActionId: ActionId.enableUsersToUnmute,
	},
	DisableUsersToUnmute: {
		oldActionId: 'DisableUsersToUnmute',
		newActionId: ActionId.disableUsersToUnmute,
	},
	LowerAllHands: {
		oldActionId: 'LowerAllHands',
		newActionId: ActionId.lowerAllHands,
	},
	OpenBreakoutRooms: {
		oldActionId: 'OpenBreakoutRooms',
		newActionId: ActionId.openBreakoutRooms,
	},
	CloseBreakoutRooms: {
		oldActionId: 'CloseBreakoutRooms',
		newActionId: ActionId.closeBreakoutRooms,
	},
	DeleteAllBreakoutRooms: {
		oldActionId: 'DeleteAllBreakoutRooms',
		newActionId: ActionId.deleteAllBreakoutRooms,
	},
	AdmitEveryoneFromWaitingRoom: {
		oldActionId: 'AdmitEveryoneFromWaitingRoom',
		newActionId: ActionId.admitEveryoneFromWaitingRoom,
	},
	EjectAllWebinarAttendees: {
		oldActionId: 'EjectAllWebinarAttendees',
		newActionId: ActionId.ejectAll,
	},
	StartLocalRecording: {
		oldActionId: 'StartLocalRecording',
		newActionId: ActionId.startLocalRecording,
	},
	PauseLocalRecording: {
		oldActionId: 'PauseLocalRecording',
		newActionId: ActionId.pauseLocalRecording,
	},
	ResumeLocalRecording: {
		oldActionId: 'ResumeLocalRecording',
		newActionId: ActionId.resumeLocalRecording,
	},
	StopLocalRecording: {
		oldActionId: 'StopLocalRecording',
		newActionId: ActionId.stopLocalRecording,
	},
	StartCloudRecording: {
		oldActionId: 'StartCloudRecording',
		newActionId: ActionId.startCloudRecording,
	},
	PauseCloudRecording: {
		oldActionId: 'PauseCloudRecording',
		newActionId: ActionId.pauseCloudRecording,
	},
	ResumeCloudRecording: {
		oldActionId: 'ResumeCloudRecording',
		newActionId: ActionId.resumeCloudRecording,
	},
	StopCloudRecording: {
		oldActionId: 'StopCloudRecording',
		newActionId: ActionId.stopCloudRecording,
	},
	RequestGalleryCount: {
		oldActionId: 'RequestGalleryCount',
		newActionId: ActionId.requestGalleryCount,
	},
	RequestListOfBreakoutRooms: {
		oldActionId: 'RequestListOfBreakoutRooms',
		newActionId: ActionId.requestListOfBreakoutRooms,
	},
	LeaveMeeting: {
		oldActionId: 'LeaveMeeting',
		newActionId: ActionId.leaveMeeting,
	},
	EndMeeting: {
		oldActionId: 'EndMeeting',
		newActionId: ActionId.endMeeting,
	},
	EnableWaitingRoom: {
		oldActionId: 'EnableWaitingRoom',
		newActionId: ActionId.enableWaitingRoom,
	},
	DisableWaitingRoom: {
		oldActionId: 'DisableWaitingRoom',
		newActionId: ActionId.disableWaitingRoom,
	},
	StartCameraShare: {
		oldActionId: 'StartCameraShare',
		newActionId: ActionId.startCameraShare,
	},
	StartShareWithWindow: {
		oldActionId: 'StartShareWithWindow',
		newActionId: ActionId.startShareWithWindow,
	},
	StartAudioShare: {
		oldActionId: 'StartAudioShare',
		newActionId: ActionId.startAudioShare,
	},
	StartScreenShare: {
		oldActionId: 'StartScreenShare',
		newActionId: ActionId.startScreenShare,
	},
	SendAChatToEveryone: {
		oldActionId: 'SendAChatToEveryone',
		newActionId: ActionId.sendAChatToEveryone,
	},
	CreateBreakoutRoom: {
		oldActionId: 'CreateBreakoutRoom',
		newActionId: ActionId.createBreakoutRoom,
	},
	DeleteBreakoutRoom: {
		oldActionId: 'DeleteBreakoutRoom',
		newActionId: ActionId.deleteBreakoutRoom,
	},
	BroadcastMessageToBreakoutRooms: {
		oldActionId: 'BroadcastMessageToBreakoutRooms',
		newActionId: ActionId.broadcastMessageToBreakoutRooms,
	},
	SendMessageToWaitingRoom: {
		oldActionId: 'SendMessageToWaitingRoom',
		newActionId: ActionId.sendMessageToWaitingRoom,
	},
}

export function UpgradeV2ToV3(
	_context: CompanionUpgradeContext,
	props: CompanionStaticUpgradeProps<ZoomConfig>
): CompanionStaticUpgradeResult<ZoomConfig> {
	// let config: ZoomConfig = props.config;
	const actions: CompanionMigrationAction[] = props.actions
	const feedbacks: CompanionMigrationFeedback[] = props.feedbacks

	const result: CompanionStaticUpgradeResult<ZoomConfig> = {
		updatedActions: [],
		updatedConfig: null,
		updatedFeedbacks: [],
	}

	for (const action of actions) {
		if (
			action.options.actionID !== undefined &&
			action.actionId === 'UserActions' &&
			Object.prototype.hasOwnProperty.call(v2UserActions, action.options.actionID as string)
		) {
			const v2Action = v2UserActions[action.options.actionID as string]
			action.actionId = v2Action.newActionId
			result.updatedActions.push(action)
		} else if (
			action.options.actionID !== undefined &&
			action.actionId === 'GlobalActions' &&
			Object.prototype.hasOwnProperty.call(v2GlobalActions, action.options.actionID as string)
		) {
			const v2Action = v2GlobalActions[action.options.actionID as string]
			action.actionId = v2Action.newActionId
			result.updatedActions.push(action)
		} else if (action.actionId === 'selectUserFromGroupPosition' && action.options.group !== undefined) {
			action.actionId = ActionId.selectUserFromGroupPosition
			action.options.group = (action.options.group as number) + 1
			result.updatedActions.push(action)
		} else if (action.actionId === 'clearGroup' && action.options.group !== undefined) {
			action.actionId = ActionId.clearGroup
			action.options.group = (action.options.group as number) + 1
			result.updatedActions.push(action)
		} else if (action.actionId === 'clearParticipants') {
			action.actionId = ActionId.clearParticipants
			result.updatedActions.push(action)
		} else if (action.actionId === 'selectionMethod') {
			action.actionId = ActionId.selectionMethod
			result.updatedActions.push(action)
		} else if (action.actionId === 'addToGroup') {
			action.actionId = ActionId.addToGroup
			action.options.group = (action.options.group as number) + 1
			if (action.options.groupOption === 'set') {
				action.options.groupOption = 'replace'
			}
			result.updatedActions.push(action)
		} else if (action.actionId === 'SelectFromGalleryPosition') {
			action.actionId = ActionId.selectFromGalleryPosition
			result.updatedActions.push(action)
		} else if (action.actionId === 'SelectFromIndexPosition') {
			action.actionId = ActionId.selectFromIndexPosition
			result.updatedActions.push(action)
		} else if (action.actionId === 'SelectUserByName') {
			action.actionId = ActionId.selectUserByName
			result.updatedActions.push(action)
		}
	}

	for (const feedback of feedbacks) {
		if (feedback.feedbackId === 'selectionMethod') {
			feedback.feedbackId = FeedbackId.selectionMethod
			result.updatedFeedbacks.push(feedback)
		} else if (
			feedback.feedbackId === 'galleryBased' ||
			feedback.feedbackId === 'indexBased' ||
			feedback.feedbackId === 'userNameBased' ||
			feedback.feedbackId === 'groupBased'
		) {
			switch (feedback.feedbackId) {
				case 'galleryBased':
					feedback.feedbackId = FeedbackId.galleryBased
					break
				case 'indexBased':
					feedback.feedbackId = FeedbackId.indexBased
					break
				case 'userNameBased':
					feedback.feedbackId = FeedbackId.userNameBased
					break
				case 'groupBased':
					feedback.feedbackId = FeedbackId.groupBased
					feedback.options.group = (feedback.options.group as number) + 1
					break
			}

			switch (feedback.options.type) {
				case 'selected':
					feedback.options.type = feedbackType.selected
					break
				case 'micLive':
					feedback.options.type = feedbackType.micLive
					break
				case 'handRaised':
					feedback.options.type = feedbackType.handRaised
					break
				case 'camera':
					feedback.options.type = feedbackType.camera
					break
				case 'activeSpeaker':
					feedback.options.type = feedbackType.activeSpeaker
					break
				default:
					break
			}

			result.updatedFeedbacks.push(feedback)
		}
	}

	return result
}

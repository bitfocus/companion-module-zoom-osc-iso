import { ActionId } from './actions.js'
import { ActionIdGroups } from './actions/action-group.js'
import { ActionIdGallery } from './actions/action-gallery.js'
import { FeedbackId, feedbackType } from './feedback.js'
import { ActionIdUserSpotlight } from './actions/action-user-spotlight.js'
import { ActionIdUserVideoMic } from './actions/action-user-video-mic.js'
import { ActionIdUserPin } from './actions/action-user-pin.js'
import { ActionIdUserHandRaised } from './actions/action-user-hand-raised.js'
import { ActionIdUserView } from './actions/action-user-view.js'
import { ActionIdGlobalGalleryTrackingAndDataRequest } from './actions/action-global-gallery-tracking-and-data-request.js'
import { ActionIdUserRolesAndAction } from './actions/action-user-roles-action.js'
import { ActionIdUserChat } from './actions/action-user-chat.js'
import { ActionIdUserWebinar } from './actions/action-user-webinars.js'
import { ActionIdUserBreakoutRooms } from './actions/action-user-breakout-rooms.js'
import { ActionIdUserWaitingRoom } from './actions/action-user-waiting-room.js'
import { ActionIdUserScreenshare } from './actions/action-user-screenshare.js'
import { ActionIdUserSettings } from './actions/action-user-settings.js'
import { ActionIdGlobal } from './actions/action-global.js'
import { ActionIdGlobalBreakoutRooms } from './actions/action-global-breakout-rooms.js'
import { ActionIdGlobalRecording } from './actions/action-global-recording.js'
import { ActionIdGlobalWaitingRoomsAndZak } from './actions/action-global-waitingrooms-and-zak.js'
import { ActionIdGlobalMemoryManagement } from './actions/action-global-memory-management.js'
import { ActionIdZoomISORouting } from './actions/action-zoomiso-routing.js'
import { ActionIdZoomISOEngine } from './actions/action-zoomiso-engine.js'
import { ActionIdZoomISOOutputSettings } from './actions/action-zoomiso-output-settings.js'
import { ActionIdZoomISOActions } from './actions/action-zoomiso-actions.js'
import { ActionIdUsers } from './actions/action-user.js'

interface v2Action {
	[key: string]: {
		oldActionId: string
		newActionId: string
		type: string
		isGroupBased?: boolean
	}
}

interface v2Feedback {
	[key: string]: {
		oldFeedbackId: string
		newFeedbackId: string
		isGroupBased?: boolean
	}
}

interface v2FeedbackType {
	[key: string]: {
		oldFeedbackId: string
		newFeedbackId: feedbackType
	}
}

export const v2Actions: v2Action = {
	Spotlight: {
		oldActionId: 'Spotlight',
		newActionId: ActionIdUserSpotlight.spotLight,
		type: 'UserActions',
	},
	AddSpotlight: {
		oldActionId: 'AddSpotlight',
		newActionId: ActionIdUserSpotlight.addSpotlight,
		type: 'UserActions',
	},
	Pin: {
		oldActionId: 'Pin',
		newActionId: ActionIdUserPin.pin,
		type: 'UserActions',
	},
	AddPin: {
		oldActionId: 'AddPin',
		newActionId: ActionIdUserPin.addPin,
		type: 'UserActions',
	},
	Unpin: {
		oldActionId: 'Unpin',
		newActionId: ActionIdUserPin.unpin,
		type: 'UserActions',
	},
	PinScreen2: {
		oldActionId: 'PinScreen2',
		newActionId: ActionIdUserPin.pinScreen2,
		type: 'UserActions',
	},
	UnpinScreen2: {
		oldActionId: 'UnpinScreen2',
		newActionId: ActionIdUserPin.unPinScreen2,
		type: 'UserActions',
	},
	TogglePinScreen2: {
		oldActionId: 'TogglePinScreen2',
		newActionId: ActionIdUserPin.togglePinScreen2,
		type: 'UserActions',
	},
	UnSpotlight: {
		oldActionId: 'UnSpotlight',
		newActionId: ActionIdUserSpotlight.unSpotLight,
		type: 'UserActions',
	},
	ToggleSpotlight: {
		oldActionId: 'ToggleSpotlight',
		newActionId: ActionIdUserSpotlight.toggleSpotlight,
		type: 'UserActions',
	},
	TurnVideoOn: {
		oldActionId: 'TurnVideoOn',
		newActionId: ActionIdUserVideoMic.turnVideoOn,
		type: 'UserActions',
	},
	TurnVideoOff: {
		oldActionId: 'TurnVideoOff',
		newActionId: ActionIdUserVideoMic.turnVideoOff,
		type: 'UserActions',
	},
	ToggleVideoState: {
		oldActionId: 'ToggleVideoState',
		newActionId: ActionIdUserVideoMic.toggleVideoState,
		type: 'UserActions',
	},
	Mute: {
		oldActionId: 'Mute',
		newActionId: ActionIdUserVideoMic.mute,
		type: 'UserActions',
	},
	Unmute: {
		oldActionId: 'Unmute',
		newActionId: ActionIdUserVideoMic.unmute,
		type: 'UserActions',
	},
	ToggleMuteState: {
		oldActionId: 'ToggleMuteState',
		newActionId: ActionIdUserVideoMic.toggleMuteState,
		type: 'UserActions',
	},
	RaiseHand: {
		oldActionId: 'RaiseHand',
		newActionId: ActionIdUserHandRaised.raiseHand,
		type: 'UserActions',
	},
	LowerHand: {
		oldActionId: 'LowerHand',
		newActionId: ActionIdUserHandRaised.lowerHand,
		type: 'UserActions',
	},
	ToggleHand: {
		oldActionId: 'ToggleHand',
		newActionId: ActionIdUserHandRaised.toggleHand,
		type: 'UserActions',
	},
	MakeHost: {
		oldActionId: 'MakeHost',
		newActionId: ActionIdUserRolesAndAction.makeHost,
		type: 'UserActions',
	},
	MakeCoHost: {
		oldActionId: 'MakeCoHost',
		newActionId: ActionIdUserRolesAndAction.makeCoHost,
		type: 'UserActions',
	},
	RevokeCoHost: {
		oldActionId: 'RevokeCoHost',
		newActionId: ActionIdUserRolesAndAction.revokeCoHost,
		type: 'UserActions',
	},
	ReclaimHost: {
		oldActionId: 'ReclaimHost',
		newActionId: ActionIdUserRolesAndAction.reclaimHost,
		type: 'UserActions',
	},
	MakePanelist: {
		oldActionId: 'MakePanelist',
		newActionId: ActionIdUserRolesAndAction.makePanelist,
		type: 'UserActions',
	},
	MakeAttendee: {
		oldActionId: 'MakeAttendee',
		newActionId: ActionIdUserRolesAndAction.makeAttendee,
		type: 'UserActions',
	},
	EjectParticipant: {
		oldActionId: 'EjectParticipant',
		newActionId: ActionIdUserRolesAndAction.ejectParticipant,
		type: 'UserActions',
	},
	ReturnSelfToMainMeeting: {
		oldActionId: 'ReturnSelfToMainMeeting',
		newActionId: ActionIdUserBreakoutRooms.returnSelfToMainMeeting,
		type: 'UserActions',
	},
	AdmitSomeoneFromWaitingRoom: {
		oldActionId: 'AdmitSomeoneFromWaitingRoom',
		newActionId: ActionIdUserWaitingRoom.admitSomeoneFromWaitingRoom,
		type: 'UserActions',
	},
	SendSomeoneToWaitingRoom: {
		oldActionId: 'SendSomeoneToWaitingRoom',
		newActionId: ActionIdUserWaitingRoom.sendSomeoneToWaitingRoom,
		type: 'UserActions',
	},
	AllowWebinarAttendeeToSpeak: {
		oldActionId: 'AllowWebinarAttendeeToSpeak',
		newActionId: ActionIdUserWebinar.allowWebinarAttendeeToSpeak,
		type: 'UserActions',
	},
	ShutUpWebinarAttendee: {
		oldActionId: 'ShutUpWebinarAttendee',
		newActionId: ActionIdUserWebinar.disallowToSpeak,
		type: 'UserActions',
	},
	AllowToRecord: {
		oldActionId: 'AllowToRecord',
		newActionId: ActionIdUserRolesAndAction.allowToRecord,
		type: 'UserActions',
	},
	DisallowToRecord: {
		oldActionId: 'DisallowToRecord',
		newActionId: ActionIdUserRolesAndAction.disallowToRecord,
		type: 'UserActions',
	},
	EnableOriginalSound: {
		oldActionId: 'EnableOriginalSound',
		newActionId: ActionIdUserSettings.enableOriginalSound,
		type: 'UserActions',
	},
	DisableOriginalSound: {
		oldActionId: 'DisableOriginalSound',
		newActionId: ActionIdUserSettings.disableOriginalSound,
		type: 'UserActions',
	},
	EnableMirrorVideo: {
		oldActionId: 'EnableMirrorVideo',
		newActionId: ActionIdUserSettings.enableMirrorVideo,
		type: 'UserActions',
	},
	DisableMirrorVideo: {
		oldActionId: 'DisableMirrorVideo',
		newActionId: ActionIdUserSettings.disableMirrorVideo,
		type: 'UserActions',
	},
	SendParticipantToBreakoutRoom: {
		oldActionId: 'SendParticipantToBreakoutRoom',
		newActionId: ActionIdUserBreakoutRooms.sendParticipantToBreakoutRoom,
		type: 'UserActions',
	},
	RemoveParticipantFromBreakoutRoom: {
		oldActionId: 'RemoveParticipantFromBreakoutRoom',
		newActionId: ActionIdUserBreakoutRooms.removeParticipantFromBreakoutRoom,
		type: 'UserActions',
	},
	AssignParticipantToBreakoutRoom: {
		oldActionId: 'AssignParticipantToBreakoutRoom',
		newActionId: ActionIdUserBreakoutRooms.assignParticipantToBreakoutRoom,
		type: 'UserActions',
	},
	UnassignParticipantFromBreakoutRoom: {
		oldActionId: 'UnassignParticipantFromBreakoutRoom',
		newActionId: ActionIdUserBreakoutRooms.unassignParticipantFromBreakoutRoom,
		type: 'UserActions',
	},
	Rename: {
		oldActionId: 'Rename',
		newActionId: ActionIdUserRolesAndAction.rename,
		type: 'UserActions',
	},
	SetWindowPosition: {
		oldActionId: 'SetWindowPosition',
		newActionId: ActionIdUserScreenshare.SetWindowPosition,
		type: 'UserActions',
	},
	SetWindowSize: {
		oldActionId: 'SetWindowSize',
		newActionId: ActionIdUserScreenshare.SetWindowSize,
		type: 'UserActions',
	},
	SetVirtualBackground: {
		oldActionId: 'SetVirtualBackground',
		newActionId: ActionIdUserSettings.setVirtualBackground,
		type: 'UserActions',
	},
	SetVideoFilter: {
		oldActionId: 'SetVideoFilter',
		newActionId: ActionIdUserSettings.setVideoFilter,
		type: 'UserActions',
	},
	SetCameraDevice: {
		oldActionId: 'SetCameraDevice',
		newActionId: ActionIdUserSettings.setCameraDevice,
		type: 'UserActions',
	},
	SetSpeakerVolume: {
		oldActionId: 'SetSpeakerVolume',
		newActionId: ActionIdUserSettings.setSpeakerVolume,
		type: 'UserActions',
	},
	SetSpeakerDevice: {
		oldActionId: 'SetSpeakerDevice',
		newActionId: ActionIdUserSettings.setSpeakerDevice,
		type: 'UserActions',
	},
	SetMicDevice: {
		oldActionId: 'SetMicDevice',
		newActionId: ActionIdUserSettings.setMicDevice,
		type: 'UserActions',
	},
	SetMicLevel: {
		oldActionId: 'SetMicLevel',
		newActionId: ActionIdUserSettings.setMicLevel,
		type: 'UserActions',
	},
	SendAChatViaDM: {
		oldActionId: 'SendAChatViaDM',
		newActionId: ActionIdUserChat.sendAChatViaDM,
		type: 'UserActions',
	},
	ClearPins: {
		oldActionId: 'ClearPins',
		newActionId: ActionIdUserPin.clearPins,
		type: 'GlobalActions',
	},
	TogglePin: {
		oldActionId: 'TogglePin',
		newActionId: ActionIdUserPin.togglePin,
		type: 'GlobalActions',
	},
	ClearPinsScreen2: {
		oldActionId: 'ClearPinsScreen2',
		newActionId: ActionIdUserPin.clearPinsScreen2,
		type: 'GlobalActions',
	},
	StartScreenShareWithPrimaryScreen: {
		oldActionId: 'StartScreenShareWithPrimaryScreen',
		newActionId: ActionIdUserScreenshare.startScreenShareWithPrimaryScreen,
		type: 'GlobalActions',
	},
	CycleSharedCameraToNextAvailable: {
		oldActionId: 'CycleSharedCameraToNextAvailable',
		newActionId: ActionIdUserScreenshare.cycleSharedCameraToNextAvailable,
		type: 'GlobalActions',
	},
	StopSharing: {
		oldActionId: 'StopSharing',
		newActionId: ActionIdUserScreenshare.stopSharing,
		type: 'GlobalActions',
	},
	GotoNextGalleryPage: {
		oldActionId: 'GotoNextGalleryPage',
		newActionId: ActionIdUserView.gotoNextGalleryPage,
		type: 'GlobalActions',
	},
	GotoPreviousGalleryPage: {
		oldActionId: 'GotoPreviousGalleryPage',
		newActionId: ActionIdUserView.gotoPreviousGalleryPage,
		type: 'GlobalActions',
	},
	SetSpeakerView: {
		oldActionId: 'SetSpeakerView',
		newActionId: ActionIdUserView.setSpeakerView,
		type: 'GlobalActions',
	},
	ShowNonVideoParticipants: {
		oldActionId: 'ShowNonVideoParticipants',
		newActionId: ActionIdUserSettings.showNonVideoParticipants,
		type: 'GlobalActions',
	},
	HideNonVideoParticipants: {
		oldActionId: 'HideNonVideoParticipants',
		newActionId: ActionIdUserSettings.hideNonVideoParticipants,
		type: 'GlobalActions',
	},
	ShowUserNamesOnVideo: {
		oldActionId: 'ShowUserNamesOnVideo',
		newActionId: ActionIdUserSettings.showUserNamesOnVideo,
		type: 'GlobalActions',
	},
	HideUserNamesOnVideo: {
		oldActionId: 'HideUserNamesOnVideo',
		newActionId: ActionIdUserSettings.hideUserNamesOnVideo,
		type: 'GlobalActions',
	},
	EnableHDVideo: {
		oldActionId: 'EnableHDVideo',
		newActionId: ActionIdUserSettings.enableHDVideo,
		type: 'GlobalActions',
	},
	DisableHDVideo: {
		oldActionId: 'DisableHDVideo',
		newActionId: ActionIdUserSettings.disableHDVideo,
		type: 'GlobalActions',
	},
	EnableOptimizeVideoForSharing: {
		oldActionId: 'EnableOptimizeVideoForSharing',
		newActionId: ActionIdUserScreenshare.enableOptimizeVideoForSharing,
		type: 'GlobalActions',
	},
	DisableOptimizeVideoForSharing: {
		oldActionId: 'DisableOptimizeVideoForSharing',
		newActionId: ActionIdUserScreenshare.disableOptimizeVideoForSharing,
		type: 'GlobalActions',
	},
	EnableComputerSoundWhenSharing: {
		oldActionId: 'EnableComputerSoundWhenSharing',
		newActionId: ActionIdUserScreenshare.enableComputerSoundWhenSharing,
		type: 'GlobalActions',
	},
	DisableComputerSoundWhenSharing: {
		oldActionId: 'DisableComputerSoundWhenSharing',
		newActionId: ActionIdUserScreenshare.disableComputerSoundWhenSharing,
		type: 'GlobalActions',
	},
	SetGalleryView: {
		oldActionId: 'SetGalleryView',
		newActionId: ActionIdUserView.setGalleryView,
		type: 'GlobalActions',
	},
	MuteAll: {
		oldActionId: 'MuteAll',
		newActionId: ActionIdGlobal.muteAll,
		type: 'GlobalActions',
	},
	UnmuteAll: {
		oldActionId: 'UnmuteAll',
		newActionId: ActionIdGlobal.unmuteAll,
		type: 'GlobalActions',
	},
	ClearSpotlight: {
		oldActionId: 'ClearSpotlight',
		newActionId: ActionIdGlobal.clearSpotlight,
		type: 'GlobalActions',
	},
	EnableUsersToUnmute: {
		oldActionId: 'EnableUsersToUnmute',
		newActionId: ActionIdGlobal.enableUsersToUnmute,
		type: 'GlobalActions',
	},
	DisableUsersToUnmute: {
		oldActionId: 'DisableUsersToUnmute',
		newActionId: ActionIdGlobal.disableUsersToUnmute,
		type: 'GlobalActions',
	},
	LowerAllHands: {
		oldActionId: 'LowerAllHands',
		newActionId: ActionIdGlobal.lowerAllHands,
		type: 'GlobalActions',
	},
	OpenBreakoutRooms: {
		oldActionId: 'OpenBreakoutRooms',
		newActionId: ActionIdGlobalBreakoutRooms.openBreakoutRooms,
		type: 'GlobalActions',
	},
	CloseBreakoutRooms: {
		oldActionId: 'CloseBreakoutRooms',
		newActionId: ActionIdGlobalBreakoutRooms.closeBreakoutRooms,
		type: 'GlobalActions',
	},
	DeleteAllBreakoutRooms: {
		oldActionId: 'DeleteAllBreakoutRooms',
		newActionId: ActionIdGlobalBreakoutRooms.deleteAllBreakoutRooms,
		type: 'GlobalActions',
	},
	AdmitEveryoneFromWaitingRoom: {
		oldActionId: 'AdmitEveryoneFromWaitingRoom',
		newActionId: ActionIdGlobalWaitingRoomsAndZak.admitEveryoneFromWaitingRoom,
		type: 'GlobalActions',
	},
	EjectAllWebinarAttendees: {
		oldActionId: 'EjectAllWebinarAttendees',
		newActionId: ActionIdGlobal.ejectAll,
		type: 'GlobalActions',
	},
	StartLocalRecording: {
		oldActionId: 'StartLocalRecording',
		newActionId: ActionIdGlobalRecording.startLocalRecording,
		type: 'GlobalActions',
	},
	PauseLocalRecording: {
		oldActionId: 'PauseLocalRecording',
		newActionId: ActionIdGlobalRecording.pauseLocalRecording,
		type: 'GlobalActions',
	},
	ResumeLocalRecording: {
		oldActionId: 'ResumeLocalRecording',
		newActionId: ActionIdGlobalRecording.resumeLocalRecording,
		type: 'GlobalActions',
	},
	StopLocalRecording: {
		oldActionId: 'StopLocalRecording',
		newActionId: ActionIdGlobalRecording.stopLocalRecording,
		type: 'GlobalActions',
	},
	StartCloudRecording: {
		oldActionId: 'StartCloudRecording',
		newActionId: ActionIdGlobalRecording.startCloudRecording,
		type: 'GlobalActions',
	},
	PauseCloudRecording: {
		oldActionId: 'PauseCloudRecording',
		newActionId: ActionIdGlobalRecording.pauseCloudRecording,
		type: 'GlobalActions',
	},
	ResumeCloudRecording: {
		oldActionId: 'ResumeCloudRecording',
		newActionId: ActionIdGlobalRecording.resumeCloudRecording,
		type: 'GlobalActions',
	},
	StopCloudRecording: {
		oldActionId: 'StopCloudRecording',
		newActionId: ActionIdGlobalRecording.stopCloudRecording,
		type: 'GlobalActions',
	},
	RequestGalleryCount: {
		oldActionId: 'RequestGalleryCount',
		newActionId: ActionIdGlobalGalleryTrackingAndDataRequest.requestGalleryCount,
		type: 'GlobalActions',
	},
	RequestListOfBreakoutRooms: {
		oldActionId: 'RequestListOfBreakoutRooms',
		newActionId: ActionIdGlobalBreakoutRooms.requestListOfBreakoutRooms,
		type: 'GlobalActions',
	},
	LeaveMeeting: {
		oldActionId: 'LeaveMeeting',
		newActionId: ActionIdGlobal.leaveMeeting,
		type: 'GlobalActions',
	},
	EndMeeting: {
		oldActionId: 'EndMeeting',
		newActionId: ActionIdGlobal.endMeeting,
		type: 'GlobalActions',
	},
	EnableWaitingRoom: {
		oldActionId: 'EnableWaitingRoom',
		newActionId: ActionIdGlobalWaitingRoomsAndZak.enableWaitingRoom,
		type: 'GlobalActions',
	},
	DisableWaitingRoom: {
		oldActionId: 'DisableWaitingRoom',
		newActionId: ActionIdGlobalWaitingRoomsAndZak.disableWaitingRoom,
		type: 'GlobalActions',
	},
	StartCameraShare: {
		oldActionId: 'StartCameraShare',
		newActionId: ActionIdUserScreenshare.startCameraShare,
		type: 'GlobalActions',
	},
	StartShareWithWindow: {
		oldActionId: 'StartShareWithWindow',
		newActionId: ActionIdUserScreenshare.startShareWithWindow,
		type: 'GlobalActions',
	},
	StartAudioShare: {
		oldActionId: 'StartAudioShare',
		newActionId: ActionIdUserScreenshare.startAudioShare,
		type: 'GlobalActions',
	},
	StartScreenShare: {
		oldActionId: 'StartScreenShare',
		newActionId: ActionIdUserScreenshare.startScreenShare,
		type: 'GlobalActions',
	},
	SendAChatToEveryone: {
		oldActionId: 'SendAChatToEveryone',
		newActionId: ActionIdGlobal.sendAChatToEveryone,
		type: 'GlobalActions',
	},
	CreateBreakoutRoom: {
		oldActionId: 'CreateBreakoutRoom',
		newActionId: ActionIdGlobalBreakoutRooms.createBreakoutRoom,
		type: 'GlobalActions',
	},
	DeleteBreakoutRoom: {
		oldActionId: 'DeleteBreakoutRoom',
		newActionId: ActionIdGlobalBreakoutRooms.deleteBreakoutRoom,
		type: 'GlobalActions',
	},
	BroadcastMessageToBreakoutRooms: {
		oldActionId: 'BroadcastMessageToBreakoutRooms',
		newActionId: ActionIdGlobalBreakoutRooms.broadcastMessageToBreakoutRooms,
		type: 'GlobalActions',
	},
	SendMessageToWaitingRoom: {
		oldActionId: 'SendMessageToWaitingRoom',
		newActionId: ActionIdGlobalWaitingRoomsAndZak.sendMessageToWaitingRoom,
		type: 'GlobalActions',
	},
	PingZoomOSC: {
		oldActionId: 'PingZoomOSC',
		newActionId: ActionIdGlobal.pingZoomOSC,
		type: 'SpecialActions',
	},
	RequestOrderOfGalleryView: {
		oldActionId: 'RequestOrderOfGalleryView',
		newActionId: ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfGalleryView,
		type: 'SpecialActions',
	},
	ListUsers: {
		oldActionId: 'ListUsers',
		newActionId: ActionIdGlobalMemoryManagement.listUsers,
		type: 'SpecialActions',
	},
	ConfigureBreakoutRooms: {
		oldActionId: 'configureBreakoutRooms',
		newActionId: ActionIdGlobalBreakoutRooms.configureBreakoutRooms,
		type: 'SpecialActions',
	},
	JoinMeeting: {
		oldActionId: 'JoinMeeting',
		newActionId: ActionIdGlobal.joinMeeting,
		type: 'SpecialActions',
	},
	ZAKJoinMeeting: {
		oldActionId: 'ZAKJoinMeeting',
		newActionId: ActionIdGlobalWaitingRoomsAndZak.ZAKJoinMeeting,
		type: 'SpecialActions',
	},
	ZAKStartMeeting: {
		oldActionId: 'ZAKStartMeeting',
		newActionId: ActionIdGlobalWaitingRoomsAndZak.ZAKStartMeeting,
		type: 'SpecialActions',
	},
	CustomCommand: {
		oldActionId: 'CustomCommand',
		newActionId: ActionId.customCommand,
		type: 'SpecialActions',
	},
	CustomCommandWithArguments: {
		oldActionId: 'CustomCommandWithArguments',
		newActionId: ActionId.customCommandWithArguments,
		type: 'SpecialActions',
	},
	setAudioGainReduction: {
		oldActionId: 'setAudioGainReduction',
		newActionId: ActionIdZoomISOOutputSettings.setAudioGainReduction,
		type: 'ISOActions',
	},
	setOutputSelection: {
		oldActionId: 'setOutputSelection',
		newActionId: ActionIdZoomISOOutputSettings.setOutputSelection,
		type: 'ISOActions',
	},
	setAudioSelection: {
		oldActionId: 'setAudioSelection',
		newActionId: ActionIdZoomISOOutputSettings.setAudioSelection,
		type: 'ISOActions',
	},
	setOutputEmbeddedAudio: {
		oldActionId: 'setOutputEmbeddedAudio',
		newActionId: ActionIdZoomISOOutputSettings.setOutputEmbeddedAudio,
		type: 'ISOActions',
	},
	setVideoLossMode: {
		oldActionId: 'setVideoLossMode',
		newActionId: ActionIdZoomISOOutputSettings.setVideoLossMode,
		type: 'ISOActions',
	},
	setOutputName: {
		oldActionId: 'setOutputName',
		newActionId: ActionIdZoomISOOutputSettings.setOutputName,
		type: 'ISOActions',
	},
	deleteOutput: {
		oldActionId: 'deleteOutput',
		newActionId: ActionIdZoomISOOutputSettings.deleteOutput,
		type: 'ISOActions',
	},
	outputISO: {
		oldActionId: 'outputISO',
		newActionId: ActionIdZoomISORouting.outputISO,
		type: 'ISOActions',
	},
	audioISO: {
		oldActionId: 'audioISO',
		newActionId: ActionIdZoomISORouting.audioISO,
		type: 'ISOActions',
	},
	startISOEngine: {
		oldActionId: 'startISOEngine',
		newActionId: ActionIdZoomISOEngine.startISOEngine,
		type: 'ISOActions',
	},
	stopISOEngine: {
		oldActionId: 'stopISOEngine',
		newActionId: ActionIdZoomISOEngine.stopISOEngine,
		type: 'ISOActions',
	},
	standbyISOEngine: {
		oldActionId: 'standbyISOEngine',
		newActionId: ActionIdZoomISOEngine.standbyISOEngine,
		type: 'ISOActions',
	},
	addOutput: {
		oldActionId: 'addOutput',
		newActionId: ActionIdZoomISOOutputSettings.addOutput,
		type: 'ISOActions',
	},
	setOutputCount: {
		oldActionId: 'setOutputCount',
		newActionId: ActionIdZoomISOOutputSettings.setOutputCount,
		type: 'ISOActions',
	},
	enableOutput: {
		oldActionId: 'enableOutput',
		newActionId: ActionIdZoomISOOutputSettings.enableOutput,
		type: 'ISOActions',
	},
	disableOutput: {
		oldActionId: 'disableOutput',
		newActionId: ActionIdZoomISOOutputSettings.disableOutput,
		type: 'ISOActions',
	},
	loadISOConfig: {
		oldActionId: 'loadISOConfig',
		newActionId: ActionId.loadISOConfig,
		type: 'ISOActions',
	},
	saveISOConfig: {
		oldActionId: 'saveISOConfig',
		newActionId: ActionId.saveISOConfig,
		type: 'ISOActions',
	},
	mergeISOConfig: {
		oldActionId: 'mergeISOConfig',
		newActionId: ActionId.mergeISOConfig,
		type: 'ISOActions',
	},
	getConfigPath: {
		oldActionId: 'getConfigPath',
		newActionId: ActionId.getConfigPath,
		type: 'ISOActions',
	},
	setOutputMode: {
		oldActionId: 'setOutputMode',
		newActionId: ActionIdZoomISOOutputSettings.setOutputMode,
		type: 'ISOActions',
	},
	setOutputType: {
		oldActionId: 'setOutputType',
		newActionId: ActionIdZoomISOOutputSettings.setOutputType,
		type: 'ISOActions',
	},
	setAudioMode: {
		oldActionId: 'setAudioMode',
		newActionId: ActionIdZoomISOOutputSettings.setAudioMode,
		type: 'ISOActions',
	},
	acceptRecordingConsent: {
		oldActionId: 'acceptRecordingConsent',
		newActionId: ActionId.acceptRecordingConsent,
		type: 'ISOActions',
	},
	selectionMethod: {
		oldActionId: 'selectionMethod',
		newActionId: ActionIdUsers.selectionMethod,
		type: 'OtherActions',
	},
	SelectUser: {
		oldActionId: 'SelectUser',
		newActionId: ActionIdUserRolesAndAction.selectUser,
		type: 'OtherActions',
	},
	SelectUserByName: {
		oldActionId: 'SelectUserByName',
		newActionId: ActionIdUsers.selectUserByName,
		type: 'OtherActions',
	},
	SelectGroup: {
		oldActionId: 'SelectGroup',
		newActionId: ActionIdGroups.selectGroup,
		type: 'OtherActions',
		isGroupBased: true,
	},
	selectUserFromGroupPosition: {
		oldActionId: 'selectUserFromGroupPosition',
		newActionId: ActionIdGroups.selectUserFromGroupPosition,
		type: 'OtherActions',
		isGroupBased: true,
	},
	SelectFromGalleryPosition: {
		oldActionId: 'SelectFromGalleryPosition',
		newActionId: ActionIdGallery.selectFromGalleryPosition,
		type: 'OtherActions',
	},
	SelectFromIndexPosition: {
		oldActionId: 'SelectFromIndexPosition',
		newActionId: ActionIdUsers.selectFromIndexPosition,
		type: 'OtherActions',
	},
	clearParticipants: {
		oldActionId: 'clearParticipants',
		newActionId: ActionIdUsers.clearParticipants,
		type: 'OtherActions',
	},
	addToGroup: {
		oldActionId: 'addToGroup',
		newActionId: ActionIdGroups.addToGroup,
		type: 'OtherActions',
		isGroupBased: true,
	},
	clearGroup: {
		oldActionId: 'clearGroup',
		newActionId: ActionIdGroups.clearGroup,
		type: 'OtherActions',
		isGroupBased: true,
	},
	removeFromGroup: {
		oldActionId: 'removeFromGroup',
		newActionId: ActionIdGroups.removeFromGroup,
		type: 'OtherActions',
		isGroupBased: true,
	},
	rename: {
		oldActionId: 'rename',
		newActionId: ActionIdUserRolesAndAction.rename,
		type: 'OtherActions',
	},
	renameGroup: {
		oldActionId: 'renameGroup',
		newActionId: ActionIdGroups.renameGroup,
		type: 'OtherActions',
		isGroupBased: true,
	},
	nextParticipants: {
		oldActionId: 'nextParticipants',
		newActionId: ActionIdUsers.nextParticipants,
		type: 'OtherActions',
	},
	previousParticipants: {
		oldActionId: 'previousParticipants',
		newActionId: ActionIdUsers.previousParticipants,
		type: 'OtherActions',
	},
	selectOutput: {
		oldActionId: 'selectOutput',
		newActionId: ActionIdZoomISOActions.selectOutput,
		type: 'OtherActionsISO',
	},
	selectAudioOutput: {
		oldActionId: 'selectAudioOutput',
		newActionId: ActionIdZoomISOActions.selectAudioChannel,
		type: 'OtherActionsISO',
	},
	takeSelectedOutputs: {
		oldActionId: 'takeSelectedOutputs',
		newActionId: ActionIdZoomISOActions.applyOutput,
		type: 'OtherActionsISO',
	},
}

export const v2Feedbacks: v2Feedback = {
	selectionMethod: {
		oldFeedbackId: 'selectionMethod',
		newFeedbackId: FeedbackId.selectionMethod,
	},
	groupBased: {
		oldFeedbackId: 'groupBased',
		newFeedbackId: FeedbackId.groupBased,
		isGroupBased: true,
	},
	indexBased: {
		oldFeedbackId: 'indexBased',
		newFeedbackId: FeedbackId.indexBased,
	},
	userNameBased: {
		oldFeedbackId: 'userNameBased',
		newFeedbackId: FeedbackId.userNameBased,
	},
	galleryBased: {
		oldFeedbackId: 'galleryBased',
		newFeedbackId: FeedbackId.galleryBased,
	},
	engineState: {
		oldFeedbackId: 'engineState',
		newFeedbackId: FeedbackId.engineState,
	},
	output: {
		oldFeedbackId: 'output',
		newFeedbackId: FeedbackId.output,
	},
	audioOutput: {
		oldFeedbackId: 'audioOutput',
		newFeedbackId: FeedbackId.audioOutput,
	},
}

export const v2FeedbackTypes: v2FeedbackType = {
	selected: {
		oldFeedbackId: 'selected',
		newFeedbackId: feedbackType.selected,
	},
	micLive: {
		oldFeedbackId: 'micLive',
		newFeedbackId: feedbackType.micLive,
	},
	handRaised: {
		oldFeedbackId: 'handRaised',
		newFeedbackId: feedbackType.handRaised,
	},
	camera: {
		oldFeedbackId: 'camera',
		newFeedbackId: feedbackType.camera,
	},
	activeSpeaker: {
		oldFeedbackId: 'activeSpeaker',
		newFeedbackId: feedbackType.activeSpeaker,
	},
}

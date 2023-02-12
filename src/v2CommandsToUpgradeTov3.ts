import { ActionId } from './actions'
import { FeedbackId, feedbackType } from './feedback'

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
		newActionId: ActionId.spotLight,
		type: 'UserActions',
	},
	AddSpotlight: {
		oldActionId: 'AddSpotlight',
		newActionId: ActionId.addSpotlight,
		type: 'UserActions',
	},
	Pin: {
		oldActionId: 'Pin',
		newActionId: ActionId.pin,
		type: 'UserActions',
	},
	AddPin: {
		oldActionId: 'AddPin',
		newActionId: ActionId.addPin,
		type: 'UserActions',
	},
	Unpin: {
		oldActionId: 'Unpin',
		newActionId: ActionId.unpin,
		type: 'UserActions',
	},
	PinScreen2: {
		oldActionId: 'PinScreen2',
		newActionId: ActionId.pinScreen2,
		type: 'UserActions',
	},
	UnpinScreen2: {
		oldActionId: 'UnpinScreen2',
		newActionId: ActionId.unPinScreen2,
		type: 'UserActions',
	},
	TogglePinScreen2: {
		oldActionId: 'TogglePinScreen2',
		newActionId: ActionId.togglePinScreen2,
		type: 'UserActions',
	},
	UnSpotlight: {
		oldActionId: 'UnSpotlight',
		newActionId: ActionId.unSpotLight,
		type: 'UserActions',
	},
	ToggleSpotlight: {
		oldActionId: 'ToggleSpotlight',
		newActionId: ActionId.toggleSpotlight,
		type: 'UserActions',
	},
	TurnVideoOn: {
		oldActionId: 'TurnVideoOn',
		newActionId: ActionId.turnVideoOn,
		type: 'UserActions',
	},
	TurnVideoOff: {
		oldActionId: 'TurnVideoOff',
		newActionId: ActionId.turnVideoOff,
		type: 'UserActions',
	},
	ToggleVideoState: {
		oldActionId: 'ToggleVideoState',
		newActionId: ActionId.toggleVideoState,
		type: 'UserActions',
	},
	Mute: {
		oldActionId: 'Mute',
		newActionId: ActionId.mute,
		type: 'UserActions',
	},
	Unmute: {
		oldActionId: 'Unmute',
		newActionId: ActionId.unmute,
		type: 'UserActions',
	},
	ToggleMuteState: {
		oldActionId: 'ToggleMuteState',
		newActionId: ActionId.toggleMuteState,
		type: 'UserActions',
	},
	RaiseHand: {
		oldActionId: 'RaiseHand',
		newActionId: ActionId.raiseHand,
		type: 'UserActions',
	},
	LowerHand: {
		oldActionId: 'LowerHand',
		newActionId: ActionId.lowerHand,
		type: 'UserActions',
	},
	ToggleHand: {
		oldActionId: 'ToggleHand',
		newActionId: ActionId.toggleHand,
		type: 'UserActions',
	},
	MakeHost: {
		oldActionId: 'MakeHost',
		newActionId: ActionId.makeHost,
		type: 'UserActions',
	},
	MakeCoHost: {
		oldActionId: 'MakeCoHost',
		newActionId: ActionId.makeCoHost,
		type: 'UserActions',
	},
	RevokeCoHost: {
		oldActionId: 'RevokeCoHost',
		newActionId: ActionId.revokeCoHost,
		type: 'UserActions',
	},
	ReclaimHost: {
		oldActionId: 'ReclaimHost',
		newActionId: ActionId.reclaimHost,
		type: 'UserActions',
	},
	MakePanelist: {
		oldActionId: 'MakePanelist',
		newActionId: ActionId.makePanelist,
		type: 'UserActions',
	},
	MakeAttendee: {
		oldActionId: 'MakeAttendee',
		newActionId: ActionId.makeAttendee,
		type: 'UserActions',
	},
	EjectParticipant: {
		oldActionId: 'EjectParticipant',
		newActionId: ActionId.ejectParticipant,
		type: 'UserActions',
	},
	ReturnSelfToMainMeeting: {
		oldActionId: 'ReturnSelfToMainMeeting',
		newActionId: ActionId.returnSelfToMainMeeting,
		type: 'UserActions',
	},
	AdmitSomeoneFromWaitingRoom: {
		oldActionId: 'AdmitSomeoneFromWaitingRoom',
		newActionId: ActionId.admitSomeoneFromWaitingRoom,
		type: 'UserActions',
	},
	SendSomeoneToWaitingRoom: {
		oldActionId: 'SendSomeoneToWaitingRoom',
		newActionId: ActionId.sendSomeoneToWaitingRoom,
		type: 'UserActions',
	},
	AllowWebinarAttendeeToSpeak: {
		oldActionId: 'AllowWebinarAttendeeToSpeak',
		newActionId: ActionId.allowWebinarAttendeeToSpeak,
		type: 'UserActions',
	},
	ShutUpWebinarAttendee: {
		oldActionId: 'ShutUpWebinarAttendee',
		newActionId: ActionId.disallowToSpeak,
		type: 'UserActions',
	},
	AllowToRecord: {
		oldActionId: 'AllowToRecord',
		newActionId: ActionId.allowToRecord,
		type: 'UserActions',
	},
	DisallowToRecord: {
		oldActionId: 'DisallowToRecord',
		newActionId: ActionId.disallowToRecord,
		type: 'UserActions',
	},
	EnableOriginalSound: {
		oldActionId: 'EnableOriginalSound',
		newActionId: ActionId.enableOriginalSound,
		type: 'UserActions',
	},
	DisableOriginalSound: {
		oldActionId: 'DisableOriginalSound',
		newActionId: ActionId.disableOriginalSound,
		type: 'UserActions',
	},
	EnableMirrorVideo: {
		oldActionId: 'EnableMirrorVideo',
		newActionId: ActionId.enableMirrorVideo,
		type: 'UserActions',
	},
	DisableMirrorVideo: {
		oldActionId: 'DisableMirrorVideo',
		newActionId: ActionId.disableMirrorVideo,
		type: 'UserActions',
	},
	SendParticipantToBreakoutRoom: {
		oldActionId: 'SendParticipantToBreakoutRoom',
		newActionId: ActionId.sendParticipantToBreakoutRoom,
		type: 'UserActions',
	},
	RemoveParticipantFromBreakoutRoom: {
		oldActionId: 'RemoveParticipantFromBreakoutRoom',
		newActionId: ActionId.removeParticipantFromBreakoutRoom,
		type: 'UserActions',
	},
	AssignParticipantToBreakoutRoom: {
		oldActionId: 'AssignParticipantToBreakoutRoom',
		newActionId: ActionId.assignParticipantToBreakoutRoom,
		type: 'UserActions',
	},
	UnassignParticipantFromBreakoutRoom: {
		oldActionId: 'UnassignParticipantFromBreakoutRoom',
		newActionId: ActionId.unassignParticipantFromBreakoutRoom,
		type: 'UserActions',
	},
	Rename: {
		oldActionId: 'Rename',
		newActionId: ActionId.rename,
		type: 'UserActions',
	},
	SetWindowPosition: {
		oldActionId: 'SetWindowPosition',
		newActionId: ActionId.SetWindowPosition,
		type: 'UserActions',
	},
	SetWindowSize: {
		oldActionId: 'SetWindowSize',
		newActionId: ActionId.SetWindowSize,
		type: 'UserActions',
	},
	SetVirtualBackground: {
		oldActionId: 'SetVirtualBackground',
		newActionId: ActionId.setVirtualBackground,
		type: 'UserActions',
	},
	SetVideoFilter: {
		oldActionId: 'SetVideoFilter',
		newActionId: ActionId.setVideoFilter,
		type: 'UserActions',
	},
	SetCameraDevice: {
		oldActionId: 'SetCameraDevice',
		newActionId: ActionId.setCameraDevice,
		type: 'UserActions',
	},
	SetSpeakerVolume: {
		oldActionId: 'SetSpeakerVolume',
		newActionId: ActionId.setSpeakerVolume,
		type: 'UserActions',
	},
	SetSpeakerDevice: {
		oldActionId: 'SetSpeakerDevice',
		newActionId: ActionId.setSpeakerDevice,
		type: 'UserActions',
	},
	SetMicDevice: {
		oldActionId: 'SetMicDevice',
		newActionId: ActionId.setMicDevice,
		type: 'UserActions',
	},
	SetMicLevel: {
		oldActionId: 'SetMicLevel',
		newActionId: ActionId.setMicLevel,
		type: 'UserActions',
	},
	SendAChatViaDM: {
		oldActionId: 'SendAChatViaDM',
		newActionId: ActionId.sendAChatViaDM,
		type: 'UserActions',
	},
	ClearPins: {
		oldActionId: 'ClearPins',
		newActionId: ActionId.clearPins,
		type: 'GlobalActions',
	},
	TogglePin: {
		oldActionId: 'TogglePin',
		newActionId: ActionId.togglePin,
		type: 'GlobalActions',
	},
	ClearPinsScreen2: {
		oldActionId: 'ClearPinsScreen2',
		newActionId: ActionId.clearPinsScreen2,
		type: 'GlobalActions',
	},
	StartScreenShareWithPrimaryScreen: {
		oldActionId: 'StartScreenShareWithPrimaryScreen',
		newActionId: ActionId.startScreenShareWithPrimaryScreen,
		type: 'GlobalActions',
	},
	CycleSharedCameraToNextAvailable: {
		oldActionId: 'CycleSharedCameraToNextAvailable',
		newActionId: ActionId.cycleSharedCameraToNextAvailable,
		type: 'GlobalActions',
	},
	StopSharing: {
		oldActionId: 'StopSharing',
		newActionId: ActionId.stopSharing,
		type: 'GlobalActions',
	},
	GotoNextGalleryPage: {
		oldActionId: 'GotoNextGalleryPage',
		newActionId: ActionId.gotoNextGalleryPage,
		type: 'GlobalActions',
	},
	GotoPreviousGalleryPage: {
		oldActionId: 'GotoPreviousGalleryPage',
		newActionId: ActionId.gotoPreviousGalleryPage,
		type: 'GlobalActions',
	},
	SetSpeakerView: {
		oldActionId: 'SetSpeakerView',
		newActionId: ActionId.setSpeakerView,
		type: 'GlobalActions',
	},
	ShowNonVideoParticipants: {
		oldActionId: 'ShowNonVideoParticipants',
		newActionId: ActionId.showNonVideoParticipants,
		type: 'GlobalActions',
	},
	HideNonVideoParticipants: {
		oldActionId: 'HideNonVideoParticipants',
		newActionId: ActionId.hideNonVideoParticipants,
		type: 'GlobalActions',
	},
	ShowUserNamesOnVideo: {
		oldActionId: 'ShowUserNamesOnVideo',
		newActionId: ActionId.showUserNamesOnVideo,
		type: 'GlobalActions',
	},
	HideUserNamesOnVideo: {
		oldActionId: 'HideUserNamesOnVideo',
		newActionId: ActionId.hideUserNamesOnVideo,
		type: 'GlobalActions',
	},
	EnableHDVideo: {
		oldActionId: 'EnableHDVideo',
		newActionId: ActionId.enableHDVideo,
		type: 'GlobalActions',
	},
	DisableHDVideo: {
		oldActionId: 'DisableHDVideo',
		newActionId: ActionId.disableHDVideo,
		type: 'GlobalActions',
	},
	EnableOptimizeVideoForSharing: {
		oldActionId: 'EnableOptimizeVideoForSharing',
		newActionId: ActionId.enableOptimizeVideoForSharing,
		type: 'GlobalActions',
	},
	DisableOptimizeVideoForSharing: {
		oldActionId: 'DisableOptimizeVideoForSharing',
		newActionId: ActionId.disableOptimizeVideoForSharing,
		type: 'GlobalActions',
	},
	EnableComputerSoundWhenSharing: {
		oldActionId: 'EnableComputerSoundWhenSharing',
		newActionId: ActionId.enableComputerSoundWhenSharing,
		type: 'GlobalActions',
	},
	DisableComputerSoundWhenSharing: {
		oldActionId: 'DisableComputerSoundWhenSharing',
		newActionId: ActionId.disableComputerSoundWhenSharing,
		type: 'GlobalActions',
	},
	SetGalleryView: {
		oldActionId: 'SetGalleryView',
		newActionId: ActionId.setGalleryView,
		type: 'GlobalActions',
	},
	MuteAll: {
		oldActionId: 'MuteAll',
		newActionId: ActionId.muteAll,
		type: 'GlobalActions',
	},
	UnmuteAll: {
		oldActionId: 'UnmuteAll',
		newActionId: ActionId.unmuteAll,
		type: 'GlobalActions',
	},
	ClearSpotlight: {
		oldActionId: 'ClearSpotlight',
		newActionId: ActionId.clearSpotlight,
		type: 'GlobalActions',
	},
	EnableUsersToUnmute: {
		oldActionId: 'EnableUsersToUnmute',
		newActionId: ActionId.enableUsersToUnmute,
		type: 'GlobalActions',
	},
	DisableUsersToUnmute: {
		oldActionId: 'DisableUsersToUnmute',
		newActionId: ActionId.disableUsersToUnmute,
		type: 'GlobalActions',
	},
	LowerAllHands: {
		oldActionId: 'LowerAllHands',
		newActionId: ActionId.lowerAllHands,
		type: 'GlobalActions',
	},
	OpenBreakoutRooms: {
		oldActionId: 'OpenBreakoutRooms',
		newActionId: ActionId.openBreakoutRooms,
		type: 'GlobalActions',
	},
	CloseBreakoutRooms: {
		oldActionId: 'CloseBreakoutRooms',
		newActionId: ActionId.closeBreakoutRooms,
		type: 'GlobalActions',
	},
	DeleteAllBreakoutRooms: {
		oldActionId: 'DeleteAllBreakoutRooms',
		newActionId: ActionId.deleteAllBreakoutRooms,
		type: 'GlobalActions',
	},
	AdmitEveryoneFromWaitingRoom: {
		oldActionId: 'AdmitEveryoneFromWaitingRoom',
		newActionId: ActionId.admitEveryoneFromWaitingRoom,
		type: 'GlobalActions',
	},
	EjectAllWebinarAttendees: {
		oldActionId: 'EjectAllWebinarAttendees',
		newActionId: ActionId.ejectAll,
		type: 'GlobalActions',
	},
	StartLocalRecording: {
		oldActionId: 'StartLocalRecording',
		newActionId: ActionId.startLocalRecording,
		type: 'GlobalActions',
	},
	PauseLocalRecording: {
		oldActionId: 'PauseLocalRecording',
		newActionId: ActionId.pauseLocalRecording,
		type: 'GlobalActions',
	},
	ResumeLocalRecording: {
		oldActionId: 'ResumeLocalRecording',
		newActionId: ActionId.resumeLocalRecording,
		type: 'GlobalActions',
	},
	StopLocalRecording: {
		oldActionId: 'StopLocalRecording',
		newActionId: ActionId.stopLocalRecording,
		type: 'GlobalActions',
	},
	StartCloudRecording: {
		oldActionId: 'StartCloudRecording',
		newActionId: ActionId.startCloudRecording,
		type: 'GlobalActions',
	},
	PauseCloudRecording: {
		oldActionId: 'PauseCloudRecording',
		newActionId: ActionId.pauseCloudRecording,
		type: 'GlobalActions',
	},
	ResumeCloudRecording: {
		oldActionId: 'ResumeCloudRecording',
		newActionId: ActionId.resumeCloudRecording,
		type: 'GlobalActions',
	},
	StopCloudRecording: {
		oldActionId: 'StopCloudRecording',
		newActionId: ActionId.stopCloudRecording,
		type: 'GlobalActions',
	},
	RequestGalleryCount: {
		oldActionId: 'RequestGalleryCount',
		newActionId: ActionId.requestGalleryCount,
		type: 'GlobalActions',
	},
	RequestListOfBreakoutRooms: {
		oldActionId: 'RequestListOfBreakoutRooms',
		newActionId: ActionId.requestListOfBreakoutRooms,
		type: 'GlobalActions',
	},
	LeaveMeeting: {
		oldActionId: 'LeaveMeeting',
		newActionId: ActionId.leaveMeeting,
		type: 'GlobalActions',
	},
	EndMeeting: {
		oldActionId: 'EndMeeting',
		newActionId: ActionId.endMeeting,
		type: 'GlobalActions',
	},
	EnableWaitingRoom: {
		oldActionId: 'EnableWaitingRoom',
		newActionId: ActionId.enableWaitingRoom,
		type: 'GlobalActions',
	},
	DisableWaitingRoom: {
		oldActionId: 'DisableWaitingRoom',
		newActionId: ActionId.disableWaitingRoom,
		type: 'GlobalActions',
	},
	StartCameraShare: {
		oldActionId: 'StartCameraShare',
		newActionId: ActionId.startCameraShare,
		type: 'GlobalActions',
	},
	StartShareWithWindow: {
		oldActionId: 'StartShareWithWindow',
		newActionId: ActionId.startShareWithWindow,
		type: 'GlobalActions',
	},
	StartAudioShare: {
		oldActionId: 'StartAudioShare',
		newActionId: ActionId.startAudioShare,
		type: 'GlobalActions',
	},
	StartScreenShare: {
		oldActionId: 'StartScreenShare',
		newActionId: ActionId.startScreenShare,
		type: 'GlobalActions',
	},
	SendAChatToEveryone: {
		oldActionId: 'SendAChatToEveryone',
		newActionId: ActionId.sendAChatToEveryone,
		type: 'GlobalActions',
	},
	CreateBreakoutRoom: {
		oldActionId: 'CreateBreakoutRoom',
		newActionId: ActionId.createBreakoutRoom,
		type: 'GlobalActions',
	},
	DeleteBreakoutRoom: {
		oldActionId: 'DeleteBreakoutRoom',
		newActionId: ActionId.deleteBreakoutRoom,
		type: 'GlobalActions',
	},
	BroadcastMessageToBreakoutRooms: {
		oldActionId: 'BroadcastMessageToBreakoutRooms',
		newActionId: ActionId.broadcastMessageToBreakoutRooms,
		type: 'GlobalActions',
	},
	SendMessageToWaitingRoom: {
		oldActionId: 'SendMessageToWaitingRoom',
		newActionId: ActionId.sendMessageToWaitingRoom,
		type: 'GlobalActions',
	},
	PingZoomOSC: {
		oldActionId: 'PingZoomOSC',
		newActionId: ActionId.pingZoomOSC,
		type: 'SpecialActions',
	},
	RequestOrderOfGalleryView: {
		oldActionId: 'RequestOrderOfGalleryView',
		newActionId: ActionId.requestOrderOfGalleryView,
		type: 'SpecialActions',
	},
	ListUsers: {
		oldActionId: 'ListUsers',
		newActionId: ActionId.listUsers,
		type: 'SpecialActions',
	},
	ConfigureBreakoutRooms: {
		oldActionId: 'configureBreakoutRooms',
		newActionId: ActionId.configureBreakoutRooms,
		type: 'SpecialActions',
	},
	JoinMeeting: {
		oldActionId: 'JoinMeeting',
		newActionId: ActionId.joinMeeting,
		type: 'SpecialActions',
	},
	ZAKJoinMeeting: {
		oldActionId: 'ZAKJoinMeeting',
		newActionId: ActionId.ZAKJoinMeeting,
		type: 'SpecialActions',
	},
	ZAKStartMeeting: {
		oldActionId: 'ZAKStartMeeting',
		newActionId: ActionId.ZAKStartMeeting,
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
		newActionId: ActionId.setAudioGainReduction,
		type: 'ISOActions',
	},
	setOutputSelection: {
		oldActionId: 'setOutputSelection',
		newActionId: ActionId.setOutputSelection,
		type: 'ISOActions',
	},
	setAudioSelection: {
		oldActionId: 'setAudioSelection',
		newActionId: ActionId.setAudioSelection,
		type: 'ISOActions',
	},
	setOutputEmbeddedAudio: {
		oldActionId: 'setOutputEmbeddedAudio',
		newActionId: ActionId.setOutputEmbeddedAudio,
		type: 'ISOActions',
	},
	setVideoLossMode: {
		oldActionId: 'setVideoLossMode',
		newActionId: ActionId.setVideoLossMode,
		type: 'ISOActions',
	},
	setOutputName: {
		oldActionId: 'setOutputName',
		newActionId: ActionId.setOutputName,
		type: 'ISOActions',
	},
	deleteOutput: {
		oldActionId: 'deleteOutput',
		newActionId: ActionId.deleteOutput,
		type: 'ISOActions',
	},
	outputISO: {
		oldActionId: 'outputISO',
		newActionId: ActionId.outputISO,
		type: 'ISOActions',
	},
	audioISO: {
		oldActionId: 'audioISO',
		newActionId: ActionId.audioISO,
		type: 'ISOActions',
	},
	startISOEngine: {
		oldActionId: 'startISOEngine',
		newActionId: ActionId.startISOEngine,
		type: 'ISOActions',
	},
	stopISOEngine: {
		oldActionId: 'stopISOEngine',
		newActionId: ActionId.stopISOEngine,
		type: 'ISOActions',
	},
	standbyISOEngine: {
		oldActionId: 'standbyISOEngine',
		newActionId: ActionId.standbyISOEngine,
		type: 'ISOActions',
	},
	addOutput: {
		oldActionId: 'addOutput',
		newActionId: ActionId.addOutput,
		type: 'ISOActions',
	},
	setOutputCount: {
		oldActionId: 'setOutputCount',
		newActionId: ActionId.setOutputCount,
		type: 'ISOActions',
	},
	enableOutput: {
		oldActionId: 'enableOutput',
		newActionId: ActionId.enableOutput,
		type: 'ISOActions',
	},
	disableOutput: {
		oldActionId: 'disableOutput',
		newActionId: ActionId.disableOutput,
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
		newActionId: ActionId.setOutputMode,
		type: 'ISOActions',
	},
	setOutputType: {
		oldActionId: 'setOutputType',
		newActionId: ActionId.setOutputType,
		type: 'ISOActions',
	},
	setAudioMode: {
		oldActionId: 'setAudioMode',
		newActionId: ActionId.setAudioMode,
		type: 'ISOActions',
	},
	acceptRecordingConsent: {
		oldActionId: 'acceptRecordingConsent',
		newActionId: ActionId.acceptRecordingConsent,
		type: 'ISOActions',
	},
	selectionMethod: {
		oldActionId: 'selectionMethod',
		newActionId: ActionId.selectionMethod,
		type: 'OtherActions',
	},
	SelectUser: {
		oldActionId: 'SelectUser',
		newActionId: ActionId.selectUser,
		type: 'OtherActions',
	},
	SelectUserByName: {
		oldActionId: 'SelectUserByName',
		newActionId: ActionId.selectUserByName,
		type: 'OtherActions',
	},
	SelectGroup: {
		oldActionId: 'SelectGroup',
		newActionId: ActionId.selectGroup,
		type: 'OtherActions',
		isGroupBased: true,
	},
	selectUserFromGroupPosition: {
		oldActionId: 'selectUserFromGroupPosition',
		newActionId: ActionId.selectUserFromGroupPosition,
		type: 'OtherActions',
		isGroupBased: true,
	},
	SelectFromGalleryPosition: {
		oldActionId: 'SelectFromGalleryPosition',
		newActionId: ActionId.selectFromGalleryPosition,
		type: 'OtherActions',
	},
	SelectFromIndexPosition: {
		oldActionId: 'SelectFromIndexPosition',
		newActionId: ActionId.selectFromIndexPosition,
		type: 'OtherActions',
	},
	clearParticipants: {
		oldActionId: 'clearParticipants',
		newActionId: ActionId.clearParticipants,
		type: 'OtherActions',
	},
	addToGroup: {
		oldActionId: 'addToGroup',
		newActionId: ActionId.addToGroup,
		type: 'OtherActions',
		isGroupBased: true,
	},
	clearGroup: {
		oldActionId: 'clearGroup',
		newActionId: ActionId.clearGroup,
		type: 'OtherActions',
		isGroupBased: true,
	},
	removeFromGroup: {
		oldActionId: 'removeFromGroup',
		newActionId: ActionId.removeFromGroup,
		type: 'OtherActions',
		isGroupBased: true,
	},
	rename: {
		oldActionId: 'rename',
		newActionId: ActionId.rename,
		type: 'OtherActions',
	},
	renameGroup: {
		oldActionId: 'renameGroup',
		newActionId: ActionId.renameGroup,
		type: 'OtherActions',
		isGroupBased: true,
	},
	nextParticipants: {
		oldActionId: 'nextParticipants',
		newActionId: ActionId.nextParticipants,
		type: 'OtherActions',
	},
	previousParticipants: {
		oldActionId: 'previousParticipants',
		newActionId: ActionId.previousParticipants,
		type: 'OtherActions',
	},
	selectOutput: {
		oldActionId: 'selectOutput',
		newActionId: ActionId.selectOutput,
		type: 'OtherActionsISO',
	},
	selectAudioOutput: {
		oldActionId: 'selectAudioOutput',
		newActionId: ActionId.selectAudioChannel,
		type: 'OtherActionsISO',
	},
	takeSelectedOutputs: {
		oldActionId: 'takeSelectedOutputs',
		newActionId: ActionId.applyOutput,
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

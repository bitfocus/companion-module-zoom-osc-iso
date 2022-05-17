export interface userActionType {
	[key: string]: { shortDescription: string; command: string; description: string; args?: any }
}
const UserActions: userActionType = {
	Pin: { description: 'User Action: pin', shortDescription: 'Pin', command: '/pin' },
	AddPin: { description: 'User Action: Add Pin', shortDescription: 'AddPin', command: '/addPin' },
	Unpin: { description: 'User Action: Unpin', shortDescription: 'Unpin', command: '/unPin' },
	ClearPins: { description: 'User Action: Clear Pins', shortDescription: 'ClearPins', command: '/clearPin' },
	TogglePin: { description: 'User Action: TogglePin', shortDescription: 'TogglePin', command: '/togglePin' },
	PinScreen2: { description: 'User Action: Pin Screen2', shortDescription: 'PinScreen2', command: '/pin2' },
	UnpinScreen2: { description: 'User Action: Unpin Screen2', shortDescription: 'UnpinScreen2', command: '/unPin2' },
	ClearPinsScreen2: {
		description: 'User Action: Clear PinsScreen2',
		shortDescription: 'ClearPinsScreen2',
		command: '/clearPin2',
	},
	TogglePinScreen2: {
		description: 'User Action: Toggle PinScreen2',
		shortDescription: 'TogglePinScreen2',
		command: '/togglePin2',
	},
	RemotePin: { description: 'User Action: Remote Pin', shortDescription: 'RemotePin', command: '/remotePin' },
	RemoteAddPin: {
		description: 'User Action: Remote AddPin',
		shortDescription: 'RemoteAddPin',
		command: '/remoteAddPin',
	},
	RemoteUnpin: { description: 'User Action: Remote Unpin', shortDescription: 'RemoteUnpin', command: '/remoteUnPin' },
	RemoteClearPin: {
		description: 'User Action: Remote ClearPin',
		shortDescription: 'RemoteClearPin',
		command: '/remoteClearPin',
	},
	RemoteTogglePin: {
		description: 'User Action: Remote TogglePin',
		shortDescription: 'RemoteTogglePin',
		command: '/remoteTogglePin',
	},
	RemotePinScreen2: {
		description: 'User Action: Remote Pin Screen2',
		shortDescription: 'RemotePinScreen2',
		command: '/remotePin2',
	},
	RemoteUnpinScreen2: {
		description: 'User Action: Remote Unpin Screen2',
		shortDescription: 'RemoteUnpinScreen2',
		command: '/remoteUnPin2',
	},
	RemoteClearPinScreen2: {
		description: 'User Action: Remote Clear PinScreen2',
		shortDescription: 'RemoteClearPinScreen2',
		command: '/remoteClearPin2',
	},
	RemoteTogglePinScreen2: {
		description: 'User Action: Remote Toggle Pin Screen2',
		shortDescription: 'RemoteTogglePinScreen2',
		command: '/remoteTogglePin2',
	},
	Spotlight: { description: 'User Action: Spotlight', shortDescription: 'Spotlight', command: '/spot' },
	AddSpotlight: { description: 'User Action: Add Spotlight', shortDescription: 'AddSpotlight', command: '/addSpot' },
	UnSpotlight: { description: 'User Action: Un Spotlight', shortDescription: 'UnSpotlight', command: '/unSpot' },
	ToggleSpotlight: {
		description: 'User Action: Toggle Spotlight',
		shortDescription: 'ToggleSpotlight',
		command: '/toggleSpot',
	},
	TurnVideoOn: { description: 'User Action: Turn Video On', shortDescription: 'TurnVideoOn', command: '/videoOn' },
	TurnVideoOff: { description: 'User Action: Turn Video Off', shortDescription: 'TurnVideoOff', command: '/videoOff' },
	ToggleVideoState: {
		description: 'User Action: Toggle Video State',
		shortDescription: 'ToggleVideoState',
		command: '/toggleVideo',
	},
	Mute: { description: 'User Action: Mute', shortDescription: 'Mute', command: '/mute' },
	Unmute: { description: 'User Action: Unmute', shortDescription: 'Unmute', command: '/unMute' },
	ToggleMuteState: {
		description: 'User Action: ToggleMuteState',
		shortDescription: 'ToggleMuteState',
		command: '/toggleMute',
	},
	SendAChatViaDM: { description: 'User Action: SendAChatViaDM', shortDescription: 'SendAChatViaDM', command: '/chat' },
	RemoteChat: { description: 'User Action: RemoteChat', shortDescription: 'RemoteChat', command: '/remoteChat', args: 'msg' },
	RaiseHand: { description: 'User Action: RaiseHand', shortDescription: 'RaiseHand', command: '/raiseHand' },
	LowerHand: { description: 'User Action: LowerHand', shortDescription: 'LowerHand', command: '/lowerHand' },
	ToggleHand: { description: 'User Action: ToggleHand', shortDescription: 'ToggleHand', command: '/toggleHand' },
	Rename: { description: 'User Action: Rename', shortDescription: 'Rename', command: '/rename' },
	MakeHost: { description: 'User Action: MakeHost', shortDescription: 'MakeHost', command: '/makeHost' },
	MakeCoHost: { description: 'User Action: MakeCoHost', shortDescription: 'MakeCoHost', command: '/makeCoHost' },
	RevokeCoHost: {
		description: 'User Action: RevokeCoHost',
		shortDescription: 'RevokeCoHost',
		command: '/revokeCoHost',
	},
	ReclaimHost: { description: 'User Action: ReclaimHost', shortDescription: 'ReclaimHost', command: '/reclaimHost' },
	MakePanelist: {
		description: 'User Action: MakePanelist',
		shortDescription: 'MakePanelist',
		command: '/makePanelist',
	},
	MakeAttendee: {
		description: 'User Action: MakeAttendee',
		shortDescription: 'MakeAttendee',
		command: '/makeAttendee',
	},
	EjectParticipant: {
		description: 'User Action: EjectParticipant',
		shortDescription: 'EjectParticipant',
		command: '/eject',
	},
	SendParticipantToBreakoutRoom: {
		description: 'User Action: SendParticipantToBreakoutRoom',
		shortDescription: 'SendParticipantToBreakoutRoom',
		command: '/sendToBreakout',
		args: 'name'
	},
	RemoveParticipantFromBreakoutRoom: {
		description: 'User Action: RemoveParticipantFromBreakoutRoom',
		shortDescription: 'RemoveParticipantFromBreakoutRoom',
		command: '/removeFromBreakout',
		args: 'name'
	},
	AssignParticipantToBreakoutRoom: {
		description: 'User Action: AssignParticipantToBreakoutRoom',
		shortDescription: 'AssignParticipantToBreakoutRoom',
		command: '/assignToBreakout',
		args: 'name'
	},
	UnassignParticipantFromBreakoutRoom: {
		description: 'User Action: UnassignParticipantFromBreakoutRoom',
		shortDescription: 'UnassignParticipantFromBreakoutRoom',
		command: '/unassignFromBreakout',
		args: 'name'
	},
	ReturnSelfToMainMeeting: {
		description: 'User Action: ReturnSelfToMainMeeting',
		shortDescription: 'ReturnSelfToMainMeeting',
		command: '/returnToMainMeeting',
	},
	AdmitSomeoneFromWaitingRoom: {
		description: 'User Action: AdmitSomeoneFromWaitingRoom',
		shortDescription: 'AdmitSomeoneFromWaitingRoom',
		command: '/admit',
	},
	SendSomeoneToWaitingRoom: {
		description: 'User Action: SendSomeoneToWaitingRoom',
		shortDescription: 'SendSomeoneToWaitingRoom',
		command: '/sendToWaitingRoom',
	},
	AllowWebinarAttendeeToSpeak: {
		description: 'User Action: AllowWebinarAttendeeToSpeak',
		shortDescription: 'AllowWebinarAttendeeToSpeak',
		command: '/allowToSpeak',
	},
	ShutUpWebinarAttendee: {
		description: 'User Action: ShutUpWebinarAttendee',
		shortDescription: 'ShutUpWebinarAttendee',
		command: '/disallowToSpeak',
	},
	StartScreenShare: {
		description: 'User Action: StartScreenShare',
		shortDescription: 'StartScreenShare',
		command: '/startScreenshare',
		args: 'id',
	},
	StartScreenShareWithPrimaryScreen: {
		description: 'User Action: StartScreenShareWithPrimaryScreen',
		shortDescription: 'StartScreenShareWithPrimaryScreen',
		command: '/startScreensharePrimary',
	},
	StartShareWithWindow: {
		description: 'User Action: StartShareWithWindow',
		shortDescription: 'StartShareWithWindow',
		command: '/startWindowShare',
		args: 'id',
	},
	StartAudioShare: {
		description: 'User Action: StartAudioShare',
		shortDescription: 'StartAudioShare',
		command: '/startAudioShare',
		args: 'id',
	},
	StartCameraShare: {
		description: 'User Action: StartCameraShare',
		shortDescription: 'StartCameraShare',
		command: '/startCameraShare',
		args: 'id',
	},
	CycleSharedCameraToNextAvailable: {
		description: 'User Action: CycleSharedCameraToNextAvailable',
		shortDescription: 'CycleSharedCameraToNextAvailable',
		command: '/shareNextCamera',
	},
	StopSharing: { description: 'User Action: StopSharing', shortDescription: 'StopSharing', command: '/stopShare' },
	RequestListWindowsForSharing: {
		description: 'User Action: RequestListWindowsForSharing',
		shortDescription: 'RequestListWindowsForSharing',
		command: '/listWindows',
	},
	RequestListScreensForSharing: {
		description: 'User Action: RequestListScreensForSharing',
		shortDescription: 'RequestListScreensForSharing',
		command: '/listScreens',
	},
	AllowToRecord: {
		description: 'User Action: AllowToRecord',
		shortDescription: 'AllowToRecord',
		command: '/allowToRecord',
	},
	DisallowToRecord: {
		description: 'User Action: DisallowToRecord',
		shortDescription: 'DisallowToRecord',
		command: '/disallowToRecord',
	},
	SetGalleryView: {
		description: 'User Action: SetGalleryView',
		shortDescription: 'SetGalleryView',
		command: '/setGalleryView',
	},
	GotoNextGalleryPage: {
		description: 'User Action: GotoNextGalleryPage',
		shortDescription: 'GotoNextGalleryPage',
		command: '/galleryPageNext',
	},
	GotoPreviousGalleryPage: {
		description: 'User Action: GotoPreviousGalleryPage',
		shortDescription: 'GotoPreviousGalleryPage',
		command: '/galleryPagePrev',
	},
	SetSpeakerView: {
		description: 'User Action: SetSpeakerView',
		shortDescription: 'SetSpeakerView',
		command: '/setSpeakerView',
	},
	ShowNonVideoParticipants: {
		description: 'User Action: ShowNonVideoParticipants',
		shortDescription: 'ShowNonVideoParticipants',
		command: '/showNonVideoParticipants',
	},
	HideNonVideoParticipants: {
		description: 'User Action: HideNonVideoParticipants',
		shortDescription: 'HideNonVideoParticipants',
		command: '/hideNonVideoParticipants',
	},
	ShowUserNamesOnVideo: {
		description: 'User Action: ShowUserNamesOnVideo',
		shortDescription: 'ShowUserNamesOnVideo',
		command: '/showUserNames',
	},
	HideUserNamesOnVideo: {
		description: 'User Action: HideUserNamesOnVideo',
		shortDescription: 'HideUserNamesOnVideo',
		command: '/hideUserNames',
	},
	EnableOriginalSound: {
		description: 'User Action: EnableOriginalSound',
		shortDescription: 'EnableOriginalSound',
		command: '/enableOriginalSound',
	},
	DisableOriginalSound: {
		description: 'User Action: DisableOriginalSound',
		shortDescription: 'DisableOriginalSound',
		command: '/disableOriginalSound',
	},
	EnableHDVideo: {
		description: 'User Action: EnableHDVideo',
		shortDescription: 'EnableHDVideo',
		command: '/enableHDVideo',
	},
	DisableHDVideo: {
		description: 'User Action: DisableHDVideo',
		shortDescription: 'DisableHDVideo',
		command: '/disableHDVideo',
	},
	EnableMirrorVideo: {
		description: 'User Action: EnableMirrorVideo',
		shortDescription: 'EnableMirrorVideo',
		command: '/enableMirrorVideo',
	},
	DisableMirrorVideo: {
		description: 'User Action: DisableMirrorVideo',
		shortDescription: 'DisableMirrorVideo',
		command: '/disableMirrorVideo',
	},
	EnableOptimizeVideoForSharing: {
		description: 'User Action: EnableOptimizeVideoForSharing',
		shortDescription: 'EnableOptimizeVideoForSharing',
		command: '/enableOptimizeVideo',
	},
	DisableOptimizeVideoForSharing: {
		description: 'User Action: DisableOptimizeVideoForSharing',
		shortDescription: 'DisableOptimizeVideoForSharing',
		command: '/disableOptimizeVideo',
	},
	EnableComputerSoundWhenSharing: {
		description: 'User Action: EnableComputerSoundWhenSharing',
		shortDescription: 'EnableComputerSoundWhenSharing',
		command: '/enableComputerSoundWhenSharing',
	},
	DisableComputerSoundWhenSharing: {
		description: 'User Action: DisableComputerSoundWhenSharing',
		shortDescription: 'DisableComputerSoundWhenSharing',
		command: '/disableComputerSoundWhenSharing',
	},
	RequestMicDeviceList: {
		description: 'User Action: RequestMicDeviceList',
		shortDescription: 'RequestMicDeviceList',
		command: '/listMicDevices',
	},
	SetMicDevice: {
		description: 'User Action: SetMicDevice',
		shortDescription: 'SetMicDevice',
		command: '/setMicDevice',
		args: 'id',
	},
	RequestSpeakerDeviceList: {
		description: 'User Action: RequestSpeakerDeviceList',
		shortDescription: 'RequestSpeakerDeviceList',
		command: '/listSpeakerDevices',
	},
	SetSpeakerDevice: {
		description: 'User Action: SetSpeakerDevice',
		shortDescription: 'SetSpeakerDevice',
		command: '/setSpeakerDevice',
		args: 'id',
	},
	RequestMicLevel: {
		description: 'User Action: RequestMicLevel',
		shortDescription: 'RequestMicLevel',
		command: '/getMicLevel',
	},
	SetMicLevel: {
		description: 'User Action: SetMicLevel',
		shortDescription: 'SetMicLevel',
		command: '/setMicLevel',
		args: 'level',
	},
	RequestSpeakerVolume: {
		description: 'User Action: RequestSpeakerVolume',
		shortDescription: 'RequestSpeakerVolume',
		command: '/getSpeakerVolume',
	},
	SetSpeakerVolume: {
		description: 'User Action: SetSpeakerVolume',
		shortDescription: 'SetSpeakerVolume',
		command: '/setSpeakerVolume',
		args: 'level',
	},
	RequestCameraDevices: {
		description: 'User Action: RequestCameraDevices',
		shortDescription: 'RequestCameraDevices',
		command: '/listCameraDevices',
	},
	SetCameraDevice: {
		description: 'User Action: SetCameraDevice',
		shortDescription: 'SetCameraDevice',
		command: '/setCamerDevice',
		args: 'id',
	},
	RequestVirtualBackgroundList: {
		description: 'User Action: RequestVirtualBackgroundList',
		shortDescription: 'RequestVirtualBackgroundList',
		command: '/listBackgrounds',
	},
	SetVirtualBackground: {
		description: 'User Action: SetVirtualBackground',
		shortDescription: 'SetVirtualBackground',
		command: '/setBackground',
		args: 'id',
	},
	SetVideoFilter: {
		description: 'User Action: SetVideoFilter',
		shortDescription: 'SetVideoFilter',
		command: '/setVideoFilter',
		args: 'id',
	},
	RequestCurrentCameraDevice: {
		description: 'User Action: RequestCurrentCameraDevice',
		shortDescription: 'RequestCurrentCameraDevice',
		command: '/getCameraDevice',
	},
	RequestCurrentMicDevice: {
		description: 'User Action: RequestCurrentMicDevice',
		shortDescription: 'RequestCurrentMicDevice',
		command: '/getMicDevice',
	},
	RequestCurrentSpeakerDevice: {
		description: 'User Action: RequestCurrentSpeakerDevice',
		shortDescription: 'RequestCurrentSpeakerDevice',
		command: '/getSpeakerDevice',
	},
	RequestCurrentVirtualBackground: {
		description: 'User Action: RequestCurrentVirtualBackground',
		shortDescription: 'RequestCurrentVirtualBackground',
		command: '/getBackground',
	},
	PingZoomOSC: { description: 'User Action: pin', shortDescription: 'pin', command: '/zoom/ping' },
	SetZoomOSCSubscribeLevel: {
		description: 'User Action: SetZoomOSCSubscribeLevel',
		shortDescription: 'SetZoomOSCSubscribeLevel',
		command: '/zoom/subscribe',
		args: 'level',
	},
	RequestOrderOfGalleryView: {
		description: 'User Action: RequestOrderOfGalleryView',
		shortDescription: 'RequestOrderOfGalleryView',
		command: '/zoom/getGalleryOrder',
	},
	RequestOrderOfSpotlights: {
		description: 'User Action: RequestOrderOfSpotlights',
		shortDescription: 'RequestOrderOfSpotlights',
		command: '/zoom/getSpotOrder',
	},
	SetWindowPosition: {
		description: 'User Action: SetWindowPosition',
		shortDescription: 'SetWindowPosition',
		command: '/setWindowPosition',
		args: 'intX,intY',
	},
	SetWindowSize: {
		description: 'User Action: SetWindowSize',
		shortDescription: 'SetWindowSize',
		command: '/setWindowSize',
		args: 'intX,intY',
	},
}

const GlobalActions = {
	MuteAll: { description: 'Global Action: Mute All', shortDescription: 'MuteAll', command: '/zoom/all/mute' },
	UnmuteAll: { description: 'Global Action: Unmute All', shortDescription: 'UnmuteAll', command: '/zoom/all/unMute' },
	ClearSpotlight: {
		description: 'Global Action: Clear Spotlight',
		shortDescription: 'Clear Spotlight',
		command: '/zoom/clearSpot',
	},
	EnableUsersToUnmute: {
		description: 'Global Action: Enable Users To Unmute',
		shortDescription: 'EnableUsersToUnmute',
		command: '/zoom/enableUserUnmute',
	},
	DisableUsersToUnmute: {
		description: 'Global Action: Disable Users ToUnmute',
		shortDescription: 'DisableUsersToUnmute',
		command: '/zoom/disableUserUnmute',
	},
	SendAChatToEveryone: {
		description: 'Global Action: Send A Chat To Everyone',
		shortDescription: 'SendAChatToEveryone',
		command: '/zoom/chatAll',
		args: 'msg',
	},
	LowerAllHands: {
		description: 'Global Action: Lower AllHands',
		shortDescription: 'LowerAllHands',
		command: '/zoom/lowerAllHands',
	},
	RequestBreakoutList: {
		description: 'Global Action: Request BreakoutList',
		shortDescription: 'RequestBreakoutList',
		command: '/zoom/listBreakouts',
	},
	CreateBreakoutRoom: {
		description: 'Global Action: Create BreakoutRoom',
		shortDescription: 'CreateBreakoutRoom',
		command: '/zoom/createBreakout',
		args: 'name',
	},
	DeleteBreakoutRoom: {
		description: 'Global Action: Delete BreakoutRoom',
		shortDescription: 'DeleteBreakoutRoom',
		command: '/zoom/deleteBreakout',
		args: 'name',
	},
	OpenBreakoutRooms: {
		description: 'Global Action: Open BreakoutRooms',
		shortDescription: 'OpenBreakoutRooms',
		command: '/zoom/openBreakouts',
	},
	CloseBreakoutRooms: {
		description: 'Global Action: Close BreakoutRooms',
		shortDescription: 'CloseBreakoutRooms',
		command: '/zoom/closeBreakouts',
	},
	// ConfigureBreakoutRooms: {
	// 	description: 'Global Action: Configure BreakoutRooms',
	// 	shortDescription: 'Configure BreakoutRooms',
	// 	command:
	// 		'/zoom/configureBreakouts{intpostCloseSeconds,intallowChooseBreakout(0=false,1=true),intallowReturnAtWill,intautoMoveParticipants,intuseTimer,intcloseWithTimer,intbreakoutDurrationSeconds}',
	// },
	DeleteAllBreakoutRooms: {
		description: 'Global Action: Delete All BreakoutRooms',
		shortDescription: 'DeleteAllBreakoutRooms',
		command: '/zoom/deleteAllBreakouts',
	},
	BroadcastMessageToBreakoutRooms: {
		description: 'Global Action: Broadcast Message To BreakoutRooms',
		shortDescription: 'BroadcastMessageToBreakoutRooms',
		command: '/zoom/broadcastToBreakouts',
		args: 'msg',
	},
	AdmitEveryoneFromWaitingRoom: {
		description: 'Global Action: AdmitEveryoneFromWaitingRoom',
		shortDescription: 'AdmitEveryoneFromWaitingRoom',
		command: '/zoom/admitAll',
	},
	SendMessageToWaitingRoom: {
		description: 'Global Action: Send Message To WaitingRoom',
		shortDescription: 'SendMessageToWaitingRoom',
		command: '/zoom/messageWaitingRoom',
		args: 'msg',
	},
	EjectAllWebinarAttendees: {
		description: 'Global Action: Eject All WebinarAttendees',
		shortDescription: 'EjectAllWebinarAttendees',
		command: '/zoom/ejectAttendees',
	},
	StartLocalRecording: {
		description: 'Global Action: Start Local Recording',
		shortDescription: 'StartLocalRecording',
		command: '/zoom/startLocalRecording',
	},
	PauseLocalRecording: {
		description: 'Global Action: Pause Local Recording',
		shortDescription: 'PauseLocalRecording',
		command: '/zoom/pauseLocalRecording',
	},
	ResumeLocalRecording: {
		description: 'Global Action: Resume Local Recording',
		shortDescription: 'ResumeLocalRecording',
		command: '/zoom/resumeLocalRecording',
	},
	StopLocalRecording: {
		description: 'Global Action: Stop Local Recording',
		shortDescription: 'StopLocalRecording',
		command: '/zoom/stopLocalRecording',
	},
	StartCloudRecording: {
		description: 'Global Action: Start Cloud Recording',
		shortDescription: 'StartCloudRecording',
		command: '/zoom/startCloudRecording',
	},
	PauseCloudRecording: {
		description: 'Global Action: Pause Cloud Recording',
		shortDescription: 'PauseCloudRecording',
		command: '/zoom/pauseCloudRecording',
	},
	ResumeCloudRecording: {
		description: 'Global Action: Resume Cloud Recording',
		shortDescription: 'ResumeCloudRecording',
		command: '/zoom/resumeCloudRecording',
	},
	StopCloudRecording: {
		description: 'Global Action: Stop Cloud Recording',
		shortDescription: 'StopCloudRecording',
		command: '/zoom/stopCloudRecording',
	},
	UpdateTargetIDs: {
		description: 'Global Action: Update TargetIDs',
		shortDescription: 'UpdateTargetIDs',
		command: '/zoom/update',
	},
	AppendTargetIDs: {
		description: 'Global Action: Append TargetIDs',
		shortDescription: 'AppendTargetIDs',
		command: '/zoom/include',
	},
	SetZoomOSCGalleryTrackingMode: {
		description: 'Global Action: Set ZoomOSC GalleryTracking Mode',
		shortDescription: 'SetZoomOSCGalleryTracking Mode',
		command: '/zoom/galTrackMode',
		args: 'mode',
	},
	RequestGalleryCount: {
		description: 'Global Action: Request GalleryCount',
		shortDescription: 'RequestGalleryCount',
		command: '/zoom/galCount',
	},
	LoadTargetIDs: {
		description: 'Global Action: Load TargetIDs',
		shortDescription: 'LoadTargetIDs',
		command: '/zoom/load',
	},
	SaveTargetIDs: {
		description: 'Global Action: Save TargetIDs',
		shortDescription: 'SaveTargetIDs',
		command: '/zoom/save',
	},
	RequestAllZoomOSCParticipantDataList: {
		description: 'Global Action: Request All ZoomOSC Participant DataList',
		shortDescription: 'RequestAllZoomOSCParticipantDataList',
		command: '/zoom/listBreakouts',
	},
	ResetTargetIDs: {
		description: 'Global Action: Reset TargetIDs',
		shortDescription: 'ResetTargetIDs',
		command: '/zoom/reset',
	},
	LeaveMeeting: {
		description: 'Global Action: Leave Meeting',
		shortDescription: 'LeaveMeeting',
		command: '/zoom/leaveMeeting',
	},
	EndMeeting: {
		description: 'Global Action: End Meeting',
		shortDescription: 'EndMeeting',
		command: '/zoom/endMeeting',
	},
	EnableWaitingRoom: {
		description: 'Global Action: Enable WaitingRoom',
		shortDescription: 'EnableWaitingRoom',
		command: '/zoom/enableWaitingRoom',
	},
	DisableWaitingRoom: {
		description: 'Global Action: Disable WaitingRoom',
		shortDescription: 'DisableWaitingRoom',
		command: '/zoom/disableWaitingRoom',
	},
	JoinMeeting: {
		description: 'Global Action: Join Meeting',
		shortDescription: 'JoinMeeting',
		command: '/zoom/joinMeeting',
		args: 'JoinMeeting'
	},
	ZAKJoinMeeting: {
		description: 'Global Action: ZAKJoinMeeting',
		shortDescription: 'ZAKJoinMeeting',
		command: '/zoom/zakJoin',
		args: 'zak'
	},
	ZAKStartMeeting: {
		description: 'Global Action: ZAKStartMeeting',
		shortDescription: 'ZAKStartMeeting',
		command: '/zoom/zakStart',
		args: 'zak'
	},
}

if (module != undefined) module.exports = { UserActions, GlobalActions }

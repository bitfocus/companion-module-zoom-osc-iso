interface userActionType {
	shortDescription: string
	command: string
	description: string
}
const UserActions = {
	Pin: '/pin',
	AddPin: '/addPin',
	Unpin: '/unPin',
	ClearPins: '/clearPin',
	TogglePin: '/togglePin',
	PinScreen2: '/pin2',
	UnpinScreen2: '/unPin2',
	ClearPinsScreen2: '/clearPin2',
	TogglePinScreen2: '/togglePin2',
	RemotePin: '/remotePin',
	RemoteAddPin: '/remoteAddPin',
	RemoteUnpin: '/remoteUnPin',
	RemoteClearPin: '/remoteClearPin',
	RemoteTogglePin: '/remoteTogglePin',
	RemotePinScreen2: '/remotePin2',
	RemoteUnpinScreen2: '/remoteUnPin2',
	RemoteClearPinScreen2: '/remoteClearPin2',
	RemoteTogglePinScreen2: '/remoteTogglePin2',
	Spotlight: '/spot',
	AddSpotlight: '/addSpot',
	UnSpotlight: '/unSpot',
	ToggleSpotlight: '/toggleSpot',
	TurnVideoOn: '/videoOn',
	TurnVideoOff: '/videoOff',
	ToggleVideoState: '/toggleVideo',
	Mute: '/mute',
	Unmute: '/unMute',
	ToggleMuteState: '/toggleMute',
	MuteAll: '/zoom/all/mute',
	UnmuteAll: '/zoom/all/unMute',
	SendAChatViaDM: '/chat{strmsg}',
	RemoteChat: '/remoteChat{strmsg}',
	RaiseHand: '/raiseHand',
	LowerHand: '/lowerHand',
	ToggleHand: '/toggleHand',
	Rename: '/rename',
	MakeHost: '/makeHost',
	MakeCoHost: '/makeCoHost',
	RevokeCoHost: '/revokeCoHost',
	ReclaimHost: '/reclaimHost',
	MakePanelist: '/makePanelist',
	MakeAttendee: '/makeAttendee',
	EjectParticipant: '/eject',
	SendParticipantToBreakoutRoom: '/sendToBreakout{strbo_name|intbo_index}',
	RemoveParticipantFromBreakoutRoom: '/removeFromBreakout(strbo_name|intbo_index}',
	AssignParticipantToBreakoutRoom: '/assignToBreakout{strbo_name|intbo_index}',
	UnassignParticipantFromBreakoutRoom: '/unassignFromBreakout{strbo_name|intbo_index}',
	ReturnSelfToMainMeeting: '/returnToMainMeeting',
	AdmitSomeoneFromWaitingRoom: '/admit',
	SendSomeoneToWaitingRoom: '/sendToWaitingRoom',
	AllowWebinarAttendeeToSpeak: '/allowToSpeak',
	ShutUpWebinarAttendee: '/disallowToSpeak',
	StartScreenShare: '/startScreenshare{intscreen_id}',
	StartScreenShareWithPrimaryScreen: '/startScreensharePrimary',
	StartShareWithWindow: '/startWindowShare{intwindow_id}',
	StartAudioShare: '/startAudioShare{intaudio_id}',
	StartCameraShare: '/startCameraShare{intcamera_id}',
	CycleSharedCameraToNextAvailable: '/shareNextCamera',
	StopSharing: '/stopShare',
	RequestListWindowsForSharing: '/listWindows',
	RequestListScreensForSharing: '/listScreens',
	AllowToRecord: '/allowToRecord',
	DisallowToRecord: '/disallowToRecord',
	SetGalleryView: '/setGalleryView',
	GotoNextGalleryPage: '/galleryPageNext',
	GotoPreviousGalleryPage: '/galleryPagePrev',
	SetSpeakerView: '/setSpeakerView',
	ShowNonVideoParticipants: '/showNonVideoParticipants',
	HideNonVideoParticipants: '/hideNonVideoParticipants',
	ShowUserNamesOnVideo: '/showUserNames',
	HideUserNamesOnVideo: '/hideUserNames',
	EnableOriginalSound: '/enableOriginalSound',
	DisableOriginalSound: '/disableOriginalSound',
	EnableHDVideo: '/enableHDVideo',
	DisableHDVideo: '/disableHDVideo',
	EnableMirrorVideo: '/enableMirrorVideo',
	DisableMirrorVideo: '/disableMirrorVideo',
	EnableOptimizeVideoForSharing: '/enableOptimizeVideo',
	DisableOptimizeVideoForSharing: '/disableOptimizeVideo',
	EnableComputerSoundWhenSharing: '/enableComputerSoundWhenSharing',
	DisableComputerSoundWhenSharing: '/disableComputerSoundWhenSharing',
	RequestMicDeviceList: '/listMicDevices',
	SetMicDevice: '/setMicDevice{intid}',
	RequestSpeakerDeviceList: '/listSpeakerDevices',
	SetSpeakerDevice: '/setSpeakerDevice{intid}',
	RequestMicLevel: '/getMicLevel',
	SetMicLevel: '/setMicLevel{intlevel}',
	RequestSpeakerVolume: '/getSpeakerVolume',
	SetSpeakerVolume: '/setSpeakerVolume{intlevel}',
	RequestCameraDevices: '/listCamerDevices',
	SetCameraDevice: '/setCamerDevice{intid}',
	RequestVirtualBackgroundList: '/listBackgrounds',
	SetVirtualBackground: '/setBackground{intid}',
	SetVideoFilter: '/setVideoFilter{intid}',
	RequestCurrentCameraDevice: '/getCameraDevice',
	RequestCurrentMicDevice: '/getMicDevice',
	RequestCurrentSpeakerDevice: '/getSpeakerDevice',
	RequestCurrentVirtualBackground: '/getBackground',
	PingZoomOSC: '/zoom/ping',
	SetZoomOSCSubscribeLevel: '/zoom/subscribe{intlevel}',
	RequestOrderOfGalleryView: '/zoom/getGalleryOrder',
	RequestOrderOfSpotlights: '/zoom/getSpotOrder',
	SetWindowPosition: '/setWindowPosition{intx,inty}',
	SetWindowSize: '/setWindowSize{intx,inty}',
	PongOutputOutput: '/zoomosc/pong',
	GalleryOrderOutputOutput: '/zoomosc/galleryOrder',
	GalleryCountOutputOutput: '/zoomosc/galleryCount',
	GalleryShapeOutputOutput: '/zoomosc/galleryShape',
	TargetIDListClearedOutputOutput: '/zoomosc/listCleared',
	ListOfBreakoutRoomsOutputOutput: '/zoomosc/listBreakouts',
	WaitingRoomListOutputOutput: '/zoomosc/waitingRoomUserList',
	AllZoomOSCParticipantDataOutputOutput: '/zoomosc/list',
	ChatMessageReceivedOutputOutput: '/chat{strmsg}',
	UserJoinOutputOutput: '/online',
	UserLeaveOutputOutput: '/offline',
	UserRoleChangedOutputOutput: '/roleChanged{introle}',
	UserUnmutedOutputOutput: '/unmute',
	UserMutedOutputOutput: '/mute',
	UserVideoOnOutputOutput: '/videoOn',
	UserVideoOffOutputOutput: '/videoOff',
	ActiveSpeakerOutputOutput: '/activeSpeaker',
	SpotlIghtOnOutputOutput: '/spotlightOn',
	SpotlightOffOutputOutput: '/spotlightOff',
	HandRaisedOutputOutput: '/handRaised',
	HandLoweredOutputOutput: '/handLowered',
	UserNameChangedOutputOutput: '/userNameChanged{strorig_name}',
	CameraDeviceListOutputOutput: '/cameraDevices',
	MicDeviceListOutputOutput: '/micDevices',
	SpeakerDeviceListOutputOutput: '/speakerDevices',
	VirtualBackgroundListOutputOutput: '/backgrounds',
	WindowsListOutputOutput: '/windows',
	ScreensListOutputOutput: '/screens',
	CurrentMicOutputOutput: '/micDevice',
	CurrentSpeakerOutputOutput: '/speakerDevice',
	CurrentCameraOutputOutput: '/cameraDevice',
	CurrentVirtualBackgroundOutputOutput: '/background',
	CurrentVideoFilterOutputOutput: '/filter',
	MicVolumeOutputOutput: '/micVolume{intvol}',
	SpeakerVolumeOutputOutput: '/speakerVolume{intvol}',
	SpotlightOrderOutputOutput: '/spotOrder',
	UserEmojiChangedOutput: '/emojiChanged',
	UserIsSpeakingOutput: '/isSpeaking',
	UserStoppedSpeakingOutput: '/stoppedSpeaking',
	UserAskedWebinarQuestionOutput: '/askedQuestion{strquestion}',
}

const GlobalActions = {
	ClearSpotlight: '/zoom/clearSpot',
	EnableUsersToUnmute: '/zoom/enableUserUnmute',
	DisableUsersToUnmute: '/zoom/disableUserUnmute',
	SendAChatToEveryone: '/zoom/chatAll{strmsg}',
	LowerAllHands: '/zoom/lowerAllHands',
	RequestBreakoutList: '/zoom/listBreakouts',
	CreateBreakoutRoom: '/zoom/createBreakout{strname}',
	DeleteBreakoutRoom: '/zoom/deleteBreakout{strname|intbo_index}',
	OpenBreakoutRooms: '/zoom/openBreakouts',
	CloseBreakoutRooms: '/zoom/closeBreakouts',
	ConfigureBreakoutRooms:
		'/zoom/configureBreakouts{intpostCloseSeconds,intallowChooseBreakout(0=false,1=true),intallowReturnAtWill,intautoMoveParticipants,intuseTimer,intcloseWithTimer,intbreakoutDurrationSeconds}',
	DeleteAllBreakoutRooms: '/zoom/deleteAllBreakouts',
	BroadcastMessageToBreakoutRooms: '/zoom/broadcastToBreakouts{strmsg}',
	AdmitEveryoneFromWaitingRoom: '/zoom/admitAll',
	SendMessageToWaitingRoom: '/zoom/messageWaitingRoom{strmsg}',
	EjectAllWebinarAttendees: '/zoom/ejectAttendees',
	StartLocalRecording: '/zoom/startLocalRecording',
	PauseLocalRecording: '/zoom/pauseLocalRecording',
	ResumeLocalRecording: '/zoom/resumeLocalRecording',
	StopLocalRecording: '/zoom/stopLocalRecording',
	StartCloudRecording: '/zoom/startCloudRecording',
	PauseCloudRecording: '/zoom/pauseCloudRecording',
	ResumeCloudRecording: '/zoom/resumeCloudRecording',
	StopCloudRecording: '/zoom/stopCloudRecording',
	UpdateTargetIDs: '/zoom/update',
	AppendTargetIDs: '/zoom/include',
	SetZoomOSCGalleryTrackingMode: '/zoom/galTrackMode{intmode}',
	RequestGalleryCount: '/zoom/galCount',
	LoadTargetIDs: '/zoom/load',
	SaveTargetIDs: '/zoom/save',
	RequestAllZoomOSCParticipantDataList: '/zoom/listBreakouts',
	ResetTargetIDs: '/zoom/reset',
	LeaveMeeting: '/zoom/leaveMeeting',
	EndMeeting: '/zoom/endMeeting',
	EnableWaitingRoom: '/zoom/enableWaitingRoom',
	DisableWaitingRoom: '/zoom/disableWaitingRoom',
	JoinMeeting: '/zoom/joinMeeting{strmeetingID,stringname,stringpw(optional)}',
	ZAKJoinMeeting: '/zoom/zakJoin{strzak,strmeetingID,strname}',
	ZAKStartMeeting: '/zoom/zakStart{strzak,strmeetingID,strname}',
}

if (module != undefined) module.exports = { UserActions, GlobalActions }
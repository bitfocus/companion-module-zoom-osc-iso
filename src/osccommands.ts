export interface userActionType {
	[key: string]: { shortDescription: string; command: string; description: string; args?: any }
}
const UserActions: userActionType = {
	Pin: { description: 'User Action: Pin', shortDescription: 'Pin', command: '/pin' },
	AddPin: { description: 'User Action: Add Pin', shortDescription: 'AddPin', command: '/addPin' },
	Unpin: { description: 'User Action: Unpin', shortDescription: 'Unpin', command: '/unPin' },
	ClearPins: { description: 'User Action: Clear Pins', shortDescription: 'ClearPins', command: '/clearPin' },
	TogglePin: { description: 'User Action: Toggle Pin', shortDescription: 'TogglePin', command: '/togglePin' },
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
		description: 'User Action: Toggle Mute State',
		shortDescription: 'ToggleMuteState',
		command: '/toggleMute',
	},
	SendAChatViaDM: {
		description: 'User Action: Send A Cha tVia DM',
		shortDescription: 'SendAChatViaDM',
		command: '/chat',
	},
	RemoteChat: {
		description: 'User Action: Remote Chat',
		shortDescription: 'RemoteChat',
		command: '/remoteChat',
		args: 'msg',
	},
	RaiseHand: { description: 'User Action: Raise Hand', shortDescription: 'RaiseHand', command: '/raiseHand' },
	LowerHand: { description: 'User Action: Lower Hand', shortDescription: 'LowerHand', command: '/lowerHand' },
	ToggleHand: { description: 'User Action: Toggle Hand', shortDescription: 'ToggleHand', command: '/toggleHand' },
	Rename: { description: 'User Action: Rename', shortDescription: 'Rename', command: '/rename' },
	MakeHost: { description: 'User Action: Make Host', shortDescription: 'MakeHost', command: '/makeHost' },
	MakeCoHost: { description: 'User Action: Make CoHost', shortDescription: 'MakeCoHost', command: '/makeCoHost' },
	RevokeCoHost: {
		description: 'User Action: Revoke CoHost',
		shortDescription: 'RevokeCoHost',
		command: '/revokeCoHost',
	},
	ReclaimHost: { description: 'User Action: Reclaim Host', shortDescription: 'ReclaimHost', command: '/reclaimHost' },
	MakePanelist: {
		description: 'User Action: Make Panelist',
		shortDescription: 'MakePanelist',
		command: '/makePanelist',
	},
	MakeAttendee: {
		description: 'User Action: Make Attendee',
		shortDescription: 'MakeAttendee',
		command: '/makeAttendee',
	},
	EjectParticipant: {
		description: 'User Action: Eject Participant',
		shortDescription: 'EjectParticipant',
		command: '/eject',
	},
	SendParticipantToBreakoutRoom: {
		description: 'User Action: Send Participant To BreakoutRoom',
		shortDescription: 'SendParticipantToBreakoutRoom',
		command: '/sendToBreakout',
		args: 'name',
	},
	RemoveParticipantFromBreakoutRoom: {
		description: 'User Action: Remove Participant From BreakoutRoom',
		shortDescription: 'RemoveParticipantFromBreakoutRoom',
		command: '/removeFromBreakout',
		args: 'name',
	},
	AssignParticipantToBreakoutRoom: {
		description: 'User Action: Assign Participant To BreakoutRoom',
		shortDescription: 'AssignParticipantToBreakoutRoom',
		command: '/assignToBreakout',
		args: 'name',
	},
	UnassignParticipantFromBreakoutRoom: {
		description: 'User Action: Unassign Participant From BreakoutRoom',
		shortDescription: 'UnassignParticipantFromBreakoutRoom',
		command: '/unassignFromBreakout',
		args: 'name',
	},
	ReturnSelfToMainMeeting: {
		description: 'User Action: Return Self To Main Meeting',
		shortDescription: 'ReturnSelfToMainMeeting',
		command: '/returnToMainMeeting',
	},
	AdmitSomeoneFromWaitingRoom: {
		description: 'User Action: Admit Someone From Waiting Room',
		shortDescription: 'AdmitSomeoneFromWaitingRoom',
		command: '/admit',
	},
	SendSomeoneToWaitingRoom: {
		description: 'User Action: Send Someone To Waiting Room',
		shortDescription: 'SendSomeoneToWaitingRoom',
		command: '/sendToWaitingRoom',
	},
	AllowWebinarAttendeeToSpeak: {
		description: 'User Action: Allow Webinar Attendee To Speak',
		shortDescription: 'AllowWebinarAttendeeToSpeak',
		command: '/allowToSpeak',
	},
	ShutUpWebinarAttendee: {
		description: 'User Action: Shut Up Webinar Attendee',
		shortDescription: 'ShutUpWebinarAttendee',
		command: '/disallowToSpeak',
	},
	StartScreenShare: {
		description: 'User Action: Start Screen Share',
		shortDescription: 'StartScreenShare',
		command: '/startScreenshare',
		args: 'id',
	},
	StartScreenShareWithPrimaryScreen: {
		description: 'User Action: Start Screen Share With Primary Screen',
		shortDescription: 'StartScreenShareWithPrimaryScreen',
		command: '/startScreensharePrimary',
	},
	StartShareWithWindow: {
		description: 'User Action: Start Share With Window',
		shortDescription: 'StartShareWithWindow',
		command: '/startWindowShare',
		args: 'id',
	},
	StartAudioShare: {
		description: 'User Action: Start AudioShare',
		shortDescription: 'StartAudioShare',
		command: '/startAudioShare',
		args: 'id',
	},
	StartCameraShare: {
		description: 'User Action: Start CameraShare',
		shortDescription: 'StartCameraShare',
		command: '/startCameraShare',
		args: 'id',
	},
	CycleSharedCameraToNextAvailable: {
		description: 'User Action: Cycle Shared Camera To Next Available',
		shortDescription: 'CycleSharedCameraToNextAvailable',
		command: '/shareNextCamera',
	},
	StopSharing: { description: 'User Action: Stop Sharing', shortDescription: 'StopSharing', command: '/stopShare' },
	RequestListWindowsForSharing: {
		description: 'User Action: Request Lis tWindows For Sharing',
		shortDescription: 'RequestListWindowsForSharing',
		command: '/listWindows',
	},
	RequestListScreensForSharing: {
		description: 'User Action: Request List Screens For Sharing',
		shortDescription: 'RequestListScreensForSharing',
		command: '/listScreens',
	},
	AllowToRecord: {
		description: 'User Action: Allow To Record',
		shortDescription: 'AllowToRecord',
		command: '/allowToRecord',
	},
	DisallowToRecord: {
		description: 'User Action: Disallow To Record',
		shortDescription: 'DisallowToRecord',
		command: '/disallowToRecord',
	},
	SetGalleryView: {
		description: 'User Action: Set Gallery View',
		shortDescription: 'SetGalleryView',
		command: '/setGalleryView',
	},
	GotoNextGalleryPage: {
		description: 'User Action: Goto Next Gallery Page',
		shortDescription: 'GotoNextGalleryPage',
		command: '/galleryPageNext',
	},
	GotoPreviousGalleryPage: {
		description: 'User Action: Goto Previous Gallery Page',
		shortDescription: 'GotoPreviousGalleryPage',
		command: '/galleryPagePrev',
	},
	SetSpeakerView: {
		description: 'User Action: Set Speaker View',
		shortDescription: 'SetSpeakerView',
		command: '/setSpeakerView',
	},
	ShowNonVideoParticipants: {
		description: 'User Action: Show Non Video Participants',
		shortDescription: 'ShowNonVideoParticipants',
		command: '/showNonVideoParticipants',
	},
	HideNonVideoParticipants: {
		description: 'User Action: Hide Non Video Participants',
		shortDescription: 'HideNonVideoParticipants',
		command: '/hideNonVideoParticipants',
	},
	ShowUserNamesOnVideo: {
		description: 'User Action: Show User Names On Video',
		shortDescription: 'ShowUserNamesOnVideo',
		command: '/showUserNames',
	},
	HideUserNamesOnVideo: {
		description: 'User Action: Hide User Names On Video',
		shortDescription: 'HideUserNamesOnVideo',
		command: '/hideUserNames',
	},
	EnableOriginalSound: {
		description: 'User Action: Enable Original Sound',
		shortDescription: 'EnableOriginalSound',
		command: '/enableOriginalSound',
	},
	DisableOriginalSound: {
		description: 'User Action: Disable Original Sound',
		shortDescription: 'DisableOriginalSound',
		command: '/disableOriginalSound',
	},
	EnableHDVideo: {
		description: 'User Action: Enable HD Video',
		shortDescription: 'EnableHDVideo',
		command: '/enableHDVideo',
	},
	DisableHDVideo: {
		description: 'User Action: Disable HD Video',
		shortDescription: 'DisableHDVideo',
		command: '/disableHDVideo',
	},
	EnableMirrorVideo: {
		description: 'User Action: Enable Mirror Video',
		shortDescription: 'EnableMirrorVideo',
		command: '/enableMirrorVideo',
	},
	DisableMirrorVideo: {
		description: 'User Action: Disable Mirror Video',
		shortDescription: 'DisableMirrorVideo',
		command: '/disableMirrorVideo',
	},
	EnableOptimizeVideoForSharing: {
		description: 'User Action: Enable Optimize Video For Sharing',
		shortDescription: 'EnableOptimizeVideoForSharing',
		command: '/enableOptimizeVideo',
	},
	DisableOptimizeVideoForSharing: {
		description: 'User Action: Disable Optimize Video For Sharing',
		shortDescription: 'DisableOptimizeVideoForSharing',
		command: '/disableOptimizeVideo',
	},
	EnableComputerSoundWhenSharing: {
		description: 'User Action: Enable Computer Sound When Sharing',
		shortDescription: 'EnableComputerSoundWhenSharing',
		command: '/enableComputerSoundWhenSharing',
	},
	DisableComputerSoundWhenSharing: {
		description: 'User Action: Disable Computer Sound When Sharing',
		shortDescription: 'DisableComputerSoundWhenSharing',
		command: '/disableComputerSoundWhenSharing',
	},
	RequestMicDeviceList: {
		description: 'User Action: Request Mic Device List',
		shortDescription: 'RequestMicDeviceList',
		command: '/listMicDevices',
	},
	SetMicDevice: {
		description: 'User Action: Set Mic Device',
		shortDescription: 'SetMicDevice',
		command: '/setMicDevice',
		args: 'id',
	},
	RequestSpeakerDeviceList: {
		description: 'User Action: Request Speaker Device List',
		shortDescription: 'RequestSpeakerDeviceList',
		command: '/listSpeakerDevices',
	},
	SetSpeakerDevice: {
		description: 'User Action: Set Speaker Device',
		shortDescription: 'SetSpeakerDevice',
		command: '/setSpeakerDevice',
		args: 'id',
	},
	RequestMicLevel: {
		description: 'User Action: Request Mic Level',
		shortDescription: 'RequestMicLevel',
		command: '/getMicLevel',
	},
	SetMicLevel: {
		description: 'User Action: Set Mic Level',
		shortDescription: 'SetMicLevel',
		command: '/setMicLevel',
		args: 'level',
	},
	RequestSpeakerVolume: {
		description: 'User Action: Request Speaker Volume',
		shortDescription: 'RequestSpeakerVolume',
		command: '/getSpeakerVolume',
	},
	SetSpeakerVolume: {
		description: 'User Action: Set Speaker Volume',
		shortDescription: 'SetSpeakerVolume',
		command: '/setSpeakerVolume',
		args: 'level',
	},
	RequestCameraDevices: {
		description: 'User Action: Request Camera Devices',
		shortDescription: 'RequestCameraDevices',
		command: '/listCameraDevices',
	},
	SetCameraDevice: {
		description: 'User Action: Set Camera Device',
		shortDescription: 'SetCameraDevice',
		command: '/setCamerDevice',
		args: 'id',
	},
	RequestVirtualBackgroundList: {
		description: 'User Action: Request Virtual Background List',
		shortDescription: 'RequestVirtualBackgroundList',
		command: '/listBackgrounds',
	},
	SetVirtualBackground: {
		description: 'User Action: Set Virtual Background',
		shortDescription: 'SetVirtualBackground',
		command: '/setBackground',
		args: 'id',
	},
	SetVideoFilter: {
		description: 'User Action: Set Video Filter',
		shortDescription: 'SetVideoFilter',
		command: '/setVideoFilter',
		args: 'id',
	},
	RequestCurrentCameraDevice: {
		description: 'User Action: Request Current Camera Device',
		shortDescription: 'RequestCurrentCameraDevice',
		command: '/getCameraDevice',
	},
	RequestCurrentMicDevice: {
		description: 'User Action: Request Current Mic Device',
		shortDescription: 'RequestCurrentMicDevice',
		command: '/getMicDevice',
	},
	RequestCurrentSpeakerDevice: {
		description: 'User Action: Request Current Speaker Device',
		shortDescription: 'RequestCurrentSpeakerDevice',
		command: '/getSpeakerDevice',
	},
	RequestCurrentVirtualBackground: {
		description: 'User Action: Request Current Virtual Background',
		shortDescription: 'RequestCurrentVirtualBackground',
		command: '/getBackground',
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
		shortDescription: 'ClearSpotlight',
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
		description: 'Global Action: Request Breakout List',
		shortDescription: 'RequestBreakoutList',
		command: '/zoom/listBreakouts',
	},
	CreateBreakoutRoom: {
		description: 'Global Action: Create Breakout Room',
		shortDescription: 'CreateBreakoutRoom',
		command: '/zoom/createBreakout',
		args: 'name',
	},
	DeleteBreakoutRoom: {
		description: 'Global Action: Delete Breakout Room',
		shortDescription: 'DeleteBreakoutRoom',
		command: '/zoom/deleteBreakout',
		args: 'name',
	},
	OpenBreakoutRooms: {
		description: 'Global Action: Open Breakout Rooms',
		shortDescription: 'OpenBreakoutRooms',
		command: '/zoom/openBreakouts',
	},
	CloseBreakoutRooms: {
		description: 'Global Action: Close Breakout Rooms',
		shortDescription: 'CloseBreakoutRooms',
		command: '/zoom/closeBreakouts',
	},
	DeleteAllBreakoutRooms: {
		description: 'Global Action: Delete All Breakout Rooms',
		shortDescription: 'DeleteAllBreakoutRooms',
		command: '/zoom/deleteAllBreakouts',
	},
	BroadcastMessageToBreakoutRooms: {
		description: 'Global Action: Broadcast Message To Breakout Rooms',
		shortDescription: 'BroadcastMessageToBreakoutRooms',
		command: '/zoom/broadcastToBreakouts',
		args: 'msg',
	},
	AdmitEveryoneFromWaitingRoom: {
		description: 'Global Action: AdmitEveryoneFromWaiting Room',
		shortDescription: 'AdmitEveryoneFromWaitingRoom',
		command: '/zoom/admitAll',
	},
	SendMessageToWaitingRoom: {
		description: 'Global Action: Send Message To Waiting Room',
		shortDescription: 'SendMessageToWaitingRoom',
		command: '/zoom/messageWaitingRoom',
		args: 'msg',
	},
	EjectAllWebinarAttendees: {
		description: 'Global Action: Eject All Webinar Attendees',
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
		shortDescription: 'SetZoomOSCGalleryTrackingMode',
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
		description: 'Global Action: Request All ZoomOSC Participant Data List',
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
		description: 'Global Action: Enable Waiting Room',
		shortDescription: 'EnableWaitingRoom',
		command: '/zoom/enableWaitingRoom',
	},
	DisableWaitingRoom: {
		description: 'Global Action: Disable Waiting Room',
		shortDescription: 'DisableWaitingRoom',
		command: '/zoom/disableWaitingRoom',
	},
	JoinMeeting: {
		description: 'Global Action: Join Meeting',
		shortDescription: 'JoinMeeting',
		command: '/zoom/joinMeeting',
		args: 'JoinMeeting',
	},
}
const SpecialActions = {
	ZAKJoinMeeting: {
		description: 'Global Action: ZAK Join Meeting',
		shortDescription: 'ZAKJoinMeeting',
		command: '/zoom/zakJoin',
		args: 'zak',
	},
	ZAKStartMeeting: {
		description: 'Global Action: ZAK Start Meeting',
		shortDescription: 'ZAKStartMeeting',
		command: '/zoom/zakStart',
		args: 'zak',
	},
	PingZoomOSC: { description: 'Global Action: Ping Zoom OSC', shortDescription: 'PingZoomOSC', command: '/zoom/ping' },
	SetZoomOSCSubscribeLevel: {
		description: 'Global Action: Set ZoomOSC Subscribe Level',
		shortDescription: 'SetZoomOSCSubscribeLevel',
		command: '/zoom/subscribe',
		args: 'subscribeLevel',
	},
	RequestOrderOfGalleryView: {
		description: 'Global Action: Request Order Of GalleryView',
		shortDescription: 'RequestOrderOfGalleryView',
		command: '/zoom/getGalleryOrder',
	},
	RequestOrderOfSpotlights: {
		description: 'Global Action: Request Order Of Spotlights',
		shortDescription: 'RequestOrderOfSpotlights',
		command: '/zoom/getSpotOrder',
	},
	ListUsers: {
		description: 'Global Action: Request list of users',
		shortDescription: 'listUsers',
		command: '/zoom/list',
	},
	// ConfigureBreakoutRooms: {
	// 	description: 'Global Action: Configure BreakoutRooms',
	// 	shortDescription: 'Configure BreakoutRooms',
	// 	command:
	// 		'/zoom/configureBreakouts{intpostCloseSeconds,intallowChooseBreakout(0=false,1=true),intallowReturnAtWill,intautoMoveParticipants,intuseTimer,intcloseWithTimer,intbreakoutDurrationSeconds}',
	// },
}

if (module != undefined) module.exports = { UserActions, GlobalActions, SpecialActions }

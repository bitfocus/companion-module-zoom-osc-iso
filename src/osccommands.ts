export interface actionType {
	[key: string]: { shortDescription: string; command: string; description: string; args?: any; type: string; singleUser?: boolean }
}

const Actions: actionType = {
	Pin: { description: 'Pin', shortDescription: 'Pin', command: '/pin', type: 'User' },
	AddPin: { description: 'Add Pin', shortDescription: 'AddPin', command: '/addPin', type: 'User' },
	Unpin: { description: 'Unpin', shortDescription: 'Unpin', command: '/unPin', type: 'User' },
	ClearPins: {
		description: 'Clear Pins',
		shortDescription: 'ClearPins',
		command: '/clearPin',
		type: 'User',
	},
	TogglePin: {
		description: 'Toggle Pin',
		shortDescription: 'TogglePin',
		command: '/togglePin',
		type: 'User',
	},
	PinScreen2: {
		description: 'Pin Screen2',
		shortDescription: 'PinScreen2',
		command: '/pin2',
		type: 'User',
	},
	UnpinScreen2: {
		description: 'Unpin Screen2',
		shortDescription: 'UnpinScreen2',
		command: '/unPin2',
		type: 'User',
	},
	ClearPinsScreen2: {
		description: 'Clear PinsScreen2',
		shortDescription: 'ClearPinsScreen2',
		command: '/clearPin2',
		type: 'User',
	},
	TogglePinScreen2: {
		description: 'Toggle PinScreen2',
		shortDescription: 'TogglePinScreen2',
		command: '/togglePin2',
		type: 'User',
	},
	// RemotePin: {
	// 	description: 'Remote Pin',
	// 	shortDescription: 'RemotePin',
	// 	command: '/remotePin',
	// 	type: 'User',
	// },
	// RemoteAddPin: {
	// 	description: 'Remote AddPin',
	// 	shortDescription: 'RemoteAddPin',
	// 	command: '/remoteAddPin',
	// 	type: 'User',
	// },
	// RemoteUnpin: {
	// 	description: 'Remote Unpin',
	// 	shortDescription: 'RemoteUnpin',
	// 	command: '/remoteUnPin',
	// 	type: 'User',
	// },
	// RemoteClearPin: {
	// 	description: 'Remote ClearPin',
	// 	shortDescription: 'RemoteClearPin',
	// 	command: '/remoteClearPin',
	// 	type: 'User',
	// },
	// RemoteTogglePin: {
	// 	description: 'Remote TogglePin',
	// 	shortDescription: 'RemoteTogglePin',
	// 	command: '/remoteTogglePin',
	// 	type: 'User',
	// },
	// RemotePinScreen2: {
	// 	description: 'Remote Pin Screen2',
	// 	shortDescription: 'RemotePinScreen2',
	// 	command: '/remotePin2',
	// 	type: 'User',
	// },
	// RemoteUnpinScreen2: {
	// 	description: 'Remote Unpin Screen2',
	// 	shortDescription: 'RemoteUnpinScreen2',
	// 	command: '/remoteUnPin2',
	// 	type: 'User',
	// },
	// RemoteClearPinScreen2: {
	// 	description: 'Remote Clear PinScreen2',
	// 	shortDescription: 'RemoteClearPinScreen2',
	// 	command: '/remoteClearPin2',
	// 	type: 'User',
	// },
	// RemoteTogglePinScreen2: {
	// 	description: 'Remote Toggle Pin Screen2',
	// 	shortDescription: 'RemoteTogglePinScreen2',
	// 	command: '/remoteTogglePin2',
	// 	type: 'User',
	// },
	Spotlight: { description: 'Spotlight', shortDescription: 'Spotlight', command: '/spot', type: 'User' },
	AddSpotlight: {
		description: 'Add Spotlight',
		shortDescription: 'AddSpotlight',
		command: '/addSpot',
		type: 'User',
	},
	UnSpotlight: {
		description: 'Un Spotlight',
		shortDescription: 'UnSpotlight',
		command: '/unSpot',
		type: 'User',
	},
	ToggleSpotlight: {
		description: 'Toggle Spotlight',
		shortDescription: 'ToggleSpotlight',
		command: '/toggleSpot',
		type: 'User',
	},
	TurnVideoOn: {
		description: 'Turn Video On',
		shortDescription: 'TurnVideoOn',
		command: '/videoOn',
		type: 'User',
	},
	TurnVideoOff: {
		description: 'Turn Video Off',
		shortDescription: 'TurnVideoOff',
		command: '/videoOff',
		type: 'User',
	},
	ToggleVideoState: {
		description: 'Toggle Video State',
		shortDescription: 'ToggleVideoState',
		command: '/toggleVideo',
		type: 'User',
	},
	Mute: { description: 'Mute', shortDescription: 'Mute', command: '/mute', type: 'User' },
	Unmute: { description: 'Unmute', shortDescription: 'Unmute', command: '/unMute', type: 'User' },
	ToggleMuteState: {
		description: 'Toggle Mute State',
		shortDescription: 'ToggleMuteState',
		command: '/toggleMute',
		type: 'User',
	},
	RaiseHand: {
		description: 'Raise Hand',
		shortDescription: 'RaiseHand',
		command: '/raiseHand',
		type: 'User',
	},
	LowerHand: {
		description: 'Lower Hand',
		shortDescription: 'LowerHand',
		command: '/lowerHand',
		type: 'User',
	},
	ToggleHand: {
		description: 'Toggle Hand',
		shortDescription: 'ToggleHand',
		command: '/toggleHand',
		type: 'User',
	},
	MakeHost: { description: 'Make Host', shortDescription: 'MakeHost', command: '/makeHost', type: 'User' },
	MakeCoHost: {
		description: 'Make CoHost',
		shortDescription: 'MakeCoHost',
		command: '/makeCoHost',
		type: 'User',
	},
	RevokeCoHost: {
		description: 'Revoke CoHost',
		shortDescription: 'RevokeCoHost',
		command: '/revokeCoHost',
		type: 'User',
	},
	ReclaimHost: {
		description: 'Reclaim Host',
		shortDescription: 'ReclaimHost',
		command: '/reclaimHost',
		type: 'User',
	},
	MakePanelist: {
		description: 'Make Panelist',
		shortDescription: 'MakePanelist',
		command: '/makePanelist',
		type: 'User',
	},
	MakeAttendee: {
		description: 'Make Attendee',
		shortDescription: 'MakeAttendee',
		command: '/makeAttendee',
		type: 'User',
	},
	EjectParticipant: {
		description: 'Eject Participant',
		shortDescription: 'EjectParticipant',
		command: '/eject',
		type: 'User',
	},
	ReturnSelfToMainMeeting: {
		description: 'Return Self To Main Meeting',
		shortDescription: 'ReturnSelfToMainMeeting',
		command: '/returnToMainMeeting',
		type: 'User',
	},
	AdmitSomeoneFromWaitingRoom: {
		description: 'Admit Someone From Waiting Room',
		shortDescription: 'AdmitSomeoneFromWaitingRoom',
		command: '/admit',
		type: 'User',
	},
	SendSomeoneToWaitingRoom: {
		description: 'Send Someone To Waiting Room',
		shortDescription: 'SendSomeoneToWaitingRoom',
		command: '/sendToWaitingRoom',
		type: 'User',
	},
	AllowWebinarAttendeeToSpeak: {
		description: 'Allow Webinar Attendee To Speak',
		shortDescription: 'AllowWebinarAttendeeToSpeak',
		command: '/allowToSpeak',
		type: 'User',
	},
	ShutUpWebinarAttendee: {
		description: 'Shut Up Webinar Attendee',
		shortDescription: 'ShutUpWebinarAttendee',
		command: '/disallowToSpeak',
		type: 'User',
	},
	StartScreenShareWithPrimaryScreen: {
		description: 'Start Screen Share With Primary Screen',
		shortDescription: 'StartScreenShareWithPrimaryScreen',
		command: '/zoom/me/startScreensharePrimary',
		type: 'Global',
	},
	CycleSharedCameraToNextAvailable: {
		description: 'Cycle Shared Camera To Next Available',
		shortDescription: 'CycleSharedCameraToNextAvailable',
		command: '/zoom/me/shareNextCamera',
		type: 'Global',
	},
	StopSharing: {
		description: 'Stop Sharing',
		shortDescription: 'StopSharing',
		command: '/zoom/me/stopShare',
		type: 'Global',
	},
	RequestListWindowsForSharing: {
		description: 'Request List Windows For Sharing',
		shortDescription: 'RequestListWindowsForSharing',
		command: '/zoom/me/listWindows',
		type: 'Global',
	},
	RequestListScreensForSharing: {
		description: 'Request List Screens For Sharing',
		shortDescription: 'RequestListScreensForSharing',
		command: '/zoom/me/listScreens',
		type: 'Global',
	},
	AllowToRecord: {
		description: 'Allow To Record',
		shortDescription: 'AllowToRecord',
		command: '/allowToRecord',
		type: 'User',
	},
	DisallowToRecord: {
		description: 'Disallow To Record',
		shortDescription: 'DisallowToRecord',
		command: '/disallowToRecord',
		type: 'User',
	},
	GotoNextGalleryPage: {
		description: 'Goto Next Gallery Page',
		shortDescription: 'GotoNextGalleryPage',
		command: '/zoom/me/galleryPageNext',
		type: 'Global',
	},
	GotoPreviousGalleryPage: {
		description: 'Goto Previous Gallery Page',
		shortDescription: 'GotoPreviousGalleryPage',
		command: '/zoom/me/galleryPagePrev',
		type: 'Global',
	},
	SetSpeakerView: {
		description: 'Set Speaker View',
		shortDescription: 'SetSpeakerView',
		command: '/zoom/me/setSpeakerView',
		type: 'Global',
	},
	ShowNonVideoParticipants: {
		description: 'Show Non Video Participants',
		shortDescription: 'ShowNonVideoParticipants',
		command: '/zoom/me/showNonVideoParticipants',
		type: 'Global',
	},
	HideNonVideoParticipants: {
		description: 'Hide Non Video Participants',
		shortDescription: 'HideNonVideoParticipants',
		command: '/zoom/me/hideNonVideoParticipants',
		type: 'Global',
	},
	ShowUserNamesOnVideo: {
		description: 'Show User Names On Video',
		shortDescription: 'ShowUserNamesOnVideo',
		command: '/showUserNames',
		type: 'User',
	},
	HideUserNamesOnVideo: {
		description: 'Hide User Names On Video',
		shortDescription: 'HideUserNamesOnVideo',
		command: '/hideUserNames',
		type: 'User',
	},
	EnableOriginalSound: {
		description: 'Enable Original Sound',
		shortDescription: 'EnableOriginalSound',
		command: '/enableOriginalSound',
		type: 'User',
	},
	DisableOriginalSound: {
		description: 'Disable Original Sound',
		shortDescription: 'DisableOriginalSound',
		command: '/disableOriginalSound',
		type: 'User',
	},
	EnableHDVideo: {
		description: 'Enable HD Video',
		shortDescription: 'EnableHDVideo',
		command: '/enableHDVideo',
		type: 'User',
	},
	DisableHDVideo: {
		description: 'Disable HD Video',
		shortDescription: 'DisableHDVideo',
		command: '/disableHDVideo',
		type: 'User',
	},
	EnableMirrorVideo: {
		description: 'Enable Mirror Video',
		shortDescription: 'EnableMirrorVideo',
		command: '/enableMirrorVideo',
		type: 'User',
	},
	DisableMirrorVideo: {
		description: 'Disable Mirror Video',
		shortDescription: 'DisableMirrorVideo',
		command: '/disableMirrorVideo',
		type: 'User',
	},
	EnableOptimizeVideoForSharing: {
		description: 'Enable Optimize Video For Sharing',
		shortDescription: 'EnableOptimizeVideoForSharing',
		command: '/enableOptimizeVideo',
		type: 'User',
	},
	DisableOptimizeVideoForSharing: {
		description: 'Disable Optimize Video For Sharing',
		shortDescription: 'DisableOptimizeVideoForSharing',
		command: '/disableOptimizeVideo',
		type: 'User',
	},
	EnableComputerSoundWhenSharing: {
		description: 'Enable Computer Sound When Sharing',
		shortDescription: 'EnableComputerSoundWhenSharing',
		command: '/enableComputerSoundWhenSharing',
		type: 'User',
	},
	DisableComputerSoundWhenSharing: {
		description: 'Disable Computer Sound When Sharing',
		shortDescription: 'DisableComputerSoundWhenSharing',
		command: '/disableComputerSoundWhenSharing',
		type: 'User',
	},
	RequestMicDeviceList: {
		description: 'Request Mic Device List',
		shortDescription: 'RequestMicDeviceList',
		command: '/listMicDevices',
		type: 'User',
	},
	RequestSpeakerDeviceList: {
		description: 'Request Speaker Device List',
		shortDescription: 'RequestSpeakerDeviceList',
		command: '/listSpeakerDevices',
		type: 'User',
	},
	RequestMicLevel: {
		description: 'Request Mic Level',
		shortDescription: 'RequestMicLevel',
		command: '/getMicLevel',
		type: 'User',
	},
	RequestSpeakerVolume: {
		description: 'Request Speaker Volume',
		shortDescription: 'RequestSpeakerVolume',
		command: '/getSpeakerVolume',
		type: 'User',
	},
	RequestCameraDevices: {
		description: 'Request Camera Devices',
		shortDescription: 'RequestCameraDevices',
		command: '/listCameraDevices',
		type: 'User',
	},
	RequestVirtualBackgroundList: {
		description: 'Request Virtual Background List',
		shortDescription: 'RequestVirtualBackgroundList',
		command: '/listBackgrounds',
		type: 'User',
	},
	RequestCurrentCameraDevice: {
		description: 'Request Current Camera Device',
		shortDescription: 'RequestCurrentCameraDevice',
		command: '/getCameraDevice',
		type: 'User',
	},
	RequestCurrentMicDevice: {
		description: 'Request Current Mic Device',
		shortDescription: 'RequestCurrentMicDevice',
		command: '/getMicDevice',
		type: 'User',
	},
	RequestCurrentSpeakerDevice: {
		description: 'Request Current Speaker Device',
		shortDescription: 'RequestCurrentSpeakerDevice',
		command: '/getSpeakerDevice',
		type: 'User',
	},
	RequestCurrentVirtualBackground: {
		description: 'Request Current Virtual Background',
		shortDescription: 'RequestCurrentVirtualBackground',
		command: '/getBackground',
		type: 'User',
	},
	SendParticipantToBreakoutRoom: {
		description: 'Send Participant To BreakoutRoom',
		shortDescription: 'SendParticipantToBreakoutRoom',
		command: '/sendToBreakout',
		type: 'User',
	},
	RemoveParticipantFromBreakoutRoom: {
		description: 'Remove Participant From BreakoutRoom',
		shortDescription: 'RemoveParticipantFromBreakoutRoom',
		command: '/removeFromBreakout',
		type: 'User',
	},
	AssignParticipantToBreakoutRoom: {
		description: 'Assign Participant To BreakoutRoom',
		shortDescription: 'AssignParticipantToBreakoutRoom',
		command: '/assignToBreakout',
		type: 'User',
	},
	UnassignParticipantFromBreakoutRoom: {
		description: 'Unassign Participant From BreakoutRoom',
		shortDescription: 'UnassignParticipantFromBreakoutRoom',
		command: '/unassignFromBreakout',
		type: 'User',
	},
	SetGalleryView: {
		description: 'Set Gallery View',
		shortDescription: 'SetGalleryView',
		command: '/zoom/me/setGalleryView',
		type: 'Global',
	},
	MuteAll: {
		description: 'Mute All',
		shortDescription: 'MuteAll',
		command: '/zoom/all/mute',
		type: 'Global',
	},
	UnmuteAll: {
		description: 'Unmute All',
		shortDescription: 'UnmuteAll',
		command: '/zoom/all/unMute',
		type: 'Global',
	},
	ClearSpotlight: {
		description: 'Clear Spotlight',
		shortDescription: 'ClearSpotlight',
		command: '/zoom/clearSpot',
		type: 'Global',
	},
	EnableUsersToUnmute: {
		description: 'Enable Users To Unmute',
		shortDescription: 'EnableUsersToUnmute',
		command: '/zoom/enableUserUnmute',
		type: 'Global',
	},
	DisableUsersToUnmute: {
		description: 'Disable Users ToUnmute',
		shortDescription: 'DisableUsersToUnmute',
		command: '/zoom/disableUserUnmute',
		type: 'Global',
	},
	LowerAllHands: {
		description: 'Lower AllHands',
		shortDescription: 'LowerAllHands',
		command: '/zoom/lowerAllHands',
		type: 'Global',
	},
	RequestBreakoutList: {
		description: 'Request Breakout List',
		shortDescription: 'RequestBreakoutList',
		command: '/zoom/listBreakouts',
		type: 'Global',
	},
	OpenBreakoutRooms: {
		description: 'Open Breakout Rooms',
		shortDescription: 'OpenBreakoutRooms',
		command: '/zoom/openBreakouts',
		type: 'Global',
	},
	CloseBreakoutRooms: {
		description: 'Close Breakout Rooms',
		shortDescription: 'CloseBreakoutRooms',
		command: '/zoom/closeBreakouts',
		type: 'Global',
	},
	DeleteAllBreakoutRooms: {
		description: 'Delete All Breakout Rooms',
		shortDescription: 'DeleteAllBreakoutRooms',
		command: '/zoom/deleteAllBreakouts',
		type: 'Global',
	},
	AdmitEveryoneFromWaitingRoom: {
		description: 'AdmitEveryoneFromWaiting Room',
		shortDescription: 'AdmitEveryoneFromWaitingRoom',
		command: '/zoom/admitAll',
		type: 'Global',
	},
	EjectAllWebinarAttendees: {
		description: 'Eject All Webinar Attendees',
		shortDescription: 'EjectAllWebinarAttendees',
		command: '/zoom/ejectAttendees',
		type: 'Global',
	},
	StartLocalRecording: {
		description: 'Start Local Recording',
		shortDescription: 'StartLocalRecording',
		command: '/zoom/startLocalRecording',
		type: 'Global',
	},
	PauseLocalRecording: {
		description: 'Pause Local Recording',
		shortDescription: 'PauseLocalRecording',
		command: '/zoom/pauseLocalRecording',
		type: 'Global',
	},
	ResumeLocalRecording: {
		description: 'Resume Local Recording',
		shortDescription: 'ResumeLocalRecording',
		command: '/zoom/resumeLocalRecording',
		type: 'Global',
	},
	StopLocalRecording: {
		description: 'Stop Local Recording',
		shortDescription: 'StopLocalRecording',
		command: '/zoom/stopLocalRecording',
		type: 'Global',
	},
	StartCloudRecording: {
		description: 'Start Cloud Recording',
		shortDescription: 'StartCloudRecording',
		command: '/zoom/startCloudRecording',
		type: 'Global',
	},
	PauseCloudRecording: {
		description: 'Pause Cloud Recording',
		shortDescription: 'PauseCloudRecording',
		command: '/zoom/pauseCloudRecording',
		type: 'Global',
	},
	ResumeCloudRecording: {
		description: 'Resume Cloud Recording',
		shortDescription: 'ResumeCloudRecording',
		command: '/zoom/resumeCloudRecording',
		type: 'Global',
	},
	StopCloudRecording: {
		description: 'Stop Cloud Recording',
		shortDescription: 'StopCloudRecording',
		command: '/zoom/stopCloudRecording',
		type: 'Global',
	},
	// UpdateTargetIDs: {
	// 	description: 'Update TargetIDs',
	// 	shortDescription: 'UpdateTargetIDs',
	// 	command: '/zoom/update',
	// 	type: 'Global',
	// },
	// AppendTargetIDs: {
	// 	description: 'Append TargetIDs',
	// 	shortDescription: 'AppendTargetIDs',
	// 	command: '/zoom/include',
	// 	type: 'Global',
	// },
	RequestGalleryCount: {
		description: 'Request GalleryCount',
		shortDescription: 'RequestGalleryCount',
		command: '/zoom/galCount',
		type: 'Global',
	},
	// LoadTargetIDs: {
	// 	description: 'Load TargetIDs',
	// 	shortDescription: 'LoadTargetIDs',
	// 	command: '/zoom/load',
	// 	type: 'Global',
	// },
	// SaveTargetIDs: {
	// 	description: 'Save TargetIDs',
	// 	shortDescription: 'SaveTargetIDs',
	// 	command: '/zoom/save',
	// 	type: 'Global',
	// },
	RequestListOfBreakoutRooms: {
		description: 'Request list of breakout rooms',
		shortDescription: 'RequestListOfBreakoutRooms',
		command: '/zoom/listBreakouts',
		type: 'Global',
	},
	// ResetTargetIDs: {
	// 	description: 'Reset TargetIDs',
	// 	shortDescription: 'ResetTargetIDs',
	// 	command: '/zoom/reset',
	// 	type: 'Global',
	// },
	LeaveMeeting: {
		description: 'Leave Meeting',
		shortDescription: 'LeaveMeeting',
		command: '/zoom/leaveMeeting',
		type: 'Global',
	},
	EndMeeting: {
		description: 'End Meeting',
		shortDescription: 'EndMeeting',
		command: '/zoom/endMeeting',
		type: 'Global',
	},
	EnableWaitingRoom: {
		description: 'Enable Waiting Room',
		shortDescription: 'EnableWaitingRoom',
		command: '/zoom/enableWaitingRoom',
		type: 'Global',
	},
	DisableWaitingRoom: {
		description: 'Disable Waiting Room',
		shortDescription: 'DisableWaitingRoom',
		command: '/zoom/disableWaitingRoom',
		type: 'Global',
	},
	PingZoomOSC: {
		description: 'Ping Zoom OSC',
		shortDescription: 'PingZoomOSC',
		command: '/zoom/ping',
		type: 'Special',
	},
	// SetZoomOSCSubscribeLevel: {
	// 	description: 'Set ZoomOSC Subscribe Level',
	// 	shortDescription: 'SetZoomOSCSubscribeLevel',
	// 	command: '/zoom/subscribe',
	// 	args: 'subscribeLevel',
	// 	type: 'Special',
	// },
	RequestOrderOfGalleryView: {
		description: 'Request Order Of GalleryView',
		shortDescription: 'RequestOrderOfGalleryView',
		command: '/zoom/getGalleryOrder',
		type: 'Special',
	},
	// RequestOrderOfSpotlights: {
	// 	description: 'Request Order Of Spotlights',
	// 	shortDescription: 'RequestOrderOfSpotlights',
	// 	command: '/zoom/getSpotOrder',
	// 	type: 'Special',
	// },
	ListUsers: {
		description: 'Request list of users (will be removed)',
		shortDescription: 'ListUsers',
		command: '/zoom/list',
		type: 'Special',
	},
	startISOEngine: {
		description: 'start ISO Engine',
		shortDescription: 'startISOEngine',
		command: '/zoom/startISOEngine',
		type: 'ISO',
	},
	stopISOEngine: {
		description: 'Start ISO Engine',
		shortDescription: 'stopISOEngine',
		command: '/zoom/stopISOEngine',
		type: 'ISO',
	},
	pauseISOEngine: {
		description: 'Pause ISO Engine',
		shortDescription: 'pauseISOEngine',
		command: '/zoom/pauseISOEngine',
		type: 'ISO',
	},
	// ConfigureBreakoutRooms: {
	// 	description: 'Configure BreakoutRooms',
	// 	shortDescription: 'Configure BreakoutRooms',
	// 	command:
	// 		'/zoom/configureBreakouts{intpostCloseSeconds,intallowChooseBreakout(0=false,1=true),intallowReturnAtWill,intautoMoveParticipants,intuseTimer,intcloseWithTimer,intbreakoutDurrationSeconds}',
	// },
}

const ActionsWithArguments: actionType = {
	Rename: { description: 'Rename', shortDescription: 'Rename', command: '/rename', type: 'User', args: 'user,name' },
	outputISO: {
		description: 'output ISO',
		shortDescription: 'outputISO',
		command: '/outputISO',
		type: 'ISO',
		singleUser: true,
		args: 'output',
	},
	audioISO: {
		description: 'audio ISO',
		shortDescription: 'audioISO',
		command: '/audioISO',
		type: 'ISO',
		singleUser: true,
		args: 'audio',
	},
	SetWindowPosition: {
		description: 'Set Window Position',
		shortDescription: 'SetWindowPosition',
		command: '/setWindowPosition',
		args: 'intX,intY',
		singleUser: true,
		type: 'User',
	},
	SetWindowSize: {
		description: 'Set Window Size',
		shortDescription: 'SetWindowSize',
		command: '/setWindowSize',
		args: 'intX,intY',
		singleUser: true,
		type: 'User',
	},
	SetVirtualBackground: {
		description: 'Set Virtual Background',
		shortDescription: 'SetVirtualBackground',
		command: '/setBackground',
		args: 'id',
		singleUser: true,
		type: 'User',
	},
	SetVideoFilter: {
		description: 'Set Video Filter',
		shortDescription: 'SetVideoFilter',
		command: '/setVideoFilter',
		args: 'id',
		singleUser: true,
		type: 'User',
	},
	SetCameraDevice: {
		description: 'Set Camera Device',
		shortDescription: 'SetCameraDevice',
		command: '/setCameraDevice',
		args: 'id',
		singleUser: true,
		type: 'User',
	},
	SetSpeakerVolume: {
		description: 'Set Speaker Volume',
		shortDescription: 'SetSpeakerVolume',
		command: '/setSpeakerVolume',
		args: 'level',
		singleUser: false,
		type: 'User',
	},
	SetSpeakerDevice: {
		description: 'Set Speaker Device',
		shortDescription: 'SetSpeakerDevice',
		command: '/setSpeakerDevice',
		args: 'id',
		singleUser: true,
		type: 'User',
	},
	SetMicDevice: {
		description: 'Set Mic Device',
		shortDescription: 'SetMicDevice',
		command: '/setMicDevice',
		args: 'id',
		singleUser: true,
		type: 'User',
	},
	SetMicLevel: {
		description: 'Set Mic Level',
		shortDescription: 'SetMicLevel',
		command: '/setMicLevel',
		args: 'level',
		type: 'User',
	},
	StartShareWithWindow: {
		description: 'Start Share With Window',
		shortDescription: 'StartShareWithWindow',
		command: '/zoom/me/startWindowShare',
		args: 'id',
		singleUser: true,
		type: 'Global',
	},
	StartAudioShare: {
		description: 'Start AudioShare',
		shortDescription: 'StartAudioShare',
		command: '/zoom/me/startAudioShare',
		args: 'id',
		singleUser: true,
		type: 'Global',
	},
	StartCameraShare: {
		description: 'Start CameraShare',
		shortDescription: 'StartCameraShare',
		command: '/zoom/me/startCameraShare',
		args: 'id',
		singleUser: true,
		type: 'Global',
	},
	StartScreenShare: {
		description: 'Start Screen Share',
		shortDescription: 'StartScreenShare',
		command: '/zoom/me/startScreenshare',
		args: 'id',
		singleUser: true,
		type: 'Global',
	},
	SendAChatViaDM: {
		description: 'Send A Chat Via DM',
		shortDescription: 'SendAChatViaDM',
		command: '/chat',
		args: 'msg',
		singleUser: true,
		type: 'User',
	},
	// RemoteChat: {
	// 	description: 'Remote Chat',
	// 	shortDescription: 'RemoteChat',
	// 	command: '/remoteChat',
	// 	args: 'msg',
	// 	type: 'User',
	// },
	SendAChatToEveryone: {
		description: 'Send A Chat To Everyone',
		shortDescription: 'SendAChatToEveryone',
		command: '/zoom/chatAll',
		args: 'msg',
		type: 'Global',
	},
	CreateBreakoutRoom: {
		description: 'Create Breakout Room',
		shortDescription: 'CreateBreakoutRoom',
		command: '/zoom/createBreakout',
		args: 'name',
		type: 'Global',
	},
	DeleteBreakoutRoom: {
		description: 'Delete Breakout Room',
		shortDescription: 'DeleteBreakoutRoom',
		command: '/zoom/deleteBreakout',
		args: 'name',
		type: 'Global',
	},
	BroadcastMessageToBreakoutRooms: {
		description: 'Broadcast Message To Breakout Rooms',
		shortDescription: 'BroadcastMessageToBreakoutRooms',
		command: '/zoom/broadcastToBreakouts',
		args: 'msg',
		type: 'Global',
	},
	SendMessageToWaitingRoom: {
		description: 'Send Message To Waiting Room',
		shortDescription: 'SendMessageToWaitingRoom',
		command: '/zoom/messageWaitingRoom',
		args: 'msg',
		type: 'Global',
	},
	JoinMeeting: {
		description: 'Join Meeting',
		shortDescription: 'JoinMeeting',
		command: '/zoom/joinMeeting',
		args: 'JoinMeeting',
		type: 'Special',
	},
	ZAKJoinMeeting: {
		description: 'ZAK Join Meeting',
		shortDescription: 'ZAKJoinMeeting',
		command: '/zoom/zakJoin',
		args: 'zak',
		type: 'Special',
	},
	ZAKStartMeeting: {
		description: 'ZAK Start Meeting',
		shortDescription: 'ZAKStartMeeting',
		command: '/zoom/zakStart',
		args: 'zak',
		type: 'Special',
	},
}
if (module != undefined) module.exports = { Actions, ActionsWithArguments }

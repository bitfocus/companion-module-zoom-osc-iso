import type ModuleInstance from '../index.js'
import type { OSCSomeArguments } from '@companion-module/base'

export interface ZoomOSCArgument {
	type: string
	value: any
}

export interface ZoomOSCResponse {
	address: string
	args: ZoomOSCArgument[]
}

export enum UserRole {
	Host = 1,
	CoHost = 2,
	Participant = 3,
}

/** The status_code in meetingStatusChanged: the Zoom SDK's ZoomSDKMeetingStatus values (there is no 11) */
export enum MeetingStatus {
	Idle = 0,
	Connecting = 1,
	WaitingForHost = 2,
	InMeeting = 3,
	Disconnecting = 4,
	Reconnecting = 5,
	Failed = 6,
	Ended = 7,
	AudioReady = 8,
	OtherMeetingInProgress = 9,
	InWaitingRoom = 10,
	WebinarPromote = 12,
	WebinarDepromote = 13,
	JoinBreakoutRoom = 14,
	LeaveBreakoutRoom = 15,
	JoinBackstage = 16,
	LeaveBackstage = 17,
}

export interface OSCHandlerContext {
	instance: ModuleInstance
	createZoomUser(data: ZoomOSCResponse): Promise<void>
	setUpdateLoop(value: boolean): void
	setNeedToPingPong(value: boolean): void
	isSpotlightGroupTrackingInitialized(): boolean
	setSpotlightGroupTrackingInitialized(value: boolean): void
	destroyTimers(): void
	createPingTimer(): void
	createUpdatePresetsTimer(): void
	createZoomIsoPullerTimer(): void
	destroyZoomIsoPullerTimer(): void
	hasZoomIsoPuller(): boolean
	/** True for the first pong since the connection started, false for every pong after it */
	isFirstPong(): boolean
	configureConnectedPingWatchdog(callStatus: number): void
	sendCommand(path: string, args?: OSCSomeArguments): void
}

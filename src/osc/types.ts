import type { OSCSomeArguments } from '@companion-module/base'
import type { ZoomConfig } from '../config.js'
import type { InstanceBaseExt } from '../utils.js'

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

export interface OSCHandlerContext {
	instance: InstanceBaseExt<ZoomConfig>
	createZoomUser(data: ZoomOSCResponse): Promise<void>
	setUpdateLoop(value: boolean): void
	isSpotlightGroupTrackingInitialized(): boolean
	setSpotlightGroupTrackingInitialized(value: boolean): void
	destroyTimers(): void
	createPingTimer(): void
	createUpdatePresetsTimer(): void
	createZoomIsoPullerTimer(): void
	destroyZoomIsoPullerTimer(): void
	hasZoomIsoPuller(): boolean
	configureConnectedPingWatchdog(callStatus: number): void
	sendCommand(path: string, args?: OSCSomeArguments): void
}

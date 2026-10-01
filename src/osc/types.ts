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

export type NodeOscTypedArgument = {
	type: string
	value: string | number | boolean
}

export type NodeOscArgument = string | number | boolean | NodeOscTypedArgument
export type NodeOscMessage = [string, ...NodeOscArgument[]]

export enum UserRole {
	Host = 1,
	CoHost = 2,
	Participant = 3,
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
	configureConnectedPingWatchdog(callStatus: number): void
	sendCommand(path: string, args?: OSCSomeArguments): void
}

import instance_skel = require('../../../instance_skel')
import {
	CompanionActions,
	CompanionConfigField,
	CompanionFeedbacks,
	CompanionPreset,
	CompanionSystem,
} from '../../../instance_skel_types'
import { Config } from './config'
import { getActions } from './actions'
import { getConfigFields } from './config'
import { getFeedbacks } from './feedback'
import { getUserPresets, getGlobalPresets, getSelectUsersPresets, getSpecialPresets } from './presets'
import { Variables } from './variables'
import { OSC } from './osc'

/**
 * Companion instance class for Zoom
 */
class ZoomInstance extends instance_skel<Config> {
	// Global call settings
	public ZoomClientDataObj: {
		subscribeMode: number
		selectedCaller: number
		selectedAddToGroup: number
		galleryShape: [number, number]
		activeSpeaker: string
		zoomOSCVersion: string | number
		callStatus: string | number
		numberOfUsersInCall: number
		galleryCount: number
		numberOfTargets: number
		galTrackMode: number
		last_ping: number
		numberOfGroups: number
	} = {
		selectedCaller: -1,
		selectedAddToGroup: -1,
		subscribeMode: 0,
		galleryShape: [0, 0],
		activeSpeaker: 'None',
		zoomOSCVersion: 'Not Connected',
		callStatus: 0,
		numberOfUsersInCall: 0,
		galleryCount: 0,
		numberOfTargets: 0,
		galTrackMode: 0,
		last_ping: 0,
		numberOfGroups: 5,
	}
	// Array with all callers
	public ZoomUserData: {
		[key: number]: {
			zoomId: number
			userName: string
			targetIndex: number
			galleryIndex: number
			mute?: boolean
			videoOn?: boolean
			handRaised?: boolean
			userRole?: number
			users: number[]
		}
	} = {}

	public OSC: OSC | null = null
	public variables: Variables | null = null

	constructor(system: CompanionSystem, id: string, config: Config) {
		super(system, id, config)
		this.system = system
		this.config = config
		this.ZoomClientDataObj.numberOfGroups = this.config.numberOfGroups

		// Setup groups
		for (let index = 0; index < this.ZoomClientDataObj.numberOfGroups; index++) {
			this.ZoomUserData[index] = {
				zoomId: index,
				userName: `Group ${index}`,
				targetIndex: -1,
				galleryIndex: -1,
				users: [],
			}
		}
	}

	/**
	 * @description triggered on instance being enabled
	 */
	public init(): void {
		// New Module warning
		this.log('info', `Welcome, Zoom module is loading`)
		this.status(this.STATUS_WARNING, 'Connecting')
		this.variables = new Variables(this)
		this.variables.updateDefinitions()
		this.OSC = new OSC(this)
	}

	/**
	 * @returns config options
	 * @description generates the config options available for this instance
	 */
	public readonly config_fields = (): CompanionConfigField[] => {
		return getConfigFields()
	}

	/**
	 * @param config new configuration data
	 * @description triggered every time the config for this instance is saved
	 */
	public updateConfig(config: Config): void {
		this.config = config
		if (config.numberOfGroups !== this.ZoomClientDataObj.numberOfGroups)
			this.ZoomClientDataObj.numberOfGroups = this.config.numberOfGroups
		if (config.subscribeMode !== this.ZoomClientDataObj.subscribeMode){
			this.ZoomClientDataObj.subscribeMode = this.config.subscribeMode
			this.oscSend(this.config.host, this.config.tx_port, '/zoom/subscribe', [{ type: 'i', value: this.config.subscribeMode }])
		}
		this.updateInstance()
		this.setPresetDefinitions([
			...getSelectUsersPresets(this),
			...getSpecialPresets(this),
			...getUserPresets(this),
			...getGlobalPresets(this),
		] as CompanionPreset[])
		if (this.variables) this.variables.updateDefinitions()
	}

	/**
	 * @description close connections and stop timers/intervals
	 */
	public readonly destroy = (): void => {
		this.log('debug', `Instance destroyed: ${this.id}`)
		this.OSC?.destroy()
	}

	/**
	 * @description Create and update variables
	 */
	public updateVariables(): void {
		this.variables?.updateDefinitions()
		this.variables?.updateVariables()
	}

	/**
	 * @description sets actions, presets and feedbacks available for this instance
	 */
	public updateInstance(): void {
		// Cast actions and feedbacks from Zoom types to Companion types
		const actions = getActions(this) as CompanionActions
		const feedbacks = getFeedbacks(this) as CompanionFeedbacks
		const presets = [
			...getSelectUsersPresets(this),
			...getUserPresets(this),
			...getGlobalPresets(this),
			...getSpecialPresets(this),
		] as CompanionPreset[]

		this.setActions(actions)
		this.setFeedbackDefinitions(feedbacks)
		this.setPresetDefinitions(presets)
	}
}

export = ZoomInstance

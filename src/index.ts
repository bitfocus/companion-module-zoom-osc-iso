import instance_skel = require('../../../instance_skel')
import {
	CompanionActions,
	CompanionConfigField,
	CompanionFeedbacks,
	CompanionSystem,
	// CompanionPreset,
} from '../../../instance_skel_types'
import { Config } from './config'
import { getActions } from './actions'
import { getConfigFields } from './config'
import { getFeedbacks } from './feedback'
// import { getPresets } from './presets'
import { Variables } from './variables'
import { OSC } from './osc'

/**
 * Companion instance class for Zoom
 */
class ZoomInstance extends instance_skel<Config> {
	constructor(system: CompanionSystem, id: string, config: Config) {
		super(system, id, config)
		this.system = system
		this.config = config
	}
	public combinedLayerArray!: { name: string; sourceA: string; sourceB: string; preset_enabled: number }[]
	public combinedTransitionsArray!: Array<string>
	public combinedSnapshotsArray!: Array<string>
	public ZoomClientDataObj!: {
		last_ping: number
		subscribeMode: number
		galleryShape: [ number, number ]
		oldgalleryShape: [number, number]
		activeSpeaker: string
		zoomOSCVersion: string | number
		galTrackMode: number
		callStatus: string | number
		numberOfTargets: number
		numberOfUsersInCall: number
		listIndexOffset: number
		numberOfSelectedUsers: number
	}
	// We use ZoomID as idex
	public ZoomUserData!: {
		zoomId: number
		username: string
		galleryIndex: number
		mute?: boolean
		videoOn?: boolean
		handRaised?: boolean
	}[]

	public connected = false
	public OSC: OSC | null = null
	public variables: Variables | null = null

	/**
	 * @description triggered on instance being enabled
	 */
	public init(): void {
		// New Module warning
		this.log('info', `Welcome, Zoom module is loading`)
		this.status(this.STATUS_WARNING, 'Connecting')
		this.variables = new Variables(this)
		this.OSC = new OSC(this)
		this.updateInstance()
		this.variables.updateDefinitions()
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
		this.updateInstance()
		// this.setPresetDefinitions(getPresets(this) as CompanionPreset[])
		if (this.variables) this.variables.updateDefinitions()
	}

	/**
	 * @description close connections and stop timers/intervals
	 */
	public readonly destroy = (): void => {
		this.log('debug', `Instance destroyed: ${this.id}`)
	}

	/**
	 * @description sets actions and feedbacks available for this instance
	 */
	public updateInstance(): void {
		// Cast actions and feedbacks from Zoom types to Companion types
		const actions = getActions(this) as CompanionActions
		
		const feedbacks = getFeedbacks(this) as CompanionFeedbacks
		// const presets = getPresets(this) as CompanionPreset[]

		this.setActions(actions)
		this.setFeedbackDefinitions(feedbacks)
		// this.setPresetDefinitions(presets)
	}
}

export = ZoomInstance

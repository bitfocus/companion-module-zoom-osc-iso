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
import {
	getPresets,
	getPresetsWithArguments,
	getSelectUsersPresets,
} from './presets'
import { Variables } from './variables'
import { OSC } from './osc'

/**
 * Companion instance class for Zoom
 */
class ZoomInstance extends instance_skel<Config> {
	static GetUpgradeScripts() {
		return [
			// any existing upgrade scripts go here
			instance_skel.CreateConvertToBooleanFeedbackUpgradeScript({
				microphoneLive: true,
				camera: true,
				handRaised: true,
				selectedUser: true,
			}),
		]
	}

	// Global call settings
	public ZoomClientDataObj: {
		last_response: number
		subscribeMode: number
		selectedCallers: number[]
		// galleryShape: [number, number]
		activeSpeaker: string
		isSpeaking: string
		zoomOSCVersion: string | number
		callStatus: string | number
		galleryCount: number
		galleryOrder: number[]
		numberOfGroups: number
	} = {
		last_response: 0,
		selectedCallers: [],
		subscribeMode: 0,
		// galleryShape: [0, 0],
		activeSpeaker: 'None',
		isSpeaking: 'None',
		zoomOSCVersion: 'Not Connected',
		callStatus: 0,
		galleryCount: 0,
		galleryOrder: [],
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

	public ZoomGroupData: {
		groupName: string
		users: { zoomID: number; userName: string }[]
	}[] = []

	public ZoomUserOffline: {
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

	public ZoomVariableLink: { zoomId: number; userName: string }[] = []

	public OSC: OSC | null = null
	public variables: Variables | null = null

	constructor(system: CompanionSystem, id: string, config: Config) {
		super(system, id, config)
		this.system = system
		this.config = config
		this.ZoomClientDataObj.numberOfGroups = this.config.numberOfGroups
		// Setup groups
		for (let index = 0; index < this.ZoomClientDataObj.numberOfGroups; index++) {
			this.ZoomGroupData[index] = {
				groupName: `Group ${index + 1}`,
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
		console.log('changing config!', config)

		this.config = config
		if (config.numberOfGroups !== this.ZoomClientDataObj.numberOfGroups)
			this.ZoomClientDataObj.numberOfGroups = config.numberOfGroups
		for (let index = 0; index < this.ZoomClientDataObj.numberOfGroups; index++) {
			this.ZoomGroupData[index] = {
				groupName: `Group ${index+1}`,
				users: [],
			}
		}
		this.OSC?.destroy()
		this.OSC = new OSC(this)

		console.log('groups', this.ZoomClientDataObj.numberOfGroups)

		this.updateInstance()
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
		if (this.variables) {
			console.log('updating')

			this.variables.updateDefinitions()
			this.variables.updateVariables()
		}
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
			...getPresets(this),
			...getPresetsWithArguments(this),
		] as CompanionPreset[]

		this.setActions(actions)
		this.setFeedbackDefinitions(feedbacks)
		this.setPresetDefinitions(presets)
		this.updateVariables()
	}
}

export = ZoomInstance

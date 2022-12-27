import {
	CompanionActionDefinitions,
	InstanceBase,
	InstanceStatus,
	CompanionConfigField,
	// CompanionFeedbackDefinitions,
	// CompanionSystem,
	runEntrypoint,
	SomeCompanionConfigField,
	CompanionVariableValues,
	// CompanionPresetDefinitions,
} from '@companion-module/base'
import { getConfigFields, ZoomConfig } from './config'
import { getActions } from './actions'
// import { getFeedbacks } from './feedback'
// import { getPresets, getSelectUsersPresets } from './presets'
import { Variables } from './variables'
import { OSC } from './osc'
import {
	ZoomAudioLevelDataInterface,
	ZoomAudioRoutingDataInterface,
	ZoomClientDataObjInterface,
	ZoomGroupDataInterface,
	ZoomOutputDataInterface,
	ZoomUserDataInterface,
	ZoomUserOfflineInterface,
	ZoomVariableLinkInterface,
} from './utils'

/**
 * Companion instance class for Zoom
 */
class ZoomInstance extends InstanceBase<ZoomConfig> {
	public config: ZoomConfig = {
		label: '',
		host: '',
		tx_port: 0,
		rx_port: 0,
		version: 0,
		selectionMethod: 0,
		numberOfGroups: 0,
		pulling: 0,
	}

	public async configUpdated(config: ZoomConfig): Promise<void> {
		this.config = config
		const variables: CompanionVariableValues = {}
		this.setVariableValues(variables)

		this.showLog('debug', 'changing config!')

		if (config.numberOfGroups !== this.ZoomClientDataObj.numberOfGroups)
			this.ZoomClientDataObj.numberOfGroups = config.numberOfGroups
		for (let index = 0; index < this.ZoomClientDataObj.numberOfGroups; index++) {
			this.ZoomGroupData[index] = {
				groupName: `Group ${index + 1}`,
				users: [],
			}
		}
		this.OSC?.destroy()
		this.OSC = new OSC(this)
		this.updateInstance()
		// Get version and start pulling (if needed)
		this.OSC.sendCommand('/zoom/ping')
	}
	getConfigFields(): SomeCompanionConfigField[] {
		throw new Error('Method not implemented.')
	}

	// Global call settings
	public ZoomClientDataObj: ZoomClientDataObjInterface = {
		last_response: 0,
		selectedCallers: [],
		selectedOutputs: [],
		selectedAudioOutputs: [],
		subscribeMode: 0,
		activeSpeaker: 'None',
		isSpeaking: 'None',
		zoomOSCVersion: 'Not Connected',
		callStatus: 0,
		galleryCount: 0,
		galleryOrder: [],
		numberOfGroups: 5,
		engineState: -1,
	}
	// Array with all callers
	public ZoomUserData: ZoomUserDataInterface = {}

	// Array with all output information
	public ZoomOutputData: ZoomOutputDataInterface = {}

	// Array with all audiolevel information
	public ZoomAudioLevelData: ZoomAudioLevelDataInterface = {}

	// Array with all audiolevel information
	public ZoomAudioRoutingData: ZoomAudioRoutingDataInterface = {}

	public ZoomGroupData: ZoomGroupDataInterface[] = []

	public ZoomUserOffline: ZoomUserOfflineInterface = {}

	public ZoomVariableLink: ZoomVariableLinkInterface[] = []

	public OSC: OSC | null = null
	public variables: Variables | null = null

	constructor(internal: unknown) {
		super(internal)
		// this.system = system
		// this.config = config
		// this.ZoomClientDataObj.numberOfGroups = this.config.numberOfGroups
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
	public async init(config: ZoomConfig): Promise<void> {
		// New Module warning
		this.log('info', `Welcome, Zoom module is loading`)
		this.updateStatus(InstanceStatus.Connecting)
		this.variables = new Variables(this)
		this.variables.updateDefinitions()
		this.OSC = new OSC(this)

		await this.configUpdated(config)
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
	// public updateConfig(config: ZoomConfig): void {
	// this.showLog('debug', 'changing config!')

	// if (config.numberOfGroups !== this.ZoomClientDataObj.numberOfGroups)
	// 	this.ZoomClientDataObj.numberOfGroups = config.numberOfGroups
	// for (let index = 0; index < this.ZoomClientDataObj.numberOfGroups; index++) {
	// 	this.ZoomGroupData[index] = {
	// 		groupName: `Group ${index + 1}`,
	// 		users: [],
	// 	}
	// }
	// this.OSC?.destroy()
	// this.OSC = new OSC(this)
	// this.updateInstance()
	// // Get version and start pulling (if needed)
	// this.OSC.sendCommand('/zoom/ping')
	// }

	/**
	 * @description close connections and stop timers/intervals
	 */
	async destroy() {
		this.ZoomUserData = {}
		this.ZoomVariableLink = []
		this.ZoomGroupData = []
		this.ZoomUserOffline = []
		this.ZoomAudioLevelData = []
		this.ZoomAudioRoutingData = []
		this.log('debug', `Instance destroyed: ${this.id}`)
		this.OSC?.destroy()
	}

	/**
	 * @description Create and update variables
	 */
	public updateVariables(): void {
		if (this.variables) {
			// this.showLog('console', 'updating variables')

			this.variables.updateDefinitions()
			this.variables.updateVariables()
		}
	}

	/**
	 * @description function to handle logs
	 * @param type isolate, console, OSC, debug, info
	 * @param message
	 */
	public showLog(type: string, message: string): void {
		switch (type) {
			case 'isolate':
				console.log(message)
				break
			case 'console':
				console.log(message)
				break
			case 'OSC':
				console.log(message)
				break
			case 'debug':
				this.log('debug', message)
				break
			case 'info':
				this.log('info', message)
				break
			case 'error':
				this.log('error', message)
				break
		}
	}

	/**
	 * @description sets actions, presets and feedbacks available for this instance
	 */
	public updateInstance(): void {
		// Cast actions and feedbacks from Zoom types to Companion types
		const actions = getActions(this) as CompanionActionDefinitions
		// const feedbacks = getFeedbacks(this) as CompanionFeedbackDefinitions
		// const presets = [
		// 	...getSelectUsersPresets(this.ZoomGroupData, this.ZoomUserData),
		// 	...getPresets(this.config),
		// ] as CompanionPresetDefinitions[]

		this.setActionDefinitions(actions)
		// this.setFeedbackDefinitions(feedbacks)
		// this.setPresetDefinitions(presets)
		this.updateVariables()
	}
}

runEntrypoint(ZoomInstance, [])

import {
	CompanionActionDefinitions,
	InstanceBase,
	InstanceStatus,
	// CompanionFeedbackDefinitions,
	// CompanionSystem,
	runEntrypoint,
	SomeCompanionConfigField,
	// CompanionPresetDefinitions,
} from '@companion-module/base'
import { GetConfigFields, ZoomConfig } from './config'
import { getActions } from './actions'
// import { getFeedbacks } from './feedback'
import { GetPresetList } from './presets'
import { InitVariables, updateVariables } from './variables'
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
		return GetConfigFields()
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
		this.config = config
		// await this.configUpdated(this.config)

		InitVariables(this)
		this.setPresetDefinitions(GetPresetList(this.ZoomGroupData, this.ZoomUserData))
		// this.setFeedbackDefinitions(GetFeedbacksList())
		this.setActionDefinitions(getActions(this))
		updateVariables(this)
		this.log('info', `Welcome, Zoom module is loading`)
		this.updateStatus(InstanceStatus.Connecting)
		this.OSC = new OSC(this)
	}

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
		InitVariables(this)
		updateVariables(this)

		this.setActionDefinitions(actions)
		// this.setFeedbackDefinitions(feedbacks)
		this.setPresetDefinitions(GetPresetList(this.ZoomGroupData, this.ZoomUserData))
	}
}

runEntrypoint(ZoomInstance, [])

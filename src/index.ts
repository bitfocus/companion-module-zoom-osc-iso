import { InstanceBase, runEntrypoint, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, ZoomConfig } from './config'
import { GetActions } from './actions'
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

	/**
	 *
	 * @param internal
	 */
	constructor(internal: unknown) {
		super(internal)
		// this.system = system
		// this.config = config
		// Setup groups
		for (let index = 0; index < this.ZoomClientDataObj.numberOfGroups; index++) {
			this.ZoomGroupData[index] = {
				groupName: `Group ${index + 1}`,
				users: [],
			}
		}
	}

	/**
	 *
	 * @param config
	 */
	public async configUpdated(config: ZoomConfig): Promise<void> {
		this.config = config
		this.log('info', 'changing config!')
		if (config.numberOfGroups !== this.ZoomClientDataObj.numberOfGroups)
			this.ZoomClientDataObj.numberOfGroups = config.numberOfGroups

		for (let index = 0; index < this.ZoomClientDataObj.numberOfGroups; index++) {
			this.ZoomGroupData[index] = {
				groupName: `Group ${index + 1}`,
				users: [],
			}
		}
		if (this.OSC) this.OSC.destroy()
		this.OSC = new OSC(this)
		this.updateInstance()
	}

	/**
	 *
	 * @returns
	 */
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}
	/**
	 * @description triggered on instance being enabled
	 * @param config
	 */
	public async init(config: ZoomConfig): Promise<void> {
		this.log('info', `Welcome, Zoom module is loading`)

		await this.configUpdated(config)
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
		InitVariables(this)
		updateVariables(this)

		this.setActionDefinitions(GetActions(this))
		// this.setFeedbackDefinitions(feedbacks)
		this.setPresetDefinitions(GetPresetList(this.ZoomGroupData, this.ZoomUserData))
	}
}

runEntrypoint(ZoomInstance, [])

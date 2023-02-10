import { InstanceBase, runEntrypoint, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, ZoomConfig } from './config'
import { GetActions } from './actions'
import { GetFeedbacks } from './feedback'
import { GetPresetList } from './presets'
import { initVariables, updateVariables } from './variables'
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
 * @description Companion instance class for Zoom
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
		PreviousSelectedCallers: [],
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
	 * @description constructor
	 * @param internal
	 */
	constructor(internal: unknown) {
		super(internal)
		this.instanceOptions.disableVariableValidation = true
	}

	/**
	 * @description when config is updated
	 * @param config
	 */
	public async configUpdated(config: ZoomConfig): Promise<void> {
		this.config = config
		this.saveConfig(config)
		this.log('info', 'changing config!')
		if (config.numberOfGroups !== this.ZoomClientDataObj.numberOfGroups)
			this.ZoomClientDataObj.numberOfGroups = config.numberOfGroups

		for (let index = 0; index < this.ZoomClientDataObj.numberOfGroups + 1; index++) {
			this.ZoomGroupData[index] = {
				groupName: index === 0 ? 'Hosts' : `Group ${index}`,
				users: [],
			}
		}
		if (this.OSC) this.OSC.destroy()
		this.OSC = new OSC(this)
		this.updateInstance()
	}

	/**
	 * @description get all config field information
	 * @returns the config fields
	 */
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}
	/**
	 * @description triggered on instance being enabled
	 * @param config
	 */
	public async init(config: ZoomConfig): Promise<void> {
		this.log('info', `Welcome, Zoom module is being initialized`)

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
	 * @description update variables values
	 */
	public UpdateVariablesValues(): void {
		updateVariables(this)
	}

	/**
	 * @description init variables
	 */
	public InitVariables(): void {
		initVariables(this)
	}
	/**
	 * @description sets actions, variables, presets and feedbacks available for this instance
	 */
	public updateInstance(): void {
		initVariables(this)
		updateVariables(this)

		this.setActionDefinitions(GetActions(this))
		this.setFeedbackDefinitions(GetFeedbacks(this))
		this.setPresetDefinitions(GetPresetList(this.ZoomGroupData, this.ZoomUserData))
	}
}

runEntrypoint(ZoomInstance, [])

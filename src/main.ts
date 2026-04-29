import { InstanceBase, type SomeCompanionConfigField } from '@companion-module/base'
import { GetActions, type ActionsSchema } from './actions.js'
import { GetConfigFields, type ZoomConfig } from './config.js'
import { GetFeedbacks, type FeedbacksSchema } from './feedback.js'
import { GetPresetList } from './presets.js'
import { OSC } from './osc.js'
import {
	ZoomAudioLevelDataInterface,
	ZoomAudioRoutingDataInterface,
	ZoomClientDataObjInterface,
	ZoomGroupDataInterface,
	ZoomOutputDataInterface,
	ZoomUserDataInterface,
	ZoomUserOfflineInterface,
	ZoomVariableLinkInterface,
	ZoomMeDataInterface,
} from './utils.js'

import { updateVariableValues } from './variables/variable-values.js'
import { initVariableDefinitions, type VariablesSchema } from './variables/variable-definitions.js'
import { addNewConfigFieldsForSocialStreamAndPerformanceTweaks } from './upgrades/addNewConfigFieldsForSocialStreamAndPerformanceTweaks.js'
import { UpgradeV2ToV3 } from './upgrades/v2CommandsToUpgradeTov3.js'
import { fixWrongPinCommands } from './upgrades/fixWrongPinCommands.js'
import { addNewConfigFieldsForSocialStreamChatMessagesToSend } from './upgrades/addNewConfigFieldsForSocialStreamChatMessagesToSend.js'
import { addPollingConfigOptions } from './upgrades/addPollingConfigOptions.js'

/**
 * @description Companion instance class for Zoom
 */
export const UpgradeScripts = [
	UpgradeV2ToV3,
	addNewConfigFieldsForSocialStreamAndPerformanceTweaks,
	fixWrongPinCommands,
	addNewConfigFieldsForSocialStreamChatMessagesToSend,
	addPollingConfigOptions,
]

export type ModuleSchema = {
	config: ZoomConfig
	secrets: undefined
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export default class ZoomInstance extends InstanceBase<ModuleSchema> {
	public config: ZoomConfig = {
		label: '',
		host: '',
		tx_port: 0,
		rx_port: 0,
		version: 0,
		selectionMethod: 0,
		numberOfGroups: 0,
		pulling: 0,
		pollEngineState: true,
		pollAudioLevels: true,
		pollOutputRouting: true,
		pollAudioRouting: true,
		feedbackImagesWithIcons: 1,
		enableSocialStream: false,
		enableVariablesForEachUser: true,
		enableVariablesForParticipants: true,
		enableActionPresetAndFeedbackSync: true,
		socialStreamId: '',
		socialStreamQuestionPrefix: '',
		socialStreamChatTypeToSend: [],
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
		activeSpeakerZoomId: -1,
		isSpeaking: 'None',
		zoomOSCVersion: 'Not Connected',
		callStatus: 0,
		galleryCount: 0,
		galleryOrder: [],
		numberOfGroups: 5,
		engineState: -1,
		capturePermissionGranted: false,
		isPro: false,
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

	public ZoomMeData: ZoomMeDataInterface = { zoomId: 0, userName: '' }

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
		if (config.numberOfGroups !== this.ZoomClientDataObj.numberOfGroups) {
			this.ZoomClientDataObj.numberOfGroups = config.numberOfGroups
			this.ZoomGroupData = []
		}

		for (let index = 0; index < this.ZoomClientDataObj.numberOfGroups + 2; index++) {
			this.ZoomGroupData[index] = {
				groupName: index === 0 ? 'Hosts' : index === 1 ? 'Spotlights' : `Group ${index}`,
				users: [],
			}
		}
		if (this.OSC) await this.OSC.destroy()
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
	async destroy(): Promise<void> {
		this.ZoomUserData = {}
		this.ZoomVariableLink = []
		this.ZoomGroupData = []
		this.ZoomUserOffline = []
		this.ZoomMeData = { zoomId: 0, userName: '' }
		this.ZoomAudioLevelData = []
		this.ZoomAudioRoutingData = []
		this.log('debug', `Instance destroyed: ${this.id}`)
		await this.OSC?.destroy()
	}

	/**
	 * @description sets actions, variables, presets and feedbacks available for this instance
	 */
	public updateInstance(): void {
		// this.log('debug', `updateInstance ${new Date()}`)
		initVariableDefinitions(this)
		updateVariableValues(this)

		this.setActionDefinitions(GetActions(this))
		this.setFeedbackDefinitions(GetFeedbacks(this))
		const { structure, presets } = GetPresetList(this)
		this.setPresetDefinitions(structure, presets)
	}

	public updateDefinitionsForActionsFeedbacksAndPresets(): void {
		this.setActionDefinitions(GetActions(this))
		this.setFeedbackDefinitions(GetFeedbacks(this))
		const { structure, presets } = GetPresetList(this)
		this.setPresetDefinitions(structure, presets)
	}
}

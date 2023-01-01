import _ from 'lodash'
import { ZoomConfig } from './config'
import { InstanceBaseExt } from './utils'

interface InstanceVariableDefinition {
	variableId: string
	name: string
	type?: string
}

interface InstanceVariableValue {
	[key: string]: string | number | undefined
}
enum engineState {
	disabled = 'disabled',
	standby = 'standby',
	enabled = 'enabled',
}
export class Variables {
	private readonly instance: InstanceBaseExt<ZoomConfig>

	constructor(instance: InstanceBaseExt<ZoomConfig>) {
		this.instance = instance
	}

	/**
	 * @param name Instance variable name
	 * @returns Value of instance variable or undefined
	 * @description Retrieves instance variable from any Zoom instances
	 */
	public readonly get = (variable: string): string | undefined => {
		return this.instance.getVariableValue(variable)?.toString()
	}

	/**
	 * @param variables Object of variable names and their values
	 * @description Updates or removes variable for current instance
	 */
	public readonly set = (variables: InstanceVariableValue): void => {
		this.instance.setVariables(variables)
	}

	/**
	 * @description Sets variable definitions
	 */
	public readonly updateDefinitions = (): void => {
		const globalSettings: Set<InstanceVariableDefinition> = new Set([
			// Status
			{ name: 'Zoom version', variableId: 'zoomVersion' },
			{ name: 'Call Status', variableId: 'callStatus' },
			{ name: 'Engine Status', variableId: 'engineState' },
			{ name: 'Selected callers/groups', variableId: 'selectedCallers' },
			{ name: 'Selected number of callers/groups', variableId: 'selectedNumberOfCallers' },
			{ name: 'Number of selectable groups', variableId: 'numberOfGroups' },
			{ name: 'Number of users in call', variableId: 'numberOfUsers' },
			{ name: 'Is speaking', variableId: 'isSpeaking' },
			{ name: 'Active speaking', variableId: 'activeSpeaker' },
		])
		// Groups
		let groupPositionVariables = []
		let userVariables = []
		let outputVariables = []
		let audioLevelVariables = []
		for (let index = 0; index < this.instance.ZoomGroupData.length; index++) {
			for (let position = 1; position < 50; position++) {
				groupPositionVariables.push({
					name: `Group${index + 1} Position ${position}`,
					variableId: `Group${index + 1}Position${position}`,
				})
			}
			userVariables.push({
				name: `Inside group`,
				variableId: `InsideGroup${index + 1}`,
			})
			userVariables.push({ name: `name`, variableId: `Group${index + 1}` })
			userVariables.push({
				name: `Callers In Group ${index + 1}`,
				variableId: `CallersInGroup${index + 1}`,
			})
		}
		for (const key in this.instance.ZoomUserData) {
			if (Object.prototype.hasOwnProperty.call(this.instance.ZoomUserData, key)) {
				const user = this.instance.ZoomUserData[key]
				if (user.zoomId > this.instance.ZoomClientDataObj.numberOfGroups)
					userVariables.push({ name: `name`, variableId: user.zoomId.toString() })
			}
		}
		for (const key in this.instance.ZoomOutputData) {
			if (Object.prototype.hasOwnProperty.call(this.instance.ZoomOutputData, key)) {
				const output = this.instance.ZoomOutputData[key]
				outputVariables.push({
					name: `Output ${output.outputNumber} name`,
					variableId: `Output${output.outputNumber}name`,
				})
				outputVariables.push({
					name: `Output ${output.outputNumber} resolution`,
					variableId: `Output${output.outputNumber}resolution`,
				})
				outputVariables.push({
					name: `Output ${output.outputNumber} mode`,
					variableId: `Output${output.outputNumber}mode`,
				})
				outputVariables.push({
					name: `Output ${output.outputNumber} status`,
					variableId: `Output${output.outputNumber}status`,
				})
			}
		}

		for (const key in this.instance.ZoomAudioRoutingData) {
			if (Object.prototype.hasOwnProperty.call(this.instance.ZoomAudioRoutingData, key)) {
				const audioOutput = this.instance.ZoomAudioRoutingData[key]
				outputVariables.push({
					name: `Output ${audioOutput.channel} name`,
					variableId: `Output${audioOutput.channel}name`,
				})
				outputVariables.push({
					name: `Output ${audioOutput.channel} mode`,
					variableId: `Output${audioOutput.channel}mode`,
				})
			}
		}

		for (const key in this.instance.ZoomAudioLevelData) {
			if (Object.prototype.hasOwnProperty.call(this.instance.ZoomAudioLevelData, key)) {
				// const channel = this.instance.ZoomAudioLevelData[key]
				audioLevelVariables.push({
					name: `Channel ${key} audiolevel`,
					variableId: `Channel${key}`,
				})
			}
		}
		let galleryVariables = []
		for (let index = 1; index < 50; index++) {
			galleryVariables.push({
				name: `Gallery position ${index}`,
				variableId: `Gallery position ${index}`,
			})
		}
		let selectUsersVariables = []
		for (let index = 1; index < 1000; index++) {
			selectUsersVariables.push({
				name: `Participant ${index}`,
				variableId: `Participant${index}`,
			})
		}
		const galleryVariablesDef: Set<InstanceVariableDefinition> = new Set(galleryVariables)
		const userVariablesDef: Set<InstanceVariableDefinition> = new Set(userVariables)
		const outputVariablesDef: Set<InstanceVariableDefinition> = new Set(outputVariables)
		const audioLevelVariablesDef: Set<InstanceVariableDefinition> = new Set(audioLevelVariables)
		const groupPositionVariablesDef: Set<InstanceVariableDefinition> = new Set(groupPositionVariables)
		const gallery: Set<InstanceVariableDefinition> = new Set([{ name: 'gallery count', variableId: 'galleryCount' }])

		let filteredVariables = [
			...outputVariablesDef,
			...audioLevelVariablesDef,
			...globalSettings,
			...userVariablesDef,
			...gallery,
			...galleryVariablesDef,
			...selectUsersVariables,
			...groupPositionVariablesDef,
		]

		this.instance.setVariableDefinitions(filteredVariables)
	}

	/**
	 * @description Update variables
	 */
	public readonly updateVariables = (): void => {
		const newVariables: InstanceVariableValue = {}
		for (const key in this.instance.ZoomOutputData) {
			if (Object.prototype.hasOwnProperty.call(this.instance.ZoomOutputData, key)) {
				const output = this.instance.ZoomOutputData[key]
				newVariables[`Output${output.outputNumber}name`] = output.outputName
				newVariables[`Output${output.outputNumber}resolution`] = output.resolution
				newVariables[`Output${output.outputNumber}mode`] = output.mode
				newVariables[`Output${output.outputNumber}status`] = output.status
			}
		}
		for (const key in this.instance.ZoomAudioRoutingData) {
			if (Object.prototype.hasOwnProperty.call(this.instance.ZoomAudioRoutingData, key)) {
				const output = this.instance.ZoomAudioRoutingData[key]
				newVariables[`Output${output.channel}name`] = output.audio_device
				newVariables[`Output${output.channel}mode`] = output.mode
			}
		}
		for (const key in this.instance.ZoomAudioLevelData) {
			if (Object.prototype.hasOwnProperty.call(this.instance.ZoomAudioLevelData, key)) {
				const channel = this.instance.ZoomAudioLevelData[key]
				newVariables[`Channel${key}`] = channel.level
			}
		}
		if (this.instance.ZoomClientDataObj.selectedCallers.length === 0) {
			newVariables['selectedCallers'] = 'nothing selected'
			newVariables['selectedNumberOfCallers'] = '0'
		} else {
			let selectedCallers: string[] = []
			this.instance.ZoomClientDataObj.selectedCallers.forEach((zoomID: number) => {
				if (zoomID < this.instance.ZoomClientDataObj.numberOfGroups + 1) {
					if (this.instance.ZoomUserData[zoomID]) {
						this.instance.ZoomUserData[zoomID].users.forEach((user: string | number) => {
							selectedCallers.push(this.instance.ZoomUserData[user].userName)
						})
					}
				} else {
					if (this.instance.ZoomUserData[zoomID]) {
						selectedCallers.push(this.instance.ZoomUserData[zoomID].userName)
					}
				}
			})
			newVariables['selectedCallers'] = selectedCallers.toString()
			newVariables['selectedNumberOfCallers'] = selectedCallers.length
		}
		newVariables['zoomVersion'] = this.instance.ZoomClientDataObj.zoomOSCVersion
		newVariables['callStatus'] = this.instance.ZoomClientDataObj.callStatus == 1 ? 'In meeting' : 'offline'
		newVariables['numberOfGroups'] = this.instance.ZoomClientDataObj.numberOfGroups
		newVariables['numberOfUsers'] = Object.keys(this.instance.ZoomUserData).length
		newVariables['isSpeaking'] = this.instance.ZoomClientDataObj.isSpeaking
		newVariables['activeSpeaker'] = this.instance.ZoomClientDataObj.activeSpeaker
		if (this.instance.ZoomClientDataObj.engineState === -1) {
			newVariables['engineState'] = 'no engine found'
		} else if (this.instance.ZoomClientDataObj.engineState === 0) {
			newVariables['engineState'] = engineState.disabled
		} else if (this.instance.ZoomClientDataObj.engineState === 1) {
			newVariables['engineState'] = engineState.standby
		} else if (this.instance.ZoomClientDataObj.engineState === 2) {
			newVariables['engineState'] = engineState.enabled
		}

		let allUsers = ''
		this.instance.ZoomGroupData.forEach((group: { users: any[]; groupName: string | number | undefined }, index: number) => {
			newVariables[`CallersInGroup${index + 1}`] = group.users?.length
			newVariables[`Group${index + 1}`] = group.groupName
			group.users?.forEach((user: { zoomID: string | number }) => {
				allUsers += this.instance.ZoomUserData[user.zoomID].userName + ' '
			})
			for (let position = 1; position < 50; position++) {
				newVariables[`Group${index + 1}Position${position}`] = group.users[position - 1]
					? group.users[position - 1].userName
					: '-'
			}
			newVariables[`InsideGroup${index + 1}`] = allUsers
			allUsers = '' // reset values
		})
		// "normal" users
		for (const key in this.instance.ZoomUserData) {
			if (Object.prototype.hasOwnProperty.call(this.instance.ZoomUserData, key)) {
				const user = this.instance.ZoomUserData[key]
				newVariables[user.zoomId.toString()] = user.userName
			}
		}
		// Use the participant selection
		for (let index = 1; index < 1000; index++) {
			newVariables[`Participant${index}`] = this.instance.ZoomVariableLink[index - 1]
				? this.instance.ZoomVariableLink[index - 1].userName
				: '-'
		}
		newVariables['galleryCount'] = this.instance.ZoomClientDataObj.galleryCount

		for (let index = 1; index < 50; index++) {
			const zoomID = this.instance.ZoomClientDataObj.galleryOrder[index - 1]
			newVariables[`Gallery position ${index}`] = this.instance.ZoomUserData[zoomID]
				? this.instance.ZoomUserData[zoomID].userName
				: '-'
		}

		this.set(newVariables)

		this.updateDefinitions()
	}
}

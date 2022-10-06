import ZoomInstance from './'
import _ from 'lodash'

interface InstanceVariableDefinition {
	label: string
	name: string
	type?: string
}

interface InstanceVariableValue {
	[key: string]: string | number | undefined
}

export class Variables {
	private readonly instance: ZoomInstance

	constructor(instance: ZoomInstance) {
		this.instance = instance
	}

	/**
	 * @param name Instance variable name
	 * @returns Value of instance variable or undefined
	 * @description Retrieves instance variable from any Zoom instances
	 */
	public readonly get = (variable: string): string | undefined => {
		let data

		this.instance.parseVariables(variable, (value) => {
			data = value
		})

		return data
	}

	/**
	 * @param variables Object of variable names and their values
	 * @description Updates or removes variable for current instance
	 */
	public readonly set = (variables: InstanceVariableValue): void => {
		const newVariables: { [variableId: string]: string | undefined } = {}

		for (const name in variables) {
			newVariables[name] = variables[name]?.toString()
		}

		this.instance.setVariables(newVariables)
	}

	/**
	 * @description Sets variable definitions
	 */
	public readonly updateDefinitions = (): void => {
		const globalSettings: Set<InstanceVariableDefinition> = new Set([
			// Status
			{ label: 'Zoom version', name: 'zoomVersion' },
			{ label: 'call status', name: 'callStatus' },
			{ label: 'Selected callers/groups', name: 'selectedCallers' },
			{ label: 'Selected number of callers/groups', name: 'selectedNumberOfCallers' },
			{ label: 'Number of selectable groups', name: 'numberOfGroups' },
			{ label: 'Number of users in call', name: 'numberOfUsers' },
			{ label: 'Is speaking', name: 'isSpeaking' },
			{ label: 'Active speaking', name: 'activeSpeaker' },
		])
		// Groups
		let groupPositionVariables = []
		let userVariables = []
		for (let index = 0; index < this.instance.ZoomGroupData.length; index++) {
			for (let position = 1; position < 50; position++) {
				groupPositionVariables.push({
					label: `Group${index + 1} Position ${position}`,
					name: `Group${index + 1}Position${position}`,
				})
			}
			userVariables.push({
				label: `Inside group`,
				name: `InsideGroup${index + 1}`,
			})
			userVariables.push({ label: `name`, name: `Group${index + 1}` })
			userVariables.push({
				label: `Callers In Group ${index + 1}`,
				name: `CallersInGroup${index + 1}`,
			})
		}
		for (const key in this.instance.ZoomUserData) {
			if (Object.prototype.hasOwnProperty.call(this.instance.ZoomUserData, key)) {
				const user = this.instance.ZoomUserData[key]
				if (user.zoomId > this.instance.ZoomClientDataObj.numberOfGroups)
					userVariables.push({ label: `name`, name: user.zoomId.toString() })
			}
		}
		let galleryVariables = []
		for (let index = 1; index < 50; index++) {
			galleryVariables.push({
				label: `Gallery position ${index}`,
				name: `Gallery position ${index}`,
			})
		}
		let selectUsersVariables = []
		for (let index = 1; index < 1000; index++) {
			selectUsersVariables.push({
				label: `Participant ${index}`,
				name: `Participant${index}`,
			})
		}
		const galleryVariablesDef: Set<InstanceVariableDefinition> = new Set(galleryVariables)
		const userVariablesDef: Set<InstanceVariableDefinition> = new Set(userVariables)
		const groupPositionVariablesDef: Set<InstanceVariableDefinition> = new Set(groupPositionVariables)
		const gallery: Set<InstanceVariableDefinition> = new Set([{ label: 'gallery count', name: 'galleryCount' }])

		let filteredVariables = [
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
		if (this.instance.ZoomClientDataObj.selectedCallers.length === 0) {
			newVariables['selectedCallers'] = 'nothing selected'
			newVariables['selectedNumberOfCallers'] = '0'
		} else {
			let selectedCallers: string[] = []
			this.instance.ZoomClientDataObj.selectedCallers.forEach((zoomID) => {
				if (zoomID < this.instance.ZoomClientDataObj.numberOfGroups + 1) {
					if (this.instance.ZoomUserData[zoomID]) {
						this.instance.ZoomUserData[zoomID].users.forEach((user) => {
							selectedCallers.push(this.instance.ZoomUserData[user].userName)
						})
					}
				} else {
					selectedCallers.push(this.instance.ZoomUserData[zoomID].userName)
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

		let allUsers = ''
		this.instance.ZoomGroupData.forEach((group, index) => {
			newVariables[`CallersInGroup${index + 1}`] = group.users?.length
			newVariables[`Group${index + 1}`] = group.groupName
			group.users?.forEach((user) => {
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

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
			{ label: 'zoomOSC version', name: 'zoomOSCversion' },
			{ label: 'call status', name: 'callStatus' },
			{ label: 'Selected callers/groups', name: 'selectedCallers' },
			{ label: 'Selected number of callers/groups', name: 'selectedNumberOfCallers' },
			{ label: 'Number of selectable groups', name: 'numberOfGroups' },
			{ label: 'Number of users in call', name: 'numberOfUsers' },
			{ label: 'Last Speaking', name: 'lastSpeaking' },
		])
		let userVariables = []
		// Which users in a group
		for (let index = 1; index - 1 < this.instance.ZoomClientDataObj.numberOfGroups; index++) {
			userVariables.push({
				label: `Inside group`,
				name: `Inside${this.instance.ZoomUserData[index].zoomId.toString()}`,
			})
			userVariables.push({ label: `name`, name: this.instance.ZoomUserData[index].zoomId.toString() })
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
		for (let index = 0; index < 50; index++) {
			selectUsersVariables.push({
				label: `UserInSelectionPosition ${index}`,
				name: `UserInSelectionPosition${index}`,
			})
		}
		const galleryVariablesDef: Set<InstanceVariableDefinition> = new Set(galleryVariables)
		const userVariablesDef: Set<InstanceVariableDefinition> = new Set(userVariables)
		const gallery: Set<InstanceVariableDefinition> = new Set([{ label: 'gallery count', name: 'galleryCount' }])

		let filteredVariables = [
			...globalSettings,
			...userVariablesDef,
			...gallery,
			...galleryVariablesDef,
			...selectUsersVariables,
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
			newVariables['selectedNumberOfCallers'] = 'nothing selected'
		} else {
			let selectedCallers: string[] = []
			this.instance.ZoomClientDataObj.selectedCallers.forEach((zoomID) => {
				if (zoomID < this.instance.ZoomClientDataObj.numberOfGroups + 1) {
					this.instance.ZoomUserData[zoomID].users.forEach((user) => {
						selectedCallers.push(this.instance.ZoomUserData[user].userName)
					})
				} else {
					selectedCallers.push(this.instance.ZoomUserData[zoomID].userName)
				}
			})
			newVariables['selectedCallers'] = selectedCallers.toString()
			newVariables['selectedNumberOfCallers'] = selectedCallers.length
		}
		newVariables['zoomOSCversion'] = this.instance.ZoomClientDataObj.zoomOSCVersion
		newVariables['callStatus'] = this.instance.ZoomClientDataObj.callStatus == 1 ? 'In meeting' : 'offline'
		newVariables['numberOfGroups'] = this.instance.ZoomClientDataObj.numberOfGroups
		newVariables['numberOfUsers'] = this.instance.ZoomClientDataObj.numberOfUsersInCall
		newVariables['lastSpeaking'] = this.instance.ZoomClientDataObj.lastSpeaking

		let allUsers = ''
		for (let index = 1; index - 1 < this.instance.ZoomClientDataObj.numberOfGroups; index++) {
			this.instance.ZoomUserData[index].users?.forEach((zoomID: number) => {
				allUsers += this.instance.ZoomUserData[zoomID].userName
			})
			newVariables[`Inside${this.instance.ZoomUserData[index].zoomId.toString()}`] = allUsers
			allUsers = '' // reset values
		}
		// "normal" users
		for (const key in this.instance.ZoomUserData) {
			if (Object.prototype.hasOwnProperty.call(this.instance.ZoomUserData, key)) {
				const user = this.instance.ZoomUserData[key]
				newVariables[user.zoomId.toString()] = user.userName
			}
		}
		// Use the dynamic selection
		for (let index = 0; index < 50; index++) {
			newVariables[`UserInSelectionPosition${index}`] = this.instance.ZoomVariableLink[index]
				? this.instance.ZoomVariableLink[index].userName
				: '(none)'
		}
		newVariables['galleryCount'] = this.instance.ZoomClientDataObj.galleryCount

		for (let index = 1; index < 50; index++) {
			const zoomID = this.instance.ZoomClientDataObj.galleryOrder[index-1]
			newVariables[`Gallery position ${index}`] = this.instance.ZoomUserData[zoomID]
				? this.instance.ZoomUserData[zoomID].userName
				: ''
		}

		this.set(newVariables)

		this.updateDefinitions()
	}
}

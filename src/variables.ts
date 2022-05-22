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
	 * @param variables Object of variablenames and their values
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
			{ label: 'Selected caller(s)', name: 'selectedCallers' },
			{ label: 'Number of selectable groups', name: 'numberOfGroups' },
		])
		let userVariables = []
		// Which users in a group
		for (let index = 0; index < this.instance.ZoomClientDataObj.numberOfGroups; index++) {
			userVariables.push({ label: `Inside group`, name: `Inside${this.instance.ZoomUserData[index].zoomId.toString()}` })
		}
		for (let index = 0; index < this.instance.ZoomUserData.length; index++) {
			userVariables.push({ label: `name`, name: this.instance.ZoomUserData[index].zoomId.toString() })
		}
		const userVariablesDef: Set<InstanceVariableDefinition> = new Set(userVariables)
		const gallery: Set<InstanceVariableDefinition> = new Set([
			// Status
			{ label: 'gallery shape X', name: 'galleryShapeX' },
			{ label: 'gallery shape Y', name: 'galleryShapeY' },
			{ label: 'gallery count', name: 'galleryCount' },
		])

		
		let filteredVariables = [
			...globalSettings,
			...userVariablesDef,
			...gallery
		]

		this.instance.setVariableDefinitions(filteredVariables)
	}

	/**
	 * @description Update variables
	 */
	public readonly updateVariables = (): void => {
		const newVariables: InstanceVariableValue = {}
		// newVariables['selectedCallers'] = this.instance.ZoomClientDataObj.selectedCallers.toString()
		newVariables['selectedCallers'] = this.instance.ZoomUserData[this.instance.ZoomClientDataObj.selectedCallers[0]] ? this.instance.ZoomUserData[this.instance.ZoomClientDataObj.selectedCallers[0]].userName : 'no selection'
		newVariables['zoomOSCversion'] = this.instance.ZoomClientDataObj.zoomOSCVersion
		newVariables['callStatus'] = this.instance.ZoomClientDataObj.callStatus == 1 ? 'In meeting' : 'offline'
		newVariables['numberOfGroups'] = this.instance.ZoomClientDataObj.numberOfGroups
		for (let index = 0; index < this.instance.ZoomClientDataObj.numberOfGroups; index++) {
			newVariables[`Inside${this.instance.ZoomUserData[index].zoomId.toString()}`] = this.instance.ZoomUserData[index].users?.toString()
		}
		for (let index = 0; index < this.instance.ZoomUserData.length; index++) {
			newVariables[this.instance.ZoomUserData[index].zoomId.toString()] = this.instance.ZoomUserData[index].userName
		}
		newVariables['galleryShapeX'] = this.instance.ZoomClientDataObj.galleryShape[0]
		newVariables['galleryShapeY'] = this.instance.ZoomClientDataObj.galleryShape[1]
		newVariables['galleryCount'] = this.instance.ZoomClientDataObj.galleryCount
	
		this.set(newVariables)

		this.updateDefinitions()
	}
}

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
			{ label: 'callStatus', name: 'callStatus' }
		])

		
		let filteredVariables = [
			...globalSettings,
		]

		this.instance.setVariableDefinitions(filteredVariables)
	}

	/**
	 * @description Update variables
	 */
	public readonly updateVariables = (): void => {
		const newVariables: InstanceVariableValue = {}

		newVariables['zoomOSCversion'] = this.instance.ZoomClientDataObj.zoomOSCVersion
		newVariables['callStatus'] = this.instance.ZoomClientDataObj.callStatus
	
		this.set(newVariables)

		this.updateDefinitions()
	}
}

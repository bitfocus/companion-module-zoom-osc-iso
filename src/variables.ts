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
			// { label: 'Selected caller(s)', name: 'selectedCallers' },
		])
		const gallery: Set<InstanceVariableDefinition> = new Set([
			// Status
			{ label: 'gallery shape X', name: 'galleryShapeX' },
			{ label: 'gallery shape Y', name: 'galleryShapeY' },
		])

		
		let filteredVariables = [
			...globalSettings,
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
		newVariables['zoomOSCversion'] = this.instance.ZoomClientDataObj.zoomOSCVersion
		newVariables['callStatus'] = this.instance.ZoomClientDataObj.callStatus == 1 ? 'In meeting' : 'offline'
		newVariables['galleryShapeX'] = this.instance.ZoomClientDataObj.galleryShape[0]
		newVariables['galleryShapeY'] = this.instance.ZoomClientDataObj.galleryShape[1]
	
		this.set(newVariables)

		this.updateDefinitions()
	}
}

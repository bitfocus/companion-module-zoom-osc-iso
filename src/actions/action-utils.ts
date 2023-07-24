import { CompanionActionEvent, InputValue, SomeCompanionActionInputField } from '@companion-module/base'
import { ZoomConfig } from '../config'
import { InstanceBaseExt, arrayAdd, arrayAddRemove, arrayRemove } from '../utils'

export const select = { single: true, multi: false }

const getChoicePositions = (): {
	id: string
	label: string
}[] => {
	const result = []
	for (let index = 1; index < 50; index++) {
		result.push({ id: index.toString(), label: `Position ${index}` })
	}

	return result
}

export const CHOICES_POSITION = getChoicePositions()

export const positionOrderOption: SomeCompanionActionInputField = {
	type: 'dropdown',
	label: 'Position',
	id: 'position',
	default: '0',
	choices: CHOICES_POSITION,
}

export enum selectionMethod {
	SingleSelection = 1,
	MultiSelection = 0,
	ToggleSelection = 2,
}

export const PreviousSelectedCallersSave = (instance: InstanceBaseExt<ZoomConfig>): void => {
	instance.ZoomClientDataObj.PreviousSelectedCallers = [...instance.ZoomClientDataObj.selectedCallers]
}

export const PreviousSelectedCallersRestore = (instance: InstanceBaseExt<ZoomConfig>): void => {
	instance.ZoomClientDataObj.selectedCallers = [...instance.ZoomClientDataObj.PreviousSelectedCallers]
}

export const toggleSelectedUser = (instance: InstanceBaseExt<ZoomConfig>, zoomId: number): void => {
	instance.ZoomClientDataObj.PreviousSelectedCallers = instance.ZoomClientDataObj.selectedCallers

	// multiple selection made before.  clear selections and add single selection
	if (
		instance.config.selectionMethod === selectionMethod.SingleSelection &&
		instance.ZoomClientDataObj.selectedCallers.length > 1
	) {
		instance.ZoomClientDataObj.selectedCallers.length = 0
		instance.ZoomClientDataObj.selectedCallers = arrayAdd(instance.ZoomClientDataObj.selectedCallers, zoomId)
	}
	// single selection already made
	else if (
		instance.config.selectionMethod === selectionMethod.SingleSelection &&
		instance.ZoomClientDataObj.selectedCallers.length === 1
	) {
		const index = instance.ZoomClientDataObj.selectedCallers.find((t) => t === zoomId)

		// if user is already selected, remove them from selection
		// else add clear selected callers and add new selection
		if (index !== undefined && index > -1) {
			instance.ZoomClientDataObj.selectedCallers = arrayRemove(instance.ZoomClientDataObj.selectedCallers, zoomId)
		} else {
			instance.ZoomClientDataObj.selectedCallers.length = 0
			instance.ZoomClientDataObj.selectedCallers = arrayAdd(instance.ZoomClientDataObj.selectedCallers, zoomId)
		}
	}
	// multiple selection
	else {
		instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(instance.ZoomClientDataObj.selectedCallers, zoomId)
	}
}

/**
 * createUserCommand function to create oscPath and arguments for user
 * @param actionID string
 * @param name string
 * @returns object { argsCallers: { type: string; value: string | number }[]; oscPath: string }
 */
export const createCommand = (
	instance: InstanceBaseExt<ZoomConfig>,
	OSCAction: string,
	name?: InputValue | string | undefined,
	singleUser?: boolean | null,
	allExcept?: boolean | null
): {
	args: {
		type: string
		value: any
	}[]
	oscPath: string
	oscPathName: string
	isValidCommand: boolean
} => {
	const command: {
		args: { type: string; value: any }[]
		oscPath: string
		oscPathName: string
		isValidCommand: boolean
	} = {
		args: [],
		oscPath: '',
		oscPathName: '',
		isValidCommand: true,
	}

	// If/When no user is involved set path and skip the rest
	if (singleUser === null || singleUser === undefined) {
		command.oscPath = `/zoom${OSCAction}`
	} else {
		const selectedCallers: number[] | string = instance.ZoomClientDataObj.selectedCallers
		PreviousSelectedCallersSave(instance)
		// Check if override has been filled
		if (name != '' && name != undefined) {
			instance.log('debug', 'Override:' + name)
			if (name === 'Me' || name === 'me' || name === 'all' || name === 'All') {
				command.oscPath = `/zoom/${name.toLowerCase()}` + OSCAction
			} else {
				command.oscPath = `/zoom/userName` + OSCAction
				command.args.push({ type: 's', value: name })
			}
			// Use the pre-selection options
		} else {
			if (Array.isArray(selectedCallers)) {
				// should be otherwise somethings wrong
				if (selectedCallers.length === 0) {
					// return something to prevent users from sending a command
					instance.log('error', 'Select a caller first')
					command.isValidCommand = false
				}
				// When command is for one user only send first caller
				else if (singleUser) {
					command.args.push({ type: 'i', value: selectedCallers[0] })
					if (selectedCallers.length > 1) {
						instance.log('warn', 'You have selected multiple participants but only the first one is allowed')
					}
				} else {
					selectedCallers.forEach((caller) => {
						command.args.push({ type: 'i', value: caller })
					})
				}
			} else {
				instance.log('debug', 'Wrong selection, no array')
			}
			// Different path when more than one users are selected
			if (allExcept) {
				command.oscPath =
					(command.args.length > 1 ? `/zoom/allExcept/users/zoomID` : `/zoom/allExcept/zoomID`) + OSCAction
			} else {
				command.oscPath = (command.args.length > 1 ? `/zoom/users/zoomID` : `/zoom/zoomID`) + OSCAction
			}
		}
		if (command.isValidCommand) {
			PreviousSelectedCallersSave(instance)
		}
	}
	return command
}

/**
 * Construct the command like I want and send it to the OSC
 * @param action
 * @param _info
 */
export const sendActionCommand = (
	instance: InstanceBaseExt<ZoomConfig>,
	action: { options: { command: any; args: any } },
	_info?: CompanionActionEvent | null
): void => {
	// Construct command
	const oscPath = action.options.command
	const args = action.options.args
	instance.log('debug', `Sending ${JSON.stringify(oscPath)}, with arguments ${JSON.stringify(args)}`)
	if (instance.OSC) instance.OSC.sendCommand(oscPath, args)
}

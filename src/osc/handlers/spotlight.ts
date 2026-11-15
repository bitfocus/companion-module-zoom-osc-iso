import { userExist } from '../../utils.js'
import {
	updateSpotlightGroupInitalizedVariable,
	updateSpotlightGroupVariables,
} from '../../variables/variable-values.js'
import { checkSpotlightFeedbacks } from '../feedbacks.js'
import type { OSCHandlerContext, ZoomOSCResponse } from '../types.js'
import { setVariables } from '../variables.js'

export function handleSpotOrder(context: OSCHandlerContext, data: ZoomOSCResponse): void {
	context.instance.log('debug', `Handling spot order: ${JSON.stringify(data)}`)
	// The Spotlights group holds everyone currently spotlighted (Zoom allows only a few), so only those people can have
	// dropped out of spotlight: clear just them rather than every participant in a large meeting
	const previouslySpotlighted = context.instance.ZoomGroupData[1].users.map((user) => user.zoomID)
	context.instance.ZoomGroupData[1].users.length = 0
	let updatedData = false

	data.args.forEach((order: { type: string; value: number }) => {
		if (userExist(order.value, context.instance.ZoomUserData)) {
			context.instance.ZoomUserData[order.value].spotlighted = true

			const findIndex = context.instance.ZoomVariableLink.findIndex(
				(id: { zoomId: number }) => id.zoomId === order.value,
			)
			context.instance.ZoomGroupData[1].users.push({
				userName: context.instance.ZoomVariableLink[findIndex].userName,
				zoomID: order.value,
			})

			updatedData = true
		}
	})

	const nowSpotlighted = new Set(data.args.map((order: { type: string; value: number }) => order.value))
	for (const zoomId of previouslySpotlighted) {
		if (!nowSpotlighted.has(zoomId) && userExist(zoomId, context.instance.ZoomUserData)) {
			context.instance.ZoomUserData[zoomId].spotlighted = false
			updatedData = true
		}
	}

	if (updatedData || !context.isSpotlightGroupTrackingInitialized()) {
		context.setSpotlightGroupTrackingInitialized(true)
		setVariables(context.instance, (variables) => {
			updateSpotlightGroupInitalizedVariable(variables)
			updateSpotlightGroupVariables(context.instance, variables)
		})
		checkSpotlightFeedbacks(context.instance)
		context.instance.updateDefinitionsForActionsFeedbacksAndPresets()
	}
}

import { userExist } from '../../utils.js'
import {
	updateGalleryCountVariables,
	updateGalleryVariables,
	updateSpotlightGroupInitalizedVariable,
	updateSpotlightGroupVariables,
} from '../../variables/variable-values.js'
import { checkGalleryFeedbacks, checkSpotlightFeedbacks } from '../feedbacks.js'
import { OSCHandlerContext, ZoomOSCResponse } from '../types.js'
import { setVariables } from '../variables.js'

export function handleGalleryMessage(context: OSCHandlerContext, data: ZoomOSCResponse, zoomPart2: string): void {
	switch (zoomPart2) {
		case 'galleryShape':
			return
		case 'galleryOrder':
			handleGalleryOrder(context, data)
			return
		case 'galleryCount':
			handleGalleryCount(context, data)
			return
		case 'spotOrder':
			handleSpotOrder(context, data)
			return
		default:
			return
	}
}

function handleGalleryOrder(context: OSCHandlerContext, data: ZoomOSCResponse): void {
	if (data.args.length === 0) {
		return
	}

	context.instance.ZoomClientDataObj.galleryOrder = data.args.map(
		(order: { type: string; value: number }) => order.value,
	)
	setVariables(context.instance, (variables) => updateGalleryVariables(context.instance, variables))
	checkGalleryFeedbacks(context.instance)
}

function handleGalleryCount(context: OSCHandlerContext, data: ZoomOSCResponse): void {
	context.instance.ZoomClientDataObj.galleryCount = data.args[0].value
	setVariables(context.instance, (variables) => updateGalleryCountVariables(context.instance, variables))
}

function handleSpotOrder(context: OSCHandlerContext, data: ZoomOSCResponse): void {
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

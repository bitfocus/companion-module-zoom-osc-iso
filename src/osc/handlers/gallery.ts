import { updateGalleryCountVariables, updateGalleryVariables } from '../../variables/variable-values.js'
import { checkGalleryFeedbacks } from '../feedbacks.js'
import type { OSCHandlerContext, ZoomOSCResponse } from '../types.js'
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
		default:
			return
	}
}

function handleGalleryOrder(context: OSCHandlerContext, data: ZoomOSCResponse): void {
	if (data.args.length === 0) {
		return
	}

	context.instance.log('debug', `Handling gallery order: ${JSON.stringify(data)}`)

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

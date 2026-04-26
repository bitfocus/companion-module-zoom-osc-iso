import { handleGalleryMessage } from './gallery.js'
import { handleIsoMessage } from './iso.js'
import { handleSessionMessage } from './session.js'
import { handleUserMessage } from './user.js'
import { OSCHandlerContext, ZoomOSCResponse } from '../types.js'

export async function dispatchOscMessage(context: OSCHandlerContext, data: ZoomOSCResponse): Promise<void> {
	const recvMsg = data.address.toString().split('/')
	const zoomPart1 = recvMsg[1]
	const zoomPart2 = recvMsg[2]
	const zoomPart3 = recvMsg[3]

	if (zoomPart1 !== 'zoomosc') {
		return
	}

	context.instance.ZoomClientDataObj.last_response = Date.now()

	switch (zoomPart2) {
		case 'me':
		case 'user':
			await handleUserMessage(context, data, zoomPart2, zoomPart3)
			return
		case 'galleryShape':
		case 'galleryOrder':
		case 'galleryCount':
		case 'spotOrder':
			handleGalleryMessage(context, data, zoomPart2)
			return
		case 'pong':
		case 'meetingStatusChanged':
		case 'meetingStatus':
		case 'listCleared':
			handleSessionMessage(context, data, zoomPart2)
			return
		case 'engineState':
		case 'audioLevels':
		case 'audioRouting':
		case 'outputRouting':
			handleIsoMessage(context, data, zoomPart2)
			return
		default:
			return
	}
}

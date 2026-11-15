import type ModuleInstance from '../index.js'
import { updateAllUserBasedVariables } from '../variables/variable-values.js'
import { UserRole, type ZoomOSCResponse } from './types.js'
import { setVariables } from './variables.js'

export async function createZoomUser(instance: ModuleInstance, data: ZoomOSCResponse): Promise<void> {
	const zoomId = parseInt(data.args[3].value)
	const userName = data.args[1].value

	// When a meeting ends, ZoomOSC/ISO lists every former participant with Zoom ID -1, named USER OFFLINE (seen on
	// ZoomOSC 5.0.1, as /zoomosc/me/list, just before listCleared). Those aren't participants: one with the host role
	// would otherwise land in the Hosts group and stay on the Host button.
	if (!Number.isInteger(zoomId) || zoomId < 0) {
		return
	}

	if (instance.ZoomUserOffline[zoomId]) {
		return
	}

	const index = instance.ZoomVariableLink.findIndex((id: { zoomId: number }) => id.zoomId === zoomId)
	if (index === -1) {
		instance.ZoomVariableLink.push({ zoomId, userName })
	}

	if (data.args.length === 4) {
		instance.ZoomUserData[zoomId] = {
			zoomId,
			targetIndex: data.args[0].value,
			userName,
			galleryIndex: data.args[2].value,
			spotlighted: false,
			users: [],
		}
	} else if (data.args.length >= 11) {
		// {int targetIndex}
		// {str userName}
		// {int galleryIndex}
		// {int zoomID}
		// {int targetCount}
		// {int listCount}
		// {int userRole}
		// {int onlineStatus}
		// {int videoStatus}
		// {int audioStatus}
		// {int handRaised}
		instance.ZoomUserData[zoomId] = {
			zoomId,
			targetIndex: data.args[0].value,
			userName,
			galleryIndex: data.args[2].value,
			userRole: data.args[6].value,
			videoOn: data.args[8].value === 1,
			mute: data.args[9].value === 0,
			handRaised: data.args[10].value === 1,
			spotlighted: false,
			users: [],
		}
		if (data.args[6].value === UserRole.Host || data.args[6].value === UserRole.CoHost) {
			const hostIndex = instance.ZoomGroupData[0].users.findIndex((id) => id.zoomID === zoomId)
			if (hostIndex === -1) {
				instance.ZoomGroupData[0].users.push({
					zoomID: zoomId,
					userName,
				})
			}
		}
	} else {
		instance.log('warn', 'create ZoomUser wrong arguments in OSC feedback')
		return
	}

	setVariables(instance, (variables) => updateAllUserBasedVariables(instance, variables))
}

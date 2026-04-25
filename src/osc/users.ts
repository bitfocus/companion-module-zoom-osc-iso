import { CompanionVariableValues } from '@companion-module/base'
import type { ZoomConfig } from '../config.js'
import type { InstanceBaseExt } from '../utils.js'
import { updateAllUserBasedVariables } from '../variables/variable-values.js'
import { UserRole, ZoomOSCResponse } from './types.js'

export async function createZoomUser(instance: InstanceBaseExt<ZoomConfig>, data: ZoomOSCResponse): Promise<void> {
	const zoomId = parseInt(data.args[3].value)

	if (instance.ZoomUserOffline[zoomId]) {
		return
	}

	const index = instance.ZoomVariableLink.findIndex((id: { zoomId: number }) => id.zoomId === zoomId)
	if (index === -1) {
		instance.ZoomVariableLink.push({ zoomId, userName: data.args[1].value })
	}

	if (data.args.length === 4) {
		instance.ZoomUserData[zoomId] = {
			zoomId,
			targetIndex: data.args[0].value,
			userName: data.args[1].value,
			galleryIndex: data.args[2].value,
			users: [],
		}
	} else if (data.args.length >= 10) {
		instance.ZoomUserData[zoomId] = {
			zoomId,
			targetIndex: data.args[0].value,
			userName: data.args[1].value,
			galleryIndex: data.args[2].value,
			userRole: data.args[6].value,
			videoOn: data.args[8].value === 1,
			mute: data.args[9].value === 0,
			handRaised: data.args[10].value === 1,
			users: [],
		}
		if (data.args[6].value === UserRole.Host || data.args[6].value === UserRole.CoHost) {
			const hostIndex = instance.ZoomGroupData[0].users.findIndex((id) => id.zoomID === zoomId)
			if (hostIndex === -1) {
				instance.ZoomGroupData[0].users.push({
					zoomID: zoomId,
					userName: data.args[1].value,
				})
			}
		}
	} else {
		instance.log('warn', 'create ZoomUser wrong arguments in OSC feedback')
	}

	instance.InitVariables()
	const variables: CompanionVariableValues = {}
	updateAllUserBasedVariables(instance, variables)
	instance.setVariableValues(variables)
}

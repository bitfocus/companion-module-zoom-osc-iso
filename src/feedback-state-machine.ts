import { CompanionAdvancedFeedbackResult } from '@companion-module/base'
import { ZoomConfig } from './config'
import { InstanceBaseExt, userExist } from './utils'
const { images } = require('./images') // eslint-disable-line

type State = [boolean, boolean, boolean, boolean, boolean]
interface StateMachine {
	states: State[]
	imagesWithIcons: Record<string, string>
	imagesWithoutIcons: Record<string, string>
}

const stateMachine: StateMachine = {
	states: [
		[false, false, false, false, false],
		[false, false, false, false, true],
		[false, false, false, true, false],
		[false, false, false, true, true],
		[false, false, true, false, false],
		[false, false, true, false, true],
		[false, false, true, true, false],
		[false, false, true, true, true],
		[false, true, false, false, false],
		[false, true, false, false, true],
		[false, true, false, true, false],
		[false, true, false, true, true],
		[false, true, true, false, false],
		[false, true, true, false, true],
		[false, true, true, true, false],
		[false, true, true, true, true],
		[true, false, false, false, false],
		[true, false, false, false, true],
		[true, false, false, true, false],
		[true, false, false, true, true],
		[true, false, true, false, false],
		[true, false, true, false, true],
		[true, false, true, true, false],
		[true, false, true, true, true],
		[true, true, false, false, false],
		[true, true, false, false, true],
		[true, true, false, true, false],
		[true, true, false, true, true],
		[true, true, true, false, false],
		[true, true, true, false, true],
		[true, true, true, true, false],
		[true, true, true, true, true],
	],
	imagesWithIcons: {
		'false,false,false,false,false': images.LG1,
		'false,false,false,false,true': images.LG2,
		'false,false,false,true,false': images.LG3,
		'false,false,false,true,true': images.LG4,
		'false,false,true,false,false': images.LG5,
		'false,false,true,false,true': images.LG6,
		'false,false,true,true,false': images.LG7,
		'false,false,true,true,true': images.LG8,
		'false,true,false,false,false': images.LG9,
		'false,true,false,false,true': images.LG10,
		'false,true,false,true,false': images.LG11,
		'false,true,false,true,true': images.LG12,
		'false,true,true,false,false': images.LG13,
		'false,true,true,false,true': images.LG14,
		'false,true,true,true,false': images.LG15,
		'false,true,true,true,true': images.LG16,
		'true,false,false,false,false': images.LG17,
		'true,false,false,false,true': images.LG18,
		'true,false,false,true,false': images.LG19,
		'true,false,false,true,true': images.LG20,
		'true,false,true,false,false': images.LG21,
		'true,false,true,false,true': images.LG22,
		'true,false,true,true,false': images.LG23,
		'true,false,true,true,true': images.LG24,
		'true,true,false,false,false': images.LG25,
		'true,true,false,false,true': images.LG26,
		'true,true,false,true,false': images.LG27,
		'true,true,false,true,true': images.LG28,
		'true,true,true,false,false': images.LG29,
		'true,true,true,false,true': images.LG30,
		'true,true,true,true,false': images.LG31,
		'true,true,true,true,true': images.LG32,
	},
	imagesWithoutIcons: {
		'false,false,false,false,false': images.NOICONLG1,
		'false,false,false,false,true': images.NOICONLG2,
		'false,false,false,true,false': images.NOICONLG3,
		'false,false,false,true,true': images.NOICONLG4,
		'false,false,true,false,false': images.NOICONLG5,
		'false,false,true,false,true': images.NOICONLG6,
		'false,false,true,true,false': images.NOICONLG7,
		'false,false,true,true,true': images.NOICONLG8,
		'false,true,false,false,false': images.NOICONLG9,
		'false,true,false,false,true': images.NOICONLG10,
		'false,true,false,true,false': images.NOICONLG11,
		'false,true,false,true,true': images.NOICONLG12,
		'false,true,true,false,false': images.NOICONLG13,
		'false,true,true,false,true': images.NOICONLG14,
		'false,true,true,true,false': images.NOICONLG15,
		'false,true,true,true,true': images.NOICONLG16,
		'true,false,false,false,false': images.NOICONLG17,
		'true,false,false,false,true': images.NOICONLG18,
		'true,false,false,true,false': images.NOICONLG19,
		'true,false,false,true,true': images.NOICONLG20,
		'true,false,true,false,false': images.NOICONLG21,
		'true,false,true,false,true': images.NOICONLG22,
		'true,false,true,true,false': images.NOICONLG23,
		'true,false,true,true,true': images.NOICONLG24,
		'true,true,false,false,false': images.NOICONLG25,
		'true,true,false,false,true': images.NOICONLG26,
		'true,true,false,true,false': images.NOICONLG27,
		'true,true,false,true,true': images.NOICONLG28,
		'true,true,true,false,false': images.NOICONLG29,
		'true,true,true,false,true': images.NOICONLG30,
		'true,true,true,true,false': images.NOICONLG31,
		'true,true,true,true,true': images.NOICONLG32,
	},
}

function getImageForState(state: State, feedbackWithIcons: number): string {
	const stateString = state.toString()
	if (feedbackWithIcons === 1) {
		return stateMachine.imagesWithIcons[stateString]
	}

	return stateMachine.imagesWithoutIcons[stateString]
}

function getParticipantState(instance: InstanceBaseExt<ZoomConfig>, zoomID: number): State {
	return [
		instance.ZoomUserData[zoomID].mute || false,
		instance.ZoomUserData[zoomID].videoOn || false,
		instance.ZoomUserData[zoomID].handRaised || false,
		instance.ZoomClientDataObj.activeSpeaker === instance.ZoomUserData[zoomID].userName || false,
		instance.ZoomClientDataObj.selectedCallers.find((element: number) => element === zoomID) !== undefined || false,
	]
}

export function feedbackResultsAdvanced(
	instance: InstanceBaseExt<ZoomConfig>,
	zoomID: number
): CompanionAdvancedFeedbackResult {
	if (userExist(zoomID, instance.ZoomUserData)) {
		const participantState = getParticipantState(instance, zoomID)
		const stateIndex = stateMachine.states.findIndex((state) => state.toString() === participantState.toString())
		const image = getImageForState(stateMachine.states[stateIndex], instance.config.feedbackImagesWithIcons)

		return {
			png64: image,
		}
	} else {
		return {}
	}
}

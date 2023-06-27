import { CompanionAdvancedFeedbackResult } from '@companion-module/base'
import { ZoomConfig } from './config'
import { InstanceBaseExt, userExist } from './utils'
const { images } = require('./images') // eslint-disable-line

type State = [boolean, boolean, boolean, boolean]
interface StateMachine {
	states: State[]
	atTop: Record<string, string>
	atTop58Height: Record<string, string>
	atBottom: Record<string, string>
	atBottom58Height: Record<string, string>
	atTopAll: Record<string, string>
	atTop58HeightAll: Record<string, string>
	atBottomAll: Record<string, string>
	atBottom58HeightAll: Record<string, string>
}

const stateMachine: StateMachine = {
	states: [
		[false, false, false, false],
		[false, false, false, false],
		[false, false, false, true],
		[false, false, false, true],
		[false, false, true, false],
		[false, false, true, false],
		[false, false, true, true],
		[false, false, true, true],
		[false, true, false, false],
		[false, true, false, false],
		[false, true, false, true],
		[false, true, false, true],
		[false, true, true, false],
		[false, true, true, false],
		[false, true, true, true],
		[false, true, true, true],
		[true, false, false, false],
		[true, false, false, false],
		[true, false, false, true],
		[true, false, false, true],
		[true, false, true, false],
		[true, false, true, false],
		[true, false, true, true],
		[true, false, true, true],
		[true, true, false, false],
		[true, true, false, false],
		[true, true, false, true],
		[true, true, false, true],
		[true, true, true, false],
		[true, true, true, false],
		[true, true, true, true],
		[true, true, true, true],
	],
	atTop: {
		'false,false,false,false': images.TopMicOn,
		'false,false,false,true': images.TopMicOnActiveSpeaker,
		'false,false,true,false': images.TopMicOnHandRaised,
		'false,false,true,true': images.TopMicOnHandRaisedActiveSpeaker,
		'false,true,false,false': images.TopMicOnCameraOn,
		'false,true,false,true': images.TopMicOnCameraOnActiveSpeaker,
		'false,true,true,false': images.TopMicOnCameraOnHandRaised,
		'false,true,true,true': images.TopAllOn,
		'true,false,false,false': images.TopAllOff,
		'true,false,false,true': images.TopActiveSpeaker,
		'true,false,true,false': images.TopHandRaised,
		'true,false,true,true': images.TopHandRaisedActiveSpeaker,
		'true,true,false,false': images.TopCameraOn,
		'true,true,false,true': images.TopCameraOnActiveSpeaker,
		'true,true,true,false': images.TopCameraOnHandRaised,
		'true,true,true,true': images.TopCameraOnHandRaisedActiveSpeaker,
	},
	atTop58Height: {
		'false,false,false,false': images.Top58MicOn,
		'false,false,false,true': images.Top58MicOnActiveSpeaker,
		'false,false,true,false': images.Top58MicOnHandRaised,
		'false,false,true,true': images.Top58MicOnHandRaisedActiveSpeaker,
		'false,true,false,false': images.Top58MicOnCameraOn,
		'false,true,false,true': images.Top58MicOnCameraOnActiveSpeaker,
		'false,true,true,false': images.Top58MicOnCameraOnHandRaised,
		'false,true,true,true': images.Top58AllOn,
		'true,false,false,false': images.Top58AllOff,
		'true,false,false,true': images.Top58ActiveSpeaker,
		'true,false,true,false': images.Top58HandRaised,
		'true,false,true,true': images.Top58HandRaisedActiveSpeaker,
		'true,true,false,false': images.Top58CameraOn,
		'true,true,false,true': images.Top58CameraOnActiveSpeaker,
		'true,true,true,false': images.Top58CameraOnHandRaised,
		'true,true,true,true': images.Top58CameraOnHandRaisedActiveSpeaker,
	},
	atBottom: {
		'false,false,false,false': images.BottomMicOn,
		'false,false,false,true': images.BottomMicOnActiveSpeaker,
		'false,false,true,false': images.BottomMicOnHandRaised,
		'false,false,true,true': images.BottomMicOnHandRaisedActiveSpeaker,
		'false,true,false,false': images.BottomMicOnCameraOn,
		'false,true,false,true': images.BottomMicOnCameraOnActiveSpeaker,
		'false,true,true,false': images.BottomMicOnCameraOnHandRaised,
		'false,true,true,true': images.BottomAllOn,
		'true,false,false,false': images.BottomAllOff,
		'true,false,false,true': images.BottomActiveSpeaker,
		'true,false,true,false': images.BottomHandRaised,
		'true,false,true,true': images.BottomHandRaisedActiveSpeaker,
		'true,true,false,false': images.BottomCameraOn,
		'true,true,false,true': images.BottomCameraOnActiveSpeaker,
		'true,true,true,false': images.BottomCameraOnHandRaised,
		'true,true,true,true': images.BottomCameraOnHandRaisedActiveSpeaker,
	},
	atBottom58Height: {
		'false,false,false,false': images.Bottom58MicOn,
		'false,false,false,true': images.Bottom58MicOnActiveSpeaker,
		'false,false,true,false': images.Bottom58MicOnHandRaised,
		'false,false,true,true': images.Bottom58MicOnHandRaisedActiveSpeaker,
		'false,true,false,false': images.Bottom58MicOnCameraOn,
		'false,true,false,true': images.Bottom58MicOnCameraOnActiveSpeaker,
		'false,true,true,false': images.Bottom58MicOnCameraOnHandRaised,
		'false,true,true,true': images.Bottom58AllOn,
		'true,false,false,false': images.Bottom58AllOff,
		'true,false,false,true': images.Bottom58ActiveSpeaker,
		'true,false,true,false': images.Bottom58HandRaised,
		'true,false,true,true': images.Bottom58HandRaisedActiveSpeaker,
		'true,true,false,false': images.Bottom58CameraOn,
		'true,true,false,true': images.Bottom58CameraOnActiveSpeaker,
		'true,true,true,false': images.Bottom58CameraOnHandRaised,
		'true,true,true,true': images.Bottom58CameraOnHandRaisedActiveSpeaker,
	},
	atTopAll: {
		'false,false,false,false': images.TopAllMicOn,
		'false,false,false,true': images.TopAllMicOnActiveSpeaker,
		'false,false,true,false': images.TopAllMicOnHandRaised,
		'false,false,true,true': images.TopAllMicOnHandRaisedActiveSpeaker,
		'false,true,false,false': images.TopAllMicOnCameraOn,
		'false,true,false,true': images.TopAllMicOnCameraOnActiveSpeaker,
		'false,true,true,false': images.TopAllMicOnCameraOnHandRaised,
		'false,true,true,true': images.TopAllAllOn,
		'true,false,false,false': images.TopAllAllOff,
		'true,false,false,true': images.TopAllActiveSpeaker,
		'true,false,true,false': images.TopAllHandRaised,
		'true,false,true,true': images.TopAllHandRaisedActiveSpeaker,
		'true,true,false,false': images.TopAllCameraOn,
		'true,true,false,true': images.TopAllCameraOnActiveSpeaker,
		'true,true,true,false': images.TopAllCameraOnHandRaised,
		'true,true,true,true': images.TopAllCameraOnHandRaisedActiveSpeaker,
	},
	atTop58HeightAll: {
		'false,false,false,false': images.Top58AllMicOn,
		'false,false,false,true': images.Top58AllMicOnActiveSpeaker,
		'false,false,true,false': images.Top58AllMicOnHandRaised,
		'false,false,true,true': images.Top58AllMicOnHandRaisedActiveSpeaker,
		'false,true,false,false': images.Top58AllMicOnCameraOn,
		'false,true,false,true': images.Top58AllMicOnCameraOnActiveSpeaker,
		'false,true,true,false': images.Top58AllMicOnCameraOnHandRaised,
		'false,true,true,true': images.Top58AllAllOn,
		'true,false,false,false': images.Top58AllAllOff,
		'true,false,false,true': images.Top58AllActiveSpeaker,
		'true,false,true,false': images.Top58AllHandRaised,
		'true,false,true,true': images.Top58AllHandRaisedActiveSpeaker,
		'true,true,false,false': images.Top58AllCameraOn,
		'true,true,false,true': images.Top58AllCameraOnActiveSpeaker,
		'true,true,true,false': images.Top58AllCameraOnHandRaised,
		'true,true,true,true': images.Top58AllCameraOnHandRaisedActiveSpeaker,
	},
	atBottomAll: {
		'false,false,false,false': images.BottomAllMicOn,
		'false,false,false,true': images.BottomAllMicOnActiveSpeaker,
		'false,false,true,false': images.BottomAllMicOnHandRaised,
		'false,false,true,true': images.BottomAllMicOnHandRaisedActiveSpeaker,
		'false,true,false,false': images.BottomAllMicOnCameraOn,
		'false,true,false,true': images.BottomAllMicOnCameraOnActiveSpeaker,
		'false,true,true,false': images.BottomAllMicOnCameraOnHandRaised,
		'false,true,true,true': images.BottomAllAllOn,
		'true,false,false,false': images.BottomAllAllOff,
		'true,false,false,true': images.BottomAllActiveSpeaker,
		'true,false,true,false': images.BottomAllHandRaised,
		'true,false,true,true': images.BottomAllHandRaisedActiveSpeaker,
		'true,true,false,false': images.BottomAllCameraOn,
		'true,true,false,true': images.BottomAllCameraOnActiveSpeaker,
		'true,true,true,false': images.BottomAllCameraOnHandRaised,
		'true,true,true,true': images.BottomAllCameraOnHandRaisedActiveSpeaker,
	},
	atBottom58HeightAll: {
		'false,false,false,false': images.Bottom58AllMicOn,
		'false,false,false,true': images.Bottom58AllMicOnActiveSpeaker,
		'false,false,true,false': images.Bottom58AllMicOnHandRaised,
		'false,false,true,true': images.Bottom58AllMicOnHandRaisedActiveSpeaker,
		'false,true,false,false': images.Bottom58AllMicOnCameraOn,
		'false,true,false,true': images.Bottom58AllMicOnCameraOnActiveSpeaker,
		'false,true,true,false': images.Bottom58AllMicOnCameraOnHandRaised,
		'false,true,true,true': images.Bottom58AllAllOn,
		'true,false,false,false': images.Bottom58AllAllOff,
		'true,false,false,true': images.Bottom58AllActiveSpeaker,
		'true,false,true,false': images.Bottom58AllHandRaised,
		'true,false,true,true': images.Bottom58AllHandRaisedActiveSpeaker,
		'true,true,false,false': images.Bottom58AllCameraOn,
		'true,true,false,true': images.Bottom58AllCameraOnActiveSpeaker,
		'true,true,true,false': images.Bottom58AllCameraOnHandRaised,
		'true,true,true,true': images.Bottom58AllCameraOnHandRaisedActiveSpeaker,
	},
}

function getImageForState(state: State, feedbackImageType: number, imageSize: number): string {
	const stateString = state.toString()
	switch (feedbackImageType) {
		case 1:
			if (imageSize === 58) {
				return stateMachine.atTop58HeightAll[stateString]
			}
			return stateMachine.atTopAll[stateString]
		case 2:
			if (imageSize === 58) {
				return stateMachine.atBottom58Height[stateString]
			}
			return stateMachine.atBottom[stateString]
		case 3:
			if (imageSize === 58) {
				return stateMachine.atBottom58HeightAll[stateString]
			}
			return stateMachine.atBottomAll[stateString]
		default:
			if (imageSize === 58) {
				return stateMachine.atTop58Height[stateString]
			}
			return stateMachine.atTop[stateString]
	}
}

function getParticipantState(instance: InstanceBaseExt<ZoomConfig>, zoomID: number): State {
	return [
		instance.ZoomUserData[zoomID].mute || false,
		instance.ZoomUserData[zoomID].videoOn || false,
		instance.ZoomUserData[zoomID].handRaised || false,
		(instance.ZoomClientDataObj.activeSpeaker === (instance.ZoomUserData[zoomID].userName || false)) === true &&
			(instance.ZoomUserData[zoomID].mute || false) === false,
	]
}

export function feedbackResultsAdvanced(
	instance: InstanceBaseExt<ZoomConfig>,
	zoomID: number,
	imageSize: number
): CompanionAdvancedFeedbackResult {
	if (instance.config.feedbackImagesWithIcons !== undefined && instance.config.feedbackImagesWithIcons === 4) {
		return {}
	}

	if (userExist(zoomID, instance.ZoomUserData)) {
		const participantState = getParticipantState(instance, zoomID)
		const stateIndex = stateMachine.states.findIndex((state) => state.toString() === participantState.toString())
		const image = getImageForState(
			stateMachine.states[stateIndex],
			instance.config.feedbackImagesWithIcons !== undefined ? instance.config.feedbackImagesWithIcons : 3,
			imageSize
		)
		return {
			png64: image,
		}
	} else {
		return {}
	}
}

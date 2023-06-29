import { CompanionAdvancedFeedbackResult } from '@companion-module/base'
import { ZoomConfig } from './config'
import { InstanceBaseExt, userExist } from './utils'
const { images } = require('./images') // eslint-disable-line

type FeedbackMultiState = [boolean, boolean, boolean, boolean]
interface FeedbackMultiStateMachine {
	states: FeedbackMultiState[]
	atBottomOnOffForCameraMicActiveSpeakerAndOnlyOnForHandRaised: Record<string, string>
	atBottomOnOffForCameraMicActiveSpeakerAndOnlyOnForHandRaised58Height: Record<string, string>
	atBottom: Record<string, string>
	atBottom58Height: Record<string, string>
	atBottomAll: Record<string, string>
	atBottom58HeightAll: Record<string, string>
}

const stateMachine: FeedbackMultiStateMachine = {
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
	atBottomOnOffForCameraMicActiveSpeakerAndOnlyOnForHandRaised: {
		'false,false,false,false': images.BottomHRAllMicOn,
		'false,false,false,true': images.BottomHRAllMicOnActiveSpeaker,
		'false,false,true,false': images.BottomHRAllMicOnHandRaised,
		'false,false,true,true': images.BottomHRAllMicOnHandRaisedActiveSpeaker,
		'false,true,false,false': images.BottomHRAllMicOnCameraOn,
		'false,true,false,true': images.BottomHRAllMicOnCameraOnActiveSpeaker,
		'false,true,true,false': images.BottomHRAllMicOnCameraOnHandRaised,
		'false,true,true,true': images.BottomHRAllAllOn,
		'true,false,false,false': images.BottomHRAllAllOff,
		'true,false,false,true': images.BottomHRAllActiveSpeaker,
		'true,false,true,false': images.BottomHRAllHandRaised,
		'true,false,true,true': images.BottomHRAllHandRaisedActiveSpeaker,
		'true,true,false,false': images.BottomHRAllCameraOn,
		'true,true,false,true': images.BottomHRAllCameraOnActiveSpeaker,
		'true,true,true,false': images.BottomHRAllCameraOnHandRaised,
		'true,true,true,true': images.BottomHRAllCameraOnHandRaisedActiveSpeaker,
	},
	atBottomOnOffForCameraMicActiveSpeakerAndOnlyOnForHandRaised58Height: {
		'false,false,false,false': images.BottomHR58AllMicOn,
		'false,false,false,true': images.BottomHR58AllMicOnActiveSpeaker,
		'false,false,true,false': images.BottomHR58AllMicOnHandRaised,
		'false,false,true,true': images.BottomHR58AllMicOnHandRaisedActiveSpeaker,
		'false,true,false,false': images.BottomHR58AllMicOnCameraOn,
		'false,true,false,true': images.BottomHR58AllMicOnCameraOnActiveSpeaker,
		'false,true,true,false': images.BottomHR58AllMicOnCameraOnHandRaised,
		'false,true,true,true': images.BottomHR58AllAllOn,
		'true,false,false,false': images.BottomHR58AllAllOff,
		'true,false,false,true': images.BottomHR58AllActiveSpeaker,
		'true,false,true,false': images.BottomHR58AllHandRaised,
		'true,false,true,true': images.BottomHR58AllHandRaisedActiveSpeaker,
		'true,true,false,false': images.BottomHR58AllCameraOn,
		'true,true,false,true': images.BottomHR58AllCameraOnActiveSpeaker,
		'true,true,true,false': images.BottomHR58AllCameraOnHandRaised,
		'true,true,true,true': images.BottomHR58AllCameraOnHandRaisedActiveSpeaker,
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

function getImageForState(state: FeedbackMultiState, feedbackImageType: number, imageSize: number): string {
	const stateString = state.toString()
	switch (feedbackImageType) {
		case 0:
			if (imageSize === 58) {
				return stateMachine.atBottomOnOffForCameraMicActiveSpeakerAndOnlyOnForHandRaised58Height[stateString]
			}
			return stateMachine.atBottomOnOffForCameraMicActiveSpeakerAndOnlyOnForHandRaised[stateString]
		case 2:
			if (imageSize === 58) {
				return stateMachine.atBottom58Height[stateString]
			}
			return stateMachine.atBottom[stateString]
		case 3:
		default:
			if (imageSize === 58) {
				return stateMachine.atBottom58HeightAll[stateString]
			}
			return stateMachine.atBottomAll[stateString]
	}
}

function getParticipantState(instance: InstanceBaseExt<ZoomConfig>, zoomID: number): FeedbackMultiState {
	return [
		instance.ZoomUserData[zoomID].mute || false, // false = muted, true = unmuted
		instance.ZoomUserData[zoomID].videoOn || false, // false = camera off, true = camera on
		instance.ZoomUserData[zoomID].handRaised || false, // false = hand lowered, true = hand raised
		instance.ZoomUserData[zoomID].userName !== undefined &&
			(instance.ZoomUserData[zoomID].mute || false) === false &&
			instance.ZoomClientDataObj.activeSpeaker === instance.ZoomUserData[zoomID].userName, // ensure that user is unmuted for active speaker
	]
}

export function feedbackResultsMultiState(
	instance: InstanceBaseExt<ZoomConfig>,
	zoomID: number,
	imageSize: number
): CompanionAdvancedFeedbackResult {
	if (instance.config.feedbackImagesWithIcons !== undefined && instance.config.feedbackImagesWithIcons === 4) {
		return {}
	}

	if (userExist(zoomID, instance.ZoomUserData)) {
		const participantState = getParticipantState(instance, zoomID)

		instance.log(
			'debug',
			`feedback: user - ${JSON.stringify(
				instance.ZoomUserData[zoomID]
			)}, **** STATE **** - ${participantState}, *** Active Speaker *** ${instance.ZoomClientDataObj.activeSpeaker}`
		)
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

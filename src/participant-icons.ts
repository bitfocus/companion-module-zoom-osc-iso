import { layerImages } from './images-layers.js'

/**
 * The participant status icons used by the layered presets.
 * Each icon is shown from Companion's image library when an image named `libraryImage` exists there,
 * falling back to the built-in image published as the module variable `variable`.
 */
export const participantIcons = {
	micOn: { label: 'Mic On', libraryImage: 'zoom_mic_on', variable: 'icon_mic_on', image: layerImages.micOn },
	micOff: { label: 'Mic Off', libraryImage: 'zoom_mic_off', variable: 'icon_mic_off', image: layerImages.micOff },
	cameraOn: {
		label: 'Camera On',
		libraryImage: 'zoom_camera_on',
		variable: 'icon_camera_on',
		image: layerImages.cameraOn,
	},
	cameraOff: {
		label: 'Camera Off',
		libraryImage: 'zoom_camera_off',
		variable: 'icon_camera_off',
		image: layerImages.cameraOff,
	},
	handRaised: {
		label: 'Hand Raised',
		libraryImage: 'zoom_hand_raised',
		variable: 'icon_hand_raised',
		image: layerImages.handRaised,
	},
	handLowered: {
		label: 'Hand Lowered',
		libraryImage: 'zoom_hand_lowered',
		variable: 'icon_hand_lowered',
		image: layerImages.handLowered,
	},
} as const

export type ParticipantIcon = (typeof participantIcons)[keyof typeof participantIcons]

/**
 * Expression for an icon: the image library override if the user added one, otherwise the built-in icon.
 * The library image is read with getVariable() rather than `$(image:…)`: when a preset is placed, Companion rewrites
 * every `$(label:…)` except `local` and `this` to the module's connection label, which would break `$(image:…)`.
 */
export const participantIconExpression = (icon: ParticipantIcon): string =>
	`getVariable('image', '${icon.libraryImage}') || $(zoomosc:${icon.variable})`

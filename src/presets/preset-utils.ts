import type { ModuleSchema } from '../index.js'
import {
	ButtonGraphicsDecorationType,
	type CompanionButtonStepActions,
	type CompanionLayeredButtonPresetDefinition,
	type CompanionPresetDefinitions,
	type CompanionPresetSection,
	type CompanionPresetFeedbackStyleOverride,
	type CompanionPresetValue,
	type ExpressionOrValue,
	type JsonValue,
	type SomeButtonGraphicsElement,
	type SomePresetConditionEntry,
	type SomePresetLayeredFeedbackEntry,
} from '@companion-module/base'
import { FeedbackId, feedbackType } from '../feedback.js'
import { colorBlack, colorDarkGray, colorDarkRed, colorSpeakerBlue, colorWhite } from '../utils.js'
import { participantIconExpression, participantIcons, type ParticipantIcon } from '../participant-icons.js'

export const buttonTextDefaultLength = 50
export const buttonTextActiveSpeakerLength = 40

/**
 * The boolean feedback (and its target options) that a layered participant preset is driven by.
 * The position may be an expression, e.g. `$(local:position)` in a template preset; the name may contain variables,
 * e.g. `$(local:name)`.
 */
export type ParticipantFeedbackTarget =
	| { feedbackId: FeedbackId.galleryBased; options: { position: CompanionPresetValue<number> } }
	| { feedbackId: FeedbackId.indexBased; options: { position: CompanionPresetValue<number> } }
	| { feedbackId: FeedbackId.groupBased; options: { group: string; position: CompanionPresetValue<number> } }
	| { feedbackId: FeedbackId.userNameBased; options: { name: string } }

/** Element ids of the layered participant button, so feedback overrides can target them */
export const ParticipantElement = {
	background: 'background',
	spotlight: 'spotlight',
	selected: 'selected',
	camera: 'camera',
	mic: 'mic',
	hand: 'hand',
	name: 'name',
	speakerBar: 'speakerBar',
	speakerText: 'speakerText',
	spotlightCircle: 'spotlightCircle',
} as const

// Values are written plainly (no { isExpression: false } wrapper) to keep presets compact; only expressions need wrapping
const expression = (v: string): ExpressionOrValue<string> => ({ isExpression: true, value: v })

const override = (
	elementId: string,
	elementProperty: string,
	to: CompanionPresetValue<JsonValue>,
): CompanionPresetFeedbackStyleOverride => ({ elementId, elementProperty, override: to })

/** Full-button bounds; every layer except the speaker bar and spotlight circle covers the whole button */
const fullBounds = { x: 0, y: 0, width: 100, height: 100 }

const box = (id: string, name: string, color: number, enabled: boolean, height = 100): SomeButtonGraphicsElement => ({
	id,
	name,
	type: 'box',
	enabled,
	...fullBounds,
	height,
	color,
})

const iconImage = (id: string, name: string): SomeButtonGraphicsElement => ({
	id,
	name,
	type: 'image',
	enabled: true,
	...fullBounds,
	base64Image: null,
	halign: 'center',
	valign: 'center',
	fillMode: 'fit',
})

/**
 * The camera, mic and hand feedbacks, in the order they appear on the button, and the icon each one shows
 * (the image library override if there is one, otherwise the built-in icon).
 * Hand Lowered is left out so a lowered hand shows nothing by default (a preset can't ship a disabled feedback);
 * users can add it to a button themselves with the hand-lowered icon.
 */
const iconFeedbacks: { type: feedbackType; elementId: string; headline: string; icon: ParticipantIcon }[] = [
	{
		type: feedbackType.camera,
		elementId: ParticipantElement.camera,
		headline: 'Camera On',
		icon: participantIcons.cameraOn,
	},
	{
		type: feedbackType.cameraOff,
		elementId: ParticipantElement.camera,
		headline: 'Camera Off',
		icon: participantIcons.cameraOff,
	},
	{ type: feedbackType.micLive, elementId: ParticipantElement.mic, headline: 'Mic On', icon: participantIcons.micOn },
	{ type: feedbackType.micOff, elementId: ParticipantElement.mic, headline: 'Mic Off', icon: participantIcons.micOff },
	{
		type: feedbackType.handRaised,
		elementId: ParticipantElement.hand,
		headline: 'Hand Raised',
		icon: participantIcons.handRaised,
	},
]

/**
 * A layered (v2) participant button: name, spotlight / selected backgrounds, an active speaker bar and
 * separate mic, camera and hand icon layers, each driven by the existing boolean participant feedbacks.
 * Mirrors the layout of the hand-built and tested Gallery Position button.
 */
export function buildParticipantLayeredPreset(params: {
	name: string
	/** Expression giving the participant name, e.g. `$(zoomosc:GalleryPosition03)` */
	nameExpression: string
	/**
	 * Text shown before the name inside the name template literal, e.g. `3` or `${$(local:position)}`.
	 * Leave out for a button without a position number (Select by name).
	 */
	positionText?: string
	target: ParticipantFeedbackTarget
	steps: CompanionButtonStepActions<ModuleSchema>[]
	localVariables?: CompanionLayeredButtonPresetDefinition<ModuleSchema>['localVariables']
}): CompanionLayeredButtonPresetDefinition<ModuleSchema> {
	const { nameExpression, positionText, target } = params
	const e = ParticipantElement

	// The typed preset format has no feedback-specific options union for the three targets, so they are built loosely
	const feedback = (type: feedbackType, isInverted = false): any => ({
		feedbackId: target.feedbackId,
		options: { ...target.options, type },
		...(isInverted ? { isInverted } : {}),
	})

	// The conditions inside the AND groups. They carry no style overrides: Companion drops those on logic-group
	// children when a preset becomes a button, so each group's own overrides do the styling.
	const condition = (
		type: feedbackType,
		headline: string,
		isInverted = false,
	): SomePresetConditionEntry<ModuleSchema> => ({
		...feedback(type, isInverted),
		headline,
	})
	const spotlightOnChild = (): SomePresetConditionEntry<ModuleSchema> =>
		condition(feedbackType.spotlightOn, 'Spotlight On')
	const spotlightOffChild = (): SomePresetConditionEntry<ModuleSchema> =>
		condition(feedbackType.spotlightOff, 'Spotlight Off')
	const selectedChild = (isInverted = false): SomePresetConditionEntry<ModuleSchema> =>
		condition(feedbackType.selected, 'Selected', isInverted)

	const andGroup = (
		headline: string,
		children: SomePresetConditionEntry<ModuleSchema>[],
		styleOverrides: CompanionPresetFeedbackStyleOverride[],
	): SomePresetLayeredFeedbackEntry<ModuleSchema> => ({
		feedbackId: 'internal:logicOperator',
		options: { operation: 'and' },
		children: { default: children },
		styleOverrides,
		headline,
	})

	const nameText = (prefix: string, length: number): string =>
		`\`${prefix}${positionText === undefined ? '' : `${positionText}. `}\${substr(${nameExpression},0,${length})}\``

	const feedbacks: SomePresetLayeredFeedbackEntry<ModuleSchema>[] = [
		andGroup(
			'Spotlighted but not Selected',
			[spotlightOnChild(), selectedChild(true)],
			[
				override(e.spotlightCircle, 'enabled', false),
				override(e.name, 'color', colorWhite),
				override(e.spotlight, 'enabled', true),
			],
		),
		andGroup(
			'Selected But Not Spotlighted',
			[spotlightOffChild(), selectedChild()],
			[
				override(e.spotlightCircle, 'enabled', false),
				override(e.name, 'color', colorWhite),
				override(e.selected, 'enabled', true),
			],
		),
		andGroup(
			'Selected and Spotlighted',
			[spotlightOnChild(), selectedChild()],
			[override(e.spotlightCircle, 'enabled', true), override(e.selected, 'enabled', true)],
		),
		{
			...feedback(feedbackType.activeSpeaker),
			headline: 'Active Speaker',
			styleOverrides: [
				override(e.speakerBar, 'enabled', true),
				override(e.speakerText, 'enabled', true),
				override(e.name, 'text', expression(nameText('\\n', buttonTextActiveSpeakerLength))),
				override(e.name, 'halign', 'left'),
				override(e.name, 'valign', 'top'),
			],
		},
		...iconFeedbacks.map(({ type, elementId, headline, icon }) => ({
			...feedback(type),
			headline,
			styleOverrides: [override(elementId, 'base64Image', expression(participantIconExpression(icon)))],
		})),
	]

	const elements: SomeButtonGraphicsElement[] = [
		box(e.background, 'Background', colorBlack, true),
		box(e.spotlight, 'Spotlight', colorDarkRed, false),
		box(e.selected, 'Selected', colorDarkGray, false),
		iconImage(e.camera, 'Camera Status'),
		iconImage(e.mic, 'Mic Status'),
		iconImage(e.hand, 'Hand Raised Status'),
		{
			id: e.name,
			name: 'Attendee Name',
			type: 'text',
			enabled: true,
			...fullBounds,
			text: expression(nameText('', buttonTextDefaultLength)),
			color: colorWhite,
			halign: 'center',
			valign: 'top',
			fontsize: 16.7,
			fontsizeAllowShrink: false,
			font: 'companion-sans',
			weight: 'normal',
		},
		box(e.speakerBar, 'Active Speaker', colorSpeakerBlue, false, 15),
		{
			id: e.speakerText,
			name: 'Active Speaker Text',
			type: 'text',
			enabled: false,
			...fullBounds,
			height: 15,
			text: 'SPEAKER',
			color: colorWhite,
			halign: 'center',
			valign: 'center',
			fontsize: 100,
			fontsizeAllowShrink: true,
			font: 'companion-sans',
			weight: 'bold',
		},
		{
			id: e.spotlightCircle,
			name: 'Spotlight Circle',
			type: 'circle',
			enabled: false,
			x: 6,
			y: 5,
			width: 15,
			height: 15,
			color: colorDarkRed,
			startAngle: 0,
			endAngle: 360,
			drawSlice: false,
			borderWidth: 2,
			borderColor: colorWhite,
			borderPosition: 'center',
			borderOnlyArc: false,
		},
	]

	return {
		type: 'layered',
		name: params.name,
		canvas: { decoration: ButtonGraphicsDecorationType.Border },
		elements,
		feedbacks,
		steps: params.steps,
		...(params.localVariables ? { localVariables: params.localVariables } : {}),
	}
}

/** The local variable each templated participant button stores its position in */
export const templatePositionVariable = 'position'
const localPosition = `$(local:${templatePositionVariable})`

/**
 * Expression resolving a per-position zoomosc variable for the button's own position, e.g. `Participant007`.
 * The variable reference is built as a string and parsed, because the name embeds the (zero-padded) position.
 */
export const positionVariableExpression = (prefix: string, padTo = 1): string => {
	const position = padTo > 1 ? `substr(concat('${'0'.repeat(padTo - 1)}', ${localPosition}), -${padTo})` : localPosition
	return `parseVariables(concat('$(zoomosc:${prefix}', ${position}, ')'))`
}

/**
 * A section holding one layered participant template, which Companion expands into a button per position.
 * Users reach further positions by changing the `position` local variable on a button.
 */
export function buildParticipantTemplateSection(params: {
	sectionId: string
	sectionName: string
	/** Id of the single template preset */
	presetId: string
	presetName: string
	/** Number of positions listed in the section */
	positions: number
	/** Button label shown for each position in the preset list */
	positionName: (position: number) => string
	/** Expression giving the participant name for the button's position (see positionVariableExpression) */
	nameExpression: string
	/** Builds the boolean feedback target for the given position expression */
	target: (position: CompanionPresetValue<number>) => ParticipantFeedbackTarget
	/** Builds the press action for the given position expression (position dropdowns use string ids) */
	action: (position: CompanionPresetValue<string>) => CompanionButtonStepActions<ModuleSchema>['down'][number]
}): { section: CompanionPresetSection<ModuleSchema>; presets: CompanionPresetDefinitions<ModuleSchema> } {
	const preset = buildParticipantLayeredPreset({
		name: params.presetName,
		nameExpression: params.nameExpression,
		positionText: `\${${localPosition}}`,
		target: params.target({ isExpression: true, value: localPosition }),
		steps: [{ down: [params.action({ isExpression: true, value: `concat(${localPosition})` })], up: [] }],
		localVariables: [{ variableType: 'simple', variableName: templatePositionVariable, startupValue: 1 }],
	})

	return {
		section: {
			id: params.sectionId,
			name: params.sectionName,
			// a template preset can only be listed through a template group, so each section holds exactly one
			definitions: [
				{
					id: `${params.sectionId}_positions`,
					type: 'template',
					name: params.sectionName,
					presetId: params.presetId,
					templateVariableName: templatePositionVariable,
					templateValues: Array.from({ length: params.positions }, (_, i) => ({
						name: params.positionName(i + 1),
						value: i + 1,
					})),
				},
			],
		},
		presets: { [params.presetId]: preset },
	}
}

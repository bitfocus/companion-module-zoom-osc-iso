import { describe, it, expect, vi } from 'vitest'
import { createMockInstance, type MockModuleInstance } from '../helpers/mock-instance.js'
import { capturePresets } from '../helpers/presets.js'
import { UpdatePresets } from '../../src/presets.js'
import { FeedbackId, feedbackType } from '../../src/feedback.js'
import { buildParticipantLayeredPreset, ParticipantElement as E } from '../../src/presets/preset-utils.js'
import { colorWhite } from '../../src/utils.js'
import { participantIcons } from '../../src/participant-icons.js'

function build(target: any = { feedbackId: FeedbackId.galleryBased, options: { position: 3 } }): any {
	return buildParticipantLayeredPreset({
		name: 'Gallery position 3',
		nameExpression: '$(zoomosc:GalleryPosition03)',
		positionText: '3',
		target,
		steps: [{ down: [], up: [] }],
	})
}

const ids = (preset: any): string[] => preset.elements.map((element: any) => element.id)
const topLevel = (preset: any, type: feedbackType): any[] =>
	preset.feedbacks.filter((f: any) => f.feedbackId !== 'internal:logicOperator' && f.options.type === type)
const group = (preset: any, headline: string): any =>
	preset.feedbacks.find((f: any) => f.feedbackId === 'internal:logicOperator' && f.headline === headline)
const overrides = (feedback: any): Record<string, unknown> =>
	Object.fromEntries(
		feedback.styleOverrides.map((o: any) => [
			`${o.elementId}.${o.elementProperty}`,
			o.override !== null && typeof o.override === 'object' ? o.override.value : o.override,
		]),
	)

describe('layered participant preset', () => {
	it('stacks the layers bottom to top as in the tested button', () => {
		expect(ids(build())).toEqual([
			E.background,
			E.spotlight,
			E.selected,
			E.camera,
			E.mic,
			E.hand,
			E.name,
			E.speakerGroup,
			E.spotlightCircle,
		])
	})

	it('keeps the speaker bar and label enabled inside a disabled Active Speaker group', () => {
		const group = build().elements.find((el: any) => el.id === E.speakerGroup)
		expect(group).toMatchObject({ type: 'group', name: 'Active Speaker Group', enabled: false })
		expect(group.children.map((c: any) => [c.id, c.enabled])).toEqual([
			[E.speakerBar, true],
			[E.speakerText, true],
		])
	})

	it('only overrides elements that exist', () => {
		{
			const preset = build()
			const elementIds = new Set(ids(preset))
			const all = preset.feedbacks.flatMap((f: any) => [
				...f.styleOverrides,
				...(f.children?.default ?? []).flatMap((c: any) => c.styleOverrides ?? []),
			])
			for (const o of all) expect(elementIds.has(o.elementId), o.elementId).toBe(true)
		}
	})

	it('targets the preset own position for every feedback, including logic group children', () => {
		const preset = build()
		const all = preset.feedbacks.flatMap((f: any) => (f.children ? f.children.default : [f]))
		for (const f of all) {
			expect(f.feedbackId).toBe(FeedbackId.galleryBased)
			expect(f.options.position).toBe(3)
		}
	})

	it('builds group presets against the group feedback', () => {
		const preset = build({ feedbackId: FeedbackId.groupBased, options: { group: '2', position: 3 } })
		const camera = topLevel(preset, feedbackType.camera)[0]
		expect(camera.feedbackId).toBe(FeedbackId.groupBased)
		expect(camera.options).toEqual({ group: '2', position: 3, type: feedbackType.camera })
	})

	it('mirrors the three spotlight / selected AND groups, with white text when selected', () => {
		const preset = build()
		const spotOnly = group(preset, 'Spotlighted but not Selected')
		expect(spotOnly.options).toEqual({ operation: 'and' })
		expect(spotOnly.children.default.map((c: any) => [c.options.type, c.isInverted ?? false])).toEqual([
			[feedbackType.spotlightOn, false],
			[feedbackType.selected, true],
		])
		expect(overrides(spotOnly)).toEqual({
			[`${E.spotlightCircle}.enabled`]: false,
			[`${E.name}.color`]: colorWhite,
			[`${E.spotlight}.enabled`]: true,
		})

		const selectedOnly = group(preset, 'Selected But Not Spotlighted')
		expect(selectedOnly.children.default.map((c: any) => c.options.type)).toEqual([
			feedbackType.spotlightOff,
			feedbackType.selected,
		])
		expect(overrides(selectedOnly)).toEqual({
			[`${E.spotlightCircle}.enabled`]: false,
			[`${E.name}.color`]: colorWhite,
			[`${E.selected}.enabled`]: true,
		})

		const both = group(preset, 'Selected and Spotlighted')
		expect(both.children.default.map((c: any) => c.options.type)).toEqual([
			feedbackType.spotlightOn,
			feedbackType.selected,
		])
		expect(overrides(both)).toEqual({ [`${E.spotlightCircle}.enabled`]: true, [`${E.selected}.enabled`]: true })
	})

	it('leaves style overrides off the logic group children, since Companion drops them', () => {
		const groups = build().feedbacks.filter((f: any) => f.feedbackId === 'internal:logicOperator')
		for (const group of groups) {
			for (const child of group.children.default) expect(child.styleOverrides).toBeUndefined()
		}
	})

	it('enables the Active Speaker group, and moves the name down for the active speaker', () => {
		const speaker = topLevel(build(), feedbackType.activeSpeaker)[0]
		const text = speaker.styleOverrides.find((o: any) => o.elementProperty === 'text')
		expect(text.override).toEqual({ isExpression: true, value: '`\\n3. ${substr($(zoomosc:GalleryPosition03),0,40)}`' })
		expect(overrides(speaker)).toEqual({
			[`${E.speakerGroup}.enabled`]: true,
			[`${E.name}.text`]: '`\\n3. ${substr($(zoomosc:GalleryPosition03),0,40)}`',
			[`${E.name}.halign`]: 'left',
			[`${E.name}.valign`]: 'top',
		})
	})

	it('prefers an image library override for each icon, falling back to the built-in icon variable', () => {
		// $(image:…) would be rewritten to the connection label when the preset is placed, so it must not appear
		expect(JSON.stringify(build())).not.toContain('$(image:')
		const preset = build()
		const expected: Record<number, [string, string, string]> = {
			[feedbackType.camera]: [E.camera, 'zoom_camera_on', 'icon_camera_on'],
			[feedbackType.cameraOff]: [E.camera, 'zoom_camera_off', 'icon_camera_off'],
			[feedbackType.micLive]: [E.mic, 'zoom_mic_on', 'icon_mic_on'],
			[feedbackType.micOff]: [E.mic, 'zoom_mic_off', 'icon_mic_off'],
			[feedbackType.handRaised]: [E.hand, 'zoom_hand_raised', 'icon_hand_raised'],
		}
		for (const [type, [elementId, libraryImage, variable]] of Object.entries(expected)) {
			const [feedback] = topLevel(preset, Number(type))
			expect(feedback.styleOverrides).toEqual([
				{
					elementId,
					elementProperty: 'base64Image',
					override: {
						isExpression: true,
						value: `getVariable('image', '${libraryImage}') || $(zoomosc:${variable})`,
					},
				},
			])
		}
	})

	it('uses image library names Companion accepts unchanged', () => {
		// Companion replaces anything other than word characters and hyphens in image names
		for (const icon of Object.values(participantIcons)) expect(icon.libraryImage).toMatch(/^[\w-]+$/)
	})

	it('leaves Hand Lowered off the button, so a lowered hand shows nothing', () => {
		expect(topLevel(build(), feedbackType.handLowered)).toEqual([])
	})

	it('lists every feedback with a headline, in the tested order', () => {
		expect(build().feedbacks.map((f: any) => f.headline)).toEqual([
			'Spotlighted but not Selected',
			'Selected But Not Spotlighted',
			'Selected and Spotlighted',
			'Active Speaker',
			'Camera On',
			'Camera Off',
			'Mic On',
			'Mic Off',
			'Hand Raised',
		])
	})

	it('gives the logic group children headlines', () => {
		const groups = build().feedbacks.filter((f: any) => f.feedbackId === 'internal:logicOperator')
		expect(groups.map((g: any) => g.children.default.map((c: any) => c.headline))).toEqual([
			['Spotlight On', 'Selected'],
			['Spotlight Off', 'Selected'],
			['Spotlight On', 'Selected'],
		])
	})

	it('builds the same button whatever the Participant Multi-State Feedback setting is', () => {
		const presets = [0, 1, 2, 3, 4].map((mode) => {
			const instance: MockModuleInstance = createMockInstance()
			instance.config.feedbackImagesWithIcons = mode
			instance.setPresetDefinitions = vi.fn()
			UpdatePresets(instance)
			return JSON.stringify(capturePresets(instance.setPresetDefinitions).presets['Gallery_position'])
		})
		for (const preset of presets) expect(preset).toBe(presets[0])
	})
})

describe('participant, gallery and group template presets', () => {
	function capture(): ReturnType<typeof capturePresets> {
		const instance: MockModuleInstance = createMockInstance()
		instance.ZoomGroupData = [
			{ groupName: 'Hosts', users: [] },
			{ groupName: 'Spotlights', users: [] },
			{ groupName: 'Group 2', users: [] },
		]
		instance.setPresetDefinitions = vi.fn()
		UpdatePresets(instance)
		return capturePresets(instance.setPresetDefinitions)
	}

	const cases = [
		{
			sectionId: 'participants',
			presetId: 'Caller',
			positions: 49,
			valueName: 'Caller7',
			feedbackId: FeedbackId.indexBased,
			fixedOptions: {},
			actionOptions: { option: 'toggle' },
			nameVariable: "parseVariables(concat('$(zoomosc:Participant', substr(concat('00', $(local:position)), -3), ')'))",
		},
		{
			sectionId: 'gallery',
			presetId: 'Gallery_position',
			positions: 49,
			valueName: 'Gallery position 7',
			feedbackId: FeedbackId.galleryBased,
			fixedOptions: {},
			actionOptions: { option: 'toggle' },
			nameVariable:
				"parseVariables(concat('$(zoomosc:GalleryPosition', substr(concat('0', $(local:position)), -2), ')'))",
		},
		{
			sectionId: 'groups_group2',
			presetId: 'Group2_Position',
			positions: 49,
			valueName: 'Group 2 7',
			feedbackId: FeedbackId.groupBased,
			fixedOptions: { group: '2' },
			actionOptions: { group: '2', option: 'toggle' },
			nameVariable: "parseVariables(concat('$(zoomosc:Group2Position', $(local:position), ')'))",
		},
	]

	for (const c of cases) {
		it(`${c.sectionId}: lists ${c.positions} positions of one layered template`, () => {
			const { structure, presets } = capture()
			const section = structure.find((s) => s.id === c.sectionId)
			expect(section?.definitions).toHaveLength(1)
			const group: any = section?.definitions[0]
			expect(group).toMatchObject({ type: 'template', presetId: c.presetId, templateVariableName: 'position' })
			expect(group.templateValues).toHaveLength(c.positions)
			expect(group.templateValues[6]).toEqual({ name: c.valueName, value: 7 })

			const preset: any = presets[c.presetId]
			expect(preset.type).toBe('layered')
			expect(preset.localVariables).toEqual([{ variableType: 'simple', variableName: 'position', startupValue: 1 }])
		})

		it(`${c.sectionId}: drives the feedbacks, action and name from the position local variable`, () => {
			const preset: any = capture().presets[c.presetId]
			const position = { isExpression: true, value: '$(local:position)' }
			const all = preset.feedbacks.flatMap((f: any) => (f.children ? f.children.default : [f]))
			for (const f of all) {
				expect(f.feedbackId).toBe(c.feedbackId)
				expect(f.options).toMatchObject({ ...c.fixedOptions, position })
			}

			expect(preset.steps[0].down[0].options).toEqual({
				...c.actionOptions,
				position: { isExpression: true, value: 'concat($(local:position))' },
			})

			const name = preset.elements.find((e: any) => e.id === E.name)
			expect(name.text).toEqual({
				isExpression: true,
				value: `\`\${$(local:position)}. \${substr(${c.nameVariable},0,50)}\``,
			})
		})
	}

	it('keeps the Spotlights group at 9 positions', () => {
		const group: any = capture().structure.find((s) => s.id === 'groups_group1')?.definitions[0]
		expect(group.templateValues).toHaveLength(9)
	})
})

describe('select by name preset', () => {
	function selectByName(): any {
		const instance: MockModuleInstance = createMockInstance()
		instance.setPresetDefinitions = vi.fn()
		UpdatePresets(instance)
		return capturePresets(instance.setPresetDefinitions).presets['Select_by_name']
	}

	it('is the same layered participant button, driven by the username feedback', () => {
		const preset = selectByName()
		const gallery = build()
		expect(preset.type).toBe('layered')
		expect(ids(preset)).toEqual(ids(gallery))
		expect(preset.feedbacks.map((f: any) => f.headline)).toEqual(gallery.feedbacks.map((f: any) => f.headline))
		const all = preset.feedbacks.flatMap((f: any) => (f.children ? f.children.default : [f]))
		for (const f of all) {
			expect(f.feedbackId).toBe(FeedbackId.userNameBased)
			expect(f.options.name).toBe('$(local:name)')
		}
	})

	it('reads the participant name from its name local variable', () => {
		const preset = selectByName()
		expect(preset.localVariables).toEqual([{ variableType: 'simple', variableName: 'name', startupValue: '' }])
		expect(preset.steps[0].down[0].options).toEqual({ option: 'toggle', name: '$(local:name)' })
		const name = preset.elements.find((e: any) => e.id === E.name)
		expect(name.text).toEqual({
			isExpression: true,
			value: "`${substr($(local:name) || 'Select by name',0,50)}`",
		})
	})
})

describe('active speaker preset', () => {
	function activeSpeaker(): any {
		const instance: MockModuleInstance = createMockInstance()
		instance.setPresetDefinitions = vi.fn()
		UpdatePresets(instance)
		const { presets, placement } = capturePresets(instance.setPresetDefinitions)
		expect(placement.get('Active_Speaker')?.sectionName).toBe('Manage Selections of Participants')
		return presets['Active_Speaker']
	}

	it('is the same layered participant button, for whoever is speaking', () => {
		const preset = activeSpeaker()
		const gallery = build()
		expect(preset).toMatchObject({ type: 'layered', name: 'Active Speaker' })
		expect(ids(preset)).toEqual(ids(gallery))
		expect(preset.feedbacks.map((f: any) => f.headline)).toEqual(gallery.feedbacks.map((f: any) => f.headline))
		const all = preset.feedbacks.flatMap((f: any) => (f.children ? f.children.default : [f]))
		for (const f of all) {
			expect(f.feedbackId).toBe(FeedbackId.userNameBased)
			expect(f.options.name).toBe('$(zoomosc:activeSpeaker)')
		}
	})

	it('toggles the active speaker with Preselect user by name, and shows their name', () => {
		const preset = activeSpeaker()
		expect(preset.steps[0].down).toEqual([
			{ actionId: 'select_User_By_Name', options: { option: 'toggle', name: '$(zoomosc:activeSpeaker)' } },
		])
		const name = preset.elements.find((e: any) => e.id === E.name)
		expect(name.text).toEqual({ isExpression: true, value: '`${substr($(zoomosc:activeSpeaker),0,50)}`' })
	})
})

import { describe, it, expect, beforeAll, vi } from 'vitest'
import { createMockInstance, type MockModuleInstance } from '../helpers/mock-instance.js'
import { capturePresets, type CapturedPresets } from '../helpers/presets.js'
import { UpdatePresets } from '../../src/presets.js'
import { UpdateActions } from '../../src/actions.js'
import { GetFeedbacks } from '../../src/feedback.js'

function setupInstance(): MockModuleInstance {
	const instance = createMockInstance()
	instance.ZoomGroupData = [
		{ groupName: 'Hosts', users: [] },
		{ groupName: 'Spotlights', users: [] },
		{ groupName: 'Group 2', users: [] },
	]
	instance.setPresetDefinitions = vi.fn()
	return instance
}

describe('presets (v2 structure)', () => {
	let instance: MockModuleInstance
	let captured: CapturedPresets

	beforeAll(() => {
		instance = setupInstance()
		UpdatePresets(instance)
		captured = capturePresets(instance.setPresetDefinitions)
	})

	it('lists every preset in exactly one group', () => {
		const { presets, listed } = captured
		expect(new Set(listed).size).toBe(listed.length)
		expect(new Set(listed)).toEqual(new Set(Object.keys(presets)))
	})

	it('uses unique section and group ids', () => {
		const ids = captured.structure.flatMap((s) => [
			s.id,
			...s.definitions.flatMap((d) => (typeof d === 'string' ? [] : [d.id])),
		])
		expect(new Set(ids).size).toBe(ids.length)
	})

	it('lists presets directly in each section, with a group only where a template needs one', () => {
		for (const section of captured.structure) {
			const groups = section.definitions.filter((d) => typeof d !== 'string')
			if (groups.length === 0) continue
			expect(section.definitions, section.id).toHaveLength(1)
			expect((groups[0] as { type: string }).type, section.id).toBe('template')
		}
	})

	it('never emits an empty group', () => {
		for (const section of captured.structure) {
			expect(section.definitions.length).toBeGreaterThan(0)
			for (const d of section.definitions) {
				if (typeof d !== 'string' && d.type === 'simple') expect(d.presets.length).toBeGreaterThan(0)
			}
		}
	})

	it('uses layered presets for participant, gallery, group, select-by-name and active speaker buttons, and simple presets elsewhere', () => {
		const layered = [
			'Caller',
			'Gallery_position',
			'Group0_Position',
			'Group1_Position',
			'Group2_Position',
			'Select_by_name',
			'Active_Speaker',
		]
		for (const [id, preset] of Object.entries(captured.presets)) {
			expect(preset?.type, id).toBe(layered.includes(id) ? 'layered' : 'simple')
		}
	})

	it('never offers the deprecated multi-state feedbacks', () => {
		const deprecated = [
			'group_Based_Advanced',
			'index_Based_Advanced',
			'user_Name_Based_Advanced',
			'gallery_Based_Advanced',
		]
		for (const [id, preset] of Object.entries(captured.presets) as [string, any][]) {
			const feedbacks = (preset.feedbacks as any[]).flatMap((f) => (f.children ? f.children.default : [f]))
			for (const f of feedbacks) expect(deprecated, `${id} uses ${f.feedbackId}`).not.toContain(f.feedbackId)
		}
	})

	it('keeps the v1 preset ids and their former categories', () => {
		const { placement } = captured
		expect(placement.get('Caller')?.sectionName).toBe('Select from Participants')
		expect(placement.get('Gallery_position')?.sectionName).toBe('Select from Gallery')
		expect(placement.get('Send_Chat_Everyone')?.sectionName).toBe('Chat Actions')
		expect(placement.get('Replace_group_Group 2')?.sectionName).toBe('Manage Selections of Groups')
		expect(placement.get('Group2_Position')?.sectionName).toBe('Select Group 2 participants')
		expect(placement.get('Group1_Position')?.sectionName).toBe('Select Spotlights participants')
		expect(placement.get('Select_Output_1')?.sectionName).toBe('ZoomISO Selections')
		expect(placement.get('set_user_to_output_1')?.sectionName).toBe('ZoomISO Actions')
	})

	it('references only existing actions and feedbacks, giving every option they define', () => {
		instance.setActionDefinitions = vi.fn()
		UpdateActions(instance)
		const actionDefs = (instance.setActionDefinitions as any).mock.calls[0][0] as Record<string, any>
		const feedbackDefs: Record<string, any> = GetFeedbacks(instance)
		const optionIds = (def: any): string[] =>
			(def.options ?? []).filter((o: any) => o.type !== 'static-text').map((o: any) => o.id)

		for (const [id, preset] of Object.entries(captured.presets) as [string, any][]) {
			for (const step of preset.steps) {
				for (const action of [...(step.down as any[]), ...(step.up as any[])]) {
					const def = actionDefs[action.actionId]
					expect(def, `${id}: action ${action.actionId}`).toBeDefined()
					expect(Object.keys(action.options).sort(), `${id}: ${action.actionId} options`).toEqual(optionIds(def).sort())
				}
			}
			// layered presets nest conditions inside internal logic feedbacks; check the module feedbacks they hold
			const feedbacks = (preset.feedbacks as any[]).flatMap((f) =>
				f.feedbackId === 'internal:logicOperator' ? f.children.default : [f],
			)
			for (const feedback of feedbacks) {
				const def = feedbackDefs[feedback.feedbackId]
				expect(def, `${id}: feedback ${feedback.feedbackId}`).toBeDefined()
				expect(Object.keys(feedback.options).sort(), `${id}: ${feedback.feedbackId} options`).toEqual(
					optionIds(def).sort(),
				)
				// v2: only boolean feedbacks carry a style in simple presets (layered presets use styleOverrides)
				if (preset.type !== 'simple') continue
				if (def.type === 'boolean') expect(feedback.style).toBeDefined()
				else expect(feedback.style).toBeUndefined()
			}
		}
	})
})

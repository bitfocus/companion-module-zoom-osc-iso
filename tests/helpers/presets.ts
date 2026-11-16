import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../../src/index.js'

/** Where a preset is listed in the v2 structure: its section, and the group inside it. */
export interface PresetPlacement {
	sectionId: string
	sectionName: string
	groupId: string
	groupName: string
}

export interface CapturedPresets {
	structure: CompanionPresetSection<ModuleSchema>[]
	presets: CompanionPresetDefinitions<ModuleSchema>
	/** Preset id -> where it appears. A preset missing from here is never shown by Companion. */
	placement: Map<string, PresetPlacement>
	/** Every listed preset id, in order (duplicates kept so tests can detect them) */
	listed: string[]
}

/** Reads the first `setPresetDefinitions(structure, presets)` call off a mocked instance. */
export function capturePresets(setPresetDefinitions: unknown): CapturedPresets {
	const [structure, presets] = (setPresetDefinitions as { mock: { calls: unknown[][] } }).mock.calls[0] as [
		CompanionPresetSection<ModuleSchema>[],
		CompanionPresetDefinitions<ModuleSchema>,
	]

	const placement = new Map<string, PresetPlacement>()
	const listed: string[] = []
	for (const section of structure) {
		for (const entry of section.definitions) {
			const where = { sectionId: section.id, sectionName: section.name }
			if (typeof entry === 'string') {
				listed.push(entry)
				placement.set(entry, { ...where, groupId: '', groupName: '' })
			} else if (entry.type === 'simple') {
				for (const id of entry.presets) {
					listed.push(id)
					placement.set(id, { ...where, groupId: entry.id, groupName: entry.name })
				}
			} else {
				listed.push(entry.presetId)
				placement.set(entry.presetId, { ...where, groupId: entry.id, groupName: entry.name })
			}
		}
	}

	return { structure, presets, placement, listed }
}

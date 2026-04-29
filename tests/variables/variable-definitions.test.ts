import { describe, expect, it } from '@jest/globals'
import { initVariableDefinitions } from '../../src/variables/variable-definitions.js'
import { createMockInstance } from '../helpers/mock-instance.js'

describe('initVariableDefinitions', () => {
	it('builds the setVariableDefinitions record directly with unchanged variable ids', () => {
		const instance = createMockInstance()
		instance.config.enableVariablesForEachUser = true
		instance.config.enableVariablesForParticipants = true
		instance.ZoomGroupData = [
			{ groupName: 'Hosts', users: [] },
			{ groupName: 'Spotlights', users: [] },
			{ groupName: 'Group 2', users: [] },
		]
		instance.ZoomUserData = {
			42: { zoomId: 42, userName: 'Alice', targetIndex: 0, galleryIndex: 0, users: [] } as never,
		}
		instance.ZoomOutputData = {
			1: { outputNumber: 1 } as never,
		}
		instance.ZoomAudioRoutingData = {
			2: { channel: 2 } as never,
		}
		instance.ZoomAudioLevelData = {
			3: { zoomId: 3, audioLevel: 10 } as never,
		}

		initVariableDefinitions(instance)

		const definitions = (instance.setVariableDefinitions as jest.Mock).mock.calls[0][0] as Record<
			string,
			{ name: string }
		>
		expect(definitions.zoomVersion).toEqual({ name: 'Zoom version' })
		expect(definitions.Group0Position1).toEqual({ name: 'Group0 Position 1' })
		expect(definitions.Group2Position1).toEqual({ name: 'Group2 Position 1' })
		expect(definitions.CallersInGroup2).toEqual({ name: 'Callers In Group 2' })
		expect(definitions['42']).toEqual({ name: 'name' })
		expect(definitions.Output1name).toEqual({ name: 'Output 1 name' })
		expect(definitions.OutputAudio2mode).toEqual({ name: 'Output Audio Channel 2 mode' })
		expect(definitions.Channel3).toEqual({ name: 'Channel 3 audiolevel' })
		expect(definitions.GalleryPosition01).toEqual({ name: 'Gallery Position 1' })
		expect(definitions.Participant001).toEqual({ name: 'Participant 1' })
	})
})

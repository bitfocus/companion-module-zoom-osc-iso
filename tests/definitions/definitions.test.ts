import { describe, it, expect, beforeAll, vi } from 'vitest'
import { createMockInstance, type MockModuleInstance } from '../helpers/mock-instance.js'
import { UpdateActions } from '../../src/actions.js'
import { GetFeedbacks } from '../../src/feedback.js'

/**
 * Options that v1 passed through parseVariablesInString, per action/feedback id.
 * v2 only parses variables for textinput fields with useVariables: true, so each of these must keep it.
 */
const PARSED_IN_V1: Record<string, string[]> = {
	createBreakoutRoom: ['name'],
	deleteBreakoutRoom: ['name'],
	SetWindowPosition: ['userName'],
	SetWindowSize: ['userName'],
	sendAChatViaDM: ['message', 'userName'],
	customCommand: ['path'],
	startMeeting: ['meetingID', 'name', 'password'],
	joinMeeting: ['meetingID', 'name', 'password'],
	sendAChatToEveryone: ['message'],
	muteAllExcept: ['userName'],
	pin: ['userName'],
	addPin: ['userName'],
	unPin: ['userName'],
	pin2: ['userName'],
	unPin2: ['userName'],
	togglePin: ['userName'],
	togglePin2: ['userName'],
	turnVideoOn: ['userName'],
	turnVideoOff: ['userName'],
	toggleVideoState: ['userName'],
	mute: ['userName'],
	unmute: ['userName'],
	toggleMuteState: ['userName'],
	sendAChatToSocialStream: ['message', 'name'],
	spotLight: ['userName'],
	addSpotlight: ['userName'],
	unSpotLight: ['userName'],
	toggleSpotlight: ['userName'],
	allowWebinarAttendeeToSpeak: ['userName'],
	disallowToSpeak: ['userName'],
	admitSomeoneFromWaitingRoom: ['userName'],
	sendSomeoneToWaitingRoom: ['userName'],
	sendParticipantToBreakoutRoom: ['userName'],
	removeParticipantFromBreakoutRoom: ['userName'],
	assignParticipantToBreakoutRoom: ['breakoutName', 'userName'],
	unassignParticipantFromBreakoutRoom: ['userName'],
	returnSelfToMainMeeting: ['userName'],
	output_ISO: ['userName'],
	audio_ISO: ['userName'],
	select_User_By_Name: ['name'],
	saveParticipants: ['filepath'],
	saveGroupToFile: ['filepath'],
	loadGroupFromFile: ['filepath'],
	remove_From_Group: ['userName'],
	rename_Group: ['name'],
	set_Output_Name: ['name'],
	rename: ['name'],
	renameByName: ['name', 'newName'],
	bulk_Rename: ['filepath'],
	makeHost: ['userName'],
	makeCoHost: ['userName'],
	revokeCoHost: ['userName'],
	makePanelist: ['userName'],
	makeAttendee: ['userName'],
	ejectParticipant: ['userName'],
	allowToRecord: ['userName'],
	disallowToRecord: ['userName'],
	ZAKJoinMeeting: ['meetingID', 'name', 'zak'],
	ZAKStartMeeting: ['meetingID', 'name', 'zak'],
	enableOriginalSound: ['userName'],
	disableOriginalSound: ['userName'],
	enableMirrorVideo: ['userName'],
	disableMirrorVideo: ['userName'],
	setVirtualBackground: ['userName'],
	setVideoFilter: ['userName'],
	setCameraDevice: ['userName'],
	setSpeakerVolume: ['userName'],
	setSpeakerDevice: ['userName'],
	setMicDevice: ['userName'],
	raiseHand: ['userName'],
	lowerHand: ['userName'],
	toggleHand: ['userName'],
	user_Name_Based: ['name'],
	user_Name_Based_Advanced: ['name'],
}

describe('action and feedback definitions (v2)', () => {
	let defs: Record<string, any>

	beforeAll(() => {
		const instance: MockModuleInstance = createMockInstance()
		instance.ZoomGroupData = [
			{ groupName: 'Hosts', users: [] },
			{ groupName: 'Spotlights', users: [] },
			{ groupName: 'Group 2', users: [] },
		]
		instance.setActionDefinitions = vi.fn()
		UpdateActions(instance)
		defs = {
			...((instance.setActionDefinitions as any).mock.calls[0][0] as Record<string, any>),
			...(GetFeedbacks(instance) as Record<string, any>),
		}
	})

	it('uses unique option ids within each definition', () => {
		for (const [id, def] of Object.entries(defs)) {
			const ids = (def.options as { id: string; type: string }[])
				.filter((o) => o.type !== 'static-text')
				.map((o) => o.id)
			expect(new Set(ids).size, id).toBe(ids.length)
		}
	})

	it('keeps variable parsing for every field v1 parsed', () => {
		for (const [id, keys] of Object.entries(PARSED_IN_V1)) {
			expect(defs[id], id).toBeDefined()
			for (const key of keys) {
				const field = defs[id].options.find((o: { id: string }) => o.id === key)
				expect(field, `${id}.${key}`).toMatchObject({ type: 'textinput', useVariables: true })
			}
		}
	})

	it('declares affectedProperties on every advanced feedback', () => {
		for (const def of Object.values(defs)) {
			if (def.type === 'advanced') expect(def.affectedProperties).toEqual(['png64'])
		}
	})
})

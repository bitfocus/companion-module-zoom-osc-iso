import { describe, it, expect } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserWebinar, ActionIdUserWebinar } from '../../src/actions/action-user-webinars.js'

describe('GetActionsUserWebinar', () => {
	// ── allowWebinarAttendeeToSpeak ───────────────────────────────────────────
	describe('allowWebinarAttendeeToSpeak', () => {
		describe('with userName override', () => {
			it('sends /zoom/userName/allowToSpeak', async () => {
				const instance = createMockInstance()
				const actions = GetActionsUserWebinar(instance)
				await (actions[ActionIdUserWebinar.allowWebinarAttendeeToSpeak] as any).callback(
					{ options: { userName: 'John Smith' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/allowToSpeak', [
					{ type: 's', value: 'John Smith' },
				])
			})
		})

		describe('with single selected caller', () => {
			it('sends /zoom/zoomID/allowToSpeak', async () => {
				const instance = createMockInstance({ selectedCallers: [1001] })
				const actions = GetActionsUserWebinar(instance)
				await (actions[ActionIdUserWebinar.allowWebinarAttendeeToSpeak] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/allowToSpeak', [
					{ type: 'i', value: 1001 },
				])
			})
		})

		describe('with multiple selected callers', () => {
			it('sends /zoom/users/zoomID/allowToSpeak', async () => {
				const instance = createMockInstance({ selectedCallers: [1001, 1002] })
				const actions = GetActionsUserWebinar(instance)
				await (actions[ActionIdUserWebinar.allowWebinarAttendeeToSpeak] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/allowToSpeak', [
					{ type: 'i', value: 1001 },
					{ type: 'i', value: 1002 },
				])
			})
		})
	})

	// ── disallowToSpeak ───────────────────────────────────────────────────────
	describe('disallowToSpeak', () => {
		describe('with userName override', () => {
			it('sends /zoom/userName/disallowToSpeak', async () => {
				const instance = createMockInstance()
				const actions = GetActionsUserWebinar(instance)
				await (actions[ActionIdUserWebinar.disallowToSpeak] as any).callback(
					{ options: { userName: 'Jane Doe' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/disallowToSpeak', [
					{ type: 's', value: 'Jane Doe' },
				])
			})
		})

		describe('with single selected caller', () => {
			it('sends /zoom/zoomID/disallowToSpeak', async () => {
				const instance = createMockInstance({ selectedCallers: [2002] })
				const actions = GetActionsUserWebinar(instance)
				await (actions[ActionIdUserWebinar.disallowToSpeak] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/disallowToSpeak', [
					{ type: 'i', value: 2002 },
				])
			})
		})

		describe('with multiple selected callers', () => {
			it('sends /zoom/users/zoomID/disallowToSpeak', async () => {
				const instance = createMockInstance({ selectedCallers: [2002, 2003] })
				const actions = GetActionsUserWebinar(instance)
				await (actions[ActionIdUserWebinar.disallowToSpeak] as any).callback(
					{ options: { userName: '' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/disallowToSpeak', [
					{ type: 'i', value: 2002 },
					{ type: 'i', value: 2003 },
				])
			})
		})
	})
})

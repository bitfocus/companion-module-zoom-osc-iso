import { describe, it, expect } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserChat, ActionIdUserChat } from '../../src/actions/action-user-chat.js'

describe('GetActionsUserChat', () => {
	// ── sendAChatViaDM ────────────────────────────────────────────────────────
	describe('sendAChatViaDM', () => {
		describe('with userName override', () => {
			it('sends /zoom/userName/chat with message arg', async () => {
				const instance = createMockInstance()
				const actions = GetActionsUserChat(instance)
				await (actions[ActionIdUserChat.sendAChatViaDM] as any).callback(
					{ options: { userName: 'John Smith', message: 'Hello World' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/chat', [
					{ type: 's', value: 'John Smith' },
					{ type: 's', value: 'Hello World' },
				])
			})
		})

		describe('with single selected caller', () => {
			it('sends /zoom/zoomID/chat with message arg', async () => {
				const instance = createMockInstance({ selectedCallers: [1001] })
				const actions = GetActionsUserChat(instance)
				await (actions[ActionIdUserChat.sendAChatViaDM] as any).callback(
					{ options: { userName: '', message: 'Hello World' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/chat', [
					{ type: 'i', value: 1001 },
					{ type: 's', value: 'Hello World' },
				])
			})
		})

		describe('with multiple selected callers', () => {
			it('sends /zoom/users/zoomID/chat with message arg', async () => {
				const instance = createMockInstance({ selectedCallers: [1001, 1002] })
				const actions = GetActionsUserChat(instance)
				await (actions[ActionIdUserChat.sendAChatViaDM] as any).callback(
					{ options: { userName: '', message: 'Broadcast message' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/users/zoomID/chat', [
					{ type: 'i', value: 1001 },
					{ type: 'i', value: 1002 },
					{ type: 's', value: 'Broadcast message' },
				])
			})
		})

		describe('message with escaped newlines', () => {
			it('converts \\n escape sequences to real newlines', async () => {
				const instance = createMockInstance({ selectedCallers: [1001] })
				const actions = GetActionsUserChat(instance)
				await (actions[ActionIdUserChat.sendAChatViaDM] as any).callback(
					{ options: { userName: '', message: 'Line 1\\nLine 2' } } as any,
					{} as any,
				)
				expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/chat', [
					{ type: 'i', value: 1001 },
					{ type: 's', value: 'Line 1\nLine 2' },
				])
			})
		})
	})
})

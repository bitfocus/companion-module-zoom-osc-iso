import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest'
import { createMockInstance } from './helpers/mock-instance.js'
import { socialStreamApi } from '../src/socialstream.js'

describe('socialStreamApi.postMessage', () => {
	let instance: ReturnType<typeof createMockInstance>
	let fetchMock: Mock<typeof fetch>

	beforeEach(() => {
		instance = createMockInstance()
		instance.config.enableSocialStream = true
		instance.config.socialStreamId = 'session-id'
		fetchMock = vi.fn<typeof fetch>(async () => new Response('ok'))
		vi.stubGlobal('fetch', fetchMock)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('POSTs the chat as JSON to the session URL', async () => {
		await socialStreamApi.postMessage('Alice', 'Hello', instance)

		expect(fetchMock).toHaveBeenCalledTimes(1)
		const [url, init] = fetchMock.mock.calls[0]
		expect(url).toBe('https://io.socialstream.ninja/session-id')
		expect(init?.method).toBe('POST')
		expect(init?.headers).toEqual({ 'Content-Type': 'application/json' })
		expect(init?.signal).toBeInstanceOf(AbortSignal)
		expect(JSON.parse(init?.body as string)).toEqual({
			chatname: 'Alice',
			chatmessage: 'Hello',
			textonly: false,
			chatimg: null,
			type: 'zoom',
		})
	})

	it('normalises line breaks into <br> and trims the message', async () => {
		await socialStreamApi.postMessage('Alice', '  line1\r\nline2\n\n\n\nline3  ', instance)

		const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string)
		expect(body.chatmessage).toBe('line1<br>line2<br><br>line3')
	})

	it('does not send when Social Stream is disabled', async () => {
		instance.config.enableSocialStream = false
		await socialStreamApi.postMessage('Alice', 'Hello', instance)
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('does not send when the session id is empty', async () => {
		instance.config.socialStreamId = ''
		await socialStreamApi.postMessage('Alice', 'Hello', instance)
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('does not send an empty name or message', async () => {
		await socialStreamApi.postMessage('', 'Hello', instance)
		await socialStreamApi.postMessage('Alice', '', instance)
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('throws on a non-2xx response', async () => {
		fetchMock.mockResolvedValueOnce(new Response('nope', { status: 500, statusText: 'Internal Server Error' }))
		await expect(socialStreamApi.postMessage('Alice', 'Hello', instance)).rejects.toThrow(
			'Social Stream request failed: HTTP 500 Internal Server Error',
		)
	})

	it('propagates network errors', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'))
		await expect(socialStreamApi.postMessage('Alice', 'Hello', instance)).rejects.toThrow('fetch failed')
	})
})

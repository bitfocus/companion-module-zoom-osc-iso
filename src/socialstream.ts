import type ModuleInstance from './index.js'

export class socialStreamApi {
	static postMessage = async (name: string, message: string, instance: ModuleInstance): Promise<void> => {
		if (
			instance.config.enableSocialStream &&
			instance.config.socialStreamId.length > 0 &&
			message.length > 0 &&
			name.length > 0
		) {
			// instance.log('debug', `chat -- ${name} - ${message}`)
			// instance.log(
			// 	'debug',
			// 	`chat -- ${name} - ${message
			// 		.replace(/\r\n/g, '\n')
			// 		.replace(/\n{3,}/g, '\n\n')
			// 		.trim()
			// 		.replace(/\n/g, '<br>')}`,
			// )
			const socialStreamId = instance.config.socialStreamId
			const url = `https://io.socialstream.ninja/${socialStreamId}`
			const body = {
				chatname: name,
				chatmessage: message
					.replace(/\r\n/g, '\n') // standardize line endings
					.replace(/\n{3,}/g, '\n\n') // remove more than 2 line breaks
					.trim() // remove leading/trailing whitespace
					.replace(/\n/g, '<br>'), // replace line breaks with html line breaks
				textonly: false,
				chatimg: null,
				type: 'zoom',
			}
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(15_000),
			})
			// fetch resolves on any HTTP status; throw on non-2xx like got did so callers still see failures
			if (!res.ok) {
				throw new Error(`Social Stream request failed: HTTP ${res.status} ${res.statusText}`.trim())
			}
		}
	}
}

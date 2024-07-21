import got from 'got-cjs'
import { InstanceBaseExt } from './utils.js'
import { ZoomConfig } from './config.js'

export class socialStreamApi {
	static postMessage = async (name: string, message: string, instance: InstanceBaseExt<ZoomConfig>): Promise<void> => {
		if (
			instance.config.enableSocialStream &&
			instance.config.socialStreamId.length > 0 &&
			message.length > 0 &&
			name.length > 0
		) {
			//instance.log('debug', `chat -- ${name} - ${message}`)
			const socialStreamId = instance.config.socialStreamId
			const url = `https://io.socialstream.ninja/${socialStreamId}`
			const body = {
				chatname: name,
				chatmessage: message,
				textonly: false,
				chatimg: null,
				type: 'zoom',
			}
			const options = {
				json: body,
				headers: {
					'Content-Type': 'application/json',
				},
			}
			await got.post(url, options)
		}
	}
}

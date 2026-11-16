/**
 * Types for the parts of the `osc` package (osc.js, CommonJS, ships no types) that this module uses.
 * Only src/osc/transport.ts imports the package; everything else goes through that ESM wrapper.
 */
declare module 'osc' {
	import { EventEmitter } from 'node:events'

	namespace osc {
		/**
		 * One argument as osc reads it with `metadata: true`: its OSC type tag and value, for example
		 * { type: 'i', value: 3 }, { type: 'f', value: 1 } (a decimal, even when it's a whole number),
		 * { type: 's', value: 'Alice' }, { type: 'T', value: true }, and a 64-bit integer as
		 * { type: 'h', value: { high, low } }.
		 * (osc reads an OSC array, [...] in the type tags, as a nested list; ZoomOSC/ISO doesn't send any.)
		 */
		interface TypedArgument {
			type: string
			value: unknown
		}

		interface Message {
			address: string
			args: TypedArgument[]
		}

		interface TimeTag {
			raw: [number, number]
			native: number
		}

		interface Bundle {
			timeTag: TimeTag
			packets: Array<Message | Bundle>
		}

		/** Where a packet came from */
		interface PacketInfo {
			address: string
			family: string
			port: number
			size: number
		}

		/** What can be sent: typed arguments are written as given, so integers and decimals stay apart */
		interface OutgoingMessage {
			address: string
			args: Array<{ type: string; value: unknown }>
		}

		interface UDPPortOptions {
			/** Address to listen on (osc's default is 127.0.0.1) */
			localAddress?: string
			localPort?: number
			/** Default destination for send() */
			remoteAddress?: string
			remotePort?: number
			/** Give each argument with its type tag, as TypedArgument, instead of a bare value */
			metadata?: boolean
			broadcast?: boolean
		}

		/**
		 * Sends and receives OSC over one UDP socket. Events:
		 * - 'ready' once the socket is bound and listening
		 * - 'message' for every message, including each one inside a bundle
		 * - 'bundle' for a bundle as a whole (its messages also fire 'message')
		 * - 'raw' with each packet's original bytes, before decoding
		 * - 'error' for socket errors and packets that can't be decoded
		 * - 'close' once the socket has closed (only after it was bound)
		 */
		class UDPPort extends EventEmitter {
			constructor(options: UDPPortOptions)
			readonly options: UDPPortOptions
			open(): void
			close(): void
			send(packet: OutgoingMessage, address?: string, port?: number): void

			on(event: 'ready' | 'close', listener: () => void): this
			on(event: 'message', listener: (message: Message, timeTag: TimeTag | undefined, info: PacketInfo) => void): this
			on(event: 'bundle', listener: (bundle: Bundle, timeTag: TimeTag | undefined, info: PacketInfo) => void): this
			on(event: 'raw', listener: (data: Uint8Array, info: PacketInfo) => void): this
			on(event: 'error', listener: (error: Error & { code?: string }) => void): this
			once(event: 'ready' | 'close', listener: () => void): this
		}
	}

	// the package is CommonJS: module.exports is this namespace (UDPPort among the rest of osc.js)
	export = osc
}

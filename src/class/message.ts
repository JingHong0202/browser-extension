/* eslint-disable @typescript-eslint/no-unused-vars */
import { TypeList } from '@/types/bookmark'
import { SendOptions } from '@/types/message'
import polyfill from 'webextension-polyfill'
import Events from './event'

export default class MessageUtils<T> {
	data!: T
	eventsHandler: Events
	constructor() {
		polyfill.runtime.onMessage.addListener(this.onMessage.bind(this))
		this.eventsHandler = new Events()
	}

	async init(initCallBack: () => Promise<T>) {
		this.data = await initCallBack()
	}

	sendMessage(options: SendOptions) {
		if (options.to === 'background') {
			return polyfill.runtime.sendMessage(polyfill.runtime.id, {
				type: options.type,
				data: options.data
			})
		} else {
			polyfill.tabs.query({ currentWindow: true, active: true }).then(tabs => {
				tabs.forEach(tab => {
					polyfill.tabs.sendMessage(tab.id!, {
						type: options.type,
						data: options.data
					})
				})
			})
		}
	}

	onMessage(
		data: TypeList<T>,
		sender: polyfill.Runtime.MessageSender,
		sendResponse: (...args: unknown[]) => void
	) {
		switch (data.type) {
			case 'command':
				this.eventsHandler.trigger({ eventName: 'command' }, data)
				break
			default:
				// console.log(data)
				this.eventsHandler.trigger({ eventName: 'message' }, data)
			// this.data = data.data
			// }
		}
	}
}

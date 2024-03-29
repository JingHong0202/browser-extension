import polyfill from 'webextension-polyfill'
import MessageUtils from './message'
import type { BookMarkAction } from '@/types/bookmark'
import { TypeList } from '@/types/bookmark'

export default class BookMarkUtils extends MessageUtils<
	polyfill.Bookmarks.BookmarkTreeNode[]
> {
	constructor() {
		// init step
		super()
		/**
		 *  only title and url changes trigger this.
		 */
		polyfill.bookmarks.onChanged.addListener(() => {
			this.getTree({ type: 'changed' })
		})

		polyfill.bookmarks.onCreated.addListener(() => {
			this.getTree({ type: 'created' })
		})
		polyfill.bookmarks.onMoved.addListener(() => {
			this.getTree({ type: 'move' })
		})
		polyfill.bookmarks.onRemoved.addListener(() => {
			this.getTree({ type: 'remove' })
		})
		// polyfill.bookmarks.onImportEnded.addListener(() => {
		//   this.getTree({ type: 'importended' })
		// })
		this.initData()
	}

	onMessage(
		data: TypeList<unknown>,
		sender: polyfill.Runtime.MessageSender,
		sendResponse: (...args: unknown[]) => void
	) {
		switch (data.type) {
			case 'init':
				sendResponse(this.data)
				break
			case 'search':
				sendResponse(polyfill.bookmarks.search(<string>data.data))
				break
			case 'select':
				polyfill.tabs.create({
					url: (<polyfill.Bookmarks.BookmarkTreeNode>data.data).url,
					active: false
				})
				break
		}
	}

	initData() {
		this.init(async () => {
			return await this.getTree({ type: 'init' })
		})
	}

	async getTree({ type }: { type?: BookMarkAction }) {
		try {
			const res = await polyfill.bookmarks.getTree()
			this.sendMessage({ type: type!, data: res, to: 'content' })
			return res
		} catch (error) {
			throw Error(String(error))
		}
	}
}

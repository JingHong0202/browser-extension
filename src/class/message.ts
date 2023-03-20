import polyfill from 'webextension-polyfill'
import type BookMarkUtils from './bookmark'

export default class MessageUtils {
  tree!: polyfill.Bookmarks.BookmarkTreeNode[]
  constructor() {
    polyfill.runtime.onMessage.addListener(this.onMessage.bind(this))
  }

  async init(child: BookMarkUtils) {
    this.tree = (await child.getTree({ sync: true }))!
  }

  send(type: string, data: polyfill.Bookmarks.BookmarkTreeNode[]) {
    polyfill.tabs.query({ currentWindow: true, active: true }).then(tabs => {
      tabs.forEach(tab => {
        polyfill.tabs.sendMessage(tab.id!, {
          type,
          data,
        })
      })
    })
  }

  onMessage(
    { type }: any,
    sender: polyfill.Runtime.MessageSender,
    sendResponse: (...args: unknown[]) => void
  ) {
    switch (type) {
      case 'init':
        sendResponse(this.tree)
        break
      default:
        console.log(arguments)
    }
  }
}

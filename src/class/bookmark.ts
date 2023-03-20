import polyfill from 'webextension-polyfill'
import MessageUtils from './message'

export default class BookMarkUtils extends MessageUtils {
  constructor() {
    // init step

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
    ;(<any>super()).init(this)
  }

  async getTree({ type, sync }: { type?: string; sync?: boolean }) {
    if (!sync) {
      polyfill.bookmarks.getTree().then(res => {
        this.send(type!, res)
      })
    } else {
      try {
        const res = await polyfill.bookmarks.getTree()
        return res
      } catch (error) {
        throw Error(String(error))
      }
    }
  }
}

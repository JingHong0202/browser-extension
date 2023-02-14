import MessageUtils from './message';


export default class BookMarkUtils extends MessageUtils {
  constructor() {
    // init step

    /**
     *  only title and url changes trigger this.
     */
    chrome.bookmarks.onChanged.addListener(() => {
      this.getTree('changed');
    });

    chrome.bookmarks.onCreated.addListener(() => {
      this.getTree('created');
    });
    chrome.bookmarks.onMoved.addListener(() => {
      this.getTree('move');
    });
    chrome.bookmarks.onRemoved.addListener(() => {
      this.getTree('remove');
    });
    chrome.bookmarks.onImportEnded.addListener(() => {
      this.getTree('importended');
    });
    super().init(this);
  }

  getTree(type, sync) {
    if (!sync) {
      chrome.bookmarks.getTree(res => {
        this.send(type, res);
      });
    } else {
      return new Promise((resolve, reject) => {
        chrome.bookmarks.getTree(res => {
          (res && resolve(res)) || reject('getTree sync error');
        });
      });
    }
  }
}

export default class MessageUtils {
  constructor() {
    chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
  }

  async init(child) {
    let tree = await child.getTree('init', true);
    chrome.runtime.onMessage.addListener(this.onMessage.bind(this, tree));
  }

  send(type, data) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type,
          data,
        });
      });
    });
  }

  onMessage(args, { type }, sender, sendResponse) {
    switch (type) {
      case 'init':
        sendResponse(args);
        args = null;
        break;
      default:
        console.log(arguments);
    }
  }
}

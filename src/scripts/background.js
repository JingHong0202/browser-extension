// chrome.bookmarks.getTree(function (res) {
//   console.log(res);
// });
/**
 * only title and url changes trigger this.
 */

chrome.bookmarks.onChanged.addListener(function () {
  chrome.bookmarks.getTree(function (res) {
    send('changed', res);
  });
});

chrome.bookmarks.onCreated.addListener(function () {
  chrome.bookmarks.getTree(function (res) {
    send('created', res);
  });
});
chrome.bookmarks.onMoved.addListener(function () {
  chrome.bookmarks.getTree(function (res) {
    send('move', res);
  });
});
chrome.bookmarks.onRemoved.addListener(function () {
  chrome.bookmarks.getTree(function (res) {
    send('remove', res);
  });
});
chrome.bookmarks.onImportEnded.addListener(function () {
  chrome.bookmarks.getTree(function (res) {
    send('importended', res);
  });
});

async function send(type, data) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabInfo) {
    chrome.tabs.sendMessage(tabInfo[0].id, {
      type,
      data,
    });
  });
}

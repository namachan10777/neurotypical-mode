const openTab = (query?: string) => {
  if (query) {
    chrome.tabs.create({ url: `https://www.google.com/search?q=${query}` });
  }
}

chrome.runtime.onInstalled.addListener(() : void => {
  chrome.contextMenus.create({
    id: "sample",
    title: "選択した文字列を検索する",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, _): void => {
  openTab(info.selectionText);
});

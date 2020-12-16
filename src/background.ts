chrome.runtime.onConnect.addListener(function(port) {
  console.log(port);
  port.onMessage.addListener(function(msg) {
    console.log(msg);
  });
});

chrome.runtime.onInstalled.addListener(function() {
  let twitterRe = /https:\/\/(tweetdeck\.)?twitter\.com.*/;
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.url) {
      console.log(changeInfo.url);
      if (twitterRe.test(changeInfo.url)) {
        console.log("close");
        chrome.tabs.remove(tabId);
      }
    }
  });
  chrome.tabs.onCreated.addListener(function(tab) {
    console.log(tab.url);
    if (tab.id && tab.url && twitterRe.test(tab.url)) {
      chrome.tabs.remove(tab.id);
    }
  });
});

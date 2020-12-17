let allow = ["manaba.tsukuba.ac.jp", "web.microsoftstream.com"];
let forbidden = ["tweetdeck.twitter.com", "twitter.com"];
let allowOrForbidden = "forbidden";
let enable = false;

function postUpdatedState(port: chrome.runtime.Port) {
  port.postMessage({
    typeName: "updateState",
    allow: allow,
    forbidden: forbidden,
    allowOrForbidden: allowOrForbidden,
    enable: enable,
  });
}

chrome.runtime.onConnect.addListener(function (port) {
  console.log(port);
  postUpdatedState(port);
  port.onMessage.addListener(function (msg) {
    if (msg.typeName == "updateDomainList") {
      if (msg.listName == "allow") {
        allow = msg.domains;
      } else if (msg.listName == "forbidden") {
        forbidden = msg.domains;
      }
      postUpdatedState(port);
    } else if (msg.typeName == "switchAllowOrForbidden") {
      allowOrForbidden = msg.allowOrForbidden;
      postUpdatedState(port);
    } else if (msg.typeName == "enableMode") {
      enable = msg.enable;
      postUpdatedState(port);
    }
  });
});

chrome.runtime.onInstalled.addListener(function () {
  let twitterRe = /https:\/\/(tweetdeck\.)?twitter\.com.*/;
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.url) {
      console.log(changeInfo.url);
      if (twitterRe.test(changeInfo.url)) {
        console.log("close");
        chrome.tabs.remove(tabId);
      }
    }
  });
  chrome.tabs.onCreated.addListener(function (tab) {
    console.log(tab.url);
    if (tab.id && tab.url && twitterRe.test(tab.url)) {
      chrome.tabs.remove(tab.id);
    }
  });
});

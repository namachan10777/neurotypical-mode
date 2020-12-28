import {
  FrontendToBackgroundMsg,
  BackgroundToFrontendMsg,
  AllowOrForbidden,
} from "./msg";

let allow = ["manaba.tsukuba.ac.jp", "web.microsoftstream.com"];
let forbidden = ["tweetdeck.twitter.com", "twitter.com"];
let allowOrForbidden: AllowOrForbidden = "forbidden";
let enable = false;

function postUpdatedState(port: chrome.runtime.Port) {
  const msg: BackgroundToFrontendMsg = {
    typeName: "updateState",
    allow: allow,
    forbidden: forbidden,
    allowOrForbidden: allowOrForbidden,
    enable: enable,
  };
  port.postMessage(msg);
}

chrome.runtime.onConnect.addListener(function (port) {
  postUpdatedState(port);
  port.onMessage.addListener(function (msg: FrontendToBackgroundMsg) {
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

function is_matched(url: string, list: Array<string>): boolean {
  for (let i = 0; i < list.length; i++) {
    const domain = list[i];
    if (
      url.indexOf("https://" + domain) == 0 ||
      url.indexOf("http://" + domain) == 0
    )
      return true;
  }
  return false;
}

function is_allowed(url: string): boolean {
  if (allowOrForbidden == "allow") {
    return is_matched(url, allow);
  } else {
    return !is_matched(url, forbidden);
  }
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.url) {
      if (enable && !is_allowed(changeInfo.url)) {
        chrome.tabs.remove(tabId);
      }
    }
  });
  chrome.tabs.onCreated.addListener(function (tab) {
    if (enable && tab.id && tab.url && !is_allowed(tab.url)) {
      chrome.tabs.remove(tab.id);
    }
  });
});

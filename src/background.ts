import {
  FrontendToBackgroundMsg,
  BackgroundToFrontendMsg,
  AllowOrForbidden,
} from "./msg";

let allow = ["manaba.tsukuba.ac.jp", "web.microsoftstream.com"];
let forbidden = ["tweetdeck.twitter.com", "twitter.com"];
let allowOrForbidden: AllowOrForbidden = "forbidden";
let secs = 1 * 60 * 60;
let running = false;
let timerId: null | number = null;
let chromeExtPort: chrome.runtime.Port | null = null;

function postUpdatedState() {
  const msg: BackgroundToFrontendMsg = {
    typeName: "updateState",
    allow: allow,
    forbidden: forbidden,
    allowOrForbidden: allowOrForbidden,
    secs: secs,
    running: running,
  };
  if (chromeExtPort) {
    chromeExtPort.postMessage(msg);
  }
}

function processIncomingMsgs(msg: FrontendToBackgroundMsg) {
  if (msg.typeName == "updateDomainList") {
    if (msg.listName == "allow") {
      allow = msg.domains;
    } else if (msg.listName == "forbidden") {
      forbidden = msg.domains;
    }
    postUpdatedState();
  } else if (msg.typeName == "switchAllowOrForbidden") {
    allowOrForbidden = msg.allowOrForbidden;
    postUpdatedState();
  } else if (msg.typeName == "setTimer" && !running) {
    secs = msg.secs;
  } else if (msg.typeName == "runTimer" && !running) {
    running = true;
    timerId = window.setInterval(function () {
      if (secs > 0) {
        secs--;
      } else {
        running = false;
        if (timerId) clearInterval(timerId);
      }
      postUpdatedState();
    }, 1000);
    postUpdatedState();
  } else if (msg.typeName == "stopTimer" && running) {
    running = false;
    if (timerId) {
      clearInterval(timerId);
    }
  }
}

chrome.runtime.onConnect.addListener(function (port) {
  chromeExtPort = port;
  postUpdatedState();
  port.onDisconnect.addListener(function () {
    chromeExtPort = null;
  });
  port.onMessage.addListener(processIncomingMsgs);
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
      if (running && !is_allowed(changeInfo.url)) {
        chrome.tabs.remove(tabId);
      }
    }
  });
  chrome.tabs.onCreated.addListener(function (tab) {
    if (running && tab.id && tab.url && !is_allowed(tab.url)) {
      chrome.tabs.remove(tab.id);
    }
  });
});

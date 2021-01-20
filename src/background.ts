import {
  FrontendToBackgroundMsg,
  BackgroundToFrontendMsg,
  AllowOrForbidden,
} from "./msg";

type State = {
  allow: Array<string>;
  forbidden: Array<string>;
  allowOrForbidden: AllowOrForbidden;
  secs: number;
  running: boolean;
};

let state: State = {
  allow: ["manaba.tsukuba.ac.jp", "web.microsoftstream.com"],
  forbidden: ["tweetdeck.twitter.com", "twitter.com"],
  allowOrForbidden: "forbidden",
  secs: 1 * 60 * 60,
  running: false,
};
let timerId: null | number = null;
let chromeExtPort: chrome.runtime.Port | null = null;

function postUpdatedState() {
  const msg: BackgroundToFrontendMsg = {
    typeName: "updateState",
    allow: state.allow,
    forbidden: state.forbidden,
    allowOrForbidden: state.allowOrForbidden,
    secs: state.secs,
    running: state.running,
  };
  localStorage.setItem("state", JSON.stringify(state));
  localStorage.setItem("timestamp", Date.now().toString());
  if (chromeExtPort) {
    chromeExtPort.postMessage(msg);
  }
}

function startTimer() {
  timerId = window.setInterval(function () {
    if (state.secs > 0) {
      state.secs--;
    } else {
      state.running = false;
      if (timerId) clearInterval(timerId);
    }
    postUpdatedState();
  }, 1000);
  closeAllInvalidTab();
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
  }
}

function processIncomingMsgs(msg: FrontendToBackgroundMsg) {
  if (msg.typeName == "updateDomainList") {
    if (msg.listName == "allow") {
      state.allow = msg.domains;
    } else if (msg.listName == "forbidden") {
      state.forbidden = msg.domains;
    }
    postUpdatedState();
  } else if (msg.typeName == "switchAllowOrForbidden") {
    state.allowOrForbidden = msg.allowOrForbidden;
    closeAllInvalidTab();
    postUpdatedState();
  } else if (msg.typeName == "setTimer" && !state.running) {
    state.secs = msg.secs;
    postUpdatedState();
  } else if (msg.typeName == "runTimer" && !state.running) {
    state.running = true;
    startTimer();
    postUpdatedState();
  } else if (msg.typeName == "stopTimer" && state.running) {
    state.running = false;
    postUpdatedState();
    stopTimer();
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
  if (url.startsWith("chrome://")) return true;
  if (state.allowOrForbidden == "allow") {
    return is_matched(url, state.allow);
  } else {
    return !is_matched(url, state.forbidden);
  }
}

function closeAllInvalidTab() {
  chrome.tabs.query({}, function (tabs) {
    const forbiddenId = [];
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      if (tab.id && tab.url && !is_allowed(tab.url)) {
        forbiddenId.push(tab.id);
      }
    }
    if (forbiddenId.length == tabs.length) {
      chrome.tabs.create({});
    }
    for (let i = 0; i < forbiddenId.length; ++i) {
      chrome.tabs.remove(forbiddenId[i]);
    }
  });
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.url) {
      if (state.running && !is_allowed(changeInfo.url)) {
        chrome.tabs.query({}, function (tabs) {
          if (tabs.length < 2) {
            chrome.tabs.goBack(tabId);
          } else {
            chrome.tabs.remove(tabId);
          }
        });
      }
    }
  });
  chrome.tabs.onCreated.addListener(function (tab) {
    if (state.running && tab.id && tab.url && !is_allowed(tab.url)) {
      chrome.tabs.remove(tab.id);
    }
  });
});

// TODO: verify state
chrome.runtime.onStartup.addListener(function () {
  const state_str = localStorage.getItem("state");
  const timestamp_str = localStorage.getItem("timestamp");
  if (state_str && timestamp_str) {
    state = JSON.parse(state_str);
    state.secs = Math.max(
      0,
      state.secs - (Date.now() - parseInt(timestamp_str, 10)),
    );
  }
  postUpdatedState();
});

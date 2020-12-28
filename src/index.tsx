import * as React from "react";
import * as ReactDOM from "react-dom";
import ControlUI from "./ControlUI";
import {
  AllowOrForbidden,
  FrontendToBackgroundMsg,
  BackgroundToFrontendMsg,
} from "./msg";
import "./index.css";

const port = chrome.runtime.connect("kdlolnhobojjgamhfdcmmanlinacgofa");

interface AppProps {
  port: chrome.runtime.Port;
}

const App: React.FunctionComponent<AppProps> = (props: AppProps) => {
  const [allowList, setAllowList] = React.useState<Array<string>>([]);
  const [forbiddenList, setForbiddenList] = React.useState<Array<string>>([]);
  const [
    allowOrForbidden,
    setAllowOrForbidden,
  ] = React.useState<AllowOrForbidden>("forbidden");
  const [enable, setEnable] = React.useState(false);
  props.port.onMessage.addListener(function (msg: BackgroundToFrontendMsg) {
    if (msg.typeName == "updateState") {
      setAllowList(msg.allow);
      setForbiddenList(msg.forbidden);
      setEnable(msg.enable);
      setAllowOrForbidden(msg.allowOrForbidden);
    }
  });
  const port = function (msg: FrontendToBackgroundMsg) {
    props.port.postMessage(msg);
  };
  return (
    <ControlUI
      allowList={allowList}
      forbiddenList={forbiddenList}
      port={port}
      allowOrForbidden={allowOrForbidden}
      enable={enable}
    />
  );
};

ReactDOM.render(<App port={port} />, document.getElementById("root"));

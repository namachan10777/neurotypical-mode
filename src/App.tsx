import * as React from "react";
import DomainList from "./DomainList";
import {
  BackgroundToFrontendMsg,
  FrontendToBackgroundMsg,
  AllowOrForbidden,
} from "./msg";

export interface Props {
  port: chrome.runtime.Port;
}

const App: React.FunctionComponent<Props> = (props: Props) => {
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
      setAllowOrForbidden(msg.allowOrForbidden);
      setEnable(msg.enable);
      console.log(msg);
    }
  });
  const updateDomainList = (
    allowOrForbidden: AllowOrForbidden,
    domains: string[],
  ) => {
    const msg: FrontendToBackgroundMsg = {
      typeName: "updateDomainList",
      listName: allowOrForbidden,
      domains: domains,
    };
    props.port.postMessage(msg);
  };
  const switchAllowOrForbidden = (allowOrForbidden: AllowOrForbidden) => {
    const msg: FrontendToBackgroundMsg = {
      typeName: "switchAllowOrForbidden",
      allowOrForbidden: allowOrForbidden,
    };
    props.port.postMessage(msg);
  };
  const enableMode = (enable: boolean) => {
    const msg: FrontendToBackgroundMsg = {
      typeName: "enableMode",
      enable: enable,
    };
    props.port.postMessage(msg);
  };
  const animation_class = (mode: AllowOrForbidden) =>
    mode == allowOrForbidden
      ? "domain-list domain-list-expanded"
      : "domain-list";
  return (
    <div className="py-2 container text-lg font-sans">
      <div className="px-2">
        <input
          id="enable-checkbox"
          type="checkbox"
          checked={enable}
          onChange={(e) => enableMode(e.target.checked)}
        />
        <label className="mx-2" htmlFor="enable-checkbox">
          enable
        </label>
      </div>
      <div className="m-0 py-2 flex-col justify-between divide-y divide-gray-300  divide-solid">
        <div className={"p-2" + " " + animation_class("allow")}>
          <input
            type="radio"
            id="allow"
            name="allow_or_forbidden"
            value="allow"
            checked={allowOrForbidden == "allow"}
            onChange={() => switchAllowOrForbidden("allow")}
          />
          <label className="mx-2" htmlFor="allow">
            allow
          </label>
          <DomainList
            list={allowList}
            setNewDomainList={(l) => updateDomainList("allow", l)}
          />
        </div>
        <div className={"p-2" + " " + animation_class("forbidden")}>
          <input
            type="radio"
            id="forbidden"
            name="allow_or_forbidden"
            value="forbidden"
            checked={allowOrForbidden == "forbidden"}
            onChange={() => switchAllowOrForbidden("forbidden")}
          />
          <label className="mx-2" htmlFor="forbidden">
            forbidden
          </label>
          <DomainList
            list={forbiddenList}
            setNewDomainList={(l) => updateDomainList("forbidden", l)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

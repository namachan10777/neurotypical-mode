import * as React from "react";
import DomainList from "./DomainList";

export interface Props {
  port: chrome.runtime.Port;
}

const App: React.FunctionComponent<Props> = (props: Props) => {
  const [allowList, setAllowList] = React.useState([]);
  const [forbiddenList, setForbiddenList] = React.useState([]);
  const [allowOrForbidden, setAllowOrForbidden] = React.useState("forbidden");
  const [enable, setEnable] = React.useState(false);
  props.port.onMessage.addListener(function (msg) {
    if (msg.typeName == "updateState") {
      setAllowList(msg.allow);
      setForbiddenList(msg.forbidden);
      setAllowOrForbidden(msg.allowOrForbidden);
      setEnable(msg.enable);
      console.log(msg);
    }
  });
  const updateDomainList = (allowOrForbidden: string, domains: string[]) => {
    props.port.postMessage({
      typeName: "updateDomainList",
      listName: allowOrForbidden,
      domains: domains,
    });
  };
  const switchAllowOrForbidden = (allowOrForbidden: string) => {
    props.port.postMessage({
      typeName: "switchAllowOrForbidden",
      allowOrForbidden: allowOrForbidden,
    });
  };
  const enableMode = (enable: boolean) => {
    props.port.postMessage({
      typeName: "enableMode",
      enable: enable,
    });
  };
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
        <div className="p-2">
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
            visible={allowOrForbidden == "allow"}
          />
        </div>
        <div className="p-2">
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
            visible={allowOrForbidden == "forbidden"}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

import * as React from "react";
import DomainList from "./DomainList";

export interface Props {
  port: chrome.runtime.Port;
}

const App : React.FunctionComponent<Props> = (props: Props) => {
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
    <div>
      <input
        id="enable-checkbox"
        type="checkbox"
        checked={enable}
        onChange={(e) => enableMode(e.target.checked)}
      />
      <label htmlFor="enable-checkbox">enable</label>
      <div>
        <label htmlFor="allow">allow</label>
        <input
          type="radio"
          id="allow"
          name="allow_or_forbidden"
          value="allow"
          checked={allowOrForbidden == "allow"}
          onChange={() => switchAllowOrForbidden("allow")}
        />
        <DomainList
          list={allowList}
          setNewDomainList={(l) => updateDomainList("allow", l)}
        />
        <label htmlFor="forbidden">forbidden</label>
        <input
          type="radio"
          id="forbidden"
          name="allow_or_forbidden"
          value="forbidden"
          checked={allowOrForbidden == "forbidden"}
          onChange={() => switchAllowOrForbidden("forbidden")}
        />
        <DomainList
          list={forbiddenList}
          setNewDomainList={(l) => updateDomainList("forbidden", l)}
        />
      </div>
    </div>
  );
};

export default App;

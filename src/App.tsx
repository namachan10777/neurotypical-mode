import * as React from "react";
import DomainList from "./DomainList";

export interface Props {
    port: chrome.runtime.Port;
}

export default (props: Props) => {
  const [allowList, setAllowList] = React.useState([]);
  const [forbiddenList, setForbiddenList] = React.useState([]);
  const [allowOrForbidden, setAllowOrForbidden] = React.useState("forbidden");
  props.port.onMessage.addListener(function(msg) {
    if (msg.typeName == "updateState") {
      setAllowList(msg.allow);
      setForbiddenList(msg.forbidden);
      setAllowOrForbidden(msg.allowOrForbidden);
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
  return <div>
    <div>
      <label htmlFor="allow">allow</label>
      <input type="radio" id="allow" name="allow_or_forbidden" value="allow" checked={allowOrForbidden == "allow"} onChange={() => switchAllowOrForbidden("allow")}/>
      <DomainList list={allowList} setNewDomainList={(l) => updateDomainList("allow", l)}/>
      <label htmlFor="forbidden" >forbidden</label>
      <input type="radio" id="forbidden" name="allow_or_forbidden" value="forbidden" checked={allowOrForbidden == "forbidden"} onChange={() => switchAllowOrForbidden("forbidden")}/>
      <DomainList list={forbiddenList} setNewDomainList={(l) => updateDomainList("forbidden", l)}/>
    </div>
  </div>;
};

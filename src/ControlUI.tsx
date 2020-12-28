import * as React from "react";
import DomainList from "./DomainList";
import { AllowOrForbidden, FrontendPort } from "./msg";

export interface Props {
  port: FrontendPort;
  allowList: Array<string>;
  forbiddenList: Array<string>;
  allowOrForbidden: AllowOrForbidden;
  enable: boolean;
}

const ControlUI: React.FunctionComponent<Props> = (props: Props) => {
  const updateDomainList = (
    allowOrForbidden: AllowOrForbidden,
    domains: string[],
  ) => {
    props.port({
      typeName: "updateDomainList",
      listName: allowOrForbidden,
      domains: domains,
    });
  };
  const switchAllowOrForbidden = (allowOrForbidden: AllowOrForbidden) => {
    props.port({
      typeName: "switchAllowOrForbidden",
      allowOrForbidden: allowOrForbidden,
    });
  };
  const enableMode = (enable: boolean) => {
    props.port({
      typeName: "enableMode",
      enable: enable,
    });
  };
  const animation_class = (mode: AllowOrForbidden) =>
    mode == props.allowOrForbidden
      ? "domain-list domain-list-expanded"
      : "domain-list";
  return (
    <div className="py-2 container text-lg font-sans">
      <div className="px-2">
        <input
          id="enable-checkbox"
          type="checkbox"
          checked={props.enable}
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
            checked={props.allowOrForbidden == "allow"}
            onChange={() => switchAllowOrForbidden("allow")}
          />
          <label className="mx-2" htmlFor="allow">
            allow
          </label>
          <DomainList
            list={props.allowList}
            setNewDomainList={(l) => updateDomainList("allow", l)}
          />
        </div>
        <div className={"p-2" + " " + animation_class("forbidden")}>
          <input
            type="radio"
            id="forbidden"
            name="allow_or_forbidden"
            value="forbidden"
            checked={props.allowOrForbidden == "forbidden"}
            onChange={() => switchAllowOrForbidden("forbidden")}
          />
          <label className="mx-2" htmlFor="forbidden">
            forbidden
          </label>
          <DomainList
            list={props.forbiddenList}
            setNewDomainList={(l) => updateDomainList("forbidden", l)}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlUI;

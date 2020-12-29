import * as React from "react";
import DomainSetting from "./DomainSetting";
import { AllowOrForbidden, FrontendPort } from "./msg";

export interface Props {
  port: FrontendPort;
  allowList: Array<string>;
  forbiddenList: Array<string>;
  allowOrForbidden: AllowOrForbidden;
  enable: boolean;
}

const ControlUI: React.FunctionComponent<Props> = (props: Props) => {
  const enableMode = (enable: boolean) => {
    props.port({
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
          checked={props.enable}
          onChange={(e) => enableMode(e.target.checked)}
        />
        <label className="mx-2" htmlFor="enable-checkbox">
          enable
        </label>
      </div>
      <div className="m-0 py-2 flex-col justify-between divide-y divide-gray-300  divide-solid">
        <DomainSetting
          port={props.port}
          listType={"allow"}
          enable={props.allowOrForbidden == "allow"}
          list={props.allowList}
        />
        <DomainSetting
          port={props.port}
          listType={"forbidden"}
          enable={props.allowOrForbidden == "forbidden"}
          list={props.forbiddenList}
        />
      </div>
    </div>
  );
};

export default ControlUI;

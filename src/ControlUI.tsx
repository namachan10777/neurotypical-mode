import * as React from "react";
import DomainSetting from "./DomainSetting";
import Timer from "./Timer";
import { AllowOrForbidden, FrontendPort } from "./msg";

export interface Props {
  port: FrontendPort;
  allowList: Array<string>;
  forbiddenList: Array<string>;
  allowOrForbidden: AllowOrForbidden;
  secs: number;
}

const ControlUI: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div className="py-2 container text-lg font-sans">
      <Timer secs={props.secs} port={props.port} />
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

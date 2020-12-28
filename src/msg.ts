export type AllowOrForbidden = "allow" | "forbidden";

export type UpdateStateMsg = {
  typeName: "updateState";
  allow: Array<string>;
  forbidden: Array<string>;
  allowOrForbidden: AllowOrForbidden;
  enable: boolean;
};

export type UpdateDomainListMsg = {
  typeName: "updateDomainList";
  listName: AllowOrForbidden;
  domains: Array<string>;
};

export type SwitchAllowOrForbiddenMsg = {
  typeName: "switchAllowOrForbidden";
  allowOrForbidden: AllowOrForbidden;
};

export type EnableModeMsg = {
  typeName: "enableMode";
  enable: boolean;
};

export type BackgroundToFrontendMsg = UpdateStateMsg;
export type FrontendToBackgroundMsg =
  | UpdateDomainListMsg
  | SwitchAllowOrForbiddenMsg
  | EnableModeMsg;

export type FrontendPort = (msg: FrontendToBackgroundMsg) => void;

export type AllowOrForbidden = "allow" | "forbidden";

export type SetTimer = {
  typeName: "setTimer";
  secs: number;
};

export type RunTimer = {
  typeName: "runTimer";
};

export type StopTimer = {
  typeName: "stopTimer";
};

export type UpdateStateMsg = {
  typeName: "updateState";
  allow: Array<string>;
  forbidden: Array<string>;
  allowOrForbidden: AllowOrForbidden;
  secs: number;
  running: boolean;
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

export type BackgroundToFrontendMsg = UpdateStateMsg;
export type FrontendToBackgroundMsg =
  | UpdateDomainListMsg
  | SwitchAllowOrForbiddenMsg
  | SetTimer
  | StopTimer
  | RunTimer;

export type FrontendPort = (msg: FrontendToBackgroundMsg) => void;

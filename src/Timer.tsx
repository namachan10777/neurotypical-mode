import * as React from "react";
import { FrontendPort } from "./msg";

export interface Props {
  secs: number;
  port: FrontendPort;
}

const Timer: React.FunctionComponent<Props> = (props: Props) => {
  const stopTimer = () => {
    props.port({
      typeName: "stopTimer",
    });
  };
  const runTimer = () => {
    props.port({
      typeName: "runTimer",
    });
  };
  return (
    <div>
      {props.secs}
      <button onClick={() => runTimer()}>Run</button>
      <button onClick={() => stopTimer()}>Stop</button>
    </div>
  );
};

export default Timer;

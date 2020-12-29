import * as React from "react";
import { FrontendPort } from "./msg";

export interface Props {
  secs: number;
  running: boolean;
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
      {props.running ? (
        <button onClick={() => stopTimer()}>Stop</button>
      ) : (
        <button onClick={() => runTimer()}>Run</button>
      )}
    </div>
  );
};

export default Timer;

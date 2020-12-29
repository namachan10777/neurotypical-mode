import * as React from "react";
import { FrontendPort } from "./msg";
import { FaPlay, FaStop } from "react-icons/fa";

interface ToggleProps {
  onClick: () => void;
}

const PlayButton: React.FC<ToggleProps> = (props: ToggleProps) => {
  return (
    <button
      className="ml-1 focus:outline-none text-green-600"
      onClick={props.onClick}
    >
      <FaPlay />
    </button>
  );
};

const StopButton: React.FC<ToggleProps> = (props: ToggleProps) => {
  return (
    <button
      className="ml-1 focus:outline-none text-red-600"
      onClick={props.onClick}
    >
      <FaStop />
    </button>
  );
};

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
    <div className="flex flex-row items-center">
      <span className="font-mono">{props.secs}</span>
      {props.running ? (
        <StopButton onClick={() => stopTimer()} />
      ) : (
        <PlayButton onClick={() => runTimer()} />
      )}
    </div>
  );
};

export default Timer;

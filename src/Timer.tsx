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
  const zeroPadding = (n: number) => ("0" + n.toString()).slice(-2);
  const hour = zeroPadding(Math.floor(props.secs / 60 / 60));
  const minute = zeroPadding(Math.floor(props.secs / 60) % 60);
  const second = zeroPadding(props.secs % 60);
  return (
    <div className="flex flex-row items-center">
      <span className="font-mono">{hour}:{minute}:{second}</span>
      {props.running ? (
        <StopButton onClick={() => stopTimer()} />
      ) : (
        <PlayButton onClick={() => runTimer()} />
      )}
    </div>
  );
};

export default Timer;

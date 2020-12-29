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
  const hour = Math.floor(props.secs / 60 / 60);
  const minute = Math.floor(props.secs / 60) % 60;
  const second = props.secs % 60;
  const changeTime = (time: number) => {
    console.log("changeTime", props.secs, " ", time);
    props.port({
      typeName: "setTimer",
      secs: time,
    });
  };
  const changeHour = (hour: number) => {
    changeTime(hour * 60 * 60 + minute * 60 + second);
  };
  const changeMinute = (minute: number) => {
    changeTime(hour * 60 * 60 + minute * 60 + second);
  };
  const changeSecond = (second: number) => {
    changeTime(hour * 60 * 60 + minute * 60 + second);
  };
  if (props.running) {
    return (
      <div className="flex flex-row items-center">
        <span className="font-mono">
          {zeroPadding(hour)}:{zeroPadding(minute)}:{zeroPadding(second)}
        </span>
        <StopButton onClick={() => stopTimer()} />
      </div>
    );
  } else {
    return (
      <div className="flex flex-row items-center">
        <span className="font-mono">
          <input
            className="w-10"
            type="number"
            value={hour}
            onChange={(e) => changeHour(parseInt(e.target.value, 10))}
          />
          :
          <input
            className="w-10"
            type="number"
            value={minute}
            onChange={(e) => changeMinute(parseInt(e.target.value, 10))}
          />
          :
          <input
            className="w-10"
            type="number"
            value={second}
            onChange={(e) => changeSecond(parseInt(e.target.value, 10))}
          />
        </span>
        <PlayButton onClick={() => runTimer()} />
      </div>
    );
  }
};

export default Timer;

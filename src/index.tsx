import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

const port = chrome.runtime.connect("kdlolnhobojjgamhfdcmmanlinacgofa");

ReactDOM.render(<App port={port} />, document.getElementById("root"));

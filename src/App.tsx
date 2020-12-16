import * as React from "react";
import DomainList from "./DomainList";

export interface Props {
    port: chrome.runtime.Port;
}

export default (props: Props) => {
  const [allowList, setAllowList] = React.useState(["manaba.tsukuba.ac.jp", "web.microsoftstream.com"]);
  const [forbiddenList, setForbiddenList] = React.useState(["tweetdeck.twitter.com", "twitter.com"]);
  const [allowOrForbidden, setAllowOrForbidden] = React.useState("forbidden");
  props.port.onMessage.addListener(function(msg) {
    if (msg.typeName == "initialState") {
      setAllowList(msg.allow);
      setForbiddenList(msg.forbidden);
      console.log(msg);
    }
  });
  return <div>
    <form>
      <label htmlFor="allow">allow</label>
      <input type="radio" id="allow" name="allow_or_forbidden" value="allow" checked={allowOrForbidden == "allow"} onChange={() => setAllowOrForbidden("allow")}/>
      <DomainList list={allowList}/>
      <label htmlFor="forbidden">forbidden</label>
      <input type="radio" id="forbidden" name="allow_or_forbidden" value="forbidden" checked={allowOrForbidden == "forbidden"} onChange={() => setAllowOrForbidden("forbidden")}/>
      <DomainList list={forbiddenList}/>
    </form>
  </div>;
};

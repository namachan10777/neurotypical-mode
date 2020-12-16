import * as React from "react";

export interface Props {
  list: string[];
}

export default (props: Props) => {
  return <ul>{props.list.map((domain) => (<li>{domain}</li>))}</ul>;
};

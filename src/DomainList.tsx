import * as React from "react";

export interface Props {
  list: string[];
  setNewDomainList: (domain: string[]) => void;
}

const DomainList: React.FunctionComponent<Props> = (props: Props) => {
  const [newDomain, setNewDomain] = React.useState("");
  const newDomainEntered = (e: React.KeyboardEvent) => {
    if (e.code == "Enter") {
      const newDomainList = [...props.list];
      newDomainList.push(newDomain);
      props.setNewDomainList(newDomainList);
    }
  };
  const removeDomain = (domain: string) => {
    const newDomainList = props.list.filter((d) => d != domain);
    console.log("remove:", domain);
    props.setNewDomainList(newDomainList);
  };
  return (
    <ul>
      {props.list.map((domain) => (
        <li key={domain}>
          <button onClick={() => removeDomain(domain)}>remove</button>
          {domain}
        </li>
      ))}
      <li key="$newDomain">
        <input
          type="text"
          placeholder="www.hogehoge.com"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          onKeyDown={(e) => newDomainEntered(e)}
        />
      </li>
    </ul>
  );
};

export default DomainList;

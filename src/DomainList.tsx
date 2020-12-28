import * as React from "react";
import { FaTrash } from "react-icons/fa";

export interface Props {
  list: string[];
  setNewDomainList: (domain: string[]) => void;
  visible: boolean;
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
  const animation_class = props.visible ? "domain-list domain-list-expanded" : "domain-list";
  return (
    <ul className={animation_class}>
      {props.list.map((domain) => (
        <li className="flex justify-between text-lg py-1" key={domain}>
          {domain}
          <button
            className="text-purple-600 hover:text-purple-700"
            onClick={() => removeDomain(domain)}
          >
            <FaTrash />
          </button>
        </li>
      ))}
      <li key="$newDomain">
        <input
          className="text-lg py-1 border border-transparent rounded-md ring-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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

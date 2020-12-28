import * as React from "react";
import { FaTrash } from "react-icons/fa";
import { MdBlock, MdDone } from "react-icons/md";

const domainRe = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;

export interface Props {
  list: string[];
  setNewDomainList: (domain: string[]) => void;
}

const DomainList: React.FunctionComponent<Props> = (props: Props) => {
  const [newDomain, setNewDomain] = React.useState("");
  const newDomainEntered = (e: React.KeyboardEvent) => {
    if (e.code == "Enter" && isValidDomain(newDomain)) {
      const newDomainList = [...props.list];
      newDomainList.push(newDomain);
      props.setNewDomainList(newDomainList);
      setNewDomain("");
    }
  };
  const isValidDomain = (domain: string): boolean => {
    return domainRe.test(domain);
  };
  const removeDomain = (domain: string) => {
    const newDomainList = props.list.filter((d) => d != domain);
    console.log("remove:", domain);
    props.setNewDomainList(newDomainList);
  };
  const okIcon = (
    <span className="text-2xl mx-2 text-green-700">
      <MdDone />
    </span>
  );
  const ngIcon = (
    <span className="text-2xl mx-2 text-red-400">
      <MdBlock />
    </span>
  );
  return (
    <ul>
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
      <li key="$newDomain" className="flex justify-start text-lg items-center">
        <input
          className="py-1 border border-transparent rounded-md ring-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          type="text"
          placeholder="www.hogehoge.com"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          onKeyDown={(e) => newDomainEntered(e)}
        />
        {isValidDomain(newDomain) ? okIcon : ngIcon}
      </li>
    </ul>
  );
};

export default DomainList;

import * as React from "react";
import { FaTrash } from "react-icons/fa";
import { MdBlock, MdDone } from "react-icons/md";
import { AllowOrForbidden, FrontendPort } from "./msg";

const domainRe = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;

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

interface DomainListProps {
  port: FrontendPort;
  listType: AllowOrForbidden;
  list: Array<string>;
}

const DomainList: React.FunctionComponent<DomainListProps> = (
  props: DomainListProps,
) => {
  const [newDomain, setNewDomain] = React.useState("");
  const setNewDomainList = (list: Array<string>) => {
    props.port({
      typeName: "updateDomainList",
      listName: props.listType,
      domains: list,
    });
  };
  const newDomainEntered = (e: React.KeyboardEvent) => {
    if (e.code == "Enter" && isValidDomain(newDomain)) {
      const newDomainList = [...props.list];
      newDomainList.push(newDomain);
      setNewDomainList(newDomainList);
      setNewDomain("");
    }
  };
  const removeDomain = (domain: string) => {
    const newDomainList = props.list.filter((d) => d != domain);
    setNewDomainList(newDomainList);
  };
  const isValidDomain = (domain: string): boolean => {
    const alreadyExists = props.list.includes(domain);
    return domainRe.test(domain) && !alreadyExists;
  };
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

export interface Props {
  port: FrontendPort;
  enable: boolean;
  list: Array<string>;
  listType: AllowOrForbidden;
}

const DomainSetting: React.FunctionComponent<Props> = (props: Props) => {
  const animation_class = props.enable
    ? "domain-list domain-list-expanded"
    : "domain-list";
  const switchAllowOrForbidden = (allowOrForbidden: AllowOrForbidden) => {
    props.port({
      typeName: "switchAllowOrForbidden",
      allowOrForbidden: allowOrForbidden,
    });
  };
  return (
    <div className={"p-2" + " " + animation_class}>
      <input
        type="radio"
        id="forbidden"
        name="allow_or_forbidden"
        value={props.listType}
        checked={props.enable}
        onChange={() => switchAllowOrForbidden(props.listType)}
      />
      <label className="mx-2" htmlFor={props.listType}>
        {props.listType}
      </label>
      <DomainList
        port={props.port}
        list={props.list}
        listType={props.listType}
      />
    </div>
  );
};

export default DomainSetting;

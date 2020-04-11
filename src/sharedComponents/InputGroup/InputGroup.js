import React from "react";
import classnames from "classnames";

import Input from "../formValueTypes/Input";
import DropDown from "../formValueTypes/Input";
import styles from "./input-group.module.scss";

function Generic({ data, cb }) {
  console.log("columns", data);

  return (
    <div className={classnames("input-group", styles["custom-input-group"])}>
      {data.map(({ name, type }, idx) => {
        if (type === "Input") {
          return (
            <div key={`ig_item_${idx}`}>
              <span>{name}</span>
              <Input type="text" propName={name} cb={cb} />
            </div>
          );
        } else {
          return <DropDown />;
        }
      })}
    </div>
  );
}

function InputGroup({ children }) {
  return (
    <div className={classnames("input-group", styles["custom-input-group"])}>
      {children}
    </div>
  );
}

InputGroup.Generic = Generic;

export default InputGroup;

import React from "react";
import classnames from "classnames";
import styles from "./input-group.module.scss";

function InputGroup({ children }) {
  return (
    <div className={classnames("input-group", styles["custom-input-group"])}>
      {children}
    </div>
  );
}

export default InputGroup;

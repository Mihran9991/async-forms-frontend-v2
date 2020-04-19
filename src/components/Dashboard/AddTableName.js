import React from "react";

import Input from "../../sharedComponents/formValueTypes/Input";
import styles from "./dashboard.module.scss";

function AddTableName({ setTitle, title }) {
  return (
    <div className={styles["add-table-name"]}>
      <h4>Add Table Name</h4>
      <Input
        cb={setTitle}
        propName="table-name"
        type="text"
        defaultValue={title}
        onlyValue
        fullWidth
      />
    </div>
  );
}

export default AddTableName;

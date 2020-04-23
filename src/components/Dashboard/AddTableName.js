import React, { useState } from "react";
import { If, Then, Else } from "react-if";
import Button from "react-bootstrap/Button";

import Input from "../../sharedComponents/formValueTypes/Input";
import styles from "./dashboard.module.scss";

function AddTableName({ saveTitle, title: titleFromProps }) {
  const [currentTitle, setCurrentTitle] = useState("");
  const [isEditingEnabled, setIsEditingEnabled] = useState(true);

  const title = titleFromProps
    ? `Edit ${titleFromProps}'s value`
    : "Add table Name";

  const editActionHandler = () => {
    if (isEditingEnabled) {
      saveTitle(currentTitle);
    }

    setCurrentTitle("");
    setIsEditingEnabled(!isEditingEnabled);
  };

  return (
    <div className={styles["add-table-name"]}>
      <If condition={isEditingEnabled}>
        <Then>
          <h4>{title}</h4>
          <Input
            cb={setCurrentTitle}
            propName="table-name"
            type="text"
            defaultValue={title}
            callbackResponseOnlyValue
            fullWidth
          />
          <Button onClick={editActionHandler}>Save</Button>
        </Then>
        <Else>
          <Button onClick={editActionHandler}>Edit</Button>
        </Else>
      </If>
    </div>
  );
}

export default AddTableName;

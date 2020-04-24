import React, { useState } from "react";
import { If, Then, Else } from "react-if";
import Button from "react-bootstrap/Button";

import Input from "../formValueTypes/Input";
import styles from "./form.module.scss";

function FormName({ saveTitle, title: titleFromProps }) {
  const [currentTitle, setCurrentTitle] = useState("");
  const [isEditingEnabled, setIsEditingEnabled] = useState(true);

  const title = titleFromProps
    ? `Edit ${titleFromProps}'s value`
    : "Add form Name";

  const editActionHandler = () => {
    if (isEditingEnabled) {
      saveTitle(currentTitle);
    }

    setIsEditingEnabled(!isEditingEnabled);
  };

  return (
    <div className={styles["add-form-name"]}>
      <If condition={isEditingEnabled}>
        <Then>
          <h4>{title}</h4>
          <Input
            cb={setCurrentTitle}
            propName="form-name"
            type="text"
            callbackResponseOnlyValue
            defaultValue={currentTitle}
            fullWidth
            placeholder={title}
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

export default FormName;

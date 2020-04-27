import React, { useState } from "react";
import { If, Then, Else } from "react-if";
import { Button } from "antd";

import Input from "../formValueTypes/Input";
import styles from "./form.module.scss";

function FormName({ saveTitle, title: titleFromProps }) {
  const [currentTitle, setCurrentTitle] = useState("");
  const [isEditingEnabled, setIsEditingEnabled] = useState(true);
  const commonBtnStyle = {
    marginBottom: 10,
  };
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
          <Input
            cb={setCurrentTitle}
            propName="form-name"
            type="text"
            callbackResponseOnlyValue
            defaultValue={currentTitle}
            fullWidth
            placeholder={title}
            style={{ marginBottom: 10 }}
          />
          <If condition={currentTitle.length > 0}>
            <Then>
              <Button
                type="primary"
                style={commonBtnStyle}
                onClick={editActionHandler}
              >
                Save
              </Button>
            </Then>
          </If>
        </Then>
        <Else>
          <Button type="primary" onClick={editActionHandler}>
            Edit Form Name
          </Button>
        </Else>
      </If>
      <h4 className={styles["title"]}>{titleFromProps}</h4>
    </div>
  );
}

export default FormName;

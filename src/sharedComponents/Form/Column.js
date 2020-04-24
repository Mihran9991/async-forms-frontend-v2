import React, { useState } from "react";
import { If, Then } from "react-if";

import { FORM_DATA_TYPES, EMPTY_VALUE } from "../../constants/formConstants";
import { isColumnValid } from "../../utils/formUtil";
import { Button } from "antd";
import Input from "../formValueTypes/Input";
import DropDown from "../formValueTypes/DropDown";
import styels from "./form.module.scss";

function Column({
  name,
  properties,
  editable,
  editColumnHandler,
  deleteColumnByNameHandler,
  maxWidth,
}) {
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [currentType, setCurrentType] = useState("Input");
  const [currentName, setCurrentName] = useState(name);

  const structureCurrentData = (editedData, structurePiece) => {
    if (structurePiece === "name") {
      setCurrentName(editedData);
    } else {
      setCurrentType(editedData.type);
    }
  };

  const editActionHandler = () => {
    if (isEditingEnabled) {
      editColumnHandler({ name: currentName, type: currentType });
    }

    // setCurrentData({});
    setIsEditingEnabled(!isEditingEnabled);
  };

  return (
    <div className={styels["column"]}>
      <div>{name ? name : EMPTY_VALUE}</div>
      <div>
        <Button onClick={editActionHandler}>
          {isEditingEnabled ? "Save" : "Edit"}
        </Button>
        <Button
          onClick={() => {
            deleteColumnByNameHandler(name);
          }}
        >
          Delete
        </Button>
        <br />
        <If condition={isEditingEnabled}>
          <Then>
            <Input
              defaultValue={name}
              cb={(editedData) => structureCurrentData(editedData, "name")}
              callbackResponseOnlyValue
              fullWidth
            />
            <If condition={Boolean(editable || !isColumnValid(properties))}>
              <DropDown
                items={FORM_DATA_TYPES}
                cb={(editedData) => structureCurrentData(editedData, "type")}
                defaultValue={"Edit column type"}
                fullWidth
              />
            </If>
          </Then>
        </If>
      </div>
    </div>
  );
}

export default Column;

import React, { useState } from "react";
import { If, Then } from "react-if";

import { EMPTY_VALUE, FORM_DATA_TYPES } from "../../constants/formConstants";
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
  type: typeFromProps = null,
}) {
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [currentType, setCurrentType] = useState(typeFromProps);
  const [currentName, setCurrentName] = useState(name);

  const structureCurrentData = (editedData, structurePiece) => {
    if (structurePiece === "name") {
      setCurrentName(editedData);
    } else {
      setCurrentType(editedData.type);
    }
  };

  const save = () => {
    if (isEditingEnabled) {
      editColumnHandler({ name: currentName, type: currentType });
    }

    setIsEditingEnabled(!isEditingEnabled);
  };

  const edit = () => {
    setIsEditingEnabled(!isEditingEnabled);
  };

  const isValid = currentName.length > 0 && currentType.length;

  return (
    <div className={styels["column"]}>
      <div>{name ? name : EMPTY_VALUE}</div>
      <div>
        <If condition={isValid && isEditingEnabled}>
          <Then>
            <Button onClick={save}>Save</Button>
          </Then>
        </If>

        <If condition={!isValid || editable}>
          <Then>
            <If condition={!isEditingEnabled}>
              <Then>
                <Button onClick={edit}>Edit</Button>
              </Then>
            </If>
          </Then>
        </If>

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
            <DropDown
              items={FORM_DATA_TYPES}
              cb={(editedData) => structureCurrentData(editedData, "type")}
              defaultValue={"Edit column type"}
              fullWidth
            />
          </Then>
        </If>
      </div>
    </div>
  );
}

// || !isColumnValid(properties)
export default Column;

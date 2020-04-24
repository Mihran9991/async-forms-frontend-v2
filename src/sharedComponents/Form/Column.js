import React, { useState } from "react";
import { If, Then } from "react-if";

import { FORM_DATA_TYPES, EMPTY_VALUE } from "../../constants/formConstants";
import { isColumnValid } from "../../utils/formUtil";
import Button from "react-bootstrap/Button";
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
  const [currentData, setCurrentData] = useState({});
  const [currentName, setCurrentName] = useState(name);

  const structureCurrentData = (editedData, structurePiece) => {
    if (structurePiece === "name") {
      setCurrentName(editedData);
      setCurrentData({
        [editedData]: { ...properties, ...currentData[currentName] },
      });
    } else {
      setCurrentData({
        [currentName]: { ...properties, ...editedData },
      });
    }
  };

  const editActionHandler = () => {
    if (isEditingEnabled) {
      editColumnHandler(name, currentData);
    }

    setCurrentData({});
    setIsEditingEnabled(!isEditingEnabled);
  };

  return (
    <th
      style={{
        width: `${maxWidth}%`,
        background: name && isColumnValid(properties) ? "inherit" : "red",
      }}
    >
      <div className={styels["column"]}>
        <div>{name ? name : EMPTY_VALUE}</div>
        <div>
          <Button onClick={editActionHandler}>
            {isEditingEnabled ? "Save" : "Edit"}
          </Button>
          <Button
            variant={"danger"}
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
    </th>
  );
}

export default Column;

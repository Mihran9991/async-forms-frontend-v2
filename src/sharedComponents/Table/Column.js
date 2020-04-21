import React, { useState } from "react";
import { If, Then } from "react-if";

import Button from "react-bootstrap/Button";
import Input from "../formValueTypes/Input";
import DropDown from "../formValueTypes/DropDown";
import { isColumnValid } from "../../utils/tableUtil";
import { TABLE_DATA_TYPES, EMPTY_VALUE } from "../../constants/tableConstants";
import styels from "./table.module.scss";

function Column({
  name,
  properties,
  editable,
  saveColumnHandler,
  deleteColumnByNameHandler,
  maxWidth,
}) {
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [currentName, setCurrentName] = useState(name);

  const structureCurrentData = (editedData, structurePiece) => {
    if (structurePiece === "name") {
      console.log("editedData name", editedData);
      console.log("currentData", currentData);

      setCurrentName(editedData);
      setCurrentData({
        [editedData]: { ...properties, ...currentData[currentName] },
      });
    } else {
      console.log("editedData", editedData);
      console.log("currentName", currentName);

      setCurrentData({
        [currentName]: { ...properties, ...editedData },
      });
    }
  };

  console.log("currentData", currentData);

  const editActionHandler = () => {
    if (isEditingEnabled) {
      saveColumnHandler(name, currentData);
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
                  items={TABLE_DATA_TYPES}
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

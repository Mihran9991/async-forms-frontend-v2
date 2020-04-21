import React, { useState } from "react";
import { If, Then } from "react-if";

import Button from "react-bootstrap/Button";
import Input from "../formValueTypes/Input";
import DropDown from "../formValueTypes/DropDown";
import { isColumnInvalid } from "../../utils/tableUtil";
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
      setCurrentName(editedData);
      setCurrentData({
        [editedData]: properties,
      });
    } else {
      setCurrentData({
        [currentName]: { ...properties, ...editedData },
      });
    }
  };

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
        background: name && !isColumnInvalid(properties) ? "inherit" : "red",
      }}
    >
      <div className={styels["column"]}>
        <div>{name ? name : EMPTY_VALUE}</div>
        <div>
          <If condition={Boolean(editable)}>
            <Then>
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
                    cb={(editedData) =>
                      structureCurrentData(editedData, "name")
                    }
                    callbackResponseOnlyValue
                    fullWidth
                  />
                  <DropDown
                    items={TABLE_DATA_TYPES}
                    cb={(editedData) =>
                      structureCurrentData(editedData, "type")
                    }
                    defaultValue={"Edit column type"}
                    fullWidth
                  />
                </Then>
              </If>
            </Then>
          </If>
        </div>
      </div>
    </th>
  );
}

export default Column;

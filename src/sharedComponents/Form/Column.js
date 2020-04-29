import React, { useState, useEffect } from "react";
import { If, Then } from "react-if";

import {
  FORM_DATA_TYPES,
  EMPTY_VALUE,
  DROP_DOWN,
} from "../../constants/formConstants";
import { Button } from "antd";
import Input from "../formValueTypes/Input";
import DropDown from "../formValueTypes/DropDown";
import styels from "./form.module.scss";
import {
  formatDropDownData,
  formatColumnProperties,
  reconstructDropDownData,
  getDropDownDataValues,
} from "../../utils/formUtil";

function Column({
  name,
  propName,
  editable,
  values,
  editColumnHandler,
  deleteColumnByNameHandler,
  saveStructureHandler,
  type: typeFromProps = null,
}) {
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [currentType, setCurrentType] = useState(typeFromProps);
  const [currentName, setCurrentName] = useState(name);
  const [currentValues, setCurrentValues] = useState(values || []);

  const structureCurrentData = (editedData, structurePiece) => {
    if (structurePiece === "name") {
      setCurrentName(editedData);
    }

    if (structurePiece === "type") {
      setCurrentType(editedData.type);
    }

    if (structurePiece === "values") {
      setCurrentValues(getDropDownDataValues(formatDropDownData(editedData)));
    }
  };

  const save = () => {
    if (isEditingEnabled) {
      editColumnHandler(
        formatColumnProperties({
          name: currentName,
          type: currentType,
          fields: currentValues,
        })
      );
    }

    saveStructureHandler();
    setIsEditingEnabled(!isEditingEnabled);
  };

  const edit = () => {
    setIsEditingEnabled(!isEditingEnabled);
  };

  useEffect(() => {
    setCurrentValues(values);
  }, [values]);

  const isValid = currentName.length > 0 && currentType.length;
  const reconstructed = reconstructDropDownData(values, propName);

  return (
    <div className={styels["column"]}>
      <div>{name ? name : EMPTY_VALUE}</div>
      <div>
        <If condition={Boolean(isValid && isEditingEnabled)}>
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
            Type field name
            <Input
              defaultValue={name}
              cb={(editedData) => structureCurrentData(editedData, "name")}
              callbackResponseOnlyValue
              fullWidth
            />
            Select field type
            <br />
            <DropDown
              items={FORM_DATA_TYPES}
              cb={(editedData) => structureCurrentData(editedData, "type")}
              defaultValue={"Select field type"}
              fullWidth
            />
            <If condition={currentType === DROP_DOWN}>
              <Then>
                <br />
                Add field values
                <DropDown
                  menuItems={reconstructed}
                  cb={(editedData) => {
                    structureCurrentData(editedData, "values");
                  }}
                  defaultValue={"Add field values"}
                  fullWidth
                  callbackResponseOnlyValue
                />
              </Then>
            </If>
          </Then>
        </If>
      </div>
    </div>
  );
}

export default Column;

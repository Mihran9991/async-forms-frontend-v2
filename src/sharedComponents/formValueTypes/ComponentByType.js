import React from "react";
import { Switch, Case, Default } from "react-if";

import Input from "./Input";
import DropDown from "./DropDown";
import EditableTable from "./EditableTable";
import { DROP_DOWN, INPUT, TABLE } from "../../constants/formConstants";
import { reconstructDropDownData } from "../../utils/formUtil";

function ComponentByType({
  type,
  name = "",
  structureBuilder,
  setName,
  saveStructureHandler,
  structure,
  error,
  forInstance,
  forStructure,
  value = {},
}) {
  const commonValidationStyle = { outline: error ? "red" : "#d9d9d9" };

  return (
    <>
      <Switch>
        <Case condition={type === INPUT}>
          <Input
            style={commonValidationStyle}
            onBlurHandler={saveStructureHandler}
            cb={(name) => {
              structureBuilder({
                [name]: name,
              });
              setName(name);
            }}
            callbackResponseOnlyValue
            propName={name}
            defaultValue={name}
            forInstance={forInstance}
          />
        </Case>
        <Case condition={type === DROP_DOWN}>
          <DropDown
            style={commonValidationStyle}
            onBlurHandler={saveStructureHandler}
            propName={name}
            disabled={!name.length}
            items={
              !forStructure && forInstance
                ? reconstructDropDownData(
                    Array.isArray(value) ? value : [],
                    name
                  )
                : []
            }
            menuItems={
              forStructure && Array.isArray(value)
                ? reconstructDropDownData(value)
                : []
            }
            cb={structureBuilder}
            callbackResponseOnlyValue
            forInstance={forInstance}
            onlyValues
          />
        </Case>
        <Case condition={type === TABLE}>
          <EditableTable
            style={commonValidationStyle}
            cb={structureBuilder}
            propName={name}
            saveStructureHandler={saveStructureHandler}
            structure={structure}
            forInstance={forInstance}
            columns={forInstance ? value.columns : value}
          />
        </Case>
        <Default>
          <Input
            style={commonValidationStyle}
            onBlurHandler={saveStructureHandler}
            cb={setName}
            callbackResponseOnlyValue
            propName={name}
            defaultValue={name}
            forInstance={forInstance}
          />
        </Default>
      </Switch>
    </>
  );
}
export default ComponentByType;
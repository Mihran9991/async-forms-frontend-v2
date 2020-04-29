import React from "react";
import { Switch, Case, Default } from "react-if";

import Input from "./Input";
import DropDown from "./DropDown";
import EditableTable from "./EditableTable";
import { DROP_DOWN, INPUT, TABLE } from "../../constants/formConstants";
import { reconstructDropDownData } from "../../utils/formUtil";

function ComponentByType({
  type,
  name,
  structureBuilder,
  setName,
  saveStructureHandler,
  structure,
  error,
  forInstance,
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
            cb={setName}
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
              forInstance
                ? reconstructDropDownData(
                    Array.isArray(value) ? value : [],
                    name
                  )
                : []
            }
            cb={structureBuilder}
            callbackResponseOnlyValue
            forInstance={forInstance}
          />
        </Case>
        <Case condition={type === TABLE}>
          <EditableTable
            style={commonValidationStyle}
            cb={structureBuilder}
            propName={name}
            onBlurHandler={saveStructureHandler}
            saveStructureHandler={saveStructureHandler}
            structure={structure}
            forInstance={forInstance}
            columns={value.columns}
          />
        </Case>
        <Default>
          <Input
            onBlurHandler={saveStructureHandler}
            cb={setName}
            callbackResponseOnlyValue
            propName={name}
            forInstance={forInstance}
          />
        </Default>
      </Switch>
    </>
  );
}
export default ComponentByType;

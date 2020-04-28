import React from "react";
import { Switch, Case, Default } from "react-if";

import Input from "../sharedComponents/formValueTypes/Input";
import DropDown from "../sharedComponents/formValueTypes/DropDown";
import EditableTable from "../sharedComponents/formValueTypes/EditableTable";
import { DROP_DOWN, INPUT, TABLE } from "../constants/formConstants";

export const GetComponentByType = ({
  type,
  name,
  structureBuilder,
  setName,
  saveStructureHandler,
  structure,
  error,
}) => {
  const commonValidationStyle = { outline: error ? "red" : "#d9d9d9" };

  return (
    <>
      <Switch>
        <Case condition={type === INPUT}>
          <Input
            style={commonValidationStyle}
            onBlurHandler={saveStructureHandler}
            cb={(data) => {
              setName(data);
            }}
            callbackResponseOnlyValue
            propName={name}
            defaultValue={name}
          />
        </Case>
        <Case condition={type === DROP_DOWN}>
          <DropDown
            style={commonValidationStyle}
            onBlurHandler={saveStructureHandler}
            propName={name}
            disabled={!name.length}
            items={[]}
            cb={structureBuilder}
            callbackResponseOnlyValue
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
          />
        </Case>
        <Default>
          <Input
            onBlurHandler={saveStructureHandler}
            cb={(data) => {
              setName(data);
            }}
            callbackResponseOnlyValue
            propName={name}
          />
        </Default>
      </Switch>
    </>
  );
};

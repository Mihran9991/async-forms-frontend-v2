import React from "react";
import { Switch, Case, Default } from "react-if";
import get from "lodash/get";

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
  instanceId,
  formId,
  title,
  fieldId,
  ownerId,
  withLoading = false,
  isLocked,
  currentUserEmail,
  lockedBy,
}) {
  const commonValidationStyle = { outline: error ? "red" : "#d9d9d9" };
  const belongsTo = { instanceId, formId, fieldId, title, ownerId };
  const disabled = isLocked && lockedBy !== currentUserEmail;

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
            defaultValue={forInstance ? value : name}
            forInstance={forInstance}
            belongsTo={belongsTo}
            withLoading={withLoading}
            disabled={disabled}
            currentUserEmail={currentUserEmail}
            info={
              lockedBy && lockedBy === currentUserEmail
                ? "This field has been locked by you!"
                : ""
            }
          />
        </Case>
        <Case condition={type === DROP_DOWN}>
          <DropDown
            style={commonValidationStyle}
            onBlurHandler={saveStructureHandler}
            propName={name}
            disabled={disabled}
            items={
              !forStructure && forInstance
                ? reconstructDropDownData(get(value, "items", []), name)
                : []
            }
            menuItems={
              forStructure && Array.isArray(value)
                ? reconstructDropDownData(value)
                : []
            }
            defaultValue={forInstance ? get(value, "defaultValue", "") : ""}
            cb={structureBuilder}
            callbackResponseOnlyValue
            forInstance={forInstance}
            onlyValues
            belongsTo={belongsTo}
            withLoading={withLoading}
            currentUserEmail={currentUserEmail}
            info={
              lockedBy && lockedBy === currentUserEmail
                ? "This field has been locked by you!"
                : ""
            }
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
            columns={forInstance ? get(value, "columns", []) : value}
            rows={forInstance ? get(value, "rows", []) : value}
            belongsTo={belongsTo}
            withLoading={withLoading}
            currentUserEmail={currentUserEmail}
          />
        </Case>
        <Default>
          <Input
            style={commonValidationStyle}
            onBlurHandler={saveStructureHandler}
            cb={setName}
            callbackResponseOnlyValue
            propName={name}
            defaultValue={forInstance ? value : name}
            forInstance={forInstance}
            belongsTo={belongsTo}
            withLoading={withLoading}
            disabled={disabled}
            currentUserEmail={currentUserEmail}
            info={
              lockedBy && lockedBy === currentUserEmail
                ? "This field has been locked by you!"
                : ""
            }
          />
        </Default>
      </Switch>
    </>
  );
}
export default ComponentByType;

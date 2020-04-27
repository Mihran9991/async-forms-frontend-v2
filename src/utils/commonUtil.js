import React from "react";

import Input from "../sharedComponents/formValueTypes/Input";
import DropDown from "../sharedComponents/formValueTypes/DropDown";
import EditableTable from "../sharedComponents/formValueTypes/EditableTable";
import { DROP_DOWN, INPUT, TABLE } from "../constants/formConstants";

export const getComponentByType = ({
  type,
  name,
  structureBuilder,
  setName,
  saveStructureHandler,
}) => {
  let component;
  let withName = false;
  switch (type) {
    case INPUT: {
      component = (
        <Input
          onBlurHandler={saveStructureHandler}
          cb={(data) => {
            setName(data);
          }}
          callbackResponseOnlyValue
          propName={name}
        />
      );
      withName = false;
      break;
    }
    case DROP_DOWN: {
      component = (
        <DropDown
          onBlurHandler={saveStructureHandler}
          propName={name}
          disabled={!name.length}
          items={[]}
          cb={structureBuilder}
          callbackResponseOnlyValue
        />
      );
      withName = true;
      break;
    }
    case TABLE: {
      component = (
        <EditableTable
          cb={structureBuilder}
          propName={name}
          onBlurHandler={saveStructureHandler}
          saveStructureHandler={saveStructureHandler}
        />
      );
      withName = true;
      break;
    }
    default: {
      component = (
        <Input
          onBlurHandler={saveStructureHandler}
          cb={(data) => {
            structureBuilder(data);
            setName(data);
          }}
          propName={name}
          callbackResponseOnlyValue
        />
      );
      withName = false;
      break;
    }
  }

  return [component, withName];
};

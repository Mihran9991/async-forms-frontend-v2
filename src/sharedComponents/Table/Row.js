import React from "react";
import Button from "react-bootstrap/Button";
import { If, Else, Then } from "react-if";

import { transformObjectDataIntoArray } from "../../utils/dataTransform";
import DropDown from "../../sharedComponents/formValueTypes/DropDown";
import Input from "../../sharedComponents/formValueTypes/Input";

import { DROP_DOWN } from "../../constants/tableConstants";

function Row({ properties }) {
  const formattedProperties = transformObjectDataIntoArray(
    properties,
    "values"
  );

  return (
    <tr>
      {formattedProperties.map(({ value, type }, idx) => {
        return (
          <td key={`${value}_${idx}`}>
            <If condition={type === DROP_DOWN}>
              <Then>
                <DropDown items={value} />
              </Then>
              <Else>
                <Input defaultValue={value} />
              </Else>
            </If>
          </td>
        );
      })}
      <td>
        <Button>Delete</Button>
      </td>
    </tr>
  );
}

export default Row;

import React from "react";
import Button from "react-bootstrap/Button";
import { If, Else, Then } from "react-if";

import {
  transformObjectDataIntoArray,
  addTypeToTableData,
} from "../../utils/dataTransform";
import DropDown from "../../sharedComponents/formValueTypes/DropDown";
import Input from "../../sharedComponents/formValueTypes/Input";

import { DROP_DOWN, INPUT } from "../../constants/tableConstants";

function Row({ properties, deleteRowHandler, editRowHandler }) {
  const formattedProperties = transformObjectDataIntoArray(
    properties,
    "entries"
  );

  return (
    <tr>
      {formattedProperties.map(([name, { value, type }], idx) => {
        return (
          <td key={`${value}_${idx}`}>
            <If condition={type === DROP_DOWN}>
              <Then>
                <DropDown
                  cb={(editedData) =>
                    editRowHandler(addTypeToTableData(editedData, DROP_DOWN))
                  }
                  fullWidth
                  items={value}
                  propName={name}
                  editable
                />
              </Then>
              <Else>
                <Input
                  cb={(editedData) =>
                    editRowHandler(addTypeToTableData(editedData, INPUT))
                  }
                  fullWidth
                  defaultValue={value}
                  propName={name}
                />
              </Else>
            </If>
          </td>
        );
      })}
      <td>
        <Button
          variant="danger"
          style={{ width: "100%" }}
          onClick={deleteRowHandler}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
}

export default Row;

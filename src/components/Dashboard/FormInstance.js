import React from "react";

import GenericFieldType from "../../sharedComponents/formValueTypes/GenericFieldType";
import { DROP_DOWN, TABLE } from "../../constants/formConstants";
import { reconstructColumnsData } from "../../utils/formUtil";

const mockRows = [
  {
    Name: "",
    key: "567a5362-272e-429a-a63e-212ff1bfe7d3",
    People: "",
    "Founded at": "esim erb",
  },
  {
    Name: "",
    key: "567a5362-272e-429a-a63e-212ff1bfe7d4",
    People: "",
    "Founded at": "",
  },
  {
    Name: "",
    key: "567a5362-272e-429a-a63e-212ff1bfe7d5",
    People: "",
    "Founded at": "",
  },
  {
    Name: "",
    key: "567a5362-272e-429a-a63e-212ff1bfe7d6",
    People: "",
    "Founded at": "",
  },
  {
    Name: "",
    key: "567a5362-272e-429a-a63e-212ff1bfe7d7",
    People: "",
    "Founded at": "",
  },
  {
    Name: "",
    key: "567a5362-272e-429a-a63e-212ff1bfe7d8",
    People: "",
    "Founded at": "",
  },
];

function FormInstance({ data: { name, structure } }) {
  return (
    <div>
      <h2>{name}</h2>
      {structure.fields.map((field) => {
        const type = field.type.name;
        const value = () => {
          if (type === DROP_DOWN) {
            return field.type.values; //TODO:: replace with values[field.name].value {}
          }

          if (type === TABLE) {
            return {
              columns: reconstructColumnsData(field.type.fields),
              rows: mockRows, //TODO:: replace with values[field.name].value
            };
          }

          return ""; //TODO:: replace with values[field.name].value {}
        };

        return (
          <div>
            <span>{field.name}</span>
            <GenericFieldType
              type={type}
              setAreAllFieldsValid={() => {}}
              saveStructure={() => {}}
              forInstance
              value={value()}
            />
          </div>
        );
      })}
    </div>
  );
}

export default FormInstance;

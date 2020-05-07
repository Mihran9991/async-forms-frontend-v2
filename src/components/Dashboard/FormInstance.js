import React from "react";

import GenericFieldType from "../../sharedComponents/formValueTypes/GenericFieldType";
import { DROP_DOWN, TABLE } from "../../constants/formConstants";
import { reconstructColumnsData } from "../../utils/formUtil";

const mockData = {
  Name: {
    value: "Gev2",
    owner: "98cc384c-229a-4e2e-8ac3-1a75cda2a21a",
    createdAt: "Tue May 05 2020 23:36:45 GMT+0400 (Armenia Standard Time)",
  },
  "Founded at": {
    value: "",
    owner: "98cc384c-229a-4e2e-8ac3-1a75cda2a21a",
    createdAt: "Tue May 05 2020 23:36:53 GMT+0400 (Armenia Standard Time)",
  },
  Quality: {
    value: "High",
    owner: "98cc384c-229a-4e2e-8ac3-1a75cda2a21a",
    createdAt: "Tue May 05 2020 23:37:04 GMT+0400 (Armenia Standard Time)",
  },
  Faculties: {
    fields: [
      {
        rowId: 1,
        Name: {
          value: "",
          owner: "98cc384c-229a-4e2e-8ac3-1a75cda2a21a",
          createdAt:
            "Tue May 05 2020 23:23:36 GMT+0400 (Armenia Standard Time)",
        },
        People: {
          value: "40-60",
          owner: "98cc384c-229a-4e2e-8ac3-1a75cda2a21a",
          createdAt:
            "Mon May 04 2020 00:23:20 GMT+0400 (Armenia Standard Time)",
        },
        "Founded at": {
          value: "17.01.2020",
          owner: "98cc384c-229a-4e2e-8ac3-1a75cda2a21a",
          createdAt:
            "Mon May 04 2020 00:22:14 GMT+0400 (Armenia Standard Time)",
        },
      },
      {
        rowId: 2,
        Name: {
          value: "Miro",
          owner: "98cc384c-229a-4e2e-8ac3-1a75cda2a21a",
          createdAt:
            "Tue May 05 2020 23:23:36 GMT+0400 (Armenia Standard Time)",
        },
        People: {
          value: "60+",
          owner: "98cc384c-229a-4e2e-8ac3-1a75cda2a21a",
          createdAt:
            "Mon May 04 2020 00:23:20 GMT+0400 (Armenia Standard Time)",
        },
        "Founded at": {
          value: "17.01.2020",
          owner: "98cc384c-229a-4e2e-8ac3-1a75cda2a21a",
          createdAt:
            "Mon May 04 2020 00:22:14 GMT+0400 (Armenia Standard Time)",
        },
      },
    ],
  },
};

function FormInstance({
  data: { name, structure, title, formId, instanceId },
}) {
  return (
    <div>
      <h2>{name}</h2>
      {structure.fields.map((field) => {
        const type = field.type.name;
        const value = () => {
          if (type === DROP_DOWN) {
            return {
              items: field.type.values,
              defaultValue: mockData[field.name].value,
            };
          }

          if (type === TABLE) {
            return {
              columns: reconstructColumnsData(field.type.fields),
              rows: mockData[field.name].fields,
            };
          }

          return mockData[field.name].value;
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
              instanceId={instanceId}
              formId={formId}
              title={title}
              fieldId={field.name}
            />
          </div>
        );
      })}
    </div>
  );
}

export default FormInstance;

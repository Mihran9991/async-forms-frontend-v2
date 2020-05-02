import React, { useState } from "react";
import { If, Then } from "react-if";
import { Button, Divider } from "antd";

import Input from "../../sharedComponents/formValueTypes/Input";
import GenericFieldType from "../../sharedComponents/formValueTypes/GenericFieldType";
import { DROP_DOWN, TABLE } from "../../constants/formConstants";
import { reconstructColumnsData } from "../../utils/formUtil";

const struct = {
  name: "th",
  fields: [
    {
      uid: "e79e02a2-d79b-429c-9551-b6cde98b334d",
      name: "Users",
      type: {
        name: "table",
        fields: [
          {
            name: "col 1",
            type: {
              name: "input",
              uid: "adca5b20-b3d7-452c-bbec-9800ec6a412f",
            },
          },
          {
            name: "col 2",
            type: {
              name: "dropdown",
              uid: "2fc2f228-f2b5-4897-a107-4bc8f142b749",
              values: ["trhtrh", "555555", "normal ban"],
            },
          },
          {
            name: "sex",
            type: {
              name: "dropdown",
              uid: "78d37ef6-36f9-4093-ba5f-caa75b7a280a",
              values: ["male ", "female"],
            },
          },
        ],
      },
      style: {},
      optional: true,
    },
    {
      uid: "64b50f74-059f-4380-86a5-cddfad83fc71",
      name: "Name",
      type: { name: "input" },
      style: {},
      optional: true,
    },
    {
      uid: "adc5545c-03b8-427b-aad9-5933631e426a",
      name: "Payment method",
      type: { name: "dropdown", values: ["Cash", "Card"] },
      style: {},
      optional: true,
    },
  ],
};

function FormInstance({ data: { name, structure } }) {
  return (
    <div>
      <h2>{name}</h2>
      {structure.fields.map((field) => {
        const type = field.type.name;
        const value = () => {
          if (type === DROP_DOWN) {
            return field.type.values;
          }

          if (type === TABLE) {
            return {
              columns: reconstructColumnsData(field.type.fields),
              rows: [], //TODO:: replace with col.values or smth like that
            };
          }

          return "";
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

function Form() {
  const [instances, setInstances] = useState([]);
  const [pendingInstance, setPendingInstance] = useState(false);
  const [instanceName, setInstanceName] = useState("");

  const saveInstance = () => {
    setInstances([
      ...instances,
      {
        name: instanceName,
        structure: struct,
      },
    ]);
    setPendingInstance(false);
    setInstanceName("");
  };

  const deleteInstance = () => {};

  return (
    <div>
      <Button
        type="primary"
        disabled={pendingInstance}
        onClick={() => setPendingInstance(true)}
      >
        Add a form instance
      </Button>
      <div>
        <If condition={pendingInstance}>
          <Then>
            <Input cb={setInstanceName} callbackResponseOnlyValue />
          </Then>
        </If>
        <If condition={instanceName.length > 0}>
          <Then>
            <br />
            <Button type="primary" onClick={saveInstance}>
              Create
            </Button>
          </Then>
        </If>
        {instances.map((instanceData, idx) => {
          return (
            <>
              <FormInstance
                key={idx}
                data={instanceData}
                deleteInstance={deleteInstance}
              />
              <Divider className="divider" />
            </>
          );
        })}
      </div>
    </div>
  );
}

export default Form;

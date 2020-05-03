import React, { useState } from "react";
import { If, Then } from "react-if";
import { Button, Divider } from "antd";

import Input from "../../sharedComponents/formValueTypes/Input";
import GenericFieldType from "../../sharedComponents/formValueTypes/GenericFieldType";
import { DROP_DOWN, TABLE } from "../../constants/formConstants";
import { reconstructColumnsData } from "../../utils/formUtil";

const struct = {
  name: "tg",
  fields: [
    {
      name: "gtrgtg",
      type: {
        name: "table",
        fields: [
          {
            type: {
              name: "input",
              uid: "feea2a29-2261-4dff-aaad-f35df017b4f8",
            },
          },
          {
            type: {
              name: "input",
              uid: "1ddb34b1-1fc8-4a3c-a5a3-46f1a58ca161",
            },
          },
          {
            name: "54t",
            type: {
              name: "dropdown",
              uid: "80eb1a77-ac89-4b8f-8572-21d7a0596e4e",
              values: ["54t54", "43t", "4444"],
            },
          },
        ],
      },
      style: {},
      optional: true,
    },
    {
      uid: "a0f5c54e-4a1a-4775-845d-6637afd0174f",
      name: "43t43t",
      type: { name: "input" },
      style: {},
      optional: true,
    },
    {
      uid: "908c9113-3056-48e8-a8f2-6f4602abac98",
      name: "34t4",
      type: { name: "dropdown", values: ["34t4", "43g"] },
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

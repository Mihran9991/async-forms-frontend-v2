import React, { useState } from "react";
import { If, Then } from "react-if";
import { Button, Divider } from "antd";

import Input from "../../sharedComponents/formValueTypes/Input";
import GenericFieldType from "../../sharedComponents/formValueTypes/GenericFieldType";
import { DROP_DOWN, TABLE } from "../../constants/formConstants";
import { reconstructColumnsData } from "../../utils/formUtil";

const struct = {
  name: "ed",
  fields: [
    {
      uid: "0b8e035b-ade5-40e7-8454-3773be1ffee7",
      name: "ewf",
      type: {
        name: "table",
        fields: [
          {
            name: "wef",
            type: {
              name: "dropdown",
              uid: "835577ff-7cb8-4eb3-a9ce-d4e948c0693a",
              values: ["sdf"],
            },
          },
          {
            name: "dsd",
            type: {
              name: "input",
              uid: "b966f812-faca-4bce-bdb3-6ac8b9f18baa",
            },
          },
        ],
      },
      style: {},
      optional: true,
    },
    {
      uid: "78c7acf4-f9e8-43c1-b78d-95d0c3149a72",
      name: "wef",
      type: { name: "input" },
      style: {},
      optional: true,
    },
    {
      uid: "988f014a-21b5-48e3-9fa5-511a14f9e073",
      name: "ewfewf",
      type: { name: "dropdown", values: ["ewfewfewy65", "u556u"] },
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

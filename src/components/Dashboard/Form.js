import React, { useState } from "react";
import { If, Then } from "react-if";
import { Button, Divider } from "antd";

import Input from "../../sharedComponents/formValueTypes/Input";
import GenericValueType from "../../sharedComponents/formValueTypes/GenericValueType";
import { DROP_DOWN, TABLE } from "../../constants/formConstants";
import { reconstructColumnsData } from "../../utils/formUtil";

const struct = {
  name: "Users Form",
  fields: [
    {
      name: "name",
      type: {
        name: "input",
      },
      style: {},
      optional: false,
    },
    {
      name: "gender",
      type: {
        name: "dropdown",
        values: ["male", "female"],
      },
      style: {},
      optional: true,
    },
    {
      name: "workplaces",
      type: {
        name: "table",
        fields: [
          {
            name: "Company",
            type: {
              name: "dropdown",
              values: ["WebbFontaine", "Simply"],
            },
            style: {},
            optional: false,
          },
          {
            name: "Country",
            type: {
              name: "dropdown",
              values: ["Armenia", "USA", "Afghanistan", "Cuba"],
            },
            style: {},
            optional: false,
          },
          {
            name: "Start Date",
            type: {
              name: "input",
            },
            style: {},
            optional: true,
          },
          {
            name: "End Date",
            type: {
              name: "input",
            },
            style: {},
            optional: true,
          },
        ],
      },
      style: {},
      optional: false,
    },
  ],
};

function FormInstance({ data: { name, structure } }) {
  console.log("structure fields", structure);

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
            <GenericValueType
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

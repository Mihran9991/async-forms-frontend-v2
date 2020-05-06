import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { List, Card, Button } from "antd";
import { If, Then } from "react-if";
import get from "lodash/get";

import routeConstants from "../../constants/routeConstants";
import Input from "../../sharedComponents/formValueTypes/Input";
import { filterArray } from "../../utils/dataTransformUtil";

const mockInstances = [
  {
    title: "Form 1 Instance 1",
    instanceId: "1",
  },
  {
    title: "Form 1 Instance 2",
    instanceId: "2",
  },
  {
    title: "Form 1 Instance 3",
    instanceId: "3",
  },
  {
    title: "Form 1 Instance 4",
    instanceId: "4",
  },
];

const struct = {
  name: "Universities",
  fields: [
    {
      uid: "7b1ed4b7-525f-452a-b28c-26e7efd100a3",
      name: "Name",
      type: { name: "input" },
      style: {},
      optional: true,
      duplicate: false,
    },
    {
      uid: "eff9a568-c305-49d3-ab8e-b88c02aa4ee0",
      name: "Founded at",
      type: { name: "input" },
      style: {},
      optional: true,
      duplicate: false,
    },
    {
      uid: "3828245d-192c-44cc-9be6-56399344e85e",
      name: "Quality",
      type: { name: "dropdown", values: ["High", "Low"] },
      style: {},
      optional: true,
      duplicate: false,
    },
    {
      uid: "966f562d-0ddb-44e9-96d5-b4218ab096bd",
      name: "Faculties",
      type: {
        name: "table",
        fields: [
          {
            name: "Name",
            type: {
              name: "input",
              uid: "9ed8c809-ad5c-4684-8b43-67e40bf931a1",
            },
          },
          {
            name: "People",
            type: {
              name: "dropdown",
              uid: "00186bf2-68af-4465-999e-b4c7f818fedd",
              values: ["20-40", "40-60", "60+"],
            },
          },
          {
            name: "Founded at",
            type: {
              name: "input",
              uid: "7c411e84-ad28-4dc7-be60-1be8c8d9cc77",
            },
          },
        ],
      },
      style: {},
      optional: true,
      duplicate: false,
    },
  ],
};

// TODO:: structure should come from Form.js
function FormsInstances(props) {
  const { formData } = get(props, "location.state", {
    formData: { title: "", formId: "" },
  });

  const [instances, setInstances] = useState(mockInstances);
  const [pendingInstance, setPendingInstance] = useState(false);
  const [instanceName, setInstanceName] = useState("");

  const saveInstance = () => {
    setInstances([
      ...instances,
      {
        title: instanceName,
      },
    ]);
    setPendingInstance(false);
    setInstanceName("");
  };

  // const deleteInstance = (title) => {
  //   const filteredInstances = filterArray(instances, {
  //     filterBy: "title",
  //     notEqualTo: title,
  //   });

  //   setInstances(filteredInstances);
  //   // TODO:: API call(delete by Form name and Instance ID)
  // };

  return (
    <>
      <Button
        type="primary"
        disabled={pendingInstance}
        onClick={() => setPendingInstance(true)}
      >
        Add a form instance
      </Button>
      <br />
      <If condition={pendingInstance}>
        <Then>
          <Input cb={setInstanceName} callbackResponseOnlyValue />
          <br />
        </Then>
      </If>
      <If condition={instanceName.length > 0}>
        <Then>
          <Button type="primary" onClick={saveInstance}>
            Create
          </Button>
        </Then>
      </If>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={instances}
        renderItem={({ title, instanceId }) => (
          <List.Item>
            <Link
              to={{
                pathname: `${routeConstants.DASHBOARD}${routeConstants.FORM}`,
                state: {
                  instanceData: {
                    ...formData,
                    name: title,
                    structure: struct,
                    instanceId,
                  },
                },
              }}
            >
              <Card title={title}>Instance content</Card>
            </Link>
            {/* <Button type="danger" onClick={() => deleteInstance(title)}>
              Delete
            </Button> */}
          </List.Item>
        )}
      />
    </>
  );
}
export default withRouter(FormsInstances);

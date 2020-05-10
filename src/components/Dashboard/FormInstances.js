import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { List, Card, Button, Spin } from "antd";
import { If, Then } from "react-if";
import get from "lodash/get";

import routeConstants from "../../constants/routeConstants";
import Input from "../../sharedComponents/formValueTypes/Input";
import { getFormInstancesByFormName } from "../../services/request/formService";
import {
  getForm,
  createFormInstance,
} from "../../services/request/formService";
import useUser from "../../hooks/useUser";

function FormsInstances(props) {
  const { formData } = get(props, "location.state", {
    formData: { title: "", formId: "" },
  });
  const [instances, setInstances] = useState([]);
  const [instancesStructure, setInstancesStructure] = useState({});
  const [pendingInstance, setPendingInstance] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const [instanceName, setInstanceName] = useState("");
  const user = useUser();

  const saveInstance = async () => {
    try {
      setPendingInstance(false);
      setInstanceName("");
      setIsSpinning(true);

      await createFormInstance({
        formName: formData.title,
        instanceName,
      });
      const formName = formData.title;
      const { data: instances } = await getFormInstancesByFormName({
        params: {
          formName,
        },
      });

      setInstances([
        ...instances,
        {
          title: instanceName,
        },
      ]);
    } catch (e) {
      console.log("err", e);
    } finally {
      setIsSpinning(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      setIsSpinning(true);

      const formName = formData.title;
      const { data: instances } = await getFormInstancesByFormName({
        params: {
          formName,
        },
      });
      const { data: structure } = await getForm({
        params: {
          formName: formName,
        },
      });

      setIsSpinning(false);
      setInstances(instances);
      setInstancesStructure(structure);
    };

    getData();
  }, []);

  return (
    <Spin spinning={isSpinning}>
      <Button
        type="primary"
        disabled={pendingInstance}
        style={{ marginBottom: 10 }}
        onClick={() => setPendingInstance(true)}
      >
        Add a form instance
      </Button>
      <If condition={pendingInstance}>
        <Then>
          <Input
            cb={setInstanceName}
            callbackResponseOnlyValue
            style={{ marginBottom: 10 }}
          />
        </Then>
      </If>
      <If condition={instanceName.length > 0}>
        <Then>
          <Button
            type="primary"
            onClick={saveInstance}
            style={{ marginBottom: 10 }}
          >
            Create
          </Button>
        </Then>
      </If>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={instances}
        renderItem={({ name }) => (
          <List.Item>
            <Link
              to={{
                pathname: `${routeConstants.DASHBOARD}${routeConstants.FORM}`,
                state: {
                  instanceData: {
                    ...formData,
                    name,
                    structure: instancesStructure,
                    instanceId: name,
                    ownerId: user.email,
                  },
                },
              }}
            >
              {name && <Card title={name}>Instance content</Card>}
            </Link>
          </List.Item>
          // {/* <Button type="danger" onClick={() => deleteInstance(title)}>
          //     Delete
          //   </Button> */}
        )}
      />
    </Spin>
  );
}
export default withRouter(FormsInstances);

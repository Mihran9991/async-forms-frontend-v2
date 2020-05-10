import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { List, Card, Spin } from "antd";

import routeConstants from "../../constants/routeConstants";
import { getForms } from "../../services/request/formService";

function Forms() {
  const [forms, setForms] = useState([]);
  const [isSpinnig, setIsSpinnig] = useState([]);

  useEffect(() => {
    const getData = async () => {
      setIsSpinnig(true);
      try {
        const { data } = await getForms();

        setForms(data);
      } catch {
        console.log("error occured");
      } finally {
        setIsSpinnig(false);
      }
    };

    getData();
  }, []);

  return (
    <Spin spinning={isSpinnig}>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={forms}
        renderItem={({ name, id }) => (
          <List.Item>
            <Link
              to={{
                pathname: `${routeConstants.DASHBOARD}${routeConstants.FORM_INSTANCES}`,
                state: {
                  formData: {
                    formId: id,
                    title: name,
                  },
                },
              }}
            >
              <Card title={name}>Form content</Card>
            </Link>
          </List.Item>
        )}
      />
    </Spin>
  );
}
export default Forms;

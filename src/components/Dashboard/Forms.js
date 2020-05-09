import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { List, Card } from "antd";

import routeConstants from "../../constants/routeConstants";
import { getForms } from "../../services/request/formService";

function Forms() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getForms();

        setForms(data);
      } catch {
        console.log("error occured");
      }
    };

    getData();
  }, []);

  return (
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
  );
}
export default Forms;

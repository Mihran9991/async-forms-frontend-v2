import React from "react";
import { Link } from "react-router-dom";
import { List, Card } from "antd";

import routeConstants from "../../constants/routeConstants";

const data = [
  {
    title: "Title 1",
    formId: "1",
  },
  {
    title: "Title 2",
    formId: "2",
  },
  {
    title: "Title 3",
    formId: "3",
  },
  {
    title: "Title 4",
    formId: "4",
  },
];

function Forms() {
  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      renderItem={({ title, formId }) => (
        <List.Item>
          <Link
            to={{
              pathname: `${routeConstants.DASHBOARD}${routeConstants.FORM_INSTANCES}`,
              state: {
                formData: {
                  formId,
                  title,
                },
              },
            }}
          >
            <Card title={title}>Form content</Card>
          </Link>
        </List.Item>
      )}
    />
  );
}
export default Forms;

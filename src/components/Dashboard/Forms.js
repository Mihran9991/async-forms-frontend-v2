import React from "react";
import { Link } from "react-router-dom";
import { List, Card } from "antd";

import routeConstants from "../../constants/routeConstants";

const data = [
  {
    title: "Title 1",
  },
  {
    title: "Title 2",
  },
  {
    title: "Title 3",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 1",
  },
  {
    title: "Title 2",
  },
  {
    title: "Title 3",
  },
  {
    title: "Title 4",
  },
];

function Forms() {
  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Link to={`${routeConstants.DASHBOARD}${routeConstants.FORM}`}>
            <Card title={item.title}>Form content</Card>
          </Link>
        </List.Item>
      )}
    />
  );
}
export default Forms;

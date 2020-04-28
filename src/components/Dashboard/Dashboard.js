import React, { useState } from "react";
import { Route, withRouter, Switch, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { FileOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";

import Create from "./Create";
import styles from "./dashboard.module.scss";

const { Header, Content, Footer, Sider } = Layout;

function SiderDemo({ match }) {
  const [collapsed, setIsCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }} className={styles["dashboard"]}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className={styles["logo"]}>logo</div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1">
            <FileOutlined />
            <Link to={`${match.path}/create`}>
              <span>Create Form</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <FormOutlined />
            <Link to={`${match.path}/forms`}>
              <span>Forms</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <UserOutlined />
            <Link to={`${match.path}/profile`}>
              <span>User Profile</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <Switch>
            <Route path={`${match.path}/create`} component={Create} />
          </Switch>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          RAU ©2020 Created by Mihran/Adrian
        </Footer>
      </Layout>
    </Layout>
  );
}

export default withRouter(SiderDemo);

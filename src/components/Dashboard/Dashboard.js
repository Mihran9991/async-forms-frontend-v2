import React, { useState } from "react";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import { Layout, Menu } from "antd";
import { FileOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";

import routeConstants from "../../constants/routeConstants";

import Create from "./Create";
import Forms from "./Forms";
import Form from "./Form";

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
            <Link to={`${match.path}${routeConstants.CREATE}`}>
              {!collapsed && <span>Create Form</span>}
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <FormOutlined />
            <Link to={`${match.path}${routeConstants.FORMS}`}>
              {!collapsed && <span>Forms</span>}
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <UserOutlined />
            <Link to={`${match.path}${routeConstants.PROFILE}`}>
              {!collapsed && <span>User Profile</span>}
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "10px 16px" }}>
          <Switch>
            <Route
              path={`${match.path}${routeConstants.CREATE}`}
              component={Create}
            />
            <Route
              path={`${match.path}${routeConstants.FORMS}`}
              component={Forms}
            />
            <Route
              exact
              path={`${routeConstants.DASHBOARD}${routeConstants.FORM}`}
              component={Form}
            />
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

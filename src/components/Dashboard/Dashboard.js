/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import { Layout, Menu, Spin } from "antd";
import {
  FileOutlined,
  FormOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import routeConstants from "../../constants/routeConstants";
// import logo from "/public/logo.png";
import Create from "./Create";
import Forms from "./Forms";
import Form from "./Form";
import FormInstances from "./FormInstances";
import Profile from "../Profile";
import ActiveUsersList from "../../sharedComponents/ActiveUserList";
import ActiveUsersListPage from "./ActiveUsers";

import styles from "./dashboard.module.scss";
import { logOut } from "../../services/auth";

const { Header, Content, Footer, Sider } = Layout;

function SiderDemo({ match }) {
  const [collapsed, setIsCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  return (
    <Spin spinning={false}>
      <Layout style={{ minHeight: "100vh" }} className={styles["dashboard"]}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          {/*  TODO:: defaultSelectedKeys={read from url(or current selected)} */}
          <div className={styles["logo"]}>Logo</div>
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
                {!collapsed && <span>Profile</span>}
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <TeamOutlined />
              <Link to={`${match.path}${routeConstants.ACTIVE_USERS}`}>
                {!collapsed && <span>Active Users</span>}
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <a
              type="default"
              style={{ float: "right", marginRight: 35 }}
              onClick={logOut}
            >
              Log out
            </a>
            <ActiveUsersList />
          </Header>
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
              <Route
                exact
                path={`${routeConstants.DASHBOARD}${routeConstants.FORM_INSTANCES}`}
                component={FormInstances}
              />
              <Route
                exact
                path={`${routeConstants.DASHBOARD}${routeConstants.PROFILE}`}
                component={Profile}
              />
              <Route
                exact
                path={`${routeConstants.DASHBOARD}${routeConstants.ACTIVE_USERS}`}
                component={ActiveUsersListPage}
              />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center" }}>2020 ©RAU</Footer>
        </Layout>
      </Layout>
    </Spin>
  );
}

export default withRouter(SiderDemo);

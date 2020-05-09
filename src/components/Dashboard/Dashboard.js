import React, { useState } from "react";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import { FileOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";

import routeConstants from "../../constants/routeConstants";
// import logo from "/public/logo.png";
import Create from "./Create";
import Forms from "./Forms";
import Form from "./Form";
import FormInstances from "./FormInstances";
import Profile from "../Profile";

import styles from "./dashboard.module.scss";
import { removeCookie } from "../../services/cookie/cookieService";

const { Header, Content, Footer, Sider } = Layout;

function SiderDemo({ match }) {
  const [collapsed, setIsCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }} className={styles["dashboard"]}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className={styles["logo"]}>
          {/* <img
            className="Header-logo"
            src="/public/Async Forms_free-file.png"
            alt="Logo"
          /> */}
        </div>

        {/*  TODO:: defaultSelectedKeys={read from url(or current selected)} */}
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
          <Menu.Item key="3" style={{ marginBottom: "calc(100vh - 310px)" }}>
            <UserOutlined />
            <Link to={`${match.path}${routeConstants.PROFILE}`}>
              {!collapsed && <span>Profile</span>}
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Button
            type="default"
            style={{ float: "right" }}
            onClick={() => {
              removeCookie("user");
              window.location.reload();
            }}
          >
            Log out
          </Button>
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

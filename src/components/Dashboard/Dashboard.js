import React from "react";
import { Route, withRouter, Switch } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { Navbar, Nav } from "react-bootstrap";
import Create from "./Create";
import Sidebar from "../../sharedComponents/Sidebar";
import styles from "./dashboard.module.scss";

function Dashboard({ match }) {
  return (
    <div className={styles["dashboard"]}>
      <div className={styles["wrapper"]}>
        <Sidebar />
        <div className={styles["content"]}>
          <Navbar
            bg="light"
            variant="light"
            className={styles["custom-navbar"]}
          >
            <AiOutlineMenu className="icon" color="#000" />
            <Nav className="ml-auto">
              <Nav.Link href="#home">Profile</Nav.Link>
            </Nav>
          </Navbar>
          <main className={styles["main"]}>
            <Switch>
              <Route path={`${match.path}/create`} component={Create} />
            </Switch>
          </main>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Dashboard);

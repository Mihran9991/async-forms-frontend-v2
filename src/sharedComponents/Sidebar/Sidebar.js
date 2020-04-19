import React from "react";
import { Link, withRouter } from "react-router-dom";
import { AiOutlinePicLeft, AiOutlinePlus } from "react-icons/ai";
import styles from "./sidebar.module.scss";

function Sidebar({ match }) {
  return (
    <div className={styles["sidebar"]}>
      <ul className={styles["links"]}>
        <li className={styles["link-item"]}>
          <Link to={`${match.url}/tables`}>
            <AiOutlinePicLeft className="mr-2" />
            Tables
          </Link>
        </li>
        <li className={styles["link-item"]}>
          <Link to={`${match.url}/create`}>
            <AiOutlinePlus className="mr-2" />
            Create
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default withRouter(Sidebar);

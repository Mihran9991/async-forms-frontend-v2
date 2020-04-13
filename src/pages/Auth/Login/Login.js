import React from "react";
import styles from "../auth.module.scss";
import LogInComponent from "../../../components/Login/Login";

function Login() {
  return (
    <div className={styles["auth-wrapper"]}>
      <div className={styles["auth-inner"]}>
        <LogInComponent/>
      </div>
    </div>
  );
}

export default Login;

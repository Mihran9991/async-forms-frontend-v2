import React from "react";
import Login from "./Login/Login";
import styles from "./auth.module.scss";

function Auth() {
  return (
    <div className={styles["auth-wrapper"]}>
      <div className={styles["auth-inner"]}>
        <Login />
      </div>
    </div>
  );
}

export default Auth;

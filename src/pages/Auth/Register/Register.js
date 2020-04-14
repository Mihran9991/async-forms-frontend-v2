import React from "react";
import styles from "../auth.module.scss";
import RegisterComponent from "../../../components/Auth/Register";

function Register() {
  return (
    <div className={styles["auth-wrapper"]}>
      <div className={styles["auth-inner"]}>
        <RegisterComponent/>
      </div>
    </div>
  );
}

export default Register;

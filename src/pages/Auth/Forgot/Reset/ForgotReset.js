import React from "react";
import styles from "../../auth.module.scss";
import ForgotResetComponent from "../../../../components/Auth/Forgot/Reset/ForgotReset";

function ForgotReset() {
  return (
    <div className={styles["auth-wrapper"]}>
      <div className={styles["auth-inner"]}>
        <ForgotResetComponent />
      </div>
    </div>
  );
}

export default ForgotReset;

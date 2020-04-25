import React from "react";
import styles from "../../auth.module.scss";
import ForgotSendComponent from "../../../../components/Auth/Forgot/Send/ForgotSend";

function ForgotSend() {
  return (
    <div className={styles["auth-wrapper"]}>
      <div className={styles["auth-inner"]}>
        <ForgotSendComponent />
      </div>
    </div>
  );
}

export default ForgotSend;

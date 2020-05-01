import React from "react";
import { Button } from "antd";

import { INPUT, DROP_DOWN, TABLE } from "../../constants/formConstants";

import styles from "./form.module.scss";

function AddNewFieldsSection({ disabled, cb }) {
  return (
    <>
      <span>Add new fields</span>
      <div className={styles["add-new-fields"]}>
        <Button
          disabled={disabled}
          type="primary"
          onClick={() => cb({ structPiece: INPUT })}
          className={styles["add-new-fields-btn"]}
        >
          Add input field
        </Button>
        <Button
          disabled={disabled}
          type="primary"
          onClick={() => cb({ structPiece: DROP_DOWN })}
          className={styles["add-new-fields-btn"]}
        >
          Add drop down field
        </Button>
        <Button
          disabled={disabled}
          type="primary"
          onClick={() => cb({ structPiece: TABLE })}
          className={styles["add-new-fields-btn"]}
        >
          Add table field
        </Button>
      </div>
    </>
  );
}

export default AddNewFieldsSection;

import React from "react";
import { If, Else, Then } from "react-if";
import Button from "react-bootstrap/Button";

import { transformObjectDataIntoArray } from "../../utils/dataTransform";
import RowProperties from "../../sharedComponents/Table/RowProperties";
import styles from "./dashboard.module.scss";

function AddTableRows({
  setRowData,
  isResetRowInputGroup,
  setIsResetRowInputGroup,
  currentRow,
  isPendingRow,
  setIsPendingRow,
  isCurrentRowValid,
  saveRow,
  columns,
}) {
  return (
    <div className={styles["add-table-rows"]}>
      <h4>Add Table Row</h4>
      <RowProperties
        data={transformObjectDataIntoArray(columns)}
        cb={setRowData}
        reset={isResetRowInputGroup}
        resetCallback={setIsResetRowInputGroup}
        currentValue={currentRow}
      />
      <If condition={isPendingRow}>
        <Then>
          <Button
            variant="outline-success"
            onClick={() => setIsPendingRow(true)}
          >
            Add Row
          </Button>
        </Then>
        <Else>
          <If condition={isCurrentRowValid()}>
            <Then>
              <Button variant="outline-success" onClick={saveRow}>
                Save
              </Button>
            </Then>
          </If>
        </Else>
      </If>
    </div>
  );
}

export default AddTableRows;

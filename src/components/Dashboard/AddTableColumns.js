import React from "react";
import { If, Else, Then } from "react-if";
import Button from "react-bootstrap/Button";
import classnames from "classnames";

import { TABLE_DATA_TYPES } from "../../constants/tableConstants";
import DropDown from "../../sharedComponents/formValueTypes/DropDown";
import InputGroup from "../../sharedComponents/InputGroup";
import Input from "../../sharedComponents/formValueTypes/Input";
import styles from "./dashboard.module.scss";

function AddTableColumns({
  isPendingColumn,
  setColumnData,
  currentColumn,
  isCurrentColumnValid,
  saveColumn,
  setIsPendingColumn,
}) {
  return (
    <div className={styles["add-table-columns"]}>
      <h4>Add Table Column</h4>
      <If condition={isPendingColumn}>
        <Then>
          <InputGroup>
            <div
              className={classnames({
                [styles["enter-column-name"]]: true,
                [styles["input-group-item"]]: true,
              })}
            >
              <span>Enter Column Name</span>
              <Input
                cb={setColumnData}
                propName="name"
                type="text"
                defaultValue={currentColumn.name}
                fullWidth
              />
            </div>
            <div
              className={classnames({
                [styles["select-field-type"]]: true,
                [styles["input-group-item"]]: true,
              })}
            >
              <span>Choose Column Type</span>
              <DropDown cb={setColumnData} items={TABLE_DATA_TYPES} />
            </div>
          </InputGroup>
          <If condition={isCurrentColumnValid()}>
            <Button variant="outline-success" onClick={saveColumn}>
              Save
            </Button>
          </If>
        </Then>
        <Else>
          <Button
            variant="outline-success"
            onClick={() => setIsPendingColumn(true)}
          >
            Add Column
          </Button>
        </Else>
      </If>
    </div>
  );
}

export default AddTableColumns;

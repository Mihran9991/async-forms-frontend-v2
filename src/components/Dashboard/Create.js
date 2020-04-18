import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { If, Else, Then } from "react-if";
import classnames from "classnames";
import isEqual from "lodash/isEqual";
import has from "lodash/has";

import Stepper from "../../sharedComponents/Stepper";
import Card from "../../sharedComponents/Card";
import Input from "../../sharedComponents/formValueTypes/Input";
import InputGroup from "../../sharedComponents/InputGroup";
import Table from "../../sharedComponents/Table";
import RowProperties from "../../sharedComponents/Table/RowProperties";
import DropDown from "../../sharedComponents/formValueTypes/DropDown";
import {
  transformObjectDataIntoArray,
  sortfObjectByKey,
} from "../../utils/dataTransform";
import { TABLE_DATA_TYPES, COLUMN_KEYS } from "../../constants/tableConstants";
import styles from "./dashboard.module.scss";

function Create() {
  const [isPendingColumn, setIsPendingColumn] = useState(false);
  const [isPendingRow, setIsPendingRow] = useState(false);
  const [currentColumn, setCurrentColumn] = useState({ name: "", type: "" });
  const [currentRow, setCurrentRow] = useState({});
  const [columns, setColumns] = useState({});
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");
  const [isResetRowInputGroup, setIsResetRowInputGroup] = useState(false);

  const isDuplicateColumn = (name) => {
    return has(columns, name);
  };

  const saveColumn = () => {
    const { name, type } = currentColumn;
    if (isDuplicateColumn(name)) {
      // TODO:: handle with modal | notification
      alert("DUPICATE COLUMN ERROR");
      return;
    }

    setColumns({ ...columns, [name]: { type } });
    setIsPendingColumn(false);
    setCurrentColumn({});
  };

  const saveRow = () => {
    setRows([...rows, sortfObjectByKey(currentRow)]);
    setIsPendingRow(false);
    setCurrentRow({});
  };

  const setRowData = (data) => {
    const [[key, { type, value }]] = Object.entries(data);
    const currentRowCopy = { ...currentRow };

    if (!value && currentRowCopy[key]) {
      delete currentRowCopy[key];
      setCurrentRow(currentRowCopy);
      return;
    }

    setCurrentRow({
      ...currentRow,
      ...data,
    });
  };

  const removeEmptyValuedColumnByKey = (key, value) => {
    const currentColumnCopy = { ...currentColumn };

    if (!value && has(currentColumnCopy, key)) {
      delete currentColumnCopy[key];
      setCurrentColumn(currentColumnCopy);
      return;
    }
  };

  const setColumnData = (data) => {
    const [[key, value]] = transformObjectDataIntoArray(data);

    removeEmptyValuedColumnByKey(key, value);
    setCurrentColumn({
      ...currentColumn,
      ...data,
    });
  };

  const isCurrentColumnValid = () => {
    const currentColumnPropertyKeys = Object.keys(currentColumn).sort();
    const areKeysPresent = isEqual(currentColumnPropertyKeys, COLUMN_KEYS);
    const areValuesNotEmpty = Object.values(currentColumn).every(
      (val) => val.length > 0
    );

    return areKeysPresent && areValuesNotEmpty;
  };

  const isCurrentRowValid = () => {
    const currentRowProperties = Object.keys(currentRow)
      .filter((key) => key !== "type")
      .sort();
    const columnNames = transformObjectDataIntoArray(columns, "keys")
      .map((name) => name)
      .sort();

    return isEqual(currentRowProperties, columnNames);
  };

  useEffect(() => {
    setIsResetRowInputGroup(!isPendingRow && rows.length);
  }, [isPendingRow, rows]);

  return (
    <>
      <Card>
        <Stepper
          allowNextSteps={[
            Boolean(title),
            Boolean(
              !isPendingColumn &&
                transformObjectDataIntoArray(columns, "keys").length
            ),
            true,
          ]}
        >
          <div className={styles["add-table-name"]}>
            <h4>Add Table Name</h4>
            <Input
              cb={setTitle}
              propName="table-name"
              type="text"
              defaultValue={title}
              onlyValue
            />
          </div>
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
          <div className={styles["add-table-rows"]}>
            <h4>Add Table Row</h4>
            <RowProperties
              data={transformObjectDataIntoArray(sortfObjectByKey(columns))}
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
        </Stepper>
      </Card>
      <Table title={title} columns={sortfObjectByKey(columns)} rows={rows} />
    </>
  );
}

export default Create;

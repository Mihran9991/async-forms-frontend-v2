import React, { useState, useEffect } from "react";
import isEqual from "lodash/isEqual";
import has from "lodash/has";

import AddTableName from "./AddTableName";
import AddTableColumns from "./AddTableColumns";
import AddTableRows from "./AddTableRows";
import Stepper from "../../sharedComponents/Stepper";
import Card from "../../sharedComponents/Card";
import Table from "../../sharedComponents/Table";
import {
  transformObjectDataIntoArray,
  sortfObjectByKey,
} from "../../utils/dataTransform";
import { COLUMN_KEYS } from "../../constants/tableConstants";

function Create() {
  const [isPendingColumn, setIsPendingColumn] = useState(false);
  const [isPendingRow, setIsPendingRow] = useState(false);
  const [currentColumn, setCurrentColumn] = useState({ name: "", type: "" });
  const [currentRow, setCurrentRow] = useState({});

  // We are representing columns as a hashMap({}) in order to avoid
  // duplicate column names.
  const [columns, setColumns] = useState({});
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");
  const [isResetRowInputGroup, setIsResetRowInputGroup] = useState(false);

  const editRowHandler = (index, editedData) => {
    const rowsCopy = [...rows];

    rowsCopy[index] = {
      ...rowsCopy[index],
      ...editedData,
    };

    setRows(rowsCopy);
  };

  const isDuplicateColumn = (name) => has(columns, name);

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

  const setColumnData = (data) => {
    const [[key, value]] = transformObjectDataIntoArray(data);

    removeEmptyValuedColumnByKey(key, value);
    setCurrentColumn({
      ...currentColumn,
      ...data,
    });
  };

  const saveRow = () => {
    setRows([...rows, sortfObjectByKey(currentRow)]);
    setIsPendingRow(false);
    setCurrentRow({});
  };

  const setRowData = (data) => {
    console.log("setRowData");

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
    }
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
    setIsResetRowInputGroup(Boolean(!isPendingRow && rows.length));
  }, [isPendingRow, rows]);

  return (
    <>
      <Card>
        <Stepper
          allowNextSteps={[
            Boolean(title),
            Boolean(transformObjectDataIntoArray(columns, "keys").length),
            true,
          ]}
        >
          <AddTableName setTitle={setTitle} title={title} />
          <AddTableColumns
            isPendingColumn={isPendingColumn}
            setColumnData={setColumnData}
            currentColumn={currentColumn}
            isCurrentColumnValid={isCurrentColumnValid}
            saveColumn={saveColumn}
            setIsPendingColumn={setIsPendingColumn}
          />
          <AddTableRows
            setRowData={setRowData}
            isResetRowInputGroup={isResetRowInputGroup}
            setIsResetRowInputGroup={setIsResetRowInputGroup}
            currentRow={currentRow}
            isPendingRow={isPendingRow}
            setIsPendingRow={setIsPendingRow}
            isCurrentRowValid={isCurrentRowValid}
            saveRow={saveRow}
            columns={columns}
          />
        </Stepper>
      </Card>
      <Table
        title={title}
        columns={sortfObjectByKey(columns)}
        rows={rows}
        editRowHandler={editRowHandler}
      />
    </>
  );
}

export default Create;

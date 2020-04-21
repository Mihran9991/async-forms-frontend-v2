import React, { useState } from "react";
import isEqual from "lodash/isEqual";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";

import AddTableName from "./AddTableName";
import Stepper from "../../sharedComponents/Stepper";
import Card from "../../sharedComponents/Card";
import Table from "../../sharedComponents/Table";
import {
  transformObjectDataIntoArray,
  renameObjectKey,
} from "../../utils/dataTransformUtil";
import {
  generateRowByColumns,
  isInvalidColumnAvailable,
} from "../../utils/tableUtil";

function Create() {
  const [columns, setColumns] = useState({});
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");

  const transformedColumns = transformObjectDataIntoArray(columns, "values");
  const hasTableInvalidColumn = isInvalidColumnAvailable(transformedColumns);
  /**
   *
   * @param {string} name
   * @param {Object | string} editedData
   * @param {string} structurePiece ("name" | "type")
   */
  const editColumnHandler = (oldName, editedData) => {
    if (isEmpty(editedData)) {
      return;
    }

    const columnsCopy = { ...columns };
    const [[newName, value]] = transformObjectDataIntoArray(
      editedData,
      "entries"
    );

    if (
      !isEqual(editedData, columnsCopy[newName]) &&
      isColumnNameExisting(newName)
    ) {
      // TODO:: handle with modal | notification
      alert("DUPICATE COLUMN ERROR");
      return;
    }

    if (oldName !== newName) {
      const modiviedColumnsCopy = renameObjectKey(
        columnsCopy,
        oldName,
        newName
      );

      modiviedColumnsCopy[newName] = value;
      setColumns(modiviedColumnsCopy);
    } else {
      columnsCopy[newName] = value;
      setColumns(columnsCopy);
    }
  };

  const deleteColumnByNameHandler = (name) => {
    const columnsCopy = { ...columns };

    delete columnsCopy[name];
    setColumns(columnsCopy);
  };

  const createColumnHandler = () => {
    if (isColumnNameExisting("") || hasTableInvalidColumn) {
      // TODO:: handle with modal | notification
      alert("Please fill pending column before trying to create new");
      return;
    }

    setColumns({ ...columns, "": { type: "" } });
  };

  const isColumnNameExisting = (name) => has(columns, name);

  const editRowHandler = (index, editedData) => {
    const rowsCopy = [...rows];
    rowsCopy[index] = {
      ...rowsCopy[index],
      ...editedData,
    };

    setRows(rowsCopy);
  };

  const createRowHandler = () => {
    setRows([...rows, generateRowByColumns(columns)]);
  };

  console.log("columns", columns);

  console.log("rows", rows);

  return (
    <Card>
      <Stepper
        allowPreviousSteps={[true, false]}
        allowNextSteps={[
          Boolean(title),
          Boolean(transformObjectDataIntoArray(columns, "keys").length),
        ]}
      >
        <AddTableName setTitle={setTitle} title={title} />
        <Table
          title={title}
          columns={columns}
          rows={rows}
          createRowHandler={createRowHandler}
          editRowHandler={editRowHandler}
          editColumnHandler={editColumnHandler}
          deleteColumnByNameHandler={deleteColumnByNameHandler}
          createColumnHandler={createColumnHandler}
          isInvalidColumnAvailable={hasTableInvalidColumn}
        />
      </Stepper>
    </Card>
  );
}

export default Create;

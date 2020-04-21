import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import get from "lodash/get";
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

function addNewColumnsAlreadyExistingRows(rows, newColumn) {
  return rows.reduce((acc, currentRow) => {
    return [...acc, { ...currentRow, ...newColumn }];
  }, []);
}

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
  const saveColumnHandler = (oldName, editedData) => {
    if (isEmpty(editedData)) {
      return;
    }

    const columnsCopy = { ...columns };
    const [[newName, value]] = transformObjectDataIntoArray(
      editedData,
      "entries"
    );
    const constructedValue = has(value, "uid")
      ? value
      : { ...value, uid: uuidv4() };

    const isColumnExisting = () => {
      return (
        has(columnsCopy, newName) &&
        get(columnsCopy, `${newName}.uid`) !== get(constructedValue, "uid")
      );
    };

    if (isColumnExisting()) {
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
      modiviedColumnsCopy[newName] = constructedValue;
      setColumns(modiviedColumnsCopy);
    } else {
      columnsCopy[newName] = constructedValue;
      setColumns(columnsCopy);
    }
  };

  const deleteColumnByNameHandler = (name) => {
    const columnsCopy = { ...columns };

    delete columnsCopy[name];
    setColumns(columnsCopy);
  };

  const createColumnHandler = () => {
    console.log("hasTableInvalidColumn", hasTableInvalidColumn);

    if (hasTableInvalidColumn) {
      // TODO:: handle with modal | notification
      alert("Please fill pending column before trying to create new");
      return;
    }
    const emptyColumn = { "": { type: "" } };
    // if (rows.length) {
    //   addNewColumnsAlreadyExistingRows(columns, emptyColumn);
    // }

    setColumns({ ...columns, ...emptyColumn });
  };

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
          saveColumnHandler={saveColumnHandler}
          deleteColumnByNameHandler={deleteColumnByNameHandler}
          createColumnHandler={createColumnHandler}
          isInvalidColumnAvailable={hasTableInvalidColumn}
        />
      </Stepper>
    </Card>
  );
}

export default Create;

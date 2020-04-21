import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import get from "lodash/get";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

import AddTableName from "./AddTableName";
import Stepper from "../../sharedComponents/Stepper";
import Card from "../../sharedComponents/Card";
import Table from "../../sharedComponents/Table";
import {
  transformObjectDataIntoArray,
  renameObjectKey,
  filterObjectByKey,
} from "../../utils/dataTransformUtil";
import {
  generateRowByColumns,
  isInvalidColumnAvailable,
  addNewColumnsToExistingRows,
  deleteColumnFromExistingRowsByName,
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
  const saveColumnHandler = (oldName, editedData) => {
    if (isEmpty(editedData)) return;
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

    if (!isEqual(oldName, newName)) {
      const modifiedColumnsCopy = renameObjectKey(
        columnsCopy,
        oldName,
        newName
      );
      modifiedColumnsCopy[newName] = constructedValue;
      setColumns(modifiedColumnsCopy);
    } else {
      columnsCopy[newName] = constructedValue;
      setColumns(columnsCopy);
    }

    if (rows.length) {
      setRows(
        addNewColumnsToExistingRows([...rows], {
          [newName]: filterObjectByKey(value, "uid"),
        })
      );
    }
  };

  const deleteColumnByNameHandler = (name) => {
    const columnsCopy = { ...columns };

    delete columnsCopy[name];
    setColumns(columnsCopy);
    setRows(deleteColumnFromExistingRowsByName([...rows], name));
  };

  const createColumnHandler = () => {
    if (hasTableInvalidColumn) {
      // TODO:: handle with modal | notification
      alert("Please fill pending column before trying to create new");
      return;
    }

    const emptyColumn = { "": { type: "" } };
    const emptyColumnWithId = { "": { type: "", uid: uuidv4() } };

    if (rows.length) {
      setRows(addNewColumnsToExistingRows([...rows], emptyColumn));
    }

    setColumns({ ...columns, ...emptyColumnWithId });
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

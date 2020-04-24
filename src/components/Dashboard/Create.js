import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import get from "lodash/get";
import has from "lodash/has";
import remove from "lodash/remove";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

import FormName from "../../sharedComponents/Form/FormName";
import Card from "../../sharedComponents/Card";
import Form from "../../sharedComponents/Form";
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
} from "../../utils/formUtil";

function Create() {
  const [columns, setColumns] = useState({});
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");

  const transformedColumns = transformObjectDataIntoArray(columns, "values");
  const formHasInvalidColumn = isInvalidColumnAvailable(transformedColumns);

  /**
   *
   * @param {string} name
   * @param {Object | string} editedData
   * @param {string} structurePiece ("name" | "type")
   */
  const editColumnHandler = (oldName, editedData) => {
    if (isEmpty(editedData)) return;
    const columnsCopy = { ...columns };
    const [[newName, value]] = transformObjectDataIntoArray(
      editedData,
      "entries"
    );
    const constructedValue = has(value, "uid")
      ? value
      : { ...value, uid: uuidv4() };
    const isColumnExists =
      has(columnsCopy, newName) &&
      get(columnsCopy, `${newName}.uid`) !== get(constructedValue, "uid");

    if (isColumnExists) {
      // TODO:: handle with modal | notification
      alert("DUPICATE COLUMN ERROR");
      return;
    }

    // case, when column name has been modified
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

    // updating existing rows with new column
    if (rows.length) {
      const updatedRows = deleteColumnFromExistingRowsByName(rows, oldName);
      setRows(
        addNewColumnsToExistingRows([...updatedRows], {
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
    if (formHasInvalidColumn) {
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

  const deleteRowHandler = (rowId) => {
    const updatedRows = remove(
      rows,
      (_, currentRowId) => rowId !== currentRowId
    );

    setRows(updatedRows);
  };
  return (
    <Card>
      <FormName saveTitle={setTitle} title={title} />
      <Form
        title={title}
        columns={columns}
        rows={rows}
        createRowHandler={createRowHandler}
        deleteRowHandler={deleteRowHandler}
        editRowHandler={editRowHandler}
        editColumnHandler={editColumnHandler}
        deleteColumnByNameHandler={deleteColumnByNameHandler}
        createColumnHandler={createColumnHandler}
        isInvalidColumnAvailable={formHasInvalidColumn}
      />
    </Card>
  );
}

export default Create;

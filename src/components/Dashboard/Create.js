import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import get from "lodash/get";
import has from "lodash/has";
import remove from "lodash/remove";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

import FormName from "../../sharedComponents/Form/FormName";
import Card from "../../sharedComponents/Card";
import Column from "../../sharedComponents/Form/Column";
import EditabelTable from "../../sharedComponents/editabelTable";

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

const originData = [];

for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

// {
//   title: () => (
//     <Column
//       name="test"
//       editColumnHandler={editColumnHandler}
//       deleteColumnByNameHandler={deleteColumnByNameHandler}
//     />
//   ),
//   dataIndex: "address",
//   width: "40%",
//   editable: true,
// },

function generateTitle(
  editColumnHandler,
  deleteColumnByNameHandler,
  columns,
  name
) {
  return (
    <Column
      name={name}
      editColumnHandler={(editedData) =>
        editColumnHandler(columns.length, editedData)
      }
      deleteColumnByNameHandler={deleteColumnByNameHandler}
    />
  );
}

function Create() {
  const [columns, setColumns] = useState([]);
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
  // const editColumnHandler = (oldName, editedData) => {
  //   if (isEmpty(editedData)) return;
  //   const columnsCopy = { ...columns };
  //   const [[newName, value]] = transformObjectDataIntoArray(
  //     editedData,
  //     "entries"
  //   );
  //   const constructedValue = has(value, "uid")
  //     ? value
  //     : { ...value, uid: uuidv4() };
  //   const isColumnExists =
  //     has(columnsCopy, newName) &&
  //     get(columnsCopy, `${newName}.uid`) !== get(constructedValue, "uid");

  //   if (isColumnExists) {
  //     // TODO:: handle with modal | notification
  //     alert("DUPICATE COLUMN ERROR");
  //     return;
  //   }

  //   // case, when column name has been modified
  //   if (!isEqual(oldName, newName)) {
  //     const modifiedColumnsCopy = renameObjectKey(
  //       columnsCopy,
  //       oldName,
  //       newName
  //     );

  //     modifiedColumnsCopy[newName] = constructedValue;
  //     setColumns(modifiedColumnsCopy);
  //   } else {
  //     columnsCopy[newName] = constructedValue;
  //     setColumns(columnsCopy);
  //   }

  //   // updating existing rows with new column
  //   if (rows.length) {
  //     const updatedRows = deleteColumnFromExistingRowsByName(rows, oldName);
  //     setRows(
  //       addNewColumnsToExistingRows([...updatedRows], {
  //         [newName]: filterObjectByKey(value, "uid"),
  //       })
  //     );
  //   }
  // };

  const deleteColumnByNameHandler = (name) => {
    const columnsCopy = { ...columns };

    delete columnsCopy[name];
    setColumns(columnsCopy);
    setRows(deleteColumnFromExistingRowsByName([...rows], name));
  };

  const createColumnHandler = () => {
    const emptyColumn = {
      title: () =>
        generateTitle(
          editColumnHandler,
          deleteColumnByNameHandler,
          columns,
          ""
        ),
      dataIndex: "",
      width: "25%",
      editable: true,
    };
    const emptyColumnWithId = { ...emptyColumn, uid: uuidv4() };

    setColumns([...columns, emptyColumnWithId]);
  };

  const editColumnHandler = (id, { name }) => {
    const columnsCopy = [...columns];

    if (columnsCopy[id]) {
      columnsCopy[id] = {
        ...columnsCopy[id],
        title: generateTitle(
          editColumnHandler,
          deleteColumnByNameHandler,
          columns,
          name
        ),
      };
    } else {
      columnsCopy[id] = {
        title: generateTitle(
          editColumnHandler,
          deleteColumnByNameHandler,
          columns,
          name
        ),
        dataIndex: name,
        width: "40%",
        editable: true,
      };
    }

    setColumns(columnsCopy);
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
      {/* <FormName saveTitle={setTitle} title={title} /> */}
      <EditabelTable
        deleteColumnByNameHandler={deleteColumnByNameHandler}
        editColumnHandler={editColumnHandler}
        createColumnHandler={createColumnHandler}
        createRowHandler={createRowHandler}
        rows={[]}
        columns={columns}
      />
      {/* <Form
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
      /> */}
    </Card>
  );
}

export default Create;

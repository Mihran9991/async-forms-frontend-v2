import React, { useState } from "react";
import { If, Then } from "react-if";
import { v4 as uuidv4 } from "uuid";

import FormName from "../../sharedComponents/Form/FormName";
import Card from "../../sharedComponents/Card";
import EditabelTable from "../../sharedComponents/editabelTable";
import {
  transformObjectDataIntoArray,
  filterObjectByKey,
} from "../../utils/dataTransformUtil";
import {
  generateRowByColumns,
  isInvalidColumnAvailable,
  isDuplicateColumnAvailable,
} from "../../utils/formUtil";

function Create() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");
  const [specificData, setSpecificData] = useState({});

  const transformedColumns = transformObjectDataIntoArray(columns, "values");

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

  const deleteColumnByNameHandler = (id) => {
    const columnsCopy = [...columns].filter((col) => {
      return col.dataIndex !== id;
    });

    setColumns(columnsCopy);
  };

  const createColumnHandler = () => {
    if (isInvalidColumnAvailable(transformedColumns)) {
      alert("Please fill current column before trying to create news");
      return;
    }

    const emptyColumn = {
      dataIndex: "",
      width: "25%",
      editable: true,
      type: "",
      uid: uuidv4(),
    };

    setColumns([...columns, emptyColumn]);
  };

  const editColumnHandler = (oldName, uid, { name, type }) => {
    if (isDuplicateColumnAvailable(columns, { name, uid })) {
      alert("Duplicate column");
      return;
    }

    const columnsCopy = [...columns];

    for (let i = 0; i < columnsCopy.length; ++i) {
      if (
        columnsCopy[i].dataIndex === oldName ||
        columnsCopy[i].dataIndex === ""
      ) {
        columnsCopy[i] = {
          ...columnsCopy[i],
          dataIndex: name,
          type,
        };
        break;
      }
    }

    setColumns(columnsCopy);
  };

  const createRowHandler = () => {
    setRows([
      ...rows,
      { key: String(rows.length), ...generateRowByColumns(columns) },
    ]);
  };

  const deleteRowHandler = (rowId) => {
    const specificDataCopy = { ...specificData };
    const keys = Object.keys(specificData);
    for (let i = 0; i < keys.length; ++i) {
      const extractedKey = keys[i].split("-")[0];
      if (extractedKey == rowId) {
        const newData = filterObjectByKey(specificDataCopy, keys[i]);
        setSpecificData(newData);
        break;
      }
    }

    const updatedRows = [...rows].filter(({ key }, idx) => key !== rowId);

    setRows(updatedRows);
  };

  return (
    <Card>
      <FormName saveTitle={setTitle} title={title} />
      <If condition={title.length}>
        <Then>
          <EditabelTable
            deleteColumnByNameHandler={deleteColumnByNameHandler}
            editColumnHandler={editColumnHandler}
            createRowHandler={createRowHandler}
            deleteRowHandler={deleteRowHandler}
            editRowHandler={setRows}
            createColumnHandler={createColumnHandler}
            rows={rows}
            columns={columns}
            specificData={specificData}
            specificDataHandler={(newData) => {
              setSpecificData({ ...specificData, ...newData });
            }}
          />
        </Then>
      </If>
    </Card>
  );
}

export default Create;

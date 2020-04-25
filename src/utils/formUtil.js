import get from "lodash/get";

import { transformObjectDataIntoArray } from "./dataTransformUtil";
import {
  DROP_DOWN,
  DROP_DOWN_INITIAL_VALUE,
  INPUT_INITIAL_VALUE,
} from "../constants/formConstants";

export const generateRowByColumns = (columns) => {
  return columns.reduce((acc, { dataIndex }, i) => {
    return {
      ...acc,
      [dataIndex]: "",
    };
  }, {});
};

export const isColumnValid = (column) => {
  return (
    get(column, "dataIndex", false).length &&
    // get(column, "uid", false).length &&
    get(column, "type", false).length
  );
};

export const isInvalidColumnAvailable = (columns) => {
  for (let i = 0; i < columns.length; ++i) {
    if (!isColumnValid(columns[i])) {
      return true;
    }
  }

  return false;
};

export const addNewColumnsToExistingRows = (rows, newColumn) => {
  return rows.reduce((acc, currentRow) => {
    // deleting initial column(e.g "": {type: ""})
    if (get(currentRow, "")) delete currentRow[""];

    const [[name, properties]] = transformObjectDataIntoArray(
      newColumn,
      "entries"
    );

    return [
      ...acc,
      {
        ...currentRow,
        [name]: {
          ...properties,
          value:
            properties.type === DROP_DOWN
              ? DROP_DOWN_INITIAL_VALUE
              : INPUT_INITIAL_VALUE,
        },
      },
    ];
  }, []);
};

export const deleteColumnFromExistingRowsByName = (rows, name) => {
  return rows.reduce((acc, currentRow) => {
    delete currentRow[name];
    return [...acc, { ...currentRow }];
  }, []);
};

export const prepareRowDataForApi = (rows, specificData) => {
  const rowsCopy = [...rows];
  return rowsCopy.reduce((acc, row) => {
    let rowCopy = { ...row };
    const rowKeys = transformObjectDataIntoArray(row, "keys");
    const key = row.key;
    for (let i = 0; i < rowKeys.length; ++i) {
      const currentKey = rowKeys[i];
      const constructedKey = `${key}-${currentKey}`;

      if (specificData[constructedKey]) {
        rowCopy[rowKeys[i]] = specificData[constructedKey];
      }
    }

    return [...acc, rowCopy];
  }, []);
};

export const preparColumnDataForApi = (columns) => {
  return columns.reduce((acc, { dataIndex, type, uid }) => {
    return [...acc, { name: dataIndex, type, uid }];
  }, []);
};

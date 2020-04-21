import get from "lodash/get";

import { transformObjectDataIntoArray } from "./dataTransformUtil";
import { DROP_DOWN } from "../constants/tableConstants";

export const generateRowByColumns = (columns) => {
  return transformObjectDataIntoArray(columns, "entries").reduce(
    (acc, [name, { type }]) => {
      return {
        ...acc,
        [name]: { value: type === DROP_DOWN ? [] : "", type },
      };
    },
    {}
  );
};

export const isColumnValid = (column) =>
  get(column, "type", "").length && get(column, "uid", "false").length;

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
          value: properties.type === DROP_DOWN ? [] : "",
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

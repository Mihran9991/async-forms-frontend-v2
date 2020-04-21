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

export const isColumnInvalid = (column) =>
  !get(column, "type", "").length || !get(column, "uid", "false").length;

export const isInvalidColumnAvailable = (columns) => {
  for (let i = 0; i < columns.length; ++i) {
    if (isColumnInvalid(columns[i])) {
      return true;
    }
  }

  return false;
};

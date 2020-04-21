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

export const isInvalidColumnAvailable = (columns) => {
  for (let i = 0; i < columns.length; ++i) {
    const areValuesEmpty = transformObjectDataIntoArray(
      columns[i],
      "values"
    ).every((val) => val.length === 0);

    if (areValuesEmpty) return true;
  }

  return false;
};

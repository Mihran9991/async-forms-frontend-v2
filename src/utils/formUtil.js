import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { v4 as uuid } from "uuid";

import { transformObjectDataIntoArray } from "./dataTransformUtil";
import {
  DROP_DOWN,
  DROP_DOWN_INITIAL_VALUE,
  INPUT_INITIAL_VALUE,
  INPUT,
  TABLE,
} from "../constants/formConstants";

// TODO :: check if iterable before iterating over objects !!!!!!!!
export const generateRowByColumns = (columns) => {
  return columns.reduce((acc, { dataIndex }) => {
    return {
      ...acc,
      [dataIndex]: "",
    };
  }, {});
};

export const isColumnValid = (column) => {
  const typeObj = get(column, "type", {});
  const dataIndex = get(column, "dataIndex", "");
  const typeName = get(typeObj, "name", "");
  const uid = get(typeObj, "uid", "");
  const fields = get(typeObj, "fields", []);

  if (!isEmpty(typeObj)) {
    if (typeName === INPUT) {
      return dataIndex.length && uid.length;
    }

    return dataIndex.length && typeName.length && uid.length && fields.length;
  }

  return false;
};

export const isInvalidColumnAvailable = (columns) =>
  columns.some((col) => !isColumnValid(col));

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
    const rowCopy = { ...row };
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

export const formatColumnProperties = ({ name, fields, type, uid }) => {
  console.log("formatColumnProperties ------->", { name, fields, type, uid });

  return {
    name,
    type: {
      name: type,
      uid: uid ? uid : uuid(),
      ...(type !== INPUT && { fields }),
    },
  };
};

export const getColumnsTypeObj = (columns) => {
  return columns.reduce((acc, { type, dataIndex: name }) => {
    return [...acc, { name, type }];
  }, []);
};

export const prepareColumnDataForApi = (columns) => {
  return columns.reduce((acc, { dataIndex, type, uid, fields }) => {
    return [
      ...acc,
      formatColumnProperties({
        name: dataIndex,
        type,
        uid,
        ...(type !== INPUT && { fields }),
      }),
    ];
  }, []);
};

export const isDuplicateColumnAvailable = (columns, { name, uid }) => {
  return columns.some(({ dataIndex, uid: colUid }) => {
    return dataIndex === name && colUid !== uid;
  });
};

export const formatDropDownData = (data) => {
  const modifiedData = transformObjectDataIntoArray(data, "values")[0];

  console.log("modifiedData", modifiedData);

  return modifiedData.reduce((acc, { value }) => {
    return [...acc, value];
  }, []);
};

export const reconstructDropDownData = (data, key) => {
  console.log("reconstruct", data);

  return data.reduce((acc, value) => [...acc, { key, value }], []);
};

export const validateField = (field, type) => {
  console.log("field ------->", field);

  if (isEmpty(field)) {
    return false;
  }

  if (type === INPUT) {
    return field.length;
  }

  const nonPrimitiveValue = transformObjectDataIntoArray(field, "values")[0];
  if (type === DROP_DOWN) {
    return nonPrimitiveValue.length;
  }

  if (type === TABLE) {
    return isInvalidColumnAvailable(nonPrimitiveValue);
  }

  return false;
};

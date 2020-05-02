import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { v4 as uuid } from "uuid";

import {
  transformObjectDataIntoArray,
  filterObjectByKey,
} from "./dataTransformUtil";
import {
  DROP_DOWN,
  DROP_DOWN_INITIAL_VALUE,
  INPUT_INITIAL_VALUE,
  INPUT,
  TABLE,
} from "../constants/formConstants";

// TODO :: check if iterable before iterating over objects !!!!!!!!
export const generateRowByColumns = (columns, key) => {
  return columns.reduce((acc, { dataIndex }) => {
    return {
      ...acc,
      [dataIndex]: "",
      key,
    };
  }, {});
};

export const isColumnValid = (column) => {
  const typeObj = get(column, "type", {});
  const dataIndex = get(column, "dataIndex", "");
  const name = get(column, "name", "");
  const typeName = get(typeObj, "name", "");
  const uid = get(typeObj, "uid", "");
  const fields = typeName === INPUT ? [] : get(typeObj, "values", []);

  if (!isEmpty(typeObj)) {
    if (typeName === INPUT) {
      return dataIndex.length > 0 || name.length > 0;
    }

    return (
      (dataIndex.length > 0 || name.length > 0) &&
      typeName.length > 0 &&
      uid.length > 0 &&
      fields.length > 0
    );
  }

  return false;
};

export const isInvalidColumnAvailable = (columns) => {
  return columns.some((col) => !isColumnValid(col));
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
  return {
    name,
    type: {
      name: type,
      uid: uid ? uid : uuid(),
      ...(type !== INPUT && {
        [type === DROP_DOWN ? "values" : "fields"]: fields,
      }),
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
        type: type !== INPUT ? type : { name: type.name },
        uid,
        ...(type !== INPUT && {
          [type === DROP_DOWN ? "values" : "fields"]: fields,
        }),
      }),
    ];
  }, []);
};

export const isDuplicateColumnAvailable = (columns, { name, uid }) => {
  return columns.some(({ dataIndex, name: colName, uid: colUid }) => {
    return (dataIndex === name || colName === name) && colUid !== uid;
  });
};

export const formatDropDownData = (data) => {
  const formattedData = transformObjectDataIntoArray(data, "values")[0];
  return formattedData;
};

export const getDropDownDataValues = (data) => {
  return data.reduce((acc, { value }) => [...acc, value], []);
};

export const reconstructDropDownData = (data, key) => {
  return data.reduce((acc, value) => [...acc, { key, value }], []);
};

export const reconstructColumn = (col, key) => {
  return {
    key,
    dataIndex: col.name,
    title: col.name,
    value: col.type.values,
    type: col.type.name,
  };
};

export const reconstructColumnsData = (columns) => {
  return columns.reduce(
    (acc, col, idx) => [...acc, reconstructColumn(col, idx)],
    []
  );
};

export const validateField = (field, type, name) => {
  if (isEmpty(field)) {
    return false;
  }

  const nonPrimitiveValue =
    get(field, "fields", false) ||
    get(field, "values", false) ||
    get(field, `${name}`, false) ||
    transformObjectDataIntoArray(filterObjectByKey(field, "uid"), "values")[0];

  if (type === DROP_DOWN || type === INPUT) {
    return nonPrimitiveValue.length > 0;
  }

  if (type === TABLE) {
    return !isInvalidColumnAvailable(nonPrimitiveValue);
  }

  return false;
};

export const formatStructure = (structure, name) => {
  return {
    name: structure.name,
    [name]: structure.values,
  };
};

export const doesFieldsContainsDuplicate = (fields, { uid, name }) => {
  if (!fields || !fields.length) {
    return false;
  }

  return fields.some((field) => {
    return field.name === name && field.uid !== uid;
  });
};

export const removeFromFields = (fields, { name }) => {
  return fields.filter((field) => {
    return field.name !== name;
  });
};

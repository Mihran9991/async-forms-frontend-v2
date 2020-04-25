import isObject from "lodash/isObject";
import isString from "lodash/isString";
import pickBy from "lodash/pickBy";

import { DROP_DOWN } from "../constants/formConstants";

export const transformObjectDataIntoArray = (objData, mode = "entries") => {
  return Object[mode](objData);
};

export const transformRowData = (data) => {
  const filterMapper = ({ type }) => {
    return type === DROP_DOWN;
  };
  const reduceMapper = (acc, [name, { type }]) => {
    const nextResult = { ...acc, [name]: { type } };
    return nextResult;
  };

  return data.filter(filterMapper).reduce(reduceMapper, {});
};

export const sortfObjectByKey = (obj, order = "asc") => {
  const sortedObj = {};
  const sortMapper = (a, b) => {
    if (!isString(a) || !isString(b)) {
      throw Error("Incomparable types");
    }

    if (order === "asc") return a.localeCompare(b);
    return b.localeCompare(a);
  };
  const forEachMapper = (key) => {
    sortedObj[key] = obj[key];
  };

  transformObjectDataIntoArray(obj, "keys")
    .sort(sortMapper)
    .forEach(forEachMapper);

  return sortedObj;
};

export const sortArrayOfObjectsByKey = (array, sortBy, order = "asc") => {
  const sortMapper = (a, b) => {
    if (!isObject(a) || !isObject(b)) {
      throw Error("Incomparable types");
    }

    if (order === "asc") return a[sortBy].localeCompare(b[sortBy]);
    return b[sortBy].localeCompare(a[sortBy]);
  };

  return array(sortMapper);
};

export const addTypeToFormData = (data, type) => {
  const [[key, value]] = transformObjectDataIntoArray(data, "entries");

  return {
    [key]: {
      value,
      type,
    },
  };
};

export const renameObjectKey = (obj, oldKey, newKey) => {
  const oldObjkeys = transformObjectDataIntoArray(obj, "keys");
  const newObj = oldObjkeys.reduce((acc, currentVal) => {
    return {
      ...acc,
      [currentVal === oldKey ? newKey : currentVal]: obj[currentVal],
    };
  }, {});

  return newObj;
};

export const filterObjectByKey = (object, filterKey) => {
  return pickBy(object, (_, key) => {
    return key !== filterKey;
  });
};

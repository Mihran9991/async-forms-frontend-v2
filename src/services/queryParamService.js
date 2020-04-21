import qs from "querystring";

export const getParam = (key, queryString = window.location.search) => {
  const values = qs.parse(queryString.slice(1));
  console.log(values);
  return values[key];
};

export default {
  getParam,
};
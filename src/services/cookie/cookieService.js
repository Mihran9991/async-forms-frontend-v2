export const addCookie = (key, value) => {
  document.cookie = `${key}=${value}`;
};

export const removeCookie = (key) => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const getCookie = (name) => {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }

  return null;
};

export default {
  addCookie,
  removeCookie,
  getCookie,
};

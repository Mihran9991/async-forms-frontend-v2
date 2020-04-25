export function addCookie(key, value) {
  document.cookie = `${key}=${value}`;
}

export function removeCookie(key) {
  document.cookie = `${key}=;`;
}

export default {
  addCookie,
  removeCookie
};

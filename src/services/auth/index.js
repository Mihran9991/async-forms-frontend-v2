import { removeCookie } from "../cookie/cookieService";

export const logOut = () => {
  removeCookie("user");
  window.location.reload();
};

export const autoLogout = (exp) => {
  setTimeout(() => logOut(), exp);
};

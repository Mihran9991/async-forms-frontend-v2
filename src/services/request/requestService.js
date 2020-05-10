import axios from "axios";
import { HOST } from "../../config/backendConfigs";
import { getCookie, removeCookie } from "../cookie/cookieService";

export const axiosInstance = axios.create({
  baseURL: HOST,
  headers: { Authorization: `Bearer ${getCookie("user")}` },
});

// autoLogout on 403
export const fetch = () => {
  removeCookie("user");
  window.location.reload();
};

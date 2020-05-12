import axios from "axios";
import { HOST } from "../../config/backendConfigs";
import { getCookie, removeCookie } from "../cookie/cookieService";

export const axiosInstance = axios.create({
  baseURL: HOST,
});

axiosInstance.interceptors.request.use((config) => {
  const authToken = getCookie("user");

  config.headers.Authorization = authToken ? `Bearer ${authToken}` : "";
  return config;
});

// autoLogout on 403
export const fetch = () => {
  removeCookie("user");
  window.location.reload();
};

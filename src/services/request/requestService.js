import axios from "axios";
import { HOST, PORT } from "../../constants/backendConstants";
import { getCookie, removeCookie } from "../cookie/cookieService";

export const axiosInstance = axios.create({
  baseURL: `http://${HOST}:${PORT}`,
  headers: { Authorization: `Bearer ${getCookie("user")}` },
});

// autoLOgout on 403
export const fetch = () => {
  removeCookie("user");
  window.location.reload();
};

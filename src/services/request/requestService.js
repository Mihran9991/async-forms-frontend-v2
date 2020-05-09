import axios from "axios";
import { HOST, PORT } from "../../constants/backendConstants";
import { getCookie } from "../cookie/cookieService";

export const axiosInstance = axios.create({
  baseURL: `http://${HOST}:${PORT}`,
  headers: { Authorization: `Bearer ${getCookie("user")}` },
});

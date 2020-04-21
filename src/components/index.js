import axios from "axios";
import BackendConfig from "../constants/backend.config";

export const axiosInstance = axios.create({
  baseURL: `http://${BackendConfig.HOST}:${BackendConfig.PORT}`,
});

import axios from "axios";
import { HOST } from "../config/backendConfigs";

export const axiosInstance = axios.create({
  baseURL: `${HOST}`,
});

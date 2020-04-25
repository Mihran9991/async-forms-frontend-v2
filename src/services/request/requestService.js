import axios from "axios";
import { HOST, PORT } from "../../constants/backendConstants";

export const axiosInstance = axios.create({
  baseURL: `http://${HOST}:${PORT}`,
});

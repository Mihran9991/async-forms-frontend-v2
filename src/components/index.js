import axios from "axios";
import backendConstants from "../constants/backendConstants";

export const axiosInstance = axios.create({
  baseURL: `http://${backendConstants.HOST}:${backendConstants.PORT}`,
});

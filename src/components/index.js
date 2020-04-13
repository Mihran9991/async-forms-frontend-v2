import axios from "axios";
import {HOST, PORT} from "../constants/backend.config";

export const axiosInstance = axios.create({baseURL: `http://${HOST}:${PORT}`});

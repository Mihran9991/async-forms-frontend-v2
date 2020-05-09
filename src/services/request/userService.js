import { axiosInstance } from "./requestService";
import {
  GET_USER_ROUTE,
  GET_ACTIVE_USERS_LIST,
} from "../../constants/backendConstants";

export async function getUserData() {
  try {
    const userData = axiosInstance.get(GET_USER_ROUTE);
    return userData;
  } catch (e) {
    console.log("err", e);
  }
}

export async function getActiveUsersList() {
  try {
    const activeUsersList = await axiosInstance.get(GET_ACTIVE_USERS_LIST);
    return activeUsersList;
  } catch (e) {
    console.log("err", e);
  }
}

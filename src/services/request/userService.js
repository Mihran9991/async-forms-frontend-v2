import { axiosInstance } from "./requestService";
import { GET_USER_ROUTE } from "../../constants/backendConstants";

export async function getUserData() {
  try {
    const userData = axiosInstance.get(GET_USER_ROUTE);
    return userData;
  } catch (e) {
    console.log("err", e);
  }
}

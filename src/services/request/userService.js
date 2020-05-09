import { axiosInstance } from "./requestService";
import { GET_USER } from "../../constants/backendConstants";

export async function getUserData() {
  try {
    const userData = axiosInstance.get(GET_USER);
    return userData;
  } catch (e) {
    console.log("err", e);
  }
}

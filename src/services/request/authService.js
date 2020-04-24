import { axiosInstance } from "./requestService";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../../constants/backendConstants";

export async function registerRequest(formData) {
  return axiosInstance.post(`${REGISTER_ROUTE}`, {
    name: formData.name,
    surname: formData.surname,
    email: formData.email,
    password: formData.password1,
  });
}

export async function loginRequest(formData) {
  return axiosInstance.post(`${LOGIN_ROUTE}`, {
    email: formData.email,
    password: formData.password,
  });
}

export default {
  registerRequest,
  loginRequest,
};
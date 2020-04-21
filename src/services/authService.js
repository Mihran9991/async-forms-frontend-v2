import { axiosInstance } from "../components";
import BackendConfig from "../constants/backend.config";

export async function registerRequest(formData) {
  return axiosInstance.post(`${BackendConfig.REGISTER_ROUTE}`, {
    name: formData.name,
    surname: formData.surname,
    email: formData.email,
    password: formData.password1,
  });
}

export async function loginRequest(formData) {
  return axiosInstance.post(`${BackendConfig.LOGIN_ROUTE}`, {
    email: formData.email,
    password: formData.password,
  });
}

export default {
  registerRequest,
  loginRequest,
};

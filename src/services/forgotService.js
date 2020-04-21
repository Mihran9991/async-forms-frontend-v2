import { axiosInstance } from "../components";
import BackendConfig from "../constants/backend.config";

export async function sendRequest(formData) {
  return axiosInstance.post(`${BackendConfig.FORGOT_SEND}`, {
    email: formData.email,
  });
}

export async function resetRequest(formData) {
  return axiosInstance.post(`${BackendConfig.FORGOT_RESET}`, {
    requestId: formData.requestId,
    newPassword: formData.newPassword,
  });
}

export default {
  sendRequest,
  resetRequest,
};

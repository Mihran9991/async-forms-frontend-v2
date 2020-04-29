import { axiosInstance } from "../components";
import backendConstants from "../constants/backendConstants";

export async function sendRequest(formData) {
  return axiosInstance.post(`${backendConstants.FORGOT_SEND}`, {
    email: formData.email,
  });
}

export async function resetRequest(formData) {
  return axiosInstance.post(`${backendConstants.FORGOT_RESET}`, {
    requestId: formData.requestId,
    newPassword: formData.newPassword,
  });
}

export default {
  sendRequest,
  resetRequest,
};

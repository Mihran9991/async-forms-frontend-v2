import { axiosInstance } from "../../components";
import { FORGOT_SEND, FORGOT_RESET } from "../../constants/backendConstants";

export async function sendRequest(formData) {
  return axiosInstance.post(`${FORGOT_SEND}`, {
    email: formData.email,
  });
}

export async function resetRequest(formData) {
  return axiosInstance.post(`${FORGOT_RESET}`, {
    requestId: formData.requestId,
    newPassword: formData.newPassword,
  });
}

export default {
  sendRequest,
  resetRequest,
};

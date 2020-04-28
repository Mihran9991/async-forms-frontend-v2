import { axiosInstance } from "./requestService";
import { CREATE_FORM_ROUTE } from "../../constants/backendConstants";

export async function create(formData) {
  try {
    await axiosInstance.post(`${CREATE_FORM_ROUTE}`, formData);
  } catch (e) {}
}

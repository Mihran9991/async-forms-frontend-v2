import { axiosInstance } from "./requestService";
import { CREATE_FORM_ROUTE } from "../../constants/backendConstants";

export async function create(formData) {
  return axiosInstance.post(`${CREATE_FORM_ROUTE}`, {
    title: formData.title,
    columns: formData.columns,
    rows: formData.rows,
  });
}

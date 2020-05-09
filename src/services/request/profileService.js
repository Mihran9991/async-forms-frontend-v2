import { axiosInstance } from "./requestService";
import {
  GET_USER_ROUTE,
  EDIT_PROFILE_ROUTER,
} from "../../constants/backendConstants";

export async function get(token) {
  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  return await axiosInstance.get(`${GET_USER_ROUTE}`, config);
}

export async function edit(formData, token) {
  console.log(formData);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
  };
  const fd = new FormData();
  fd.append("name", formData.name);
  fd.append("surname", formData.surname);
  fd.append("picture", formData.picture);
  try {
    return await axiosInstance.post(`${EDIT_PROFILE_ROUTER}`, fd, config);
  } catch (e) {}
}

export default {
  get,
  edit,
};

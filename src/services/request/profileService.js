import { axiosInstance } from "./requestService";
import { EDIT_PROFILE_ROUTER } from "../../constants/backendConstants";

export async function edit(formData, token) {
  console.log(formData);
  const config = {
    headers: {
      "content-type": "multipart/form-data",
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
  edit,
};

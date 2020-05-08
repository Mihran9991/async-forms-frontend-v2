import { axiosInstance } from "./requestService";
import {
  CREATE_FORM_ROUTE,
  GET_FORMS,
  GET_FORM_INSTANCES,
  GET_FORM,
  CREATE_FORM_INSTANCE,
  INSERT_FORM_INSTANCE_VALUE,
  GET_FORM_INSTANCE,
} from "../../constants/backendConstants";

export async function create(formData) {
  try {
    await axiosInstance.post(`${CREATE_FORM_ROUTE}`, formData);
  } catch (e) {
    console.log("err", e);
  }
}

export async function getForms() {
  try {
    const forms = await axiosInstance.get(`${GET_FORMS}`);
    return forms;
  } catch (e) {
    console.log("err", e);
  }
}

export async function getFormInstancesByFormName(instanceData) {
  try {
    const instances = await axiosInstance.get(GET_FORM_INSTANCES, instanceData);
    return instances;
  } catch (e) {
    console.log("err", e);
  }
}

export async function getForm(formData) {
  try {
    const instances = await axiosInstance.get(GET_FORM, formData);
    return instances;
  } catch (e) {
    console.log("err", e);
  }
}

export async function createFormInstance(formData) {
  try {
    await axiosInstance.post(CREATE_FORM_INSTANCE, formData);
  } catch (e) {
    console.log("err", e);
  }
}

export async function insertFormInstanceValue(formData) {
  try {
    await axiosInstance.post(INSERT_FORM_INSTANCE_VALUE, formData);
  } catch (e) {
    console.log("err", e);
  }
}

export async function getFormInstance(formData) {
  try {
    const instanceData = axiosInstance.get(GET_FORM_INSTANCE, formData);
    return instanceData;
  } catch (e) {
    console.log("err", e);
  }
}

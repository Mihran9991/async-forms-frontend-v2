import socketConstants from "../../constants/socketConstants";
import { socket } from "./index";
import { getFormInstance } from "../request/formService";

export const specificEvents = ({ setInstanceData, formName }) => {
  socket.on(socketConstants.UPDATE_FORM_FIELD, async (changedFieldData) => {
    if (formName !== changedFieldData.formName) {
      return;
    }

    const { data } = await getFormInstance({
      params: {
        formName: changedFieldData.formName,
        instanceName: changedFieldData.instanceName,
      },
    });

    const value = (() => {
      return {
        ...data,
        [changedFieldData.fieldName]: {
          ...data[changedFieldData.fieldName],
          value: changedFieldData.value,
        },
      };
    })();

    setInstanceData(value);
  });
};

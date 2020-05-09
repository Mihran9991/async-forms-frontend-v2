import socketConstants from "../../constants/socketConstants";
import { socket } from "./index";
import { insertFormInstanceValue } from "../request/formService";
import { TABLE } from "../../constants/formConstants";

export const startFieldChange = (fieldData) => {
  socket.emit(socketConstants.START_FORM_FIELD_CHANGE, fieldData);
};

export const finishFieldChange = (fieldData) => {
  const valueByType = (() => {
    if (fieldData.type === TABLE) {
      return {
        formName: fieldData.formName,
        instanceName: fieldData.instanceName,
        field: {
          name: fieldData.fieldName,
          field: {
            rowId: fieldData.rowId,
            name: fieldData.columnId,
            value: fieldData.value,
          },
        },
      };
    }

    return {
      formName: fieldData.formName,
      instanceName: fieldData.instanceName,
      field: {
        name: fieldData.fieldName,
        value: fieldData.value,
      },
    };
  })();

  insertFormInstanceValue(valueByType);
  socket.emit(socketConstants.FINISH_FORM_FIELD_CHANGE, fieldData);
};

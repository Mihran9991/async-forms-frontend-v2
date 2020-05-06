import get from "lodash/get";

import socketConstants from "../../constants/socketConstants";
import { socket } from "./index";

export const events = ({ setValue }) => {
  socket.on(
    socketConstants.DISABLE_FORM_FIELD,
    ({ rowId, columnId, formId, instanceId, fieldId }) => {
      console.log("DISABLE_FORM_FIELD", {
        rowId,
        columnId,
        formId,
        instanceId,
        fieldId,
      });
      setValue((state) => {
        const cellId = `${rowId}-${columnId}`;

        return {
          ...state,
          [formId]: {
            ...get(state, "formId", {}),
            [instanceId]: {
              ...get(state, `${formId}.${instanceId}`, {}),
              [fieldId]: new Set([
                ...get(state, `${formId}.${instanceId}.${fieldId}`, []),
                cellId,
              ]),
            },
          },
        };
      });
    }
  );

  socket.on(
    socketConstants.ENABLE_FORM_FIELD,
    ({ rowId, columnId, formId, instanceId, fieldId }) => {
      console.log("ENABLE_FORM_FIELD", {
        rowId,
        columnId,
        formId,
        instanceId,
      });
      setValue((state) => {
        const cellId = `${rowId}-${columnId}`;
        const copyState = { ...state };
        get(
          copyState,
          `${formId}.${instanceId}.${fieldId}`,
          new Set([])
        ).delete(cellId);

        return copyState;
      });
    }
  );

  // TODO:: handle row delete
  socket.on(
    socketConstants.DELETE_FORM_FIELD,
    ({ rowId, columnId, formId, instanceId, fieldId }) => {
      console.log("DELETE_FORM_FIELD", {
        rowId,
        columnId,
        formId,
        instanceId,
        fieldId,
      });
    }
  );
};

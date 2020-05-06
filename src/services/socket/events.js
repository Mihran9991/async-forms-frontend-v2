import get from "lodash/get";
import set from "lodash/set";

import socketConstants from "../../constants/socketConstants";
import { socket } from "./index";
import { TABLE } from "../../constants/formConstants";

export const events = ({ setValue }) => {
  socket.on(
    socketConstants.DISABLE_FORM_FIELD,
    ({ rowId, columnId, formId, instanceId, fieldId, type }) => {
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
              [fieldId]:
                type === TABLE
                  ? new Set([
                      ...get(state, `${formId}.${instanceId}.${fieldId}`, []),
                      cellId,
                    ])
                  : true,
            },
          },
        };
      });
    }
  );

  socket.on(
    socketConstants.ENABLE_FORM_FIELD,
    ({ rowId, columnId, formId, instanceId, fieldId, type }) => {
      console.log("ENABLE_FORM_FIELD", {
        rowId,
        columnId,
        formId,
        instanceId,
      });
      setValue((state) => {
        const cellId = `${rowId}-${columnId}`;
        const copyState = { ...state };
        const propertyPath = `${formId}.${instanceId}.${fieldId}`;
        if (type === TABLE) {
          get(copyState, propertyPath, new Set([])).delete(cellId);
        } else {
          set(copyState, propertyPath, false);
        }

        return copyState;
      });
    }
  );

  // TODO:: handle table row delete
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

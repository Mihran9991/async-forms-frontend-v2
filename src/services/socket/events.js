import get from "lodash/get";
import set from "lodash/set";

import socketConstants from "../../constants/socketConstants";
import { socket } from "./index";
import { TABLE } from "../../constants/formConstants";

export const events = ({ setValue }) => {
  socket.on(
    socketConstants.DISABLE_FORM_FIELD,
    ({
      rowId,
      columnId,
      formId,
      instanceName: instanceId,
      fieldName: fieldId,
      ownerId,
      type,
    }) => {
      setValue((state) => {
        const cellId = `${rowId}-${columnId}`;
        const fieldValue = !get(
          state,
          `${formId}.${instanceId}.${fieldId}`,
          new Set([])
        ).size
          ? new Set([cellId])
          : get(state, `${formId}.${instanceId}.${fieldId}`);

        const updatedState = {
          ...state,
          [formId]: {
            ...get(state, "formId", {}),
            [instanceId]: {
              ...get(state, `${formId}.${instanceId}`, {}),
              [fieldId]: {
                value: type === TABLE ? fieldValue : true,
                ownerId,
              },
            },
          },
        };

        return updatedState;
      });
    }
  );

  socket.on(
    socketConstants.ENABLE_FORM_FIELD,
    ({
      rowId,
      columnId,
      formId,
      instanceName: instanceId,
      fieldName: fieldId,
      type,
    }) => {
      setValue((state) => {
        const cellId = `${rowId}-${columnId}`;
        const copyState = { ...state };
        const propertyPath = `${formId}.${instanceId}.${fieldId}.value`;

        if (type === TABLE) {
          get(copyState, propertyPath, new Set([])).delete(cellId);
        } else {
          set(copyState, propertyPath, false);
        }

        return copyState;
      });
    }
  );
};

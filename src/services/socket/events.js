import socketConstants from "../../constants/socketConstants";
import { socket } from "./index";

export const events = ({ setValue }) => {
  socket.on(socketConstants.DISABLE_FORM_FIELD, (disabledFieldData) => {
    console.log("DISABLE_FORM_FIELD", disabledFieldData);

    setValue((state) => {
      const cellId = `${disabledFieldData.rowId}-${disabledFieldData.columnId}`;

      return new Set([...state, cellId]);
    });
  });

  socket.on(socketConstants.ENABLE_FORM_FIELD, (enabledFieldData) => {
    setValue((state) => {
      return { ...state, ...enabledFieldData };
    });
  });
};

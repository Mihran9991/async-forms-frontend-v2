import socketConstants from "../../constants/socketConstants";
import { socket } from "./index";

export const startFieldChange = (fieldData) => {
  socket.emit(socketConstants.START_FORM_FIELD_CHANGE, fieldData);
};
export const finishFieldChange = (fieldData) => {
  socket.emit(socketConstants.FINISH_FORM_FIELD_CHANGE, fieldData);
};

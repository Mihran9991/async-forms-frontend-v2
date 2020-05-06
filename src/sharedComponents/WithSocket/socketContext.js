import { createContext } from "react";

// {
//   fieldId: null,
//   rowId: null,
//   columnId: null,
//   formId: null,
//   instanceId: null,
//   fieldId: null
// }

export const initialValue = {};

const SocketContext = createContext(initialValue);

export default SocketContext;

import { createContext } from "react";

// {
//   rowId: null,
//   columnId: null,
//   formId: null,
//   instanceId: null,
// }

export const initialValue = new Set([]);

const SocketContext = createContext(initialValue);

export default SocketContext;

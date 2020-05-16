import React, { useState, useEffect } from "react";

import SocketContext, { initialValue } from "./socketContext";
import initSockets from "../../services/socket";

function WithSocket({ children }) {
  console.log("WithSocket");
  const [value, setValue] = useState(initialValue);

  useEffect(() => initSockets({ setValue }), []);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export default WithSocket;

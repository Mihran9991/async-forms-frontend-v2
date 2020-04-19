import React, { useEffect } from "react";
import io from "socket.io-client";

import { getCookie } from "../../services/cookieService";

const socket = io("http://localhost:3000/", {
  reconnection: true,
});
const userToken = getCookie("user");

function WithSocket({ children }) {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");

      socket.emit("authentication", { userToken });
      socket.on("authenticated", () => {
        // use the socket as usual
      });
    });
  }, []);

  return <>{children}</>;
}

export default WithSocket;

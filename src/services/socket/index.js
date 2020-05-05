import io from "socket.io-client";

import { events } from "./events";

export const socket = io("http://9638a45d.ngrok.io");

export default ({ setValue }) => {
  console.log("Connected");
  events({ setValue });
};

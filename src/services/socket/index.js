import io from "socket.io-client";

import { events } from "./events";
import { getCookie } from "../cookie/cookieService";

export const socket = io("http://ea675b47.ngrok.io", {
  query: `auth_token=${getCookie("user")}`,
});

export default ({ setValue }) => {
  events({ setValue });
};

import io from "socket.io-client";

import { events } from "./events";
import { specificEvents } from "./specificEvents";

import { getCookie } from "../cookie/cookieService";

export const socket = io("http://2fc220c0.ngrok.io", {
  query: `auth_token=${getCookie("user")}`,
});

export default ({ setValue }) => {
  events({ setValue });
};

export const initSpecificEvents = ({ setInstanceData, data }) => {
  specificEvents({ setInstanceData, data });
};

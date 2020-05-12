import io from "socket.io-client";

import { events } from "./events";
import { specificEvents } from "./specificEvents";

import { getCookie } from "../cookie/cookieService";
import { HOST } from "../../config/backendConfigs";

export const socket = io(HOST, {
  query: `auth_token=${getCookie("user")}`,
});

export default ({ setValue }) => {
  events({ setValue });
};

export const initSpecificEvents = ({ setInstanceData, formName }) => {
  specificEvents({ setInstanceData, formName });
};

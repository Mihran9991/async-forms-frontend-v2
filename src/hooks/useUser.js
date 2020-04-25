import { getCookie } from "../services/cookie/cookieService";

// TODO:: init user data here (e.g fetch from API)
export default function useUser() {
  const user = getCookie("user");

  return user;
}

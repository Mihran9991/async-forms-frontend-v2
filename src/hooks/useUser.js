import { useEffect, useState } from "react";

import { getUserData } from "../services/request/userService";

export default function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await getUserData();

      setUser(user);
    };

    getData();
  }, []);

  return user;
}

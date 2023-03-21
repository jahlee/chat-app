import { createContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    userId: null,
    email: null,
    name: null,
    photo_url: null,
    last_logged_in: null,
  });
  const value = {
    user,
    setUser,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export default UserContext;

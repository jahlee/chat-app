import { serverTimestamp } from "firebase/firestore";
import { createContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase-config";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [authUser] = useAuthState(auth);
  const isAuth = Boolean(authUser);
  console.log(isAuth, authUser);
  const user = authUser
    ? {
        userId: authUser.uid,
        email: authUser.email,
        name: authUser.displayName,
        photo_url: authUser.photoURL,
        last_logged_in: serverTimestamp(),
      }
    : {
        userId: null,
        email: null,
        name: null,
        photo_url: null,
        last_logged_in: null,
      };
  const value = { user, isAuth };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export default UserContext;

import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase-config";
import { usersRef } from "../firebase-config";

const UserContext = createContext();

/**
 * user information that is retrieved from FB useAuthState hook
 */
export function UserProvider({ children }) {
  const [authUser] = useAuthState(auth);
  const [userDoc, setUserDoc] = useState(null);

  useEffect(() => {
    if (authUser) {
      const unsubscribe = onSnapshot(
        doc(usersRef, authUser.uid),
        (snapshot) => {
          setUserDoc(snapshot);
        }
      );
      return () => unsubscribe();
    } else {
      setUserDoc(null);
    }
  }, [authUser]);

  const isAuth = Boolean(authUser);
  const user = authUser
    ? {
        userId: authUser.uid,
        email: authUser.email,
        name: userDoc ? userDoc.data().name : authUser.displayName,
        photo_url: userDoc ? userDoc.data().photo_url : authUser.photoURL,
        last_active: serverTimestamp(),
      }
    : {
        userId: null,
        email: null,
        name: null,
        photo_url: null,
        last_active: null,
      };
  const value = { user, isAuth };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContext;

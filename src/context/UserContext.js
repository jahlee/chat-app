import { createContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({children}) {
    const [user, setUser] = useState(null);
    return (
        <UserContext.Provider>{children}</UserContext.Provider>
        )
    }
export default UserContext;
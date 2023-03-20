import { createContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({children}) {
    const [chat, setChat] = useState([]);
    return (
        <ChatContext.Provider>{children}</ChatContext.Provider>
        )
    }
export default ChatContext;
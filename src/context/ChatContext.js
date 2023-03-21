import { createContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({children}) {
    const [chat, setChat] = useState([]);
    const value = {
        chat,
        setChat,
    }
    return (
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
        )
    }
export default ChatContext;
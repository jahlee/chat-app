import React from "react";
import SidebarConv from "./SidebarConv";

export default function Conversations({
  conversations,
  currConv,
  setCurrConv,
}) {
  return (
    <ul className="conversations">
      {conversations.map((conversation) => (
        <SidebarConv
          key={conversation.conversation_id}
          conversation={conversation}
          currConv={currConv}
          setCurrConv={setCurrConv}
        />
      ))}
    </ul>
  );
}

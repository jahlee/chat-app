import React from "react";
import SidebarConv from "./SidebarConv";

export default function Conversations({
  conversations,
  currConv,
  setCurrConv,
}) {
  return (
    <ul className="conversations">
      {conversations.map((conversation, idx) => (
        <SidebarConv
          id={conversation.conversation_id}
          preview={conversation.last_message}
          photo={conversation.photo_url}
          timestamp={JSON.stringify(conversation.last_timestamp)}
          key={idx}
          currConv={currConv}
          setCurrConv={setCurrConv}
        />
      ))}
    </ul>
  );
}

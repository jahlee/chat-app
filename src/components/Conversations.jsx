import React from "react";
import SidebarConv from "./SidebarConv";

export default function Conversations({ conversations }) {
  return (
    <ul>
      {conversations.map((conversation) => (
        <SidebarConv
          id={conversation.conversation_id}
          preview={conversation.last_message}
          photo={conversation.photo_url}
          timestamp={conversation.last_timestamp}
        />
      ))}
    </ul>
  );
}

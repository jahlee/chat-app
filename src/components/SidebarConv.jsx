import React from "react";
import "../styling/Sidebar.css";

export default function SidebarConv({ conversation, currConv, setCurrConv }) {
  const handleSelect = () => {
    console.log("clicked on:", conversation);
    if (currConv !== conversation) {
      console.log("setting new conversation to:", conversation);
      setCurrConv(conversation);
    }
  };
  return (
    <li onClick={handleSelect} className="sidebar-conv">
      sidebar conv:
      <img src={conversation.photo} alt="img" />
      <p>preview: {conversation.preview}</p>
      <p>timestamp: {JSON.stringify(conversation.last_timestamp)}</p>
    </li>
  );
}

import React from "react";
import SidebarConv from "./SidebarConv";

/**
 * A list of all of the user's conversations
 * as shown on the sidebar
 *
 * @param {Array} conversations - list of user's conversations
 * @param {Object} currConv - current conversation to highlight
 * @param {Function} setCurrConv - function to update currConv
 */
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

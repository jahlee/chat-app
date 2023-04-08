import React from "react";
import Search from "./Search";
import Conversations from "./Conversations";
import "../styling/Sidebar.css";

/**
 * Component that holds search + list of current conversations
 *
 * @param {Array} conversations - List of conversations to put on sidebar
 * @param {Object} currConv - reference to current conversation displayed
 * @param {Function} setCurrConv - function to change current conversation
 * @param {Function} setConvByUsers - function to create/set new conversation
 */
export default function Sidebar({
  conversations,
  currConv,
  setCurrConv,
  setConvByUsers,
}) {
  return (
    <div className="sidebar-content">
      <div className="search-container">
        <Search setConvByUsers={setConvByUsers} />
      </div>
      <div className="conversations-container">
        <Conversations
          conversations={conversations}
          currConv={currConv}
          setCurrConv={setCurrConv}
        />
      </div>
    </div>
  );
}

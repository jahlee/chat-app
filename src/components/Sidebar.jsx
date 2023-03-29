import React from "react";
import Search from "./Search";
import Conversations from "./Conversations";
import "../styling/Sidebar.css";

export default function Sidebar({
  conversations,
  currConv,
  setCurrConv,
  setConvByUser,
}) {
  return (
    <div className="sidebar-content">
      <div className="search-container">
        <Search setConvByUser={setConvByUser} />
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

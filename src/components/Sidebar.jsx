import React from "react";
import Search from "./Search";
import Conversations from "./Conversations";
import "../styling/Sidebar.css";

export default function Sidebar({ conversations, currConv, setCurrConv }) {
  return (
    <div class="sidebar-content">
      <div class="search-container">
        <Search setCurrConv={setCurrConv} />
      </div>
      <div class="conversations-container">
        <Conversations
          conversations={conversations}
          currConv={currConv}
          setCurrConv={setCurrConv}
        />
      </div>
    </div>
  );
}

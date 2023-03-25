import React from "react";
import Search from "./Search";
import Conversations from "./Conversations";

export default function Sidebar({ conversations, currConv, setCurrConv }) {
  return (
    <div className="sidebar">
      <Search setCurrConv={setCurrConv} />
      <Conversations
        conversations={conversations}
        currConv={currConv}
        setCurrConv={setCurrConv}
      />
    </div>
  );
}

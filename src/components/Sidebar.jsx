import React from "react";
import Search from "./Search";
import Conversations from "./Conversations";

export default function Sidebar({ conversations, setCurrConv }) {
  return (
    <div>
      <Search setCurrConv={setCurrConv} />
      <Conversations conversations={conversations} />
    </div>
  );
}

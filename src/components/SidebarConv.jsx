import React from "react";
import "../styling/Sidebar.css";

export default function SidebarConv({
  id,
  preview,
  photo,
  timestamp,
  currConv,
  setCurrConv,
}) {
  const handleSelect = () => {
    if (currConv !== id) {
      setCurrConv(id);
    }
  };
  return (
    <li onClick={handleSelect} className="sidebar-conv">
      sidebar conv:
      <img src={photo} alt="img" />
      <p>preview: {preview}</p>
      <p>timestamp: {timestamp}</p>
    </li>
  );
}

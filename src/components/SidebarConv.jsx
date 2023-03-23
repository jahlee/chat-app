import React from "react";

export default function SidebarConv({ id, preview, photo, timestamp }) {
  return (
    <li>
      sidebar conv:
      <img src={photo} alt="img" />
      <p>preview: {preview}</p>
      <p>timestamp: {timestamp}</p>
    </li>
  );
}

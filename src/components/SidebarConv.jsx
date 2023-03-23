import React from "react";

export default function SidebarConv({ id, preview, photo, timestamp }) {
  return (
    <li>
      <img src={photo} alt="" />
      <p>{preview}</p>
      <p>{timestamp}</p>
    </li>
  );
}

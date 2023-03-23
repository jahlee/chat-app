import React from "react";

export default function SearchEntry(props) {
  const { id, photo, name, onHover, onSelect, isHovered } = props;
  const className = isHovered ? "hover" : "";
  const handleSelect = () => {
    onSelect();
  };
  const handleHover = () => {
    onHover(id);
  };
  return (
    <li onClick={handleSelect} onMouseEnter={handleHover} className={className}>
      <img src={photo} alt="" />
      <text>{name}</text>
    </li>
  );
}

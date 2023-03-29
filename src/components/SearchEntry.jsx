import React from "react";
import "../styling/Search.css";

export default function SearchEntry(props) {
  const { user, onHover, onSelect, isHovered } = props;
  const { photo_url, name } = user;
  const className = isHovered
    ? "user-dropdown selected-user-dropdown"
    : "user-dropdown";

  const handleSelect = () => {
    onSelect();
  };
  const handleHover = () => {
    onHover(user);
  };
  return (
    <li onClick={handleSelect} onMouseEnter={handleHover} className={className}>
      <img src={photo_url} alt="" className="dropdown-profile" />
      <p className="dropdown-name">{name}</p>
    </li>
  );
}

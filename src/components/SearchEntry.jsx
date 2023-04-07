import React from "react";
import "../styling/Search.css";

export default function SearchEntry(props) {
  const { user, onHover, onSelect, isHovered, type } = props;
  let { photo_url, name } = user;
  if (Array.isArray(name)) {
    name = name.join(", ");
  }
  const liClassName = isHovered
    ? type + "-user-dropdown selected-user-dropdown"
    : type + "-user-dropdown";
  const profileClassName = type + "-dropdown-profile";
  const nameClassName = type + "-dropdown-name";

  const handleSelect = () => {
    onSelect();
  };
  const handleHover = () => {
    onHover(user);
  };
  return (
    <li
      onClick={handleSelect}
      onMouseEnter={handleHover}
      className={liClassName}
    >
      <img src={photo_url} alt="" className={profileClassName} />
      {name && <p className={nameClassName}>{name}</p>}
    </li>
  );
}

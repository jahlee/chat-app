import React from "react";
import "../styling/Search.css";

/**
 * One of the entries that were found with the search
 *
 * @param {Object} user - user that is found
 * @param {Function} onHover - action when hovering entry
 * @param {Function} onSelect - action when select entry
 * @param {Boolean} isHovered - check if currently hovered
 * @param {String} type - sidebar/modal for specific styling
 */
export default function SearchEntry({
  user,
  onHover,
  onSelect,
  isHovered,
  type,
}) {
  let { photo_url, name } = user;
  // handle groups
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

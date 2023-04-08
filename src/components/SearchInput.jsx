import React from "react";
import "../styling/Search.css";

/**
 * The input value of the searchbar
 *
 * @param {Function} setSearch - update searchinput value
 * @param {Function} onFocus - action when search is selected
 * @param {Function} onBlur - action when search is not selected
 */
export default function SearchInput({ setSearch, onFocus, onBlur }) {
  function handleSearchChange(event) {
    setSearch(event.target.value.toLowerCase());
  }

  return (
    <input
      type="text"
      placeholder="Search for user..."
      onChange={handleSearchChange}
      className="input-search"
      onFocus={onFocus}
      onBlur={onBlur}
    ></input>
  );
}

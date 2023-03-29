import React from "react";
import "../styling/Search.css";

export default function SearchInput(props) {
  const { setSearch, setSearchSelected } = props;

  function handleSearchChange(event) {
    setSearch(event.target.value.toLowerCase());
  }

  function handleSearchFocus() {
    setSearchSelected(true);
  }

  function handleSearchBlur() {
    setSearchSelected(false);
  }

  return (
    <input
      type="text"
      placeholder="Search for user..."
      onChange={handleSearchChange}
      onFocus={handleSearchFocus}
      onBlur={handleSearchBlur}
      className="input-search"
    ></input>
  );
}

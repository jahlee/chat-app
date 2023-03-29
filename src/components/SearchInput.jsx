import React from "react";
import "../styling/Search.css";

export default function SearchInput(props) {
  const { setSearch } = props;

  function handleSearchChange(event) {
    setSearch(event.target.value.toLowerCase());
  }

  return (
    <input
      type="text"
      placeholder="Search for user..."
      onChange={handleSearchChange}
      className="input-search"
    ></input>
  );
}

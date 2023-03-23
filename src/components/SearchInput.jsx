import React from "react";

export default function SearchInput(props) {
  const { setSearch } = props;

  function handleSearchChange(event) {
    setSearch(event.target.value);
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

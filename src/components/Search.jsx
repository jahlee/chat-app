import React, { useState } from "react";
import SearchDropdown from "./SearchDropdown";
import SearchInput from "./SearchInput";

export default function Search({ setCurrConv }) {
  const [search, setSearch] = useState("");
  let timeoutId;

  function handleSearchChange(newSearch) {
    console.log("changed value to: ", newSearch);
    // debounce, wait 500ms (0.5s) till search for users
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setSearch(newSearch);
    }, 500);
  }

  return (
    <div>
      <SearchInput setSearch={handleSearchChange} />
      <SearchDropdown search={search} setCurrConv={setCurrConv} />
    </div>
  );
}

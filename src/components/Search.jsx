import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { db } from "../firebase-config";
import SearchDropdown from "./SearchDropdown";
import SearchInput from "./SearchInput";
import "../styling/Search.css";

export default function Search({ setConvByUser }) {
  const [search, setSearch] = useState("");
  const [searchSelected, setSearchSelected] = useState(false);
  const { user } = useContext(UserContext);
  const userId = user ? user.userId : "";
  const convRef = collection(db, "conversations");
  let timeoutId;

  useEffect(() => {
    console.log("search is selected:", searchSelected);
  }, [searchSelected]);

  function handleSearchChange(newSearch) {
    console.log("changed value to: ", newSearch);
    // debounce, wait 500ms (0.5s) till search for users
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setSearch(newSearch);
    }, 500);
  }

  async function createNewConversation() {
    // TODO: only create new conversation if it doesn't exist yet
    // TODO: have other user's id as input to this function
    // TODO: set photo_url to their profile pic(?)
    try {
      const newConvRef = doc(convRef);
      const convData = {
        conversation_id: newConvRef.id,
        participants: [user.userId, "user1"].sort(),
        participants_obj: { userId: true, user1: true },
        photo_url: "google.com",
        last_message: "",
        last_timestamp: serverTimestamp(),
      };
      await setDoc(newConvRef, convData);
      console.log("successfully created new conversation with data:", convData);
    } catch (e) {
      console.error(e.toString());
    }
  }
  function handleSearchFocus() {
    setSearchSelected(true);
  }

  function handleSearchBlur() {
    // wait 200ms to allow setConvByUser to propogate
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setSearchSelected(false);
    }, 200);
  }

  function handleSelectedUser(usr) {
    setConvByUser(usr);
  }

  return (
    <div
      className="search-content"
      onFocus={handleSearchFocus}
      onBlur={handleSearchBlur}
    >
      <SearchInput setSearch={handleSearchChange} />
      <button onClick={createNewConversation} className="create-conv-button">
        +
      </button>
      {searchSelected && (
        <SearchDropdown
          search={search}
          handleSelectedUser={handleSelectedUser}
          searchSelected={searchSelected}
        />
      )}
    </div>
  );
}

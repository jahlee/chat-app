import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { db } from "../firebase-config";
import SearchDropdown from "./SearchDropdown";
import SearchInput from "./SearchInput";
import "../styling/Search.css";

export default function Search({ setCurrConv }) {
  const [search, setSearch] = useState("");
  const [searchSelected, setSearchSelected] = useState(false);
  const { user } = useContext(UserContext);
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
        participants: [user.userId, "user1"],
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

  return (
    <div className="search-content">
      <SearchInput
        setSearch={handleSearchChange}
        setSearchSelected={setSearchSelected}
      />
      <button onClick={createNewConversation} className="create-conv-button">
        +
      </button>
      {searchSelected && (
        <SearchDropdown search={search} setCurrConv={setCurrConv} />
      )}
    </div>
  );
}

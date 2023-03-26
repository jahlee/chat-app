import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { db } from "../firebase-config";
import SearchDropdown from "./SearchDropdown";
import SearchInput from "./SearchInput";

export default function Search({ setCurrConv }) {
  const [search, setSearch] = useState("");
  const { user } = useContext(UserContext);
  const convRef = collection(db, "conversations");
  let timeoutId;

  function handleSearchChange(newSearch) {
    console.log("changed value to: ", newSearch);
    // debounce, wait 500ms (0.5s) till search for users
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setSearch(newSearch);
    }, 500);
  }

  function createNewConversation() {
    // TODO: only create new conversation if it doesn't exist yet
    // TODO: have other user's id as input to this function
    // TODO: set photo_url to their profile pic(?)
    try {
      const newConvRef = doc(convRef);
      const convData = {
        conversation_id: newConvRef.id,
        last_message: serverTimestamp(),
        last_timestamp: serverTimestamp(),
        participants: [user.userId, "user1"],
        photo_url: "google.com",
      };
      addDoc(convRef, convData);
      console.log("successfully created new conversation with data:", convData);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <SearchInput setSearch={handleSearchChange} />
      <button onClick={createNewConversation}>+</button>
      <SearchDropdown search={search} setCurrConv={setCurrConv} />
    </div>
  );
}

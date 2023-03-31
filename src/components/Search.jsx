import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { db } from "../firebase-config";
import SearchDropdown from "./SearchDropdown";
import SearchInput from "./SearchInput";
import "../styling/Search.css";
import Modal from "./Modal";

export default function Search({ setConvByUsers }) {
  const [search, setSearch] = useState("");
  const [searchSelected, setSearchSelected] = useState(false);
  const [createNewConv, setCreateNewConv] = useState(false);
  const [newConvUsers, setNewConvUsers] = useState([]);
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

  function toggleNewConversation() {
    setCreateNewConv(true);
  }

  function handleSearchFocus() {
    setSearchSelected(true);
  }

  function handleSearchBlur() {
    // wait 200ms to allow setConvByUsers to propogate
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setSearchSelected(false);
    }, 200);
  }

  function handleSelectedUser(usr) {
    setConvByUsers([usr]);
  }

  function handleSelectedUsers() {
    setConvByUsers(newConvUsers);
    setCreateNewConv(false);
    setSearch("");
    setNewConvUsers([]);
  }

  function handleAbort() {
    setCreateNewConv(false);
    setNewConvUsers([]);
    setSearch("");
  }

  function stopPropagation(event) {
    event.stopPropagation();
  }

  function addUserToConv(usr) {
    const user_exists = newConvUsers.some((i) => i.userId === usr.userId);
    if (!user_exists) setNewConvUsers([...newConvUsers, usr]);
  }

  function removeUser(idx) {
    const newUsers = [...newConvUsers];
    newUsers.splice(idx, 1);
    setNewConvUsers(newUsers);
  }

  return (
    <div className="search-content">
      <SearchInput
        setSearch={handleSearchChange}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
      />
      <button onClick={toggleNewConversation} className="create-conv-button">
        +
      </button>
      {createNewConv && (
        <Modal onClose={handleAbort}>
          <div className="modal-create-conv" onClick={stopPropagation}>
            <h1>Create a new conversation...</h1>
            <SearchInput setSearch={handleSearchChange} />
            <SearchDropdown
              search={search}
              handleSelectedUser={addUserToConv}
              searchSelected={searchSelected}
              type="modal"
            />
            <div className="modal-create-conv-users">
              {newConvUsers && newConvUsers.length > 0 && <h2>Users:</h2>}
              {newConvUsers.map((usr, idx) => (
                <button
                  onClick={() => removeUser(idx)}
                  key={idx}
                  className="modal-create-conv-user"
                >
                  {usr.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleAbort}
              className="modal-create-conv-button modal-cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleSelectedUsers}
              className="modal-create-conv-button modal-create-button"
            >
              Create
            </button>
          </div>
        </Modal>
      )}
      {searchSelected && (
        <SearchDropdown
          search={search}
          handleSelectedUser={handleSelectedUser}
          searchSelected={searchSelected}
          type="sidebar"
        />
      )}
    </div>
  );
}

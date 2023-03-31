import React, { useEffect, useState } from "react";
import SearchEntry from "./SearchEntry";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import "../styling/Search.css";

export default function SearchDropdown({
  search,
  handleSelectedUser,
  searchSelected,
  type,
}) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(searchSelected);
  const className = type + "-dropdown";

  useEffect(() => {
    console.log("current users for search", search, "is:", users);
    const handleSearch = async () => {
      try {
        const query_users = [];
        const q = query(
          collection(db, "users"),
          where("lowercase_name", ">=", search),
          where("lowercase_name", "<", `${search}\uf8ff`)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          query_users.push(doc.data());
        });
        console.log("setting users to:", query_users);
        setUsers(query_users);
      } catch (err) {
        console.error("err retrieving searched users:", err);
      }
    };
    handleSearch();
  }, [search]);

  const handleSelect = () => {
    handleSelectedUser(selectedUser);
  };

  const handleHoveredUser = (usr) => {
    setSelectedUser(usr);
  };

  return (
    <ul className={className}>
      {users.map((user, idx) => (
        <SearchEntry
          key={idx}
          user={user}
          onSelect={handleSelect}
          onHover={handleHoveredUser}
          isHovered={selectedUser && selectedUser.userId === user.userId}
          type={type}
        />
      ))}
    </ul>
  );
}

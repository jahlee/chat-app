import React, { useEffect, useState } from "react";
import SearchEntry from "./SearchEntry";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";

export default function SearchDropdown(props) {
  const { search, setCurrConv } = props;
  const [users, setUsers] = useState([]);
  const [hoveredUser, setHoveredUser] = useState(null);

  useEffect(() => {
    const handleSearch = async () => {
      const q = query(collection(db, "users"), where("name", "==", search));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUsers([...users, doc.data()]);
        });
      } catch (err) {
        console.error("err retrieving searched users:", err);
      }
    };
    handleSearch();
  }, [search]);

  const handleSelect = () => {
    setCurrConv(hoveredUser);
  };

  return (
    <ul className="dropdown">
      {users.map((user) => (
        <SearchEntry
          id={user.id}
          photo={user.photo_url}
          name={user.name}
          onSelect={handleSelect}
          onHover={setHoveredUser}
          isHovered={hoveredUser && hoveredUser.id === user.id}
        />
      ))}
    </ul>
  );
}

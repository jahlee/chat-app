import React, { useContext, useEffect, useState } from "react";
import { convRef } from "../firebase-config";
import { limit, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import Conversation from "../components/Conversation";
import Sidebar from "../components/Sidebar";
import UserContext from "../context/UserContext";
import "../styling/Chats.css";

function Chats() {
  const [currConv, setCurrConv] = useState(null);
  const [conversations, setConversations] = useState([]);
  const { user } = useContext(UserContext);
  console.log("user:", user);

  useEffect(() => {
    // get conversations from db
    const conversationsQuery = query(
      convRef,
      where("participants", "array-contains", user ? user.userId : null),
      orderBy("last_timestamp", "desc"),
      limit(10)
    );
    console.log(user ? user.userId : null, conversationsQuery);
    const unsubscribe = onSnapshot(
      conversationsQuery,
      (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setConversations(items);
        console.log("conversations:", items);

        if (items) {
          // set current conv to the most recent conversation
          setCurrConv(items[0]);
        }
      },
      (err) => {
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="chats-container">
      <div className="sidebar">
        <Sidebar
          conversations={conversations}
          currConv={currConv}
          setCurrConv={setCurrConv}
        />
      </div>
      <div className="conversation">
        <Conversation conv={currConv} />
      </div>
    </div>
  );
}

export default Chats;

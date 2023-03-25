import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import Conversation from "../components/Conversation";
import Sidebar from "../components/Sidebar";
import UserContext from "../context/UserContext";
import "../styling/Chats.css";

function Chats() {
  const [currConv, setCurrConv] = useState(null);
  const [conversations, setConversations] = useState([]);
  const { user } = useContext(UserContext);
  const convRef = collection(db, "conversations");
  const conversationsQuery = query(
    convRef,
    where("participants", "array-contains", user ? user.userId : null)
  );

  useEffect(() => {
    // get conversations from db
    const unsubscribe = onSnapshot(
      conversationsQuery,
      (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setConversations(items.reverse());
        console.log(items);

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

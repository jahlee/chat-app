import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import Conversation from "../components/Conversation";
import Sidebar from "../components/Sidebar";
import UserContext from "../context/UserContext";

function Chats() {
  const [currConv, setCurrConv] = useState(null);
  const [conversations, setConversations] = useState([]);
  const { user } = useContext(UserContext);
  const convRef = collection(db, "conversations");
  const conversationsQuery = query(
    convRef,
    where("participants", "array-contains", user.userId)
  );

  useEffect(() => {
    // get conversations from db
    console.log(user.userId);
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
  }, []);

  return (
    <div>
      <Sidebar conversations={conversations} setCurrConv={setCurrConv} />
      <Conversation conv={currConv} />
    </div>
  );
}

export default Chats;

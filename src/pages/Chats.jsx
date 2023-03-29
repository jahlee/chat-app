import React, { useContext, useEffect, useState } from "react";
import { convRef } from "../firebase-config";
import {
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "@firebase/firestore";
import Conversation from "../components/Conversation";
import Sidebar from "../components/Sidebar";
import UserContext from "../context/UserContext";
import "../styling/Chats.css";
import { useNavigate } from "react-router-dom";

function Chats() {
  const [currConv, setCurrConv] = useState(null);
  const [conversations, setConversations] = useState([]);
  const { user, isAuth } = useContext(UserContext);
  const userId = user ? user.userId : "";
  const navigate = useNavigate();

  useEffect(() => {
    const wait = setTimeout(() => {
      if (!isAuth) {
        navigate("/");
      }
    }, 500);
    return () => clearTimeout(wait);
  }, [isAuth]);

  useEffect(() => {
    console.log("currconv changed!", currConv);
  }, [currConv]);

  useEffect(() => {
    // get conversations from db
    const conversationsQuery = query(
      convRef,
      where("participants", "array-contains", userId),
      orderBy("last_timestamp", "desc"),
      limit(10)
    );

    console.log(userId, conversationsQuery);
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

  const setConversationByUser = async (usr) => {
    // where("participants", "==", [id1, id2])
    let newConversation = {};
    const usr_id = usr.userId;
    const newConversationQuery = query(
      convRef,
      where(`participants.${userId}`, "==", true),
      where(`participants.${usr_id}`, "==", true),
      limit(1)
    );
    const querySnapshot = await getDocs(newConversationQuery);

    // no current conversation, create new conversation
    if (querySnapshot.empty) {
      try {
        const newConvRef = doc(convRef);
        newConversation = {
          conversation_id: newConvRef.id,
          participants: [userId, usr_id].sort(),
          participants_obj: { userId: true, usr_id: true },
          photo_url: user.photo_url,
          last_message: "",
          last_timestamp: serverTimestamp(),
        };
        await setDoc(newConvRef, newConversation);
        console.log(
          "successfully created new conversation with data:",
          newConversation
        );
      } catch (e) {
        console.error(e.toString());
      }
    } else {
      newConversation = querySnapshot.docs[0].data();
    }
    setCurrConv(newConversation);
  };

  if (!isAuth) {
    return null;
  }

  return (
    <div className="chats-container">
      <div className="sidebar">
        <Sidebar
          conversations={conversations}
          currConv={currConv}
          setCurrConv={setCurrConv}
          setConvByUser={setConversationByUser}
        />
      </div>
      <div className="conversation">
        <Conversation conv={currConv} />
      </div>
    </div>
  );
}

export default Chats;

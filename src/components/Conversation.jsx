import React, { useContext, useEffect, useState } from "react";
import { db, storage } from "../firebase-config";
import { ref } from "firebase/storage";
import {
  addDoc,
  doc,
  collection,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  orderBy,
  limit,
} from "@firebase/firestore";
import UserContext from "../context/UserContext";
import ChatInput from "./ChatInput";

export default function Conversation({ conv }) {
  const conversation_id = conv ? conv.conversation_id : "";
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  const firebaseRef = collection(db, "messages");
  const storageRef = ref(storage);
  const messagesQuery = query(
    firebaseRef,
    where("conversation_id", "==", conversation_id),
    orderBy("timestamp", "desc"),
    limit(10)
  );

  // load messages + use handler to get messages
  useEffect(() => {
    // use snapshot for real-time listener
    const unsubscribe = onSnapshot(
      messagesQuery,
      (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setMessages(items.reverse());
        console.log("messages:", items);
      },
      (err) => {
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, [conv]);

  function sendMessage(message, files) {
    try {
      const newDocRef = doc(firebaseRef);
      if (files && files.length > 0) {
        // eslint-disable-next-line array-callback-return
        files.map((file) => {
          const timestamp = serverTimestamp()();
          const fileName = `${timestamp}_${file.name}`;
          const fileRef = storageRef.child(fileName);
          fileRef
            .put(file)
            .then(() => {
              console.log("file uploaded!");
            })
            .catch((err) => {
              console.error(err);
            });
        });
      }
      const messageData = {
        id: newDocRef.id,
        text: message,
        timestamp: serverTimestamp(),
        conversation_id: conversation_id,
        image_urls: files,
      };
      addDoc(firebaseRef, messageData);
    } catch (e) {
      console.error(e);
    }
    console.log(
      "sent message:",
      message,
      "with conversation id:",
      conversation_id
    );
  }

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.conversation_id}</p>
          <p>{message.text}</p>
        </div>
      ))}
      <button onClick={() => sendMessage("message", null)}>Send message</button>
      <ChatInput sendMessage={sendMessage} />
    </>
  );
}

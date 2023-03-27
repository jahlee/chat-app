import React, { useContext, useEffect, useState } from "react";
import { messagesRef, storage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  doc,
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
  const messagesQuery = query(
    messagesRef,
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

  async function sendMessage(message, files) {
    try {
      let file_urls = [];
      if (files && files.length > 0) {
        // eslint-disable-next-line array-callback-return
        await Promise.all(
          Array.from(files).map(async (file) => {
            const fileName = `messages/${file.name}`;
            const fileRef = ref(storage, fileName);
            await uploadBytes(fileRef, file);
            console.log("uploaded file!");
            const url = await getDownloadURL(fileRef);
            console.log("url:", url);
            file_urls.push(url);
          })
        );
      }
      const newDocRef = doc(messagesRef);
      const messageData = {
        id: newDocRef.id,
        text: message,
        timestamp: serverTimestamp(),
        conversation_id: conversation_id,
        file_urls: file_urls,
      };
      await addDoc(messagesRef, messageData);
    } catch (e) {
      console.error(e);
    }
    console.log(
      "sent message:",
      message,
      "and file(s):",
      files,
      "with conversation id:",
      conversation_id
    );
  }

  function renderFiles(file_urls) {
    return (
      <div className="files-container">
        {file_urls.map((url) => {
          const fileRef = ref(storage, url);
          console.log(url);
          console.log(fileRef);
          return (
            <div className="file-container" key={url}>
              <img src={url} alt={fileRef ? fileRef.name : ""} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.conversation_id}</p>
          <p>{message.text}</p>
          {message.file_urls && renderFiles(message.file_urls)}
        </div>
      ))}
      <ChatInput sendMessage={sendMessage} />
    </>
  );
}

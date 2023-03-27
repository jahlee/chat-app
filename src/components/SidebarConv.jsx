import { deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { convRef, db, messagesRef, storage } from "../firebase-config";
import "../styling/Sidebar.css";

export default function SidebarConv({ conversation, currConv, setCurrConv }) {
  const [showDel, setShowDel] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log("curr conv:", currConv);
  }, [currConv]);

  const handleSelect = () => {
    console.log("clicked on:", conversation);
    if (currConv !== conversation) {
      console.log("setting new conversation to:", conversation);
      setCurrConv(conversation);
    }
  };

  const deleteConversation = async () => {
    try {
      const convId = conversation.conversation_id;
      console.log("deleting convid:", convId);

      // get all messages with conversation_id == convId
      const messagesQuery = query(
        messagesRef,
        where("conversation_id", "==", convId)
      );
      const messagesSnapshot = await getDocs(messagesQuery);

      // delete each message and its associated object storages
      const deletePromises = messagesSnapshot.docs.map(async (messageDoc) => {
        const messageData = messageDoc.data();
        console.log("message:", messageData);
        // delete each object storage in the file_urls array
        const deleteFilePromises = messageData.file_urls.map(
          async (fileUrl) => {
            const fileRef = ref(storage, fileUrl.url);
            await deleteObject(fileRef);
            console.log("Object storage deleted:", fileUrl);
          }
        );
        await Promise.all(deleteFilePromises);

        // delete the message document
        const messageDocRef = doc(messagesRef, messageDoc.id);
        await deleteDoc(messageDocRef);
        console.log("Message deleted:", messageDoc.id);
      });
      await Promise.all(deletePromises);
      console.log("going to delete conv now");
      // delete the conversation document
      // const convDocRef = await getDoc(
      //   query(convRef, where("conversation_id", "==", convId))
      // );
      const convDocRef = doc(convRef, convId);
      await deleteDoc(convDocRef);
      console.log("Conversation deleted:", convId);

      setCurrConv({
        conversation_id: null,
        last_message: null,
        last_timestamp: null,
        participants: [user.userId],
        photo_url: "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleMouseEnter = () => {
    setShowDel(true);
  };

  const handleMouseLeave = () => {
    setShowDel(false);
  };

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const handleAbort = () => {
    setShowConfirm(false);
  };

  return (
    <li
      onClick={handleSelect}
      className="sidebar-conv"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showDel && (
        <button className="delete" onClick={handleDelete}>
          X
        </button>
      )}
      {showConfirm && (
        <div className="confirm-delete">
          <div className="delete-message">
            Are you sure you want to delete this conversation?
          </div>
          <button onClick={deleteConversation}>Yes</button>
          <button onClick={handleAbort}>No</button>
        </div>
      )}
      <img src={conversation.photo_url} alt="img" />
      <p>preview: {conversation.preview}</p>
    </li>
  );
}

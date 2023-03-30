import { deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { convRef, filesRef, messagesRef, storage } from "../firebase-config";
import "../styling/Sidebar.css";
import Modal from "./Modal";

export default function SidebarConv({ conversation, currConv, setCurrConv }) {
  const [showDel, setShowDel] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useContext(UserContext);

  let className = "sidebar-conv";
  if (currConv && currConv.conversation_id === conversation.conversation_id) {
    className += " selected-conv";
  }

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
        // delete each object storage + file doc in the file_refs array
        const deleteFilePromises = messageData.file_refs.map(
          async (fileRefObj) => {
            const { url, id } = fileRefObj;
            const storageRef = ref(storage, url);
            console.log("deleting object storage:", storageRef);
            await deleteObject(storageRef);

            const fileDocRef = doc(filesRef, id);
            await deleteDoc(fileDocRef);
          }
        );
        await Promise.all(deleteFilePromises);

        // delete the message document
        const messageDocRef = doc(messagesRef, messageDoc.id);
        await deleteDoc(messageDocRef);
        console.log("Message deleted:", messageDoc.id);
      });
      await Promise.all(deletePromises);

      // delete the conversation document
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
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showDel && (
        <button className="delete-button" onClick={handleDelete}>
          X
        </button>
      )}
      {showConfirm && (
        <Modal onClose={handleAbort}>
          <div className="modal-delete">
            <p>Are you sure you want to delete this conversation?</p>
            <button id="confirmDelete" onClick={deleteConversation}>
              Yes, delete
            </button>
            <button id="cancelDelete" onClick={handleAbort}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
      <img src={conversation.photo_url} alt="img" className="sidebar-profile" />
      <div className="sidebar-details">
        <h3 className="sidebar-name">{user.userId}</h3>
        <p className="sidebar-preview">You: {conversation.last_message}</p>
      </div>
    </li>
  );
}

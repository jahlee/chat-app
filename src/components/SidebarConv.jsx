import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import {
  convRef,
  filesRef,
  messagesRef,
  storage,
  usersRef,
} from "../firebase-config";
import "../styling/Sidebar.css";
import Modal from "./Modal";

export default function SidebarConv({ conversation, currConv, setCurrConv }) {
  const [showDel, setShowDel] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastUserName, setLastUserName] = useState("");
  const { user } = useContext(UserContext);
  let last_timestamp_display = "now";
  try {
    const timestamp_date = conversation.last_timestamp.toDate();
    const timeDiff = new Date() - timestamp_date;
    const minsDiff = Math.floor(timeDiff / (1000 * 60)); // ms to s, s to min
    const hoursDiff = Math.floor(minsDiff / 60); // min to hr
    const daysDiff = Math.floor(hoursDiff / 24); // hr to day
    const monthsDiff = Math.floor(daysDiff / 30.44); // average number of days in a month
    const yearsDiff = Math.floor(daysDiff / 365); // day to year
    let unit = "now";
    let amount = 0;
    if (yearsDiff >= 1) {
      unit = "year";
      amount = yearsDiff;
    } else if (monthsDiff >= 1) {
      unit = "month";
      amount = monthsDiff;
    } else if (daysDiff >= 1) {
      unit = "day";
      amount = daysDiff;
    } else if (hoursDiff >= 1) {
      unit = "hour";
      amount = hoursDiff;
    } else if (minsDiff >= 1) {
      unit = "min";
      amount = minsDiff;
    }

    last_timestamp_display =
      amount === 0
        ? "now"
        : amount === 1
        ? `${amount} ${unit} ago`
        : `${amount} ${unit}s ago`;
  } catch (e) {
    console.error(e);
  }

  useEffect(() => {
    async function fetchLastUserName() {
      try {
        if (conversation.last_message_userId === user.userId) {
          setLastUserName("You");
        } else {
          console.log(conversation);
          const userDoc = doc(usersRef, conversation.last_message_userId);
          const docSnapshot = await getDoc(userDoc);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setLastUserName(userData.name);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchLastUserName();
  }, [conversation, user]);

  let className = "sidebar-conv";
  if (currConv && currConv.conversation_id === conversation.conversation_id) {
    className += " selected-conv";
  }

  const handleSelect = () => {
    if (currConv !== conversation) {
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
        <p className="sidebar-preview">
          {lastUserName}: {conversation.last_message}
        </p>
        <p className="sidebar-timestamp">{last_timestamp_display}</p>
      </div>
    </li>
  );
}

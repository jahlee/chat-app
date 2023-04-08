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
  statusRef,
  storage,
  usersRef,
} from "../firebase-config";
import chat_logo from "../assets/chat.png";
import groupchat_logo from "../assets/groupchat.png";
import "../styling/Sidebar.css";
import Modal from "./Modal";

/**
 * Each entry of the array of conversations that the user has
 *
 * @param {Object} conversation - conversation of this component
 * @param {Object} currConv - current conversation being displayed
 * @param {Function} setCurrConv - change displayed conv to this conv
 */
export default function SidebarConv({ conversation, currConv, setCurrConv }) {
  const [showDel, setShowDel] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [convName, setConvName] = useState("");
  const [lastUserName, setLastUserName] = useState("");
  const [photoURL, setPhotoURL] = useState(chat_logo);
  const [isActive, setIsActive] = useState(false);
  const { user } = useContext(UserContext);

  // get conversation photo
  useEffect(() => {
    async function fetchPhotoURL() {
      try {
        const otherUserId = conversation.participants.filter(
          (id) => id !== user.userId
        )[0];
        const userDoc = doc(usersRef, otherUserId);
        const docSnapshot = await getDoc(userDoc);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setPhotoURL(userData.photo_url);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (conversation.participants && conversation.participants.length > 2) {
      setPhotoURL(groupchat_logo);
    } else if (
      conversation.participants &&
      conversation.participants.length === 2
    ) {
      fetchPhotoURL();
    } else {
      setPhotoURL(chat_logo);
    }
  }, [conversation, user]);

  // get active status of conversation/user
  useEffect(() => {
    async function fetchActive() {
      try {
        const otherUserIds = conversation.participants.filter(
          (id) => id !== user.userId
        );
        otherUserIds.forEach(async (usrId) => {
          const userDoc = doc(usersRef, usrId);
          const docSnapshot = await getDoc(userDoc);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const timeDiff = new Date() - userData.last_active.toDate();
            // if active within past 5 minutes
            if (timeDiff / (1000 * 60) < 5) {
              setIsActive(true);
              return;
            }
          }
        });
        setIsActive(false);
      } catch (e) {
        console.error(e);
      }
    }

    if (conversation.participants) {
      fetchActive();
    }
  }, [currConv, conversation.participants, conversation.last_message, user]);

  // get name of sender of last message
  useEffect(() => {
    async function fetchLastUserName() {
      try {
        if (conversation.last_message_userId === user.userId) {
          setLastUserName("You");
        } else {
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

  // get names of users in this conversation
  useEffect(() => {
    async function fetchUserNames() {
      try {
        const participantsNames = [];
        await Promise.all(
          conversation.participants.map(async (id) => {
            if (id !== user.userId) {
              const userDoc = doc(usersRef, id);
              const docSnapshot = await getDoc(userDoc);
              participantsNames.push(docSnapshot.data().name);
            }
          })
        );
        setConvName(
          participantsNames.length > 1
            ? participantsNames.join(", ")
            : participantsNames.join("")
        );
      } catch (e) {
        console.error(e);
      }
    }
    fetchUserNames();
  }, [conversation, user]);

  // get last timestamp
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
            await deleteObject(storageRef);

            const fileDocRef = doc(filesRef, id);
            await deleteDoc(fileDocRef);
          }
        );
        await Promise.all(deleteFilePromises);

        // delete the message document
        const messageDocRef = doc(messagesRef, messageDoc.id);
        await deleteDoc(messageDocRef);
      });
      await Promise.all(deletePromises);

      // delete the status document for this conversation
      const statusQuery = query(
        statusRef,
        where("conversation_id", "==", convId)
      );
      const statusSnapshot = await getDocs(statusQuery);
      statusSnapshot.forEach((statusDoc) => {
        const statusDocRef = doc(statusRef, statusDoc.id);
        deleteDoc(statusDocRef);
      });

      // delete the conversation document
      const convDocRef = doc(convRef, convId);
      await deleteDoc(convDocRef);

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
      <div className="profile-container">
        <img src={photoURL} alt="img" className="sidebar-profile" />
        {isActive && <div className="active-indicator"></div>}
      </div>
      <div className="sidebar-details">
        <h3 className="sidebar-name">{convName}</h3>
        {lastUserName && (
          <p className="sidebar-preview">
            {lastUserName}: {conversation.last_message}
          </p>
        )}
        <p className="sidebar-timestamp">{last_timestamp_display}</p>
      </div>
    </li>
  );
}

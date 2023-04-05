import { ref } from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import { storage, usersRef } from "../firebase-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import UserContext from "../context/UserContext";
import { doc, getDoc } from "firebase/firestore";
import "../styling/Chats.css";

export default function Message({
  message,
  openImage,
  openPdf,
  showUser,
  showTime,
}) {
  const { user } = useContext(UserContext);
  const [senderName, setSenderName] = useState("");
  let className = "message ";
  className +=
    message.sender_id === user.userId ? "sent-message " : "receive-message ";
  let timestamp_display = "";
  try {
    const timestamp_date = message.timestamp.toDate();
    if (showTime) {
      const now = new Date();
      const timeDiff = now - timestamp_date;
      const minsDiff = Math.floor(timeDiff / (1000 * 60)); // ms to s, s to min

      // If within a minute of sending, show "Now"
      if (minsDiff <= 1) {
        timestamp_display = "Now";
      }
      // If within an hour, show minutes ago
      else if (minsDiff < 60) {
        timestamp_display = `${minsDiff} minutes ago`;
      }
      // If same day, show time of message
      else if (
        now.getDate() === timestamp_date.getDate() &&
        now.getMonth() === timestamp_date.getMonth() &&
        now.getFullYear() === timestamp_date.getFullYear()
      ) {
        timestamp_display = timestamp_date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      // Show date and time
      else {
        timestamp_display = `${timestamp_date.toLocaleDateString()} ${timestamp_date.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}`;
      }
    }
  } catch (err) {
    console.error(err);
  }

  useEffect(() => {
    async function fetchSenderName() {
      try {
        if (message.sender_id && message.sender_id !== user.userId) {
          const userDoc = doc(usersRef, message.sender_id);
          const docSnapshot = await getDoc(userDoc);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setSenderName(userData.name);
          }
        } else {
          setSenderName("");
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchSenderName();
  }, [message, user]);

  function renderFiles(file_refs) {
    return (
      <div className="files-container">
        {file_refs.map((refObj, idx) => {
          const { url, type } = refObj;
          const fileRef = ref(storage, url);
          return type === "image" ? (
            <img
              key={idx}
              src={url}
              className="image"
              alt={fileRef ? fileRef.name : ""}
              onClick={() => openImage(url)}
            />
          ) : (
            <div className="pdf" onClick={() => openPdf(url)} key={idx}>
              <FontAwesomeIcon icon={faFile} className="pdf-icon" />
              {fileRef.name}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className={className}>
        {message && message.text && <p>{message.text}</p>}
        {message.file_refs && renderFiles(message.file_refs)}
      </div>
      {showUser && senderName && <p className="sender">{senderName}</p>}
      {showTime && <p className="timestamp">{timestamp_display}</p>}
    </React.Fragment>
  );
}

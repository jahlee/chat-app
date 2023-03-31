import { ref } from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import { storage, usersRef } from "../firebase-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import UserContext from "../context/UserContext";
import { doc, getDoc } from "firebase/firestore";

export default function Message({ message, openImage, openPdf }) {
  const { user } = useContext(UserContext);
  const [senderName, setSenderName] = useState("");
  const className =
    message.sender_id === user.userId ? "sent-message" : "receive-message";

  useEffect(() => {
    async function fetchSenderName() {
      try {
        if (message.sender_id !== user.userId) {
          const userDoc = doc(usersRef, message.sender_id);
          const docSnapshot = await getDoc(userDoc);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setSenderName(userData.name);
          }
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
        {file_refs.map((refObj) => {
          const { url, type } = refObj;
          const fileRef = ref(storage, url);
          return type === "image" ? (
            <img
              key={url}
              src={url}
              className="image"
              alt={fileRef ? fileRef.name : ""}
              onClick={() => openImage(url)}
            />
          ) : (
            <div className="pdf" onClick={() => openPdf(url)}>
              <FontAwesomeIcon icon={faFile} className="pdf-icon" />
              {fileRef.name}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div key={message.id} className={className}>
      <p>{senderName}</p>
      <p>{message.text}</p>
      {message.file_refs && renderFiles(message.file_refs)}
    </div>
  );
}

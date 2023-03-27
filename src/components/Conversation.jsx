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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import UserContext from "../context/UserContext";
import ChatInput from "./ChatInput";
import "../styling/Chats.css";

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
      const image_urls = [];
      const pdf_urls = [];
      if (files && files.length > 0) {
        // eslint-disable-next-line array-callback-return
        await Promise.all(
          Array.from(files).map(async (file) => {
            const fileName = `messages/${file.name}`;
            const fileRef = ref(storage, fileName);
            const isImage = file.type.includes("image");
            await uploadBytes(fileRef, file);
            console.log("uploaded file!");
            const urlObj = {
              url: await getDownloadURL(fileRef),
              type: isImage ? "image" : "pdf",
            };
            console.log("url:", urlObj);
            if (isImage) {
              image_urls.push(urlObj);
            } else {
              pdf_urls.push(urlObj);
            }
          })
        );
      }
      const file_urls = [...pdf_urls, ...image_urls];
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

  function openPdf(url) {
    window.open(url, "_blank");
  }

  function openImage(url) {
    // Create the modal container
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Create the image element
    const img = document.createElement("img");
    img.src = url;
    img.classList.add("modal-content");

    // Create the close button element
    const span = document.createElement("span");
    span.classList.add("close");
    span.innerHTML = "&times;";

    // Define the click handler for the close button
    span.onclick = () => modal.remove();

    // Append the image and close button elements to the modal container
    modal.appendChild(span);
    modal.appendChild(img);

    // Append the modal container to the document body
    document.body.appendChild(modal);

    // Define the click handler for clicks outside of the modal
    const handleClickOutside = (event) => {
      if (event.target === modal) {
        modal.remove();
        window.removeEventListener("click", handleClickOutside);
      }
    };

    // Define the keydown handler for the escape key
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        modal.remove();
        window.removeEventListener("keydown", handleKeyDown);
      }
    };

    // Add event listeners for clicks outside of the modal and for the escape key
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
  }

  function renderFiles(file_urls) {
    return (
      <div className="files-container">
        {file_urls.map((urlObj) => {
          const { url, type } = urlObj;
          const fileRef = ref(storage, url);
          console.log(url);
          console.log(fileRef);
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
    <>
      {messages.map((message) => (
        <div key={message.id} className="message">
          <p>{message.conversation_id}</p>
          <p>{message.text}</p>
          {message.file_urls && renderFiles(message.file_urls)}
        </div>
      ))}
      <ChatInput sendMessage={sendMessage} />
    </>
  );
}

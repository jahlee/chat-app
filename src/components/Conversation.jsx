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
import Modal from "./Modal";

export default function Conversation({ conv }) {
  const conversation_id = conv ? conv.conversation_id : "";
  const [messages, setMessages] = useState([]);
  const [imageOpened, setImageOpened] = useState(false);
  const [openImageURL, setOpenImageURL] = useState("");
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
        setMessages(items);
        console.log("messages:", items);
      },
      (err) => {
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, [conv]);

  useEffect(() => {
    console.log("imageOpened:", imageOpened);
  }, [imageOpened]);

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
        conversation_id: conversation_id,
        sender_id: user.userId,
        text: message,
        file_urls: file_urls,
        timestamp: serverTimestamp(),
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

  function closeImage() {
    setImageOpened(false);
    setOpenImageURL("");
  }

  function openImage(url) {
    setImageOpened(true);
    setOpenImageURL(url);
    console.log(url, "being opened");
  }

  function renderFiles(file_urls) {
    return (
      <div className="files-container">
        {file_urls.map((urlObj) => {
          const { url, type } = urlObj;
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

  function renderMessages() {
    return (
      <div className="messages-container">
        {messages.map((message) => {
          const className =
            message.sender_id === user.userId
              ? "sent-message"
              : "receive-message";
          return (
            <div key={message.id} className={className}>
              <p>{message.conversation_id}</p>
              <p>{message.text}</p>
              {message.file_urls && renderFiles(message.file_urls)}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <React.Fragment>
      {imageOpened && (
        <Modal onClose={closeImage}>
          <img
            src={openImageURL}
            alt={openImageURL}
            onClick={(e) => e.stopPropagation()}
            className="modal-image"
          />
        </Modal>
      )}
      {renderMessages()}
      <ChatInput sendMessage={sendMessage} className="chat-input-container" />
    </React.Fragment>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { convRef, filesRef, messagesRef, storage } from "../firebase-config";
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
  updateDoc,
} from "@firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import UserContext from "../context/UserContext";
import ChatInput from "./ChatInput";
import "../styling/Chats.css";
import Modal from "./Modal";
import Message from "./Message";

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
      const image_refs = [];
      const pdf_refs = [];
      if (files && files.length > 0) {
        // eslint-disable-next-line array-callback-return
        await Promise.all(
          Array.from(files).map(async (file) => {
            const uuid = uuidv4();
            const fileName = file.name;
            const storageName = `messages/${uuid}`;
            const fileRef = ref(storage, storageName);
            const type = file.type.includes("image") ? "image" : "pdf";

            await uploadBytes(fileRef, file);
            console.log("uploaded file!");

            const fileURL = await getDownloadURL(fileRef);

            // upload file metadata
            const fileObj = {
              uuid: uuid,
              file_name: fileName,
              storage_name: storageName,
              file_url: fileURL,
              file_type: type,
              user_id: user.userId,
              conv_id: conversation_id,
              upload_time: serverTimestamp(),
            };
            const newFileRef = await addDoc(filesRef, fileObj);
            console.log(newFileRef);

            const newFileRefObj = {
              id: newFileRef.id,
              url: fileURL,
              type: type,
            };

            if (type === "image") {
              image_refs.push(newFileRefObj);
            } else {
              pdf_refs.push(newFileRefObj);
            }
          })
        );
      }
      const file_refs = [...pdf_refs, ...image_refs];
      const newDocRef = doc(messagesRef);
      const messageData = {
        id: newDocRef.id,
        conversation_id: conversation_id,
        sender_id: user.userId,
        text: message,
        file_refs: file_refs,
        timestamp: serverTimestamp(),
      };
      await addDoc(messagesRef, messageData);

      // update conversation with last_message and last_timestamp
      const convDoc = doc(convRef, conversation_id);
      const last_message =
        files && files.length > 0
          ? files.length > 1
            ? `${files.length} files were added`
            : "1 file was added"
          : message;
      await updateDoc(convDoc, {
        last_message: last_message,
        last_message_userId: user.userId,
        last_timestamp: serverTimestamp(),
      });
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

  function renderMessages() {
    const returnMessages = [];
    let prev_userId = null;
    let prev_timestamp = new Date(0);
    let showTime = true;
    let showUser = true;
    for (let idx = messages.length - 1; idx >= 0; idx--) {
      const message = messages[idx];
      try {
        const message_timestamp = message.timestamp.toDate();
        if (idx < messages.length - 1) {
          const timeDiff = message_timestamp - prev_timestamp;
          const minsDiff = Math.floor(timeDiff / (1000 * 60)); // ms to s, s to min
          console.log(minsDiff);
          // more than 5 mins from last timestamped message
          showTime = minsDiff > 5;
          showUser = prev_userId === message.sender_id;
        }
        prev_userId = message.sender_id;
        prev_timestamp = showTime ? message_timestamp : prev_timestamp;
        console.log(idx, showUser, showTime, message);
      } catch (err) {
        showTime = false;
        console.error(err);
      }
      returnMessages.push(
        <Message
          key={idx}
          message={message}
          openImage={openImage}
          openPdf={openPdf}
          showUser={showUser}
          showTime={showTime}
        />
      );
    }
    return <div className="messages-container">{returnMessages.reverse()}</div>;
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

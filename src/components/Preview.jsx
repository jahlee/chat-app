import React, { useEffect, useState } from "react";
import { collection, doc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { RecaptchaVerifier } from "firebase/auth";

function Preview() {
  const [messagesList, setMessagesList] = useState([]);
  const messagesCollectionRef = collection(db, "messages");

  // get all messages when we get the previews component
  useEffect(() => {
    const getMessages = async () => {
      const data = await getDocs(messagesCollectionRef);
      setMessagesList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getMessages();
  }, []);

  const deleteMessage = async (id) => {
    const userMessage = doc(db, "messages", id);
    await deleteDoc(userMessage);
    window.location.reload();
  };

  return (
    <div>
      {messagesList.map((message) => (
        <React.Fragment>
          <div className="picture">{message.picture}</div>
          <div className="preview">{message.preview}</div>
          <button onClick={() => deleteMessage(message.id)}>Delete</button>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Preview;

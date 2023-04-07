import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { limit, onSnapshot, query, where } from "firebase/firestore";
import { statusRef } from "../firebase-config";
import "../styling/Chats.css";

export default function StatusIndicator({ conv, setRead }) {
  const { user } = useContext(UserContext);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const statusQuery = query(
      statusRef,
      where("conversation_id", "==", conv ? conv.conversation_id : ""),
      limit(1)
    );
    const unsubscribe = onSnapshot(
      statusQuery,
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const { last_read, typing } = data;
          const message_to_user = {};
          for (const usr in last_read) {
            const msg = last_read[usr];
            if (msg in message_to_user) {
              message_to_user[msg].push(usr);
            } else {
              message_to_user[msg] = [usr];
            }
          }
          setRead(message_to_user);
          let isTyping = false;
          for (const key in typing) {
            console.log(key, key !== user.userId && typing[key]);
            if (key !== user.userId && typing[key]) {
              isTyping = true;
              break;
            }
          }
          setTyping(isTyping);
        });
      },
      (err) => {
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, [conv]);

  return (
    typing && (
      <p style={{ margin: 0, padding: 0, marginLeft: "5px" }}>
        Someone is typing...
      </p>
    )
  );
}

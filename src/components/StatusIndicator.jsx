import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { limit, onSnapshot, query, where } from "firebase/firestore";
import { statusRef } from "../firebase-config";
import "../styling/Chats.css";

/**
 * Component that handles each user's last read message of convo
 * and whether or not a user is typing
 *
 * @param {Object} conv - conversation for this status indicator
 * @param {Function} setRead - function to set last read message
 */
export default function StatusIndicator({ conv, setRead }) {
  const { user } = useContext(UserContext);
  const [typing, setTyping] = useState(false);

  // update last read and is typing for status document of this conversation
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conv]);

  return (
    typing && (
      <p style={{ margin: 0, padding: 0, marginLeft: "5px" }}>
        Someone is typing...
      </p>
    )
  );
}

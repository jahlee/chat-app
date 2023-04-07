import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { limit, onSnapshot, query, where } from "firebase/firestore";
import { statusRef } from "../firebase-config";

export default function StatusIndicator({ conv }) {
  const { user } = useContext(UserContext);
  const [read, setRead] = useState({});
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
          setRead(last_read);
          for (const key in typing) {
            if (key !== user.userId && typing[key] === true) {
              setTyping(true);
              break;
            }
          }
        });
      },
      (err) => {
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, [conv]);

  return (
    <div>
      {JSON.stringify(read)} {typing}
    </div>
  );
}

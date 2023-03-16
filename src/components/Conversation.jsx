import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase-config';
import { ref } from 'firebase/storage'; 
import { addDoc, doc, collection, onSnapshot } from '@firebase/firestore';
import Input from './Input';

export default function Conversation() {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const firebaseRef = collection(db, process.env.REACT_APP_DB_MESSAGES);
  const storageRef = ref(storage);

  // load messages + use handler to get messages
  useEffect(() => {
    setLoading(true);
    // snapShot better than just `get()` becauase it has a listener to update
    // in real-time. 
    const unsubscribe = onSnapshot(firebaseRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setConversation(items.reverse());
      setLoading(false);
      console.log(items);
    }, (err) => {
      console.error(err);
    });
    
    return () => unsubscribe();
  }, []);

    function sendMessage(message, files) {
        try {
          const newDocRef = doc(firebaseRef);
          const messageData = {
            id: newDocRef.id,
            text: message,
            timestamp: new Date().toISOString(),
          }
          addDoc(firebaseRef, messageData);
          if (files && files.length > 0) {
            // eslint-disable-next-line array-callback-return
            files.map((file) => {
              const timestamp = new Date().getTime();
              const fileName = `${timestamp}_${file.name}`;
              const fileRef = storageRef.child(fileName);
              fileRef.put(file)
              .then(() => {
                console.log('file uploaded!');
              })
              .catch((err) => {
                console.error(err);
              })
            })
          }
        } catch (e) {
            console.log(e);
        }
        console.log('hi');
    }


  return (
    <>
    {conversation.map((message) => (
      <div key={message.id}>
        <p>{message.conversation_id}</p>
        <p>{message.text}</p>
      </div>
    ))}
    <button onClick={() => sendMessage('hi', null)}>Send hi</button>
    <Input sendMessage={sendMessage} />
    </>
  );
}

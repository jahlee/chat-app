import React, { useState } from 'react';
import { db } from '../firebase-config'; 
import { addDoc, collection } from '@firebase/firestore';
import Input from './Input';

export default function Conversation() {
    const ref = collection(db, process.env.REACT_APP_DB_MESSAGES);
    function sendMessage(message, files) {
        try {
            const storage = db.storage().ref();
            addDoc(ref, message);
        } catch (e) {
            console.log(e);
        }
    }


  return (
    <Input sendMessage={sendMessage} />
  );
}

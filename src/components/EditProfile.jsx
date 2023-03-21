import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase-config";

function EditProfile({ setEditMode }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // reference to our profiles collection in firebase
  const profilesColectionRef = collection(db, "profiles");
  const updateProfile = async () => {
    await addDoc(profilesColectionRef, {
      id: auth.currentUser.uid,
      name: name === "" ? name : auth.currentUser.displayName,
      description,
    });
    setEditMode(false);
  };
  return (
    <div>
      <input
        placeholder={name === "" ? "Your Name" : name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <textarea
        placeholder={
          description === "" ? "Description about yourself" : description
        }
        onChange={(event) => {
          setDescription(event.target.value);
        }}
      />
      <button onClick={() => updateProfile()}>Save changes</button>
    </div>
  );
}

export default EditProfile;

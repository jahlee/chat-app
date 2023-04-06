import React, { useContext, useRef, useState } from "react";
import editIcon from "../assets/edit.svg";
import UserContext from "../context/UserContext";
import "../styling/Profile.css";
import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { filesRef, storage, usersRef } from "../firebase-config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Modal from "../components/Modal";

function Profile() {
  const { user } = useContext(UserContext);
  const [editName, setEditName] = useState(false);
  const [editPhoto, setEditPhoto] = useState(false);
  const [name, setName] = useState(user.name);
  const [photoURL, setPhotoURL] = useState(user.photo_url);
  const [photo, setPhoto] = useState(null);
  const [imageOpened, setImageOpened] = useState(false);
  const fileInputRef = useRef();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePhotoChange = (event) => {
    if (event.target.files) {
      setEditPhoto(true);
      setPhoto(event.target.files[0]);
      setPhotoURL(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleEditPhoto = () => {
    fileInputRef.current.click();
  };

  const openImage = () => {
    setImageOpened(true);
  };

  const closeImage = () => {
    setImageOpened(false);
  };

  const handleCancelChanges = () => {
    setEditPhoto(false);
    setEditName(false);
    setName(user.name);
    setPhotoURL(user.photo_url);
  };

  const handleSaveChanges = async () => {
    const userDoc = doc(usersRef, user.userId);
    let newPhotoURL = photoURL;
    if (photo) {
      const uuid = uuidv4();
      const fileName = photo.name;
      const storageName = `profiles/${uuid}`;
      const fileRef = ref(storage, storageName);
      const type = "image";
      await uploadBytes(fileRef, photo);
      newPhotoURL = await getDownloadURL(fileRef);

      // upload photo metadata
      const photoObj = {
        uuid: uuid,
        file_name: fileName,
        storage_name: storageName,
        file_url: newPhotoURL,
        file_type: type,
        user_id: user.userId,
        upload_time: serverTimestamp(),
      };
      await addDoc(filesRef, photoObj);

      // delete old picture + metadata
      // need try/catch in case old picture is fb/google default url
      try {
        const deleteURL = user.photo_url;
        const storageRef = ref(storage, deleteURL);
        await deleteObject(storageRef);

        const q = query(filesRef, where("file_url", "==", deleteURL));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (queryDoc) => {
          const docId = queryDoc.id;
          await deleteDoc(doc(filesRef, docId));
        });
        console.log("deleted old picture:", user.photo_url);
      } catch (err) {
        console.error("error deleting previous profile picture", err);
      }
    }

    try {
      await updateDoc(userDoc, {
        name: name,
        photo_url: newPhotoURL,
        last_timestamp: serverTimestamp(),
      });
      console.log("updated with:", name, newPhotoURL);
    } catch (e) {
      console.error(e);
    }
    setEditPhoto(false);
    setEditName(false);
  };

  return (
    <div className="profile">
      {imageOpened && (
        <Modal onClose={closeImage}>
          <img
            src={photoURL}
            alt={photoURL}
            onClick={(e) => e.stopPropagation()}
            className="modal-image"
          />
        </Modal>
      )}
      {editName ? (
        <div className="name-container">
          <input
            className="edit-name"
            type="text"
            value={name}
            onChange={handleNameChange}
            autoFocus
          />
        </div>
      ) : (
        <div className="name-container">
          <h1 className="name">{name}</h1>
          <img
            src={editIcon}
            alt="Edit Icon"
            className="edit-icon"
            onClick={() => setEditName(true)}
          />
        </div>
      )}
      <div className="photo-container">
        <img
          src={photoURL}
          alt="Profile"
          className="photo"
          onClick={openImage}
        />
        <img
          src={editIcon}
          alt="Edit Icon"
          className="edit-icon"
          onClick={handleEditPhoto}
        />
      </div>
      <input
        id="photo-upload"
        type="file"
        accept="image/jpeg"
        onChange={handlePhotoChange}
        ref={fileInputRef}
      />
      {(editName || editPhoto) && (
        <div className="buttons">
          <button
            className="profile-cancel-button"
            onClick={handleCancelChanges}
          >
            Cancel
          </button>
          <button className="profile-save-button" onClick={handleSaveChanges}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;

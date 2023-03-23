import React, { useContext, useState } from "react";
import EditProfile from "../components/EditProfile";
import editIcon from "../assets/edit.svg";
import UserContext from "../context/UserContext";

function Profile() {
  const { user } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  return (
    <div className="profile">
      {editMode ? (
        <div>
          <EditProfile setEditMode={setEditMode} />
        </div>
      ) : (
        <div>
          <h1>{JSON.stringify(user)}</h1>
          <p></p>
        </div>
      )}
      <img src={editIcon} alt="Edit Icon" onClick={() => setEditMode(true)} />
    </div>
  );
}

export default Profile;

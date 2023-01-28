import React, { useState } from "react";
import EditProfile from "./EditProfile";
import editIcon from "../assets/edit.svg";

function Profile() {
    const name = "Michael Scott";
    const [editMode, setEditMode] = useState(false);
    return (
    <div className="profile">
            {editMode ? (
                <div>
                    <EditProfile setEditMode={setEditMode} />
                </div>
            ) : (
                <div>
                    <h1>{name}</h1>
                    <p></p>
                </div>
            )}
            <img
                src={editIcon}
                alt="Edit Icon"
                onClick={() => setEditMode(true)} />
            
        </div>
    );
}

export default Profile;
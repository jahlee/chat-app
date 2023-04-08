import React, { useContext, useEffect, useState } from "react";
import SearchEntry from "./SearchEntry";
import { getDoc, getDocs, query, where, doc } from "firebase/firestore";
import { convRef, usersRef } from "../firebase-config";
import "../styling/Search.css";
import UserContext from "../context/UserContext";

/**
 * The dropdown of names when searching for a specific name
 *
 * @param {String} search - search content/text
 * @param {Function} handleSelectedUser - action when select user
 * @param {Boolean} searchSelected - highlight specific search option
 * @param {String} type - for searchentry, if for sidebar vs modal search
 */
export default function SearchDropdown({
  search,
  handleSelectedUser,
  searchSelected,
  type,
}) {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedUser, setSelectedUser] = useState(searchSelected);
  const { user } = useContext(UserContext);
  const className = type + "-dropdown";

  useEffect(() => {
    const handleSearch = async () => {
      try {
        let query_users = [];
        const q1 = query(
          usersRef,
          where("lowercase_name", ">=", search),
          where("lowercase_name", "<", `${search}\uf8ff`)
        );
        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach((doc) => {
          query_users.push(doc.data());
        });
        // remove self from entries
        query_users = query_users.filter((usr) => usr.userId !== user.userId);
        setUsers(query_users);

        // get groupchats with both of these users, prevent duplicate entries
        let query_groups = [];
        const seen_groups = new Set();
        const q2 = query(
          convRef,
          where(`participants_obj.${user.userId}`, "==", true)
        );
        const querySnapshot2 = await getDocs(q2);
        await Promise.all(
          // from list of userids, get group convos with these two users
          query_users.map(async (usr) => {
            await Promise.all(
              querySnapshot2.docs.map(async (groupDoc) => {
                const groupData = groupDoc.data();
                if (
                  groupData.participants_obj[usr.userId] &&
                  groupData.num_participants > 2 &&
                  !seen_groups.has(groupData.conversation_id)
                ) {
                  seen_groups.add(groupData.conversation_id);
                  const names = [];
                  await Promise.all(
                    groupData.participants.map(async (pId) => {
                      // get names of these users
                      if (pId !== user.userId) {
                        const userDoc = doc(usersRef, pId);
                        const userDocRef = await getDoc(userDoc);
                        names.push(userDocRef.data().name);
                      }
                    })
                  );
                  query_groups.push({
                    name: names.sort(),
                    photo_url: groupData.photo_url,
                  });
                }
              })
            );
          })
        );
        setGroups(query_groups);
      } catch (err) {
        console.error("err retrieving searched users:", err);
      }
    };
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSelect = () => {
    handleSelectedUser(selectedUser);
  };

  const handleHoveredUser = (usr) => {
    setSelectedUser(usr);
  };

  const handleGroupSelect = () => {
    console.log("Selected group!");
  };

  return (
    <ul className={className}>
      {users.map((user, idx) => (
        <SearchEntry
          key={idx}
          user={user}
          onSelect={handleSelect}
          onHover={handleHoveredUser}
          isHovered={selectedUser && selectedUser.userId === user.userId}
          type={type}
        />
      ))}
      <div className="group-divider">Groups:</div>
      {groups.map((group, idx) => (
        <SearchEntry
          key={idx}
          user={group}
          onSelect={handleGroupSelect}
          onHover={handleHoveredUser}
          isHovered={selectedUser && selectedUser.userId === user.userId}
          type={type}
        />
      ))}
    </ul>
  );
}

import React, { useState, useEffect } from "react";

export default function Profile({ logOut, user, changeGroupStatus }) {
    const [createGroupName, setCreateGroup] = useState("");
    const [inAGroup, setInGroup] = useState(!!user.group);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [error, setError] = useState("");
    console.log(user);
    console.log(inAGroup);
    useEffect(() => {
  fetch("/api/groups/getAll")
    .then(r => r.json())
    .then(data => setGroups(data));
}, []);

    const createGroup = async () => {
        if (createGroupName.trim() === "") {
            setError("Group name cannot be empty");
        return;
        }
        try {
        const response = await fetch("/api/groups/create", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user._id}),
        });

        if (!response.ok) {
            throw new Error(response.error);
        }

        const data = await response.json();
        console.log(data);
        setInGroup(true);
        changeGroupStatus(data.group);
        } catch (err) {
        setError(err.message || "An error occurred during create group");
        }
    }

    const leaveGroup = async () => {
        try {
        const response = await fetch("/api/groups/leave", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.username}),
        });

        if (!response.ok) {
            throw new Error(response.error);
        }

        const data = await response.json();
        console.log(data);
        changeGroupStatus(null);
        } catch (err) {
        setError(err.message || "An error occurred during leave group");
        }
    }

    const joinGroup = async () => {
  if (!selectedGroup) { setError("Select a group first"); return; }
  const response = await fetch("/api/groups/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user._id, groupId: selectedGroup }),
  });
  if (!response.ok) throw new Error("Join group failed");
  setInGroup(true);
};

    return (
        <div id="profile">
        <div id="userName">Username: {user?.username}</div>
        <div id="points">Points: {user?.points}</div>
        <div>Group: {!!user.group ? user.group : "No Group joined"}</div>
        <button onClick={() => logOut()}>Log Out</button>
        {!inAGroup && <div id = 'createGroup'>
            <input
            type="text"
            value={createGroupName}
            onChange={(e) => setCreateGroup(e.target.value)}
            />
            <button onClick={() => createGroup()}>Create Group</button>
        </div>}

        {!inAGroup && <button onClick={() => joinGroup()}>Join Group</button>}
        <button onClick={() => leaveGroup()}>Leave Group</button>
        {!inAGroup && <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
  <option value="">Select a group</option>
  {groups.map((g) => (
    <option key={g._id} value={g._id}>{g.name}</option>
  ))}
</select>}
        </div>
        
    );
}

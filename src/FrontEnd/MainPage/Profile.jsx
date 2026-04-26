import React, { useState } from "react";

export default function Profile({ logOut, user, changeGroupStatus }) {
    const [joinGroup, setNewGroup] = useState("");
    const [createGroupName, setCreateGroup] = useState("");
    const [inAGroup, setInGroup] = useState(!!user.groups);
    const [groups, setGroups] = useState([]);

    const createGroup = async () => {
        if (createGroup.trim() === "") {
            setError("Group name cannot be empty");
        return;
        }
        try {
        const response = await fetch("/api/groups/create", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.id, groupName: createGroupName }),
        });

        if (!response.ok) {
            throw new Error(response.error);
        }

        const data = await response.json();
        console.log(data);
        setInGroup(true);
        changeGroupStatus(createGroup);
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
            body: JSON.stringify({ userId: user.id, groupName: user.group }),
        });

        if (!response.ok) {
            throw new Error(response.error);
        }

        const data = await response.json();
        console.log(data);
        setGroups(data.response);
        changeGroupStatus(null);
        } catch (err) {
        setError(err.message || "An error occurred during leave group");
        }
    }

    const getGroups = async () => {
        if (createGroup.trim() === "") {
            setError("Group name cannot be empty");
        return;
        }
        try {
        const response = await fetch("/api/groups/get", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: "",
        });

        if (!response.ok) {
            throw new Error(response.error);
        }

        const data = await response.json();
        console.log(data);
        } catch (err) {
        setError(err.message || "An error occurred during group fetch");
        }
    }

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
        {!inAGroup && <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>

        </select>}
        {!inAGroup && <button onClick={() => joinGroup()}>Join Group</button>}
        {inAGroup && <button onClick={() => leaveGroup()}>Leave Group</button>}
        </div>
    );
}

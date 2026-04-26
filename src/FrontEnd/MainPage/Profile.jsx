import React, { useState, useEffect } from "react";
import './Profile.css';

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
            body: JSON.stringify({ userId: user._id, name: createGroupName}),
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
            body: JSON.stringify({ userId: user._id}),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Leave failed");
        }

        // Update the global App state
        changeGroupStatus(null); 
        // Update the local component state to show Join/Create buttons
        setInGroup(false); 
        
    } catch (err) {
        setError(err.message);
    }
    }

    const joinGroup = async () => {
        if (!selectedGroup) { setError("Select a group first"); return; }
        try {
            const response = await fetch("/api/groups/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, groupId: selectedGroup }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Join group failed");

            // Find the name of the group we just joined to update the UI
            const joinedGroup = groups.find(g => g._id === selectedGroup);
            changeGroupStatus(joinedGroup ? joinedGroup.name : "Joined");
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-container">
            <div className="side-banner"></div>
            <div id="profile">
                <h2>Profile</h2>
                <div id="userName"><strong>Username:</strong> {user?.username}</div>
                <div id="points"><strong>Points:</strong> {user?.points}</div>
                <div id="userGroup"><strong>Group:</strong> {user?.group ?? "No Group joined"}</div>

                <hr />

                {user?.group ? (
                    <div id="inGroupSection">
                        <p>You are currently a member of <b>{user.group}</b></p>
                        <button onClick={leaveGroup}>Leave Group</button>
                    </div>
                ) : (
                    <div id="noGroupSection">
                        <h3>Create a Group</h3>
                        <input
                            type="text"
                            placeholder="New Group Name"
                            value={createGroupName}
                            onChange={(e) => setCreateGroup(e.target.value)}
                        />
                        <button onClick={createGroup}>Create Group</button>

                        <h3>Or Join a Group</h3>
                        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                            <option value="">-- Select a group --</option>
                            {groups.map((g) => (
                                <option key={g._id} value={g._id}>{g.name}</option>
                            ))}
                        </select>
                        <button onClick={joinGroup}>Join Group</button>
                    </div>
                )}

                <hr />

                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                <button onClick={logOut} style={{ marginTop: '20px', backgroundColor: '#ff4d4d', color: 'white' }}>
                    Log Out
                </button>
            </div>
        </div>
    );
}
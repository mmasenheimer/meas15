import React, { useState, useEffect } from "react";
import './Profile.css';

export default function Profile({ logOut, user, changeGroupStatus }) {
    const [createGroupName, setCreateGroup] = useState("");
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/groups/getAll")
            .then(r => r.json())
            .then(data => setGroups(data))
            .catch(() => setError("Could not load groups."));
    }, []);

    const createGroup = async () => {
        if (createGroupName.trim() === "") {
            setError("Group name cannot be empty");
            return;
        }
        try {
            const response = await fetch("/api/groups/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, name: createGroupName }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Create failed");
            changeGroupStatus(data.group);
            setCreateGroup("");
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    const leaveGroup = async () => {
        try {
            const response = await fetch("/api/groups/leave", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Leave failed");
            }
            changeGroupStatus(null);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

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
<<<<<<< HEAD
            <div id="profile">
                <h2>Profile</h2>
                <div id="userName"><strong>Username:</strong> {user?.username}</div>
                <div id="points"><strong>Points:</strong> {user?.points}</div>
                <div id="userGroup"><strong>Group:</strong> {user?.group ?? "No Group joined"}</div>
=======
            
            <div className="content-area" id="profile">
                <h1>Profile</h1>
                <div className="info-section">
                    <p><strong>Username:</strong> {user?.username}</p>
                    <p><strong>Points:</strong> {user?.points}</p>
                    <p><strong>Group:</strong> {user?.group ? user.group : "No Group joined"}</p>
                </div>
>>>>>>> cbd788a974d3d9a0046c3517e87b7ff7e104d77e

                <hr />

                {user?.group ? (
<<<<<<< HEAD
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
=======
                    <div className="route-container">
                        <h1>{user.group}</h1>
                        <p>You are currently a member of this group.</p>
                        <button className="map-button btn-red" onClick={leaveGroup}>
                            Leave Group
                        </button>
                    </div>
                ) : (
                    <div id="noGroupSection">
                        <div className="form-group">
                            <h1>Create a Group</h1>
                            <label>New Group Name</label>
                            <input
                                type="text"
                                value={createGroupName}
                                onChange={(e) => setCreateGroup(e.target.value)}
                                placeholder="Enter group name..."
                            />
                            <button className="map-button" onClick={createGroup}>
                                Create Group
                            </button>
                        </div>

                        <div className="form-group" style={{marginTop: '40px'}}>
                            <h1>Join a Group</h1>
                            <label>Select an existing group</label>
                            <select 
                                className="styled-select"
                                value={selectedGroup} 
                                onChange={(e) => setSelectedGroup(e.target.value)}
                            >
                                <option value="">-- Select a group --</option>
                                {groups.map((g) => (
                                    <option key={g._id} value={g._id}>{g.name}</option>
                                ))}
                            </select>
                            <button className="map-button" onClick={joinGroup}>
                                Join Group
                            </button>
                        </div>
>>>>>>> cbd788a974d3d9a0046c3517e87b7ff7e104d77e
                    </div>
                )}

                <hr />
<<<<<<< HEAD

                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                <button onClick={logOut} style={{ marginTop: '20px', backgroundColor: '#ff4d4d', color: 'white' }}>
=======
                
                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                
                <button 
                    className="map-button btn-red"
                    onClick={logOut} 
                >
>>>>>>> cbd788a974d3d9a0046c3517e87b7ff7e104d77e
                    Log Out
                </button>
            </div>
        </div>
    );
}
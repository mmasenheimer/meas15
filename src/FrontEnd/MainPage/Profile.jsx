import React, { useState } from "react";
import "./Profile.css";

export default function Profile({ logOut, user, changeGroupStatus }) {
    const [groupName, setGroupName] = useState("");
    const [inAGroup, setInGroup] = useState(!!user?.group);
    const [error, setError] = useState("");

    const createGroup = async () => {
        if (!groupName.trim()) {
            setError("Group name cannot be empty");
            return;
        }

        try {
            const response = await fetch("/api/groups/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user?.id, groupName }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to create group");
            }

            const data = await response.json();
            console.log(data);
            setInGroup(true);
            setGroupName("");
            setError("");

            if (changeGroupStatus) {
                changeGroupStatus(groupName);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred while creating the group");
        }
    };

    const leaveGroup = async () => {
        try {
            const response = await fetch("/api/groups/leave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user?.id, groupName: user?.group }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to leave group");
            }

            const data = await response.json();
            console.log(data);
            setInGroup(false);
            setError("");

            if (changeGroupStatus) {
                changeGroupStatus(null);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred while leaving the group");
        }
    };

    return (
        <div id="profile-page">
            <nav className="side-banner"></nav>
            <div id="profile">
                <div id="userName">Username: {user?.username}</div>
                <div id="points">Points: {user?.points}</div>
                <div>Group: {!!user?.group ? user.group : "No group joined"}</div>
                <button id="logOutButton" onClick={() => logOut()}>
                    Log Out
                </button>

                {!inAGroup && (
                    <div id="createGroup">
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="New group name"
                        />
                        <button onClick={createGroup}>Create Group</button>
                    </div>
                )}

                {inAGroup && <button onClick={leaveGroup}>Leave Group</button>}

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}

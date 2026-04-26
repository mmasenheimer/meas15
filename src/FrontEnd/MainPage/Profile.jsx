import React, {useState} from 'react';
import './Profile.css';

<<<<<<< Updated upstream
export default function Profile({logOut}) {

    return (
        <div id="profile-page">
            <nav className="side-banner"></nav>
            <div id="profile">
                <div id="userName">Username: </div>
                <div id="points">Points: </div>
                <button id="logOutButton" onClick={() => logOut()}>Log Out</button>
            </div>
=======
export default function Profile({ logOut, user }) {
    const [joinGroup, setNewGroup] = useState("");
    const [groupName, setGroupName] = useState("");
    const [inAGroup, setInGroup] = useState(!!user.groups);

    const createGroup = async () => {
        if (!groupName.trim()) {
            alert("Please enter a group name");
            return;
        }
        try {
            const response = await fetch('/api/groups/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: groupName, userId: user.id }),
            });
            if (!response.ok) {
                throw new Error('Failed to create group');
            }
            const data = await response.json();
            // Update user state or refetch user data
            setInGroup(true);
            setGroupName(""); // Clear input
            alert("Group created successfully!");
        } catch (error) {
            console.error('Error creating group:', error);
            alert("Error creating group: " + error.message);
        }
    }

    const leaveGroup = async () => {
        try {
            const response = await fetch('/api/groups/leave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            });
            if (!response.ok) {
                throw new Error('Failed to leave group');
            }
            // Update user state
            setInGroup(false);
            alert("Left group successfully!");
        } catch (error) {
            console.error('Error leaving group:', error);
            alert("Error leaving group: " + error.message);
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
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            />
            <button onClick={() => createGroup()}>Create Group</button>
        </div>}
        {!!inAGroup && <button onClick={() => joinGroup()}>Join Group</button>}
        {inAGroup && <button onClick={() => leaveGroup()}>Leave Group</button>}
>>>>>>> Stashed changes
        </div>
    )
}
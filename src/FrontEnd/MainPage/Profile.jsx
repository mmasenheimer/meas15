import React, { useState } from "react";

export default function Profile({ logOut, user }) {
    const [joinGroup, setNewGroup] = useState("");
    const [createGroup, setCreateGroup] = useState("");
    const [inAGroup, setInGroup] = useState(!!user.groups);

    const createGroup = () => {
        
    }

    const leaveGroup = () => {

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
            value={createGroup}
            onChange={(e) => setCreateGroup(e.target.value)}
            />
            <button onClick={() => createGroup()}>Create Group</button>
        </div>}
        {!!inAGroup && <button onClick={() => joinGroup()}>Join Group</button>}
        {inAGroup && <button onClick={() => leaveGroup()}>Leave Group</button>}
        </div>
    );
}

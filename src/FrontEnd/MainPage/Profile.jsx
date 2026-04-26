import React, { useState } from "react";

export default function Profile({ logOut, user }) {
    const [joinGroup, setNewGroup] = useState("");
    const [createGroup, setCreateGroup] = useState("");

    const createGroup = () => {
        
    }

    return (
        <div id="profile">
        <div id="userName">Username: {user?.username}</div>
        <div id="points">Points: {user?.points}</div>
        <div>Groups: </div>
        <div id="groups">
            {user.groups?.map((group) => <div>{group}</div>) || "No groups joined"}
        </div>
        <button onClick={() => logOut()}>Log Out</button>
        <input
            type="text"
            value={createGroup}
            onChange={(e) => setCreateGroup(e.target.value)}
        />
        <button onClick={() => createGroup()}>Create Group</button>
        </div>
    );
}

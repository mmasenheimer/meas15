import React, { useState } from "react";

export default function Profile({ logOut, user }) {
    const [joinGroup, setNewGroup] = useState("");
    const [createGroup, setCreateGroup] = useState("");

    return (
        <div id="profile">
        <div id="userName">Username: {user?.username}</div>
        <div id="points">Points: {user?.points}</div>
        <div>Groups: </div>
        <div id="groups">
            {user.groups?.map((group) => <div>{group}</div>) || "No groups joined"}
        </div>
        </div>
    );
}

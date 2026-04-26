import React, { useState } from "react";

export default function Profile({ logOut, user }) {
  return (
    <div id="profile">
      <div id="userName">Username: {user?.username}</div>
      <div id="points">Points: {user?.points}</div>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
}

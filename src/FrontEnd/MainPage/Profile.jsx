import React, {useState} from 'react';

export default function Profile({logOut}) {

    return (
        <div id="profile">
            <div id="userName">Username: </div>
            <div id="points">Points: </div>
            <button id="logOutButton" onClick={() => logOut()}>Log Out</button>
        </div>
    )
}
import React, {useState} from 'react';

export default function Profile() {

    return (
        <div id="profile">
            <div id="userName">Username: </div>
            <div id="points">Points: </div>
            <button id="logOutButton">Log Out</button>
        </div>
    )
}
import React, {useState} from 'react';
import './Profile.css';

export default function Profile({logOut}) {

    return (
        <div id="profile-page">
            <nav className="side-banner"></nav>
            <div id="profile">
                <div id="userName">Username: </div>
                <div id="points">Points: </div>
                <button id="logOutButton" onClick={() => logOut()}>Log Out</button>
            </div>
        </div>
    )
}
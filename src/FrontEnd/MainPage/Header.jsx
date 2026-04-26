import React, {useState} from 'react';

export default function Header({ changePage, page }) {

    return (
        <div id="header">
            <h1 id="title"></h1>
            <button id="homeButton" onClick={() => changePage("home")}>Home</button>
            <button id="leaderboardButton" onClick={() => changePage("leaderboard")}>Leaderboard</button>
            <button id="profileButton" onClick={() => changePage("profile")}>Profile</button>
            <button id="mapButton" onClick={() => changePage("map")}>map</button>
        </div>
    )
}
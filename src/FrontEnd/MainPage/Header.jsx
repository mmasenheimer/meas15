import React, {useState} from 'react';

export default function Header({ changePage, page }) {

    return (
        <div id="header">
            <h1 id="title"></h1>
            {!(page === 'home') && <button id="homeButton" onClick={() => changePage("home")}>Home</button>}
            {!(page === 'leaderboard') && <button id="leaderboardButton" onClick={() => changePage("leaderboard")}>Leaderboard</button>}
            {!(page === 'profile') && <button id="profileButton" onClick={() => changePage("profile")}>Profile</button>}
            {!(page === 'map') && <button id="mapButton" onClick={() => changePage("map")}>map</button>}
        </div> 
    )
}
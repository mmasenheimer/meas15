import React from 'react';
import './header.css'; // Make sure this import is here!

export default function Header({ changePage, page }) {
    return (
        <div id="header">
            <h1 id="title">ECO-Map</h1>
            
            <div className="nav-group">
                <button id="homeButton" onClick={() => changePage("home")}>
                    <span className="material-symbols-outlined">home</span>
                    Home
                </button>
                <button id="leaderboardButton" onClick={() => changePage("leaderboard")}>
                    <span className="material-symbols-outlined">leaderboard</span>
                    Leaderboard
                </button>
                <button id="mapButton" onClick={() => changePage("map")}>
                    <span className="material-symbols-outlined">location_on</span>
                    Map
                </button>
            </div>

            <button id="profileButton" onClick={() => changePage("profile")}>
                <span className="material-symbols-outlined">account_circle</span>
            </button>
        </div>
    )
}
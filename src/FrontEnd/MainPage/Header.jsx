import React, {useState} from 'react';
import './Header.css';

export default function Header({ changePage, page }) {

    return (
        <div id="header">
            <div className="nav-group">
                {page !== 'login' && !(page === 'home') && <button className="navButton" onClick={() => changePage("home")}>Home</button>}
                {page !== 'login' && !(page === 'leaderboard') && <button className="navButton" onClick={() => changePage("leaderboard")}>Leaderboard</button>}
                {page !== 'login' && !(page === 'map') && <button className="navButton" onClick={() => changePage("map")}>Map</button>}
            </div>
            {page !== 'login' && !(page === 'profile') && <button className="navButton" onClick={() => changePage("profile")}>Profile</button>}
        </div> 
    )
}
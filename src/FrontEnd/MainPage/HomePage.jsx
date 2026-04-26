import React, {useState} from 'react';
import './HomePage.css';

export default function HomePage({changePage, onLogOut, user}) {

    return (
        <div className="page-container">
            <div className="side-banner"></div>
            <div className="content-area" id="homePage">
                <h1>Hello, Welcome {user.username}!</h1>
                <p>You've earned {user.points} points</p>
            </div>
        </div>
    )
}
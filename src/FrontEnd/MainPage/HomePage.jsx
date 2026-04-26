import React, {useState} from 'react';
import './HomePage.css';

export default function HomePage({changePage, onLogOut, user}) {

    return (
        <div className="page-container">
            <div className="side-banner"></div>
            <div className="content-area" id="homePage">
                <h1>Hello, {user.username}!</h1>
                <p>Currently, you have {user.points} points.</p>
                <p>Click on the Map page to earn more!</p>

            </div>
        </div>
    )
}
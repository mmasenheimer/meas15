import React, {useState} from 'react';

export default function HomePage({changePage, onLogOut, user}) {

    return (
        <div id="homePage">
            <h1>Hello, Welcome {user.username}!</h1>
            <p>You've earned {user.points} points</p>
        </div>
    )
}
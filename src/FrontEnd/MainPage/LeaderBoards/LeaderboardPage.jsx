import React, {useState} from 'react';
import LeaderBoard from './Leaderboard.jsx';


export default function Leaderboard() {

    return (
        <div id="leaderboardPage">
            <div id = "globalLeaderboard" className = "leaderBoard"></div>
            <div id = "myGroupLeaderboard" className = "leaderBoard"></div>
            <div id = "groupLeaderboard" className = "leaderBoard"></div>
        </div>
    )
}
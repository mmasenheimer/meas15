import React, {useState} from 'react';
import LeaderBoard from './Leaderboard.jsx';


export default function Leaderboard() {


    return (
        <div id="leaderboardPage">
            <div id = "globalLeaderboard"></div>
            <div id = "myGroupLeaderboard"></div>
            <div id = "groupLeaderboard"></div>
        </div>
    )
}
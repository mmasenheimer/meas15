import React, {useState} from 'react';
import LeaderBoard from './Leaderboard.jsx';
import '../HomePage.css';


export default function Leaderboard() {

    

    const leaderBoardMaker = () => {

    }

    return (
        <div className="page-container">
            <div className="side-banner"></div>
            <div className="content-area" id="leaderboardPage">
                <div id = "globalLeaderboard" className = "leaderBoard"></div>
                <div id = "myGroupLeaderboard" className = "leaderBoard"></div>
                <div id = "groupLeaderboard" className = "leaderBoard"></div>
            </div>
        </div>
    )
}
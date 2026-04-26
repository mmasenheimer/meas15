import React, {useState} from 'react';
import '../HomePage.css';
import LeaderBoard from './Leaderboard.jsx';

export default function Leaderboard() {
    const leaderBoardMaker = () => {

    }

    return (
        <div className="page-container">
            <nav className="side-banner"></nav>
            <main className="content-area" id="leaderboardPage">
                <div id="globalLeaderboard" className="leaderBoard"></div>
                <div id="myGroupLeaderboard" className="leaderBoard"></div>
                <div id="groupLeaderboard" className="leaderBoard"></div>
            </main>
        </div>
    )
}
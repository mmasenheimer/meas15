import React, {useState} from 'react';
import LeaderBoard from './Leaderboard.jsx';
import '../HomePage.css';


export default function LeaderboardPage({user}) {

    const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
    const [groupLeaderboard, setGroupLeaderboard] = useState([]);

    const generateGlobalLeaderboard = async () => {
        try {
        const response = await fetch("/api/map/getActivity", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: ""
        });

        if (!response.ok) {
            throw new Error(response.error);
        }

        const data = await response.json();
        console.log(data);
        setGlobalLeaderboard(data);
        } catch (err) {
            setError(err.message || "An error occurred during create group");
        }
    }

    const generateGroupLeaderboard = async (group) => {
        try {
        const response = await fetch(`/api/map/${group}`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: ""
        });

        if (!response.ok) {
            throw new Error(response.error);
        }

        const data = await response.json();
        console.log(data);
        setGroupLeaderboard(data);
        } catch (err) {
            setError(err.message || "An error occurred during create group");
        }
    }

    const leaderBoardMaker = (type) => {
        if (type === 1) {
            generateGlobalLeaderboard().then(() => {
                return (
                    <table>
                    {Object.entries(globalLeaderboard).map(([userId, user]) => (
                        <tr>
                            <td>{userId}</td>
                            <td>{user.username}</td>
                        </tr>

                    ))}
                    </table>
                )
            });
        } else{
            if (!user.group) {
                return (<p>You are not in a group yet</p>)
            }else{
                generateGroupLeaderboard().then(() => {
                return (
                    <table>
                    {groupLeaderboard.map((user, i) => (
                        <tr>
                            <td>{i}</td>
                            <td>{user}</td>
                        </tr>
                    ))}
                    </table>
                )
            });
            }
        }
    }

    return (
        <div className="page-container">
            <div className="side-banner"></div>
            <div className="content-area" id="leaderboardPage">
                <div id = "globalLeaderboard" className = "leaderBoard">
                    <h1>Global Leaderboard</h1>
                    {leaderBoardMaker(1)}
                </div>
                <div id = "myGroupLeaderboard" className = "leaderBoard">
                    <h1>Your Group Leaderboard</h1>
                    {leaderBoardMaker(2)}
                </div>
            </div>
        </div>
    )
}
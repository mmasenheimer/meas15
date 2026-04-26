import React, {useState} from 'react';
import Header from './Header.jsx';
import Leaderboard from './LeaderBoards/LeaderboardPage.jsx';
import Profile from './profile.jsx';
import Map from './map.jsx';
import HomePage from './HomePage.jsx';


export default function Page({onLogOut}) {
    const [page, setPage] = useState('home');

    const changePage = (newPage) => {
        setPage(newPage);
    }

    function getPage() {
        switch (page) {
            case 'leaderboard':
                return <Leaderboard />;
            case 'profile':
                return <Profile />;
            case 'map':
                return <Map />;
            default:
                return <HomePage />;
        }
    }

    return <div>
        <Header changePage={changePage} page={page} />
        {getPage()}
    </div>;
}
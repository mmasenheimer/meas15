import React, { useState } from "react";
import Header from "./Header.jsx";
import Leaderboard from "./LeaderBoards/LeaderboardPage.jsx";
import Profile from "./profile.jsx";
import Map from "./map.jsx";
import HomePage from "./HomePage.jsx";

export default function Page({ logOut, user, changeGroupStatus}) {
  const [page, setPage] = useState("home");

  const changePage = (newPage) => {
    setPage(newPage);
  };

  function getPage() {
    switch (page) {
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile logOut={logOut} user={user} changeGroupStatus={changeGroupStatus} />;
      case "map":
        return <Map />;
      default:
        return <HomePage user={user}/>;
    }
  }

  return (
    <div>
      <Header changePage={changePage} page={page} />
      {getPage()}
    </div>
  );
}

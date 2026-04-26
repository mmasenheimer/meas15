import React, { useState } from "react";
import Header from "./Header.jsx";
import Leaderboard from "./LeaderBoards/LeaderboardPage.jsx";
import Profile from "./profile.jsx";
import Map from "./map.jsx";
import HomePage from "./HomePage.jsx";

export default function Page({ logOut, user }) {
  const [page, setPage] = useState("home");

  const changePage = (newPage) => {
    setPage(newPage);
  };

  function getPage() {
    switch (page) {
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile logOut={logOut} />;
      case "map":
        return <Map />;
      default:
        return <HomePage />;
    }
  }

  return (
    <div>
      <Header changePage={changePage} page={page} />
      <Profile logOut={logOut} user={user} />
      {getPage()}
    </div>
  );
}

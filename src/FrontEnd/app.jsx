import React, { useState } from "react";
import LogInPage from "./LogInPage.jsx";
import Page from "./MainPage/Page.jsx";
import Header from "./MainPage/Header.jsx";

function App() {
  const [count, setCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // const changeGroupStatus = (groupName) => {
  //   user.group = groupName;
  // }
  const changeGroupStatus = (group) => {
  setUser({ ...user, group });
};

  const onSubmit = (data) => {
    setUser(data.user);
    setLoggedIn(true);
  };

  const logOut = async () => {
    await fetch("/api/profile/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id }),
    });
    setLoggedIn(false);
    setUser(null);
  };

  const updatePoints = (newPoints) => {
    setUser({ ...user, points: newPoints });
};

  return (
    <div className="App">
         
     <Header changePage={() => {}} page="login" />
      {loggedIn ? (
        <Page logOut={logOut} user={user} changeGroupStatus={changeGroupStatus} updatePoints={updatePoints}/>
      ) : (
        <LogInPage onSubmit={onSubmit} />
      )}
    </div>
  );
}

export default App;

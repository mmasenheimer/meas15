import React, { useState } from "react";
import LogInPage from "./LogInPage.jsx";
import Page from "./MainPage/Page.jsx";

function App() {
    const [count, setCount] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const onSubmit = (userName, password) => {
        console.log('Login attempt:', { userName, password });
        setLoggedIn(true);
    }
    const logOut = () => {
        setLoggedIn(false);
        setPassword('');
        setUserName('');
    }
    return (
        <div className="App">
            {loggedIn ? (<Page logOut={logOut}/>) : (<LogInPage onSubmit={onSubmit}/>)}
        </div>
    );
}

export default App;

import React, { useState } from 'react';
import LogInPage from './LogInPage.jsx';
import HomePage from './MainPage/Page.jsx';

function App() {
    const [count, setCount] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const onSubmit = (userName, password) => {
        console.log('Login attempt:', { userName, password });
        setLoggedIn(true);
    }
    const onLogOut = () => {
        setLoggedIn(false);
        setPassword('');
        setUserName('');
    }
    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to React</h1>
            </header>
            {loggedIn ? (<LogInPage onSubmit={onSubmit}/>) : (<HomePage onLogOut={onLogOut}/>)}
        </div>
    );
}

export default App;
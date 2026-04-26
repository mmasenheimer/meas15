import React, { useState } from 'react';
import { LogInPage } from './LogInPage.jsx';
import { HomePage } from './MainPage/HomePage.jsx';

function App() {
    const [count, setCount] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const onSubmit = (email, password) => {
        console.log('Login attempt:', { email, password });
        setLoggedIn(true);
    }
    const onLogout = () => {
        setLoggedIn(false);
        setPassword('');
        setEmail('');
    }
    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to React</h1>
            </header>
            {loggedIn ? (<LogInPage onSubmit={onSubmit}/>) : (<HomePage/>)}
        </div>
    );
}

export default App;
import React, { useState } from 'react';

function LogInPage({onSubmit}) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    return (
        <div>
        <h1>Welcome to ECO-Map!</h1>
        <h3>Trying to be more eco friendly?</h3>
        <h2>Username</h2>
        <input type = "text" id = "username" name = "username"></input>
        <h2>Password</h2>
        <input type = "text" id = "password" name = "password"></input>
        <button id = "login-btn" onClick={onSubmit}>Log in</button>
        <button id = "create-btn" > Create new Account</button>
        </div>
    );
}

export default LogInPage;
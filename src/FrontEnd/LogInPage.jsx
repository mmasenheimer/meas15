import React, { useState } from 'react';

function LogInPage({onSubmit}) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (userName.trim() === '' || password.trim() === '') {
            setError('Username and password cannot be empty.');
            return;
        }
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            onSubmit(data);
            setError('');
        } catch (err) {
            setError(err.message || 'An error occurred during login');
        }
    }

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
        <p>{error}</p>
        </div>
    );
}

export default LogInPage;
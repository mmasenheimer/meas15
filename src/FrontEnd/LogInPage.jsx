import React, { useState } from 'react';
import './LogInPage.css';

function LogInPage({onSubmit}) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    /*const handleSubmit = () => {
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
    }*/

    const byPass = () =>{
        onSubmit("a", "b");
    }

    const handleSubmit = () => {
        onSubmit(userName, password);
    }

    return (
        <div className="page-container">
            <nav className="side-banner"></nav>
            <main className="content-area">
                <button id="byPass" onClick={byPass}>ByPass</button>

                <h1>Welcome to ECO-Map!</h1>
                <h3>Trying to be more eco friendly?</h3>

                <div className="form-group">
                    <h2>Username</h2>
                    <input 
                        type="text" 
                        id="username" 
                        name="username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <h2>Password</h2>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button id="login-btn" onClick={handleSubmit}>Log in</button>
                <button id="create-btn">Create new Account</button>

                {error && <p className="error-message">{error}</p>}
            </main>
        </div>
    );
}

export default LogInPage;
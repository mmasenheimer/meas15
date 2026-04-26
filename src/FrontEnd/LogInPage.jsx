import React, { useState } from 'react';

export default function LogInPage({onSubmit}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        // Handle login logic here
        console.log('Login attempt:', { email, password });
        setError('');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Login</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Sign In
                    </button>
                </form>

                <div className="login-footer">
                    <a href="#forgot">Forgot password?</a>
                    <span> | </span>
                    <a href="#signup">Sign up</a>
                </div>
            </div>
        </div>
    );
}
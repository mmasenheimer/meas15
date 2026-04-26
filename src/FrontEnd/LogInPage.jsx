import React, { useState } from "react";

function LogInPage({ onSubmit }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (username.trim() === "" || password.trim() === "") {
      setError("Username and password cannot be empty.");
      return;
    }
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password}),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      onSubmit(data);
      setError("");
    } catch (err) {
      setError(err.message || "An error occurred during login");
    }
  };

  const handleCreate = async () => {
    if (username.trim() === "" || password.trim() === "") {
      setError("Username and password cannot be empty.");
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.status === 409) {
        throw new Error("Account already exists with that username or email");
      }else if(!response.ok){
        throw new Error("Create Account failed");
      }

      const data = await response.json();
      onSubmit(data);
      setError("");
    } catch (err) {
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <div>
      <h1>Welcome to ECO-Map!</h1>
      <h3>Trying to be more eco friendly?</h3>
      <h2>Username</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Log in</button>
      <button id="create-btn"> Create new Account</button>
      <p>{error}</p>
    </div>
  );
}

export default LogInPage;

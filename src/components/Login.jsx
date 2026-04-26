import React, { useState } from 'react';

const Login = () => {
  // 1. State for form inputs
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // 2. State for feedback (errors or success)
  const [message, setMessage] = useState('');

  // Update state as user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 3. Fetch your intermediate JSON data
      const response = await fetch('/users.json');
      const data = await response.json();

      // 4. Validate credentials
      const user = data.users.find(
        (u) => u.username === formData.username && u.password === formData.password
      );

      if (user) {
        setMessage(`Welcome back, ${user.username}! Leaf a trace, not a carbon footprint. 🌿`);
        // Here you would typically redirect to the dashboard
      } else {
        setMessage('Incorrect credentials. Try again!');
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage('Error connecting to the database.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Eco Friendly Strava</h1>
      <p>Log in to track your green commutes</p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Sign In</button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Basic inline styling for now
const styles = {
  container: { textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' },
  title: { color: '#2d6a4f' }, // Green theme
  form: { display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto' },
  input: { padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '10px', backgroundColor: '#40916c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  message: { marginTop: '20px', fontWeight: 'bold', color: '#1b4332' }
};

export default Login;

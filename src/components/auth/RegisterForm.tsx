'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirection

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (!username || !password) {
      setMessage('Username and password are required.');
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Registration successful!');
        setIsError(false);
        // Optionally, redirect to login page or clear form
        router.push('/login'); // Assuming you have a /login page
      } else {
        setMessage(data.message || 'Registration failed.');
        setIsError(true);
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
      setIsError(true);
      console.error('Registration error:', error);
    }
  };

  // Basic styling
  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginTop: '50px',
  };

  const inputStyle: React.CSSProperties = {
    marginBottom: '10px',
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const messageStyle: React.CSSProperties = {
    marginTop: '10px',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: isError ? '#ffebee' : '#e8f5e9', // Light red for error, light green for success
    color: isError ? '#c62828' : '#2e7d32', // Darker red/green text
    textAlign: 'center',
  };


  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Register</h2>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <button type="submit" style={buttonStyle}>Register</button>
      {message && (
        <div style={messageStyle}>
          {message}
        </div>
      )}
    </form>
  );
};

export default RegisterForm;

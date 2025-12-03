import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSignInAlt,
  FaUser,
  FaLock,
  FaExclamationCircle,
  FaCheckCircle
} from 'react-icons/fa';
import '../Styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Simple validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    // Demo login (you can replace with actual authentication)
    if (username === 'admin' && password === 'admin123') {
      setSuccess('Login successful! Redirecting...');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          <FaSignInAlt className="login-title-icon" />
          Welcome Back
        </h1>
        <p className="login-subtitle">Sign in to continue to Pump Statement</p>

        <form className="login-form" onSubmit={handleLogin}>
          {error && (
            <div className="login-error">
              <FaExclamationCircle />
              {error}
            </div>
          )}

          {success && (
            <div className="login-success">
              <FaCheckCircle />
              {success}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <FaUser /> Username
            </label>
            <div className="form-input-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FaUser className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaLock /> Password
            </label>
            <div className="form-input-wrapper">
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="input-icon" />
            </div>
          </div>

          <button type="submit" className="login-btn">
            <FaSignInAlt /> Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>Demo credentials: <strong>admin / admin123</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
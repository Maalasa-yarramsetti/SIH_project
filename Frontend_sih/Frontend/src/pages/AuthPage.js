import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [monasteryName, setMonasteryName] = useState('');
  const [ngoName, setNgoName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleAuthSuccess = (authResult) => {
    if (authResult) {
      // --- THIS IS THE FIX ---
      // Redirect users and NGOs to '/explore', but admins to their default page.
      if (authResult.role === 'admin') {
        navigate('/admin'); 
      } else {
        navigate(`/${authResult.role}/explore`);
      }
    } else {
        setError('Invalid username or password.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    let authResult = null;

    if (isLogin) {
      authResult = login(username, password);
    } else {
      authResult = signup(username, email, password, role, { monasteryName, ngoName });
    }
    
    handleAuthSuccess(authResult);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const authResult = signup(decoded.name, decoded.email, 'google-auth', 'user', {});
    handleAuthSuccess(authResult);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          
          {!isLogin && (
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          )}

          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {!isLogin && (
            <>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="ngo">NGO</option>
              </select>
              {role === 'admin' && (
                <input type="text" placeholder="Monastery Name" value={monasteryName} onChange={(e) => setMonasteryName(e.target.value)} required />
              )}
              {role === 'ngo' && (
                <input type="text" placeholder="NGO Name" value={ngoName} onChange={(e) => setNgoName(e.target.value)} required />
              )}
            </>
          )}

          <button type="submit" className="auth-button">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <div className="divider">OR</div>
        <div className="google-button-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setError('Google login failed. Please try again.');
            }}
            useOneTap
          />
        </div>
        <p className="toggle-auth">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? ' Sign Up' : ' Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSun, FaMoon, FaCoins } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Header.css';
// Add your app icon to the src/assets folder
// import AppIcon from '../assets/app-icon.png';

const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <Link to="/user/explore" className="header-logo">
        {/* <img src={AppIcon} alt="Monastery360 Icon" /> */}
        <h3>Monastery360</h3>
      </Link>
      <div className="header-actions">
        <div className="coin-display">
          <FaCoins className="coin-icon" />
          <span className="coin-count">{user?.coins || 0}</span>
        </div>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        <FaUserCircle className="profile-icon" onClick={() => navigate('/user/profile')} />
      </div>
    </header>
  );
};

export default Header;
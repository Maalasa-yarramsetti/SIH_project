import React from 'react';
import './SplashScreen.css';
// You would add a transparent buddha image to the `src/assets` folder
// import BuddhaImage from '../assets/buddha-transparent.png'; 

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      {/* <img src={BuddhaImage} alt="Buddha" className="splash-logo" /> */}
      <h1 className="splash-title">Welcome to Monastery360</h1>
      <p className="splash-subtitle">A Digital World to Experience Monasteries of Sikkim</p>
      <div className="loader"></div>
    </div>
  );
};

export default SplashScreen;
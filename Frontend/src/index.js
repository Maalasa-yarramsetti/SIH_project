// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './index.css';
import App from './App';
import { register } from './serviceWorkerRegistration'; // <-- UPDATED IMPORT
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "680601988888-s6hjrpa3knfss2sj12hjcqgn9h12o8ko.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// This enables the service worker for offline capabilities
register(); // <-- UPDATED FUNCTION CALL
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Explore from './user/Explore';
import Events from './user/Events';
import Maps from './user/Maps';
import Archives from './user/Archives';
import Trivia from './user/Trivia';
import ContactUs from './user/ContactUs';
import Profile from './user/Profile';
import Chatbot from '../components/Chatbot';
import MonasteryDetailPage from './user/MonasteryDetailPage';
import FullScreenARView from '../components/FullScreenARView';
import './UserDashboard.css';

const UserDashboard = () => {
  const [arViewModel, setArViewModel] = useState(null);

  if (arViewModel) {
    return <FullScreenARView monastery={arViewModel} onClose={() => setArViewModel(null)} />;
  }

  return (
    <div className="dashboard-container">
      <Header />
      <Navbar />
      <main className="dashboard-content">
        <Routes>
          <Route path="explore" element={<Explore onArViewClick={setArViewModel} />} />
          <Route path="explore/:monasteryId" element={<MonasteryDetailPage onArViewClick={setArViewModel} />} />
          <Route path="events" element={<Events />} />
          <Route path="maps" element={<Maps />} />
          <Route path="archives" element={<Archives />} />
          <Route path="trivia" element={<Trivia />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
      <Chatbot />
    </div>
  );
};

export default UserDashboard;
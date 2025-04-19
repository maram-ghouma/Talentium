import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout component
import Layout from './components/layout/Layout';

// Dashboard components
import DashboardHome from './components/home/DashboardHome';
import Profile from './components/profile/Profile';
import MissionDetails from './components/mission/MissionDetails';
import Chat from '../../components/Freelancer/chat'; // Fixed capitalization
import History from '../../components/Freelancer/History'; // Assuming you have this component

function FreelancerHomepage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mission/:id" element={<MissionDetails />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/history" element={<History />} /> {/* Using History component instead of Profile */}
          <Route path="/schedule" element={<div className="p-6">Schedule page content</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default FreelancerHomepage;
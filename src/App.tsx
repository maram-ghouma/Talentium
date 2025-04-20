import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import FreelancersList from './Pages/Admin/FreelancersList';
import ClientHome from './Pages/Client/ClientHomePage';
import ClientsList from './Pages/Admin/ClientsList';
import Profile from './components/Freelancer/Profile';
import MissionDetails from './components/Freelancer/mission';
import Chat from './components/Freelancer/chat';
import History from './components/Freelancer/History';
import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { useEffect } from 'react';


function App() {
 
  return (
    <Routes>
  <Route path="/admin/clients" element={<ClientsList />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/freelancers" element={<FreelancersList />} />
  <Route path="/profile" element={<Profile />} />
          <Route path="/mission/:id" element={<MissionDetails />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/history" element={<Profile />} />

</Routes>
  );
}

export default App;
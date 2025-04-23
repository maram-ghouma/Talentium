import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import FreelancersList from './Pages/Admin/FreelancersList';
import ClientHome from './Pages/Client/ClientHomePage';
import ClientsList from './Pages/Admin/ClientsList';
import ReportsInterface from './Pages/Admin/ReportsInterface';
import ClientInterviewSchedule from './Pages/Client/ClientInterviews';
import ClientProfilePage from './Pages/Client/ClientProfile';

import Profile from './components/Freelancer/Profile';
import {chatConversations, messages, missions, profile, workHistory} from './Data/mockData';
import MissionDetails from './components/Freelancer/mission';
import Chat from './components/Freelancer/chat';
import History from './components/Freelancer/History';
import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { useEffect } from 'react';
import FreelancerHomePage from './Pages/Freelancer/FreelancerHomePage';
import FreelancerDashboard from './Pages/Freelancer/FreelancerDashboard';
import FreelancerProfile from './Pages/Freelancer/FreelancerProfile';
import FreelancerHistory from './Pages/Freelancer/FreelancerHistory';
import FreelancerChat from './Pages/Freelancer/FreelancerChat';



function App() {
 
  return (
    <Routes>
  <Route path="/admin/clients" element={<ClientsList />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/freelancers" element={<FreelancersList />} />

  <Route path="/Freelancer/profile" element={<FreelancerProfile profile={profile} />} />
  <Route path="/Freelancer/mission/:id" element={<MissionDetails mission={missions[0]} />} />
  <Route path="/Freelancer/chat" element={<FreelancerChat />} />
  <Route path="/Freelancer/history" element={<FreelancerHistory historyItems={workHistory} />} />
  <Route path="/Freelancer" element={<FreelancerDashboard />} />
          

  <Route path="/admin/reports" element={<ReportsInterface />} />
  <Route path="/client" element ={<ClientHome/>}/>
  <Route path="/client/interviews" element ={<ClientInterviewSchedule/>}/>
  <Route path="/client/profile" element ={<ClientProfilePage/>}/>


</Routes>
  );
}

export default App;
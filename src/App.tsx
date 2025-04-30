import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { CreateMission } from './components/CreateMission';
import { MissionCard } from './components/MissionCard';
import { Mission } from './types';
import { Route, Routes } from 'react-router-dom';


import SignUpPage from './Pages/SignUpPage/SignUpPage';
import SignInPage from './Pages/SignInPage/SignInPage';
import PaymentPage from './Pages/PaymentPage/PaymentPage';
import NotificationsPage from './Pages/NotificationsPage/NotificationsPage';



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
import { MainLayout } from './components/layout/MainLayout';
import FreelancerHomePage from './Pages/Freelancer/FreelancerHomePage';
import FreelancerDashboard from './Pages/Freelancer/FreelancerDashboard';
import FreelancerProfile from './Pages/Freelancer/FreelancerProfile';
import FreelancerHistory from './Pages/Freelancer/FreelancerHistory';
import FreelancerChat from './Pages/Freelancer/FreelancerChat';



function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Need a complete redesign of our e-commerce website with modern UI/UX principles.',
      status: 'not_assigned',
      price: 2500,
      date: '2024-03-15',
      clientId: 'client1',
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Looking for a developer to create an iOS/Android app for our service.',
      status: 'in_progress',
      price: 5000,
      date: '2024-03-14',
      clientId: 'client1',
    },
  ]);

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

        <div className="row g-4">
          {missions.map((mission) => (
            <div key={mission.id} className="col-12 col-md-6 col-lg-4">
              <MissionCard mission={mission} isDarkMode={isDarkMode} />
            </div>
          ))}
        </div>
  <Route path="/signup" element={<SignUpPage />} />
  <Route path="/signin" element={<SignInPage />} />
  <Route path="/payment" element={<PaymentPage />} />
  <Route path="/notifications" element={<NotificationsPage />} />


</Routes>
  );
}

export default App;
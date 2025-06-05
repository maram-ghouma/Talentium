import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
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
import GuestHome from './Pages/GuestHome';
import { HomePage } from './components/client/home page/homePage';
import FreelancerFeed from './Pages/Freelancer/feed';
import ClientEditProfile from './Pages/Client/ClientEditProfile';
import FreelancerEditProfile from './Pages/Freelancer/FreelancerEditProfile';
import JalonsPage from './Pages/PaymentPage/JalonsPage';




function App() {

  return (
    <Routes>
  <Route path="/admin/clients" element={<ClientsList />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/freelancers" element={<FreelancersList />} />

  <Route path="/Freelancer/profile" element={<FreelancerProfile />} />
  <Route path="/Freelancer/editProfile" element={<FreelancerEditProfile />} />
  <Route path="/Freelancer/mission/:id" element={<MissionDetails mission={missions[0]} />} />
  <Route path="/Freelancer/chat" element={<FreelancerChat />} />
  <Route path="/Freelancer/history" element={<FreelancerHistory historyItems={workHistory} />} />
  <Route path="/Freelancer/dashboard" element={<FreelancerDashboard />} />
  <Route path="/freelancer/interviews" element ={<ClientInterviewSchedule/>}/>
  <Route path="/Freelancer" element={<FreelancerFeed />} />
          

  <Route path="/admin/reports" element={<ReportsInterface />} />
  <Route path="/client" element ={<ClientHome/>}/>
    <Route path="/client/editProfile" element ={<ClientEditProfile/>}/>
  <Route path="/client/interviews" element ={<ClientInterviewSchedule/>}/>
  <Route path="/client/profile" element ={<ClientProfilePage/>}/>
  <Route path="/jalons" element ={<JalonsPage/>}/>

  <Route path="/signup" element={<SignUpPage />} />
  <Route path="/signin" element={<SignInPage />} />
  <Route path="/payment" element={<PaymentPage />} />
  <Route path="/notifications" element={<NotificationsPage />} />
    <Route path="/" element={<GuestHome />} />

</Routes>
  );
}

export default App;
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import SignUpPage from './Pages/SignUpPage/SignUpPage';
import SignInPage from './Pages/SignInPage/SignInPage';
import PaymentPage from './Pages/PaymentPage/PaymentPage';
import NotificationsPage from './Pages/NotificationsPage/NotificationsPage';

import AdminDashboard from './Pages/Admin/AdminDashboard';
import FreelancersList from './Pages/Admin/FreelancersList';
import ClientsList from './Pages/Admin/ClientsList';
import ReportsInterface from './Pages/Admin/ReportsInterface';

import ClientHome from './Pages/Client/ClientHomePage';
import ClientEditProfile from './Pages/Client/ClientEditProfile';
import ClientInterviewSchedule from './Pages/Client/ClientInterviews';
import ClientProfilePage from './Pages/Client/ClientProfile';
import ClientKanban from './Pages/Client/ClientKanban';


import FreelancerDashboard from './Pages/Freelancer/FreelancerDashboard';
import FreelancerProfile from './Pages/Freelancer/FreelancerProfile';
import FreelancerHistory from './Pages/Freelancer/FreelancerHistory';
import FreelancerChat from './Pages/Freelancer/FreelancerChat';
import ClientChat from './Pages/Client/ClientChat';
import MissionDetails from './components/Freelancer/mission';
import FreelancerClient from './Pages/Freelancer/FreelancerKanban';

import GuestHome from './Pages/GuestHome';
import { missions, profile, workHistory } from './Data/mockData';

import NotificationContainer from './components/realtime_notification/NotificationContainer';
import { useNotifications } from './hooks/useNotifications';
import FreelancerKanban from './Pages/Freelancer/FreelancerKanban';

function App() {
  const { notifications, removeNotification, addNotification } = useNotifications();

  return (
    <DndProvider backend={HTML5Backend}>
      <NotificationContainer 
        notifications={notifications} 
        onDismiss={removeNotification} 
      />
        <Routes>
          <Route path="/admin/clients" element={<ClientsList />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/freelancers" element={<FreelancersList />} />
          <Route path="/admin/reports" element={<ReportsInterface />} />

          <Route path="/Freelancer/profile" element={<FreelancerProfile profile={profile} />} />
          <Route path="/Freelancer/mission/:id" element={<MissionDetails mission={missions[0]} />} />
          <Route path="/Freelancer/chat" element={<FreelancerChat />} />
          <Route path="/Freelancer/history" element={<FreelancerHistory historyItems={workHistory} />} />
          <Route path="/Freelancer" element={<FreelancerDashboard />} />
          <Route path="/Freelancer/missions/:id/kanban" element={<FreelancerKanban />} />

          <Route path="/client" element={<ClientHome />} />
          <Route path="/client/editProfile" element={<ClientEditProfile />} />
          <Route path="/client/interviews" element={<ClientInterviewSchedule />} />
          <Route path="/client/profile" element={<ClientProfilePage />} />
          <Route path="/client/chat" element={<ClientChat />} />
          <Route path="/kanban/:id" element={<ClientKanban />} />


          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/paym²ent" element={<PaymentPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route path="/" element={<GuestHome />} />
        </Routes>
    </DndProvider>
  );
}

export default App;

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


import Profile from './components/Freelancer/Profile';
import Chat from './components/Freelancer/chat';
import History from './components/Freelancer/History';
import { MainLayout } from './components/layout/MainLayout';
import FreelancerHomePage from './Pages/Freelancer/FreelancerHomePage';
import FreelancerDashboard from './Pages/Freelancer/FreelancerDashboard';
import FreelancerProfile from './Pages/Freelancer/FreelancerProfile';
import FreelancerHistory from './Pages/Freelancer/FreelancerHistory';
import FreelancerChat from './Pages/Freelancer/FreelancerChat';
import ClientChat from './Pages/Client/ClientChat';
import MissionDetails from './components/Freelancer/mission';
import FreelancerClient from './Pages/Freelancer/FreelancerKanban';

import GuestHome from './Pages/GuestHome';
import { missions, profile, workHistory } from './Data/mockData';
import { HomePage } from './components/client/home page/homePage';
import FreelancerFeed from './Pages/Freelancer/feed';
import FreelancerEditProfile from './Pages/Freelancer/FreelancerEditProfile';
import JalonsPage from './Pages/PaymentPage/JalonsPage';
import NotFoundPage from './components/layout/NotFound';
import ReviewPage from './Pages/Review/ReviewPage';
import DisputeForm from './components/dispute/dispute';



import NotificationContainer from './components/realtime_notification/NotificationContainer';
import { useNotifications } from './hooks/useNotifications';
import FreelancerKanban from './Pages/Freelancer/FreelancerKanban';

import { MissionCard } from './components/Freelancer/freelancerfeed/freelancerMissionCard';

import Kanban from './Pages/kanban'


function App() {
  return (
    <>
    <DndProvider backend={HTML5Backend}>
        <Routes>
          <Route path="/admin/clients" element={<ClientsList />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/freelancers" element={<FreelancersList />} />
          <Route path="/admin/reports" element={<ReportsInterface />} />

  <Route path="/Freelancer/profile" element={<FreelancerProfile />} />
  <Route path="/Freelancer/profile/:id" element={<FreelancerProfile />} />
  <Route path="/Freelancer/editProfile" element={<FreelancerEditProfile />} />
  {/*<Route path="/Freelancer/mission/:id" element={<MissionDetails mission={missions[0]} />} />*/}
  <Route path="/Freelancer/chat" element={<FreelancerChat />} />
  <Route path="/Freelancer/history" element={<FreelancerHistory />} />
  <Route path="/Freelancer/dashboard" element={<FreelancerDashboard />} />
  <Route path="/freelancer/interviews" element ={<ClientInterviewSchedule/>}/>
  <Route path="/Freelancer" element={<FreelancerFeed />} />
          
<Route path="/reviews/:missionId" element={<ReviewPage />} />

  <Route path="/
  admin/reports" element={<ReportsInterface />} />
  <Route path="/client" element ={<ClientHome/>}/>
    <Route path="/client/editProfile" element ={<ClientEditProfile/>}/>
  <Route path="/client/interviews" element ={<ClientInterviewSchedule/>}/>
  <Route path="/client/profile" element ={<ClientProfilePage/>}/>
  <Route path="/client/profile/:id" element ={<ClientProfilePage/>}/>
  <Route path="/client/chat" element={<ClientChat />} />
  <Route path="/kanban/:id" element={<Kanban />} />
  <Route path="/jalons" element ={<JalonsPage/>}/>
    
  <Route path="/signup" element={<SignUpPage />} />
      <Route path="/disputeForm" element={<DisputeForm />}/>

  <Route path="/signin" element={<SignInPage />} />
  <Route path="/payment" element={<PaymentPage />} />
  <Route path="/notifications" element={<NotificationsPage />} />
    <Route path="/" element={<GuestHome />} />
        <Route path="*" element={<NotFoundPage />} />

<Route path="missiontest/:missionId" element={<MissionCard mission={{
  id: "1",
  title: "Hourglass",
  description: "A mission to build a hourglass",
  status: "completed",
  price: 1000,
  date: "2024-06-01",
  clientId: "client1",
  clientName: "Client One",
  tasks: {
    total: 1,
    completed: 0,
    //items: [{ title: "Task 1", duration: 2 }]
  },
  //freelancerId: "freelancer1",
  // add any other required fields if present in Mission
}} isDarkMode={false} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/paym²ent" element={<PaymentPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route path="/" element={<GuestHome />} />
        </Routes>
    </DndProvider>
    </>
  );
}

export default App;
